const Views = {
  display: '_id by stats htmlHead meta.lastTouch github.repoInfo'
           + ' reviews forkers title tmpl slug tags assetUrl'
           + ' url html toc similar adtag history',
  list:    '_id by history htmlHead.canonical htmlHead.description htmlHead.ogImage github.repoInfo title url slug tags stats',
  cache:   '_id by.name by.avatar title htmlHead.canonical htmlHead.ogImage history.subscribed history.published',
  sub:     '_id name email avatar username auth.gh.login photos'
}

const Query = {

  byUrl(url) {
    var match = new RegExp(`${url.split('?')[0].replace(/\+\+/g,'\\+\\+')}$`, 'i')
    return { 'htmlHead.canonical': match }
  },

  cached: { $or: [
    { 'history.submitted' : {'$exists': true }},
    { 'history.published' : {'$exists': true }}] },

  published(andQuery) { return assign(andQuery||{}, {
      'history.published' : { '$exists': true },
      'history.published' : { '$lt': new Date() }
    })
  },

  latest: { $and: [ {'history.published' : { '$exists': true }},
                    {'history.published': { '$lt': new Date() }},
                    {'tmpl' : { '$ne': 'blank' }},
                    {'tmpl' : { '$ne': 'faq' }},
                    {'by._id' : { '$ne': '52ad320166a6f999a465fdc5' }} ]},

  submitted(opts) {
    opts = opts || {}
    // var [amount,measure] = config.authoring.stale.split(':')
    // var staleTime = moment().add(amount, measure).toDate()

    // var $or = [      { 'meta.lastTouch.utc': { '$gt': staleTime } },
                     // { 'history.submitted':  { '$gt': staleTime } } ]
    var q = { $and: [{ 'history.submitted' : {'$exists': true }},
                     { 'history.published' : {'$exists': false }},
                     // { $or }
                     ] }

        return q
  }
}

const Opts = {
  latest: { select: Views.list, sort: { 'history.published': -1, 'stats.reviews': -1, 'stats.rating': -1 } },
  inreview: { select: `${Views.display} md slug subscribed history` },
  published: { select: `${Views.display} md slug subscribed history` },
  publishedNewest: limit => ({ limit, select: Views.list, sort: { 'history.published': -1 } }),
  submitted: limit => ({ limit, select: Views.list, sort: { 'meta.lastTouch._id': -1 } }),
  subscribedUsers: { select: Views.sub }
// recentlyUpdated: { select: Views.activity, sort: { 'updated': 1 }, limit: 15 },
}


var generateToc = require('../toc')()
var lib = {
  post: require('../../../es/post'),
  stat: require('../../../es/post.stat')
}

