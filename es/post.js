var shared = {

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


  validSlug(slug) {
    return /^[a-z0-9]+([a-z0-9\-\.]+)*$/.test(slug)
  },

  previewable(post) {
    return post.tags.length > 0 &&
           post.assetUrl
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


  extractReferences(markdown, patterns) {
    var references = []
    var matcher = patterns ? patterns.matcher : /<sup>(.*?)<\/sup>/g
    var matches = markdown.match(matcher)

    if (!matches)
      return {markdown,references}

    var count = 0
    references = {}

    var md = markdown
    matches.forEach(sup => {
      var extracter = patterns ? patterns.extracter : /<\/?sup>/g
      var ref = sup.replace(extracter,'')
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
    var refs = []
    for (var idx in references)
      refs.push(`<cite id="r${idx}">${idx}. ${marked(references[idx])}</cite>`.replace(/<\/?p>/g,''))
    refs.reverse()
    return refs.join('\n')
  },


  authorFromUser(user) {
    var by = _.extend({ userId:user._id }, _.pick(user,'name','bio','social','username','avatar', 'userId'))
    if (by.social)
      by.social = util.selectFromObject(by.social,{ 'gh.username': 1,'so.link':1,'bb.username':1,'in.id':1,'tw.username':1,'al.username':1,'gp.link':1 })
    return by
  }


}


module.exports = shared
