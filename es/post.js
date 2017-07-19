function author(user, post) {
  if (!(user||{})._id) return undefined
  if (!(post.by||{})._id) return undefined

  return user._id.toString() == post.by._id.toString()
}

function editor(user) {
  if (!(user||{}).roles) return undefined
  if (!user.roles.length) return undefined
  return user.roles.indexOf('editor') != -1
}

function forker(user, post) {
  if (!(post||{}).forkers) return undefined
  if (!user.forkers.length) return undefined

  return post.forkers.map(f=>f.userId.toString())
                     .indexOf(user._id.toString()) != -1
}

module.exports = {

  role: {
    author, editor, forker,
    authorOrEditor: (user, post) => editor(user) || author(user,post),
    authorOrForker: (user, post) => author(user,post) || forker(user,post)
  },


  wordcount(post) {
    var {md} = post
    var s = md.replace(/(^\s*)|(\s*$)/gi,"");
    s = s.replace(/[ ]{2,}/gi," ");
    s = s.replace(/\n /,"\n");
    return s.split(' ').length;
  },


  toc(md) {
    var inCodeBlock = false, headers = [], toc = []
    var lines = md.split('\n')

    lines.forEach(function(line, idx) {
      if (/^```/.test(line))
        inCodeBlock = !inCodeBlock;

      if (!inCodeBlock) {
        // Find headers of the form    ### h2 [###]'
        var match = /^(\#{2,3} )[ ]*(.+)\r?$/.exec(line)
        if (match)
          headers.push({
            line: idx,
            rank: match[1].length - 1,
            name: match[2].replace(/[ #]+$/, '') // Turn into '## xxx' if was '## xxx ##'
          })

        // Find headers of the form    h2
        //                             --
        // if (/^==+ *\r?$/.exec(line))      rank = 1;
        else if (idx > 0 && /^--+ *\r?$/.exec(line))
          headers.push({
            line: idx - 1,
            rank: 2,
            name: lines[idx - 1],
          })
      }
    })

    headers.forEach(function addAnchor(header) {
      var headerHthml = marked(header.name+'\n==')
      var idAttr = headerHthml.split('"')[1]
      var item = `- [${header.name}](#${idAttr})`
      toc.push(header.rank == 2 ? item : '  ' + item)
    })

    return toc.length == 0 ? '' : toc.join('\n')
  },

  //-- Takes <sup> tags and replaces content with
  //-- Numbers pointing to refence table
  indexReferences(md) {
    // $log('indexReferences'.yellow, md)
    var refs = []
    var idx = 0
    var supTags = md.match(/<sup>([\s\S]*?)<\/sup>/g) || []

    supTags.forEach(sup => {
      var ref = sup.replace(/<\/?sup>/g,'')
      var reused = refs[parseInt(ref)]

      // allows to reuse previous references
      // e.g. <sup>1</sup> to point to first reference
      if (!reused)
        refs.push(`${++idx}. <cite id="ref-${idx}">${marked(ref)}</cite>`.replace(/<\/?p>|\n/g,''))

      md = md.replace(sup, `<sup>[[${idx}](#ref-${reused?ref:idx})]</sup>`)
    })

    return { md, references: refs.join('\n') }
  },


  defaultSlug(post) {
    var slug = post.title
               .toLowerCase()
               .replace(/ /g, '_')
               .replace(/\W+/g, '')
               .replace(/_/g, '-')
               .replace(/--/g,'-')

    return (slug.length > 40 ? slug.substring(0,40) : slug)
               .replace(/-$/,'')
  },


  validSlug(slug) {
    return /^[a-z0-9]+([a-z0-9\-\.]+)*$/.test(slug)
  },


  status(post) {
    if (!post.history) return null

    var submitted = post.history.submitted
    var published = post.history.published

    if (!submitted && !published)
      return "draft"
    if (submitted && !published)
      return "submitted"
    if (published)
      return "published"
  },


  url(post) {
    var canonical = _.get(post,'htmlHead.canonical')
    if (canonical) return canonical
    var submitted = post.history ? post.history.submitted : null
    return submitted ? `https://www.airpair.com/posts/review/${post._id}`
                     : `/editor/${post._id}`
  },


  pullRequestUrl(post, fromLogin) {
    return `https://github.com/airpair/${post.slug}/compare/edit...${fromLogin}:edit?expand=1`
  },


  previewable(post) {
    return post.tags.length > 0 && post.assetUrl
  },


  submittable(post, wordcount) {
    return post.tags.length > 0 &&
           post.assetUrl &&
           wordcount ? wordcount > 400 : false
  },


  publishable(post) {
    var history = post.history
    if (history && history.submitted && history.published) return true
    return post.stats && post.stats.reviews > 2 && post.stats.rating > 3.8
  },


  todo(post) {
    var stats = post.stats
    var words = stats ? stats.words : null
    if (!words || words < 400) return 'wordcount'

    if (!post.tags || post.tags.length == 0) return 'tag'
    if (!post.assetUrl) return 'asset'

    var submitted = post.history ? post.history.submitted : null
    if (submitted === undefined) return 'submit'

    if (stats.reviews < 3) return 'reviews'
    if (stats.rating < 3.5) return 'rating'
  },


  authorFromUser(user) {
    var by = _.extend({ userId:user._id }, _.pick(user,'name','bio','social','username','avatar', 'userId'))
    if (by.social)
      by.social = util.selectFromObject(by.social,{ 'gh.username': 1,'so.link':1,'bb.username':1,'in.id':1,'tw.username':1,'al.username':1,'gp.link':1 })
    return by
  },


  calcStats(post, wordcount) {
    var PRs = false// PRs || []
    var feedback = post.reviews ? post.reviews.map(r => r.said) : []
    var stars = post.reviews ? post.reviews.map(r => r.val) : []

    var stats = {
      reviews: stars.length,
      comments: feedback.length + _.flatten(_.pluck(post.reviews||[],'replies')||[]).length,
      forkers: (post.forkers||[]).length,
      // views: 0,            // figure it out later
      // shares: 0,           // figure it out later
      words: wordcount(post.md)   //  words: utilFns.wordcount(post.md)
    }

    var sum = 0
    for (var i = 0, ii = stars.length; i < ii; ++i)
      sum += stars[i]

    if (sum > 0) stats.rating = sum/stars.length

    return !PRs ? stats : _.extend(stats, {
      openPRs:     _.where(PRs, pr => pr.state=='open').length,  // not really correct at all grrr
      closedPRs:   _.where(PRs, pr => pr.state=='closed').length,  // not really correct at all grrr
      acceptedPRs: _.where(PRs, pr => pr.state=='closed').length,  // not really correct at all grrr
    })

    // var totalStars = 0
    // var reviews = post.reviews || []
    // var stars = _.map(reviews, (r) => {
    //   var s = parseInt(_.find(r.questions,(q)=>q.key=='rating').answer)
    //   totalStars = totalStars + s
    //   return s
    // })

    // return {
    //   rating: (stars.length > 0) ? totalStars / stars.length : null,
    //   reviews: reviews.length,
    //   comments: reviews.length + _.flatten(_.pluck(reviews,'replies')||[]).length,
    //   forkers: (post.forkers||[]).length,
    //   openPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='open').length,  // not really correct at all grrr
    //   closedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
    //   acceptedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
    //   shares: 0,            // figure it out later
    //   words: utilFns.wordcount(post.md)
    // }
  },


  ratingBasic(post) {
    var stars = []
    var reviews = post.reviews || []
    var rated = reviews.filter(r => r.val)
    if (rated.length > 0) stars = rated.map(r => r.val)
    var stat = { reviews: stars.length }

    var sum = 0
    for (var i = 0, ii = stars.length; i < ii; ++i)
      sum += stars[i]

    if (sum > 0) stat.rating = sum/stars.length
    return stat
  },


  ratingWeighted(post) {
    console.log('Not imp algorithm utilizing user mojo and votes')
  },


  comments(post) {
    var reviews = post.reviews || []
    var count = reviews.length + _.flatten(_.map(reviews,'replies')||[]).length
    return { comments: count }
  },




  // validSlug(slug) {
  //   return /^[a-z0-9]+([a-z0-9\-\.]+)*$/.test(slug)
  // },

  wordcount(md) {
    var s = md.replace(/(^\s*)|(\s*$)/gi,"");
    s = s.replace(/[ ]{2,}/gi," ");
    s = s.replace(/\n /,"\n");
    return s.split(' ').length;
  },

  wordsTogoForReview(wordcount) {
    var remainder = wordcount%50;
    var countWithoutRemainder = wordcount - remainder;
    return 400 - countWithoutRemainder;
  },

  extractSupReferences(markdown) {
    var references = null
    var supTags = markdown.match(/<sup>(.*?)<\/sup>/g)

    if (!supTags) return {markdown,references}

    var count = 0
    var references = {}

    var md = markdown
    supTags.forEach((sup) => {
      var ref = sup.replace(/<\/?sup>/g,'')
      var reused = references[parseInt(ref)]

      // allows to reuse previous references
      if (!reused) {
        references[++count] = ref
        markdown = markdown.replace(sup,
          `<sup>[<a href="#r${count}">${count}</a>]</sup>`)
      } else {
        markdown = markdown.replace(sup,
          `<sup>[<a href="#r${count}">${ref}</a>]</sup>`)
      }
    })

    return { markdown, references }
  },

  markupReferences(references, marked) {
    return _.map(_.keys(references), (idx) =>
      `<cite id="r${idx}">${idx}. ${marked(references[idx])}</cite>`.replace(/<\/?p>/g,''))
  },

  // getPreview(md, cb) {
  //   var preview = utilFns.extractSupReferences(md)
  //   preview.wordcount = utilFns.wordcount(md)
  //   preview.markedUpReferences =
  //     utilFns.markupReferences(preview.references, marked)
  //   marked(preview.markdown, (e, postHtml) => {
  //     if (e) return cb(e)
  //     preview.body = postHtml
  //     cb(null,preview)
  //   })
  // },

  // calcStats(post, wordcount) {
  //   var PRs = false// PRs || []
  //   var feedback = post.reviews ? post.reviews.map(r => r.said) : []
  //     forkers: (post.forkers||[]).length,
  //     // views: 0,            // figure it out later
  //     // shares: 0,           // figure it out later
  //     words: wordcount(post.md)   //  words: utilFns.wordcount(post.md)
  //   }
  //   return !PRs ? stats : _.extend(stats, {
  //     openPRs:     _.where(PRs, pr => pr.state=='open').length,  // not really correct at all grrr
  //     closedPRs:   _.where(PRs, pr => pr.state=='closed').length,  // not really correct at all grrr
  //     acceptedPRs: _.where(PRs, pr => pr.state=='closed').length,  // not really correct at all grrr
  //   })


  calcStats(post) {
    var PRs = false
    // var PRs = post.PRs || []
    var feedback = post.reviews ? post.reviews.map(r => r.said) : []
    var stars = post.reviews ? post.reviews.map(r => r.val) : []

    var stats = {
      reviews: stars.length,
      comments: feedback.length + _.flatten(_.pluck(post.reviews||[],'replies')||[]).length,
      forkers: (post.forkers||[]).length,
      // views: 0,            // figure it out later
      // shares: 0,           // figure it out later
      words: utilFns.wordcount(post.md)
    }

    var sum = 0
    for (var i = 0, ii = stars.length; i < ii; ++i)
      sum += stars[i]

    if (sum > 0) stats.rating = parseInt((sum/stars.length)*100)/100

    return !PRs ? stats : _.extend(stats, {
      openPRs:     _.where(PRs, pr => pr.state=='open').length,  // not really correct at all grrr
      closedPRs:   _.where(PRs, pr => pr.state=='closed').length,  // not really correct at all grrr
      acceptedPRs: _.where(PRs, pr => pr.state=='closed').length,  // not really correct at all grrr
    })
    // var totalStars = 0
    // var reviews = post.reviews || []
    // var stars = _.map(reviews, (r) => {
    //   var s = parseInt(_.find(r.questions,(q)=>q.key=='rating').answer)
    //   totalStars = totalStars + s
    //   return s
    // })

    // return {
    //   rating: (stars.length > 0) ? totalStars / stars.length : null,
    //   reviews: reviews.length,
    //   comments: reviews.length + _.flatten(_.pluck(reviews,'replies')||[]).length,
    //   forkers: (post.forkers||[]).length,
    //   openPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='open').length,  // not really correct at all grrr
    //   closedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
    //   acceptedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
    //   shares: 0,            // figure it out later
    //   words: utilFns.wordcount(post.md)
    // }
  },


  // extendWithReviewsSummary(post) {
  //   post.stars = { total: 0 }
  //   post.reviews.forEach(r => post.stars.total += parseInt(r.val))
  //   post.stars.avg = post.stars.total/post.reviews.length
  //   return post
  // },


  // wordsTogoForReview(wordcount) {
  //   var remainder = wordcount%50;
  //   var countWithoutRemainder = wordcount - remainder;
  //   return 400 - countWithoutRemainder;
  // },


    // var totalStars = 0
    // var reviews = post.reviews || []
    // return {
    //
    //   forkers: (post.forkers||[]).length,
    //   openPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='open').length,  // not really correct at all grrr
    //   closedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
    //   acceptedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
    //   shares: 0,            // figure it out later
    //   words: utilFns.wordcount(post.md)
    // }

}