module.exports = { Views, Query, Opts,

  Projections: ({select, inflate, md5}, {chain}) => ({

    subscribedHash: d => {
      var hash = {}
      for (var u of d.users)
        hash[u._id] = _.omit(u, '_id')

      var p = d.post
      // $log('subHash'.yellow, p)
      p.subscribed = p.subscribed.map(s=>assign(s,hash[s.userId]||{}))

      if (!p.subHash) {
        p.subHash = {}
        p.subscribed = p.subscribed || [{userId:d.by._id,mail:'primary'}]
        for (var sub of p.subscribed) {
          p.subHash[sub.userId] = _.omit(sub,'_id','userId','auth','photos', 'email', 'mail', 'username', 'name')
          p.subHash[sub.userId].name = sub.username || sub.name
          var pic = sub.photos ? sub.photos[0].value : `https://0.gravatar.com/avatar/${md5(sub.email)}`
          assign(p.subHash[sub.userId], {
           // _id: sub.userId,
            pic: pic.split('?')[0] })
          if (sub.auth && sub.auth.gh) p.subHash[sub.userId].gh = sub.auth.gh.login
        }
      }
      return p
    },


    words: d =>
      assign(d, {stats:assign(d.stats||{},{words:lib.stat.wordcount(d)})}),


    forker: f =>
        assign(f,d.subHash[f.userId],{gh: f.gh || f.social.gh.username})
        // {
        // userId: f.userId,
        // name: f.name,
        // gh: f.gh || f.social.gh.username,
        // avatar: f.avatar || md5(f.email||'team@airpair.com')
    ,
    // }),

    reviews: d => {
      d.reviews = (d.reviews||[]).map(rev => assign(rev, {
        by: d.subHash[rev.by],
        votes: (rev.votes||[]).map(v => assign(v,{by:d.subHash[v.by]})),
        replies: (rev.replies||[]).map(r => assign(r,{by:d.subHash[r.by]}))
      }))
      return d
    },

    other: d => {
      // $log('other'.yellow, d)
      var {submitted,published} = d.history

      if (submitted) {
        d.submitted = submitted
        // d.stats = d.stats || postUtil.calcStats(d)
        var reviews = d.stats ? d.stats.reviews : 0
        d.publishReady = reviews > 2 && d.stats.rating > 3.5
      }

      if (!published)
        d.htmlHead = { noindex: true }
      else {
        d.published = published
        //-- Stop using disqus once deployed the review system
        // d.showDisqus = moment(d.published) < moment('20150201', 'YYYYMMDD')
      }

      d.htmlHead.ogTypePost = true

      d.forkers = (d.forkers||[]).map(f => assign(f,d.subHash[f.userId]))
      d.by.firstName = util.firstName(d.by.name)

      return d
    },

    adTag: d => {
      if (!d.tags || d.tags.length == 0) {
        $log(`post ${d.title} [${d._id}] has no tags`.red)
        return cb(null, d)
      }

      d.adtag = cache['tags'][d.tags[0]._id]

      // $log('adTag'.yellow, d.tags, d.adtag)
      d.primarytag = d.adtag || _.find(d.tags, t => t.sort==0) || d.tags[0]
      // var topTagPage = _.find(topTapPages,(s) => d.primarytag.slug==s)
      d.primarytag.postsUrl = // topTagPage ? `/${d.primarytag.slug}` :
        `/posts/tag/${d.primarytag.slug}`

      var hasMatch = pattern => _.find(d.tags, t => pattern.test(t.slug))
      var override = d.adtag ? d.adtag.slug : false

      // Set of tags valid for the campaign
      var campaign = /(ruby|node.js|java|php|python)$/i
      var defaulttag = 'ruby'

      // Starts with the default catch all tag when we don't match any rules
      var adtag = defaulttag

      // Override value can set ahead of time on a specific piece of content
      // * Allows full control when content matches multiple campaign tags
      // * Must be a valid campaign tag else its ignored
      var overridetag = override && override.match(campaign) ? override : null

      // If we've match a custom chosen override tag we've done
      if (overridetag)
        adtag = overridetag

      // Looks at each tag of the content/post and matches if on the values
      // is anywhere in the tag name (case insensitive)
      // E.g. node| matches: "node.js", "nodejs" "node.version.6.0" "server-node"

      // Only looks at this set if no match above (..|angular|node|etc.)
      // If no match Will continue to the next (..php|laravel|etc.)
      else if (hasMatch(/java|android|spring|jvm|clojure/i) && !_.find(d.tags,t=>t.slug=='javascript'))
        adtag = 'java'

      else if (hasMatch(/node|mean|npm|express|mongoose/i))
        adtag = 'node.js'

      // If no match found here, we've already set the default - ruby
      else if (hasMatch(/(php|laravel|wordpress|joomla)/i))
        adtag = 'php'

      else if (hasMatch(/python|flask|django|google/i))
        adtag = 'python'

      return assign(d, {adtag})
    },


    tocHtml: d => {
      // $log('tocHtml'.yellow)
      return assign(d, {toc:marked(generateToc(d.md))})
    },

    bodyHtml: d => {
      // $log('bodyHtml'.yellow, d.tags, cache.tags.length)
      var supped = lib.post.extractSupReferences(d.md)
      d.references = lib.post.markupReferences(supped.references, marked)
      var html = d.html || {}
      html.body = marked(supped.markdown)
      return assign(d, {html})
      // $log('inflateHtml'.yellow, d.tags)
      // d.toc = marked(generateToc(d.md))
      // var supped = PostsUtil.extractSupReferences(d.md)
      // d.references = PostsUtil.markupReferences(supped.references, marked)
      // if (isAnon) {
        // var odd = false
        // marked.setOptions({highlight: function(code, lang) {
          // odd = !odd
          // if (odd) {
            // var maxLines = 0
            // var obs = ""
            // for (var line of code.split('\n')) {
              // if (++maxLines < 4)
                // obs += '\n' + line.replace(/(\S\S)(\S\S)/g,'$1{}{}')
            // }
            // return obs.replace('\n','') // trim first \n
          // }
          // else
            // return code
        // }})
        // d.html = marked(supped.markdown)
        // marked.setOptions({highlight:null})
      // }
      // else
      // d.html = marked(supped.markdown)
    },

    tmpl: d => {
      // $log('tmpl'.yellow)
      d.tmpl = !d.tmpl || d.tmpl == 'default' ? 'post_v1' : d.tmpl
      if (d.tmpl == 'post_v1')
        d.htmlHead.css = [] // ['/lib.css'] // grab archived css
      return d
    },

    otherByAuthor: d => {
      var other = []
      for (var id in cache['posts']) {
        if (!_.idsEqual(d._id, id)) {
          var p = cache['posts'][id]
          if (_.idsEqual(d.by._id, p.by))
            other.push({_id:id,by:d.by,url:p.url,ogImg:p.ogImg,title:p.title})
        }
      }
      return assign(d, other.length > 0 ? {other} : {})
    },

    displayPublished: d => {
      // $log('displayPublished'.yellow, d.by.name, d.adtag, d.tags)
      var r = chain(d, 'subscribedHash', inflate.tags, 'bodyHtml', 'url', 'tocHtml', 'tmpl', 'adTag', 'reviews', 'other', select.display, 'otherByAuthor')
      for (var sim of r.similar) sim.url = sim.htmlHead.canonical
      if (!r.similar || r.similar.length == 0) r.similar = false
      for (var tag of r.tags) tag.url = tag.slug == 'angularjs' ? '/angularjs/posts' : `/${tag.slug}`
      // $log('displayPublished'.magenta, d.reviews.length)
      return r
    },

    displayReview: d => {
      // $log('displayReview'.yellow, d)
      if (d.post.history.published)
        return select(chain(d.post, inflate.tags, 'url'), '_id url title history')

      var post = chain(d, 'subscribedHash', inflate.tags, 'bodyHtml', 'url', 'tocHtml', 'tmpl', 'reviews', select.display)
      var r = { tmpl: 'inreview', post }
      $log('displayReview'.yellow, r.post.title)
      return r
    },

    url: d => assign(d, { url :
      d.history.submitted && !d.history.published ? `/posts/review/${d._id}` :
      `${d.htmlHead ? d.htmlHead.canonical : '/posts/preview/'+d._id }`
    }),

    tileList: d =>
      chain(d, inflate.tags, 'url', select.list),


    submitted: d =>
      chain(d, inflate.tags, 'url', select.list),


    byTag: d => {
      var tag = select(cache['tags'][d._id], 'name short url')
      var htmlHead = {
        ogType: "technology",
        title:`${tag.name} Programming Guides and Tutorials from Top ${tag.short} Developers and expert consultants`,
        canonical: `https://www.airpair.com${tag.url}`
      }

      // var workhops = cache.workshops.filter(w => w.tags.indexOf(d.slug))
      var posts = chain(d.posts, inflate.tags, 'url', select.list)
      var related = _.sortBy((_.uniq(_.flatten(_.pluck(posts, 'tags')), t => t.slug)), t => t.slug)
                     .map(t => cache['tags'][t._id])
      if (related.length > 16) related = _.take(_.sortBy(related, t => -1*t.posts), 16)

      // if (workhops.length>0) r.workhops = workhops
      return assign({ htmlHead, related, posts: {latest:posts} }, tag)
    }

  })

}
// .shareProjections('post', 'subscribedHash reviews url tocHtml bodyHtml displayReview')
// .shareProjections('stat', 'words')
// .addCacheInflate('tags', ['name','url','short'])


// //-- Could make this generic, but we don't want to allow the cache to start
// //-- accepting arbitary things
// cache.pullRequests = function(repo, getterCB, cb)
// {
//   if (!cache['post_prs']) cache['post_prs'] = {}
//   if (cache['post_prs'][repo])
//     return cb(null, cache['post_prs'][repo])
//   getterCB((e,r)=>{
//     if (e) return cb(e)
//     cache['post_prs'][repo] = r
//     $log("set cache['post_prs']".trace, repo)
//     cb(null,r)
//   })
// }



// var inflateHtml = function(isAnon, cb) {
//   return (e,r) => {
//     if (!r) return cb(e,r)
//     var tags = []
//     for (var {_id} of r.tags)
//       if (cache.tags[_id]) tags.push(_.pick(cache.tags[tag._id],'name','slug','short','desc')))
//     r.tags.map(t=>({}))
//     // $log('inflateHtml'.yellow, r.tags)
//     r.toc = marked(generateToc(r.md))
//     var supped = PostsUtil.extractSupReferences(r.md)
//     r.references = PostsUtil.markupReferences(supped.references, marked)
//     r.html = marked(supped.markdown)
//     cb(e,r)
//   }
// };

// var userCommentByte = (byte) => {
//   var avatar = byte.email ? md5.gravatarUrl(byte.email) :
//     "/static/img/pages/posts/storm.png"
//   return _.extend(_.pick(byte,'_id','name'), {avatar})
// }


// var select = {
//   list: {
//     'by': 1,
//     'htmlHead.canonical': 1,
//     'htmlHead.description': 1,
//     'htmlHead.ogImage': 1,
//     'github.repoInfo': 1,
//     'title':1,
//     'slug': 1,
//     'history': 1,
//     'tags': 1,
//     'stats': 1
//   },
//   display: {
//     '_id': 1,
//     'by':1,
//     'htmlHead': 1,
//     'github.repoInfo': 1,
//     'reviews': 1,
//     'forkers':1,
//     'title':1,
//     'tmpl':1,
//     'slug': 1,
//     'stats': 1,
//     'history': 1,
//     'meta.lastTouch': 1,
//     'tags': 1,
//     'assetUrl': 1,
//     'md': 1,
//   },
  // stats: {
  //   '_id': 1,
  //   'title': 1,
  //   'by.userId':1,
  //   'by.name': 1,
  //   'by.avatar': 1,
  //   'slug': 1,
  //   'htmlHead': 1,
  //   'forkers':1,
  //   'reviews._id': 1,
  //   'reviews.by': 1,
  //   'reviews.updated': 1,
  //   'reviews.replies': 1,
  //   'reviews.votes': 1,
  //   'reviews.questions.key': 1,
  //   'reviews.questions.answer': 1,
  //   'created': 1,
  //   'published': 1,
  //   'submitted': 1,
  //   'tags': 1,
  //   'assetUrl': 1,
  //   'stats': 1,
  //   'pullRequests': 1,
  //   'lastTouch.utc': 1,
  //   'lastTouch.action': 1,
  //   'lastTouch.by.name': 1
  // },
  // tmpl: {
  //   reviewNotify(post, review) {
  //     var {_id,title} = post
  //     var rating = _.find(review.questions,(q)=>q.key=='rating').answer
  //     var comment = _.find(review.questions,(q)=>q.key=='feedback').answer
  //     return { _id, title , comment, rating, reviewerFullName: review.by.name }
  //   },
  //   reviewReplyNotify(post, reply) {
  //     var {_id,title} = post
  //     var {comment,by} = reply
  //     return { _id, title , comment, replierFullName: by.name }
  //   },
  // },
  // cb: {
    // editInfoView(cb) {
    //   return (e,r) => {
    //     if (e || !r) return cb(e,r)
    //     cb(null, selectFromObj(r, select.editInfo))
    //   }
    // },
    // editView(cb, overrideMD, owner) {
    //   return (e,r) => {
    //     if (e && !r) return cb(e,r)
    //     else if (e) {
    //       if (e.message.indexOf("Not Found") != -1)
    //         return cb(Error(`Could not read ${r.slug} repo`))
    //       return cb(e,r)
    //     }
    //     r = selectFromObject(r, select.edit)
    //     r.repo = `${owner}/${r.slug}`
    //     if (overrideMD) {
    //       r.synced = r.md == overrideMD
    //       r.md = overrideMD // hack for front-end editor to show latest edit
    //     }
    //     cb(null,r)
    //   }
    // },
    // statsViewList(cb) {
    //   return (e,posts) => {
    //     var statsR = []
    //     for (var p of posts) {
    //       var url = select.url(p),
    //         wordcount = PostsUtil.wordcount(p.md),
    //         reviews = select.mapReviews(p.reviews),
    //         forkers = select.mapForkers(p.forkers || [])
    //       p.lastTouch = p.lastTouch || { utc: moment().add(-3,'months').toDate() }
    //       statsR.push(_.extend(selectFromObject(p, select.stats),
    //         { url, reviews, forkers, wordcount }))
    //     }
    //    cb(null,statsR)
    //   }
    // }
  // }
// }
// var query = {

  // cached() {
  //   return { $or: [
  //     { 'history.submitted' : {'$exists': true }},
  //     { 'history.published' : {'$exists': true }}]}
  // },

  // posts published before now or readyForReview
  // publishedReviewReady(andCondition) {
  //   var query = {$or: [
  //     {'submitted' : {'$exists': true}},
  //     {$and:
  //       [{'published' : { '$exists': true }},
  //       {'published': { '$lt': new Date() }}]}]}

  //   return andQuery(query, andCondition)
  // },

  // inReview(andCondition) {
  //   var query = [
  //     { 'submitted': {'$exists': true } },
  //     { 'published': {'$exists': false } },
  //     { '$or': [
  //         {'submitted': {'$gt': moment().add(-10,'day').toDate() }},
  //         {'updated':   {'$gt': moment().add(-10,'day').toDate() }}
  //       ]
  //     }
  //   ]
  //   return andQuery(query, andCondition)
  // },

  // stale(andCondition) {
  //   var query = [
  //     { 'submitted': {'$exists': true } },
  //     { 'submitted': {'$lt': moment().add(-10,'day').toDate() } },
  //     { 'published': {'$exists': false } },
  //   ]
  //   return andQuery(query, andCondition)
  // },

  // inDraft(andCondition) {
  //   return { $and:[
  //     { _id },
  //     { 'tags': {'$exists': true } },
  //     { 'assetUrl': {'$exists': true } },
  //     { 'by.userId': userId }
  //   ]}
  // },
  // forker(userId) {
  //   return {
  //     forkers: {
  //       $elemMatch: {
  //         userId: userId
  //       }
  //     }
  //   }
  // },

// }


// var opts = {
//   publishedNewest(limit) {
//     var o = { sort: { 'history.published': -1 } }
//     if (limit) o.limit = limit
//     return o
//   },
//   highestRating: {
//     sort: { 'stats.reviews': -1, 'stats.rating': -1 }
//   },
//   allPublished: {
//     sort: { 'history.published': -1, 'stats.reviews': -1, 'stats.rating': -1 }
//   },
//   stale: {
//     sort: { 'stats.reviews': -1, 'stats.rating': -1 }, 'limit': 9
//   }
// }





// module.exports = {select,query,opts,data}
