const Views = {
  display: '_id by stats htmlHead meta.lastTouch github.repoInfo'
           + ' reviews forkers title tmpl slug tags assetUrl'
           + ' url html toc similar adtag history',
  list:    '_id by history htmlHead.canonical htmlHead.description htmlHead.ogImage github.repoInfo title url slug tags stats',
  cache:   '_id by.name by.avatar title htmlHead.canonical htmlHead.ogImage history.subscribed history.published',
  sub:     '_id name email avatar username auth.gh.login photos'
}

var lib = require('../../../es/post')



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
  //     { '$or': [
  //         {'submitted': {'$gt': moment().add(-10,'day').toDate() }},
  //         {'updated':   {'$gt': moment().add(-10,'day').toDate() }}
  //       ]
  //     }
                     ] }

        return q
  }
}


// var query = {

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


const Opts = {
  latest: { select: Views.list, sort: { 'history.published': -1, 'stats.reviews': -1, 'stats.rating': -1 } },
  inreview: { select: `${Views.display} md slug subscribed history` },
  published: { select: `${Views.display} md slug subscribed history` },
  publishedNewest: limit => ({ limit, select: Views.list, sort: { 'history.published': -1 } }),
  submitted: limit => ({ limit, select: Views.list, sort: { 'meta.lastTouch._id': -1 } }),
  subscribedUsers: { select: Views.sub }
// recentlyUpdated: { select: Views.activity, sort: { 'updated': 1 }, limit: 15 },
// stale: { sort: { 'stats.reviews': -1, 'stats.rating': -1 }, 'limit': 9 }
}


module.exports = { Views, Query, Opts,

  Projections: ({select, inflate, md5, tmpl}, {chain, view}) => ({

    subscribedHash: d => {
      var hash = {}
      for (var u of d.users)
        hash[u._id] = _.omit(u, '_id')

      var p = d.post
      // $log('subHash'.yellow, p)
      p.subscribed = (p.subscribed||[]).map(s=>assign(s,hash[s.userId]||{}))

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
      return d
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
      d.by.firstName = honey.util.String.firstName(d.by.name)

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


    toHtml: d => {
      var {md,references} = lib.indexReferences(d.md)
      var html = {references}
      html.toc = marked(lib.toc(d.md))
      html.body = marked(md)
      return assign(d, {html})
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
        // d.html = marked(md)
        // marked.setOptions({highlight:null})
      // }
      // else
      // d.html = marked(md)
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
      for (var sim of d.similar) sim.url = sim.htmlHead.canonical
      if (!d.similar || d.similar.length == 0) d.similar = false
      // $log('d', d)
      var d2 = chain(d, 'subscribedHash')
      d2.post = chain(d.post, inflate.tags, 'toHtml', 'url', 'tmpl', 'adTag', 'reviews', 'other', view.display, 'otherByAuthor')
      for (var tag of d2.post.tags) tag.url = tag.slug == 'angularjs' ? '/angularjs/posts' : `/${tag.slug}`
      // $log('displayPublished'.magenta, d.reviews.length)
      return d2
    },

    displayReview: d => {
      // $log('displayReview'.yellow, d)
      if (d.post.history.published)
        return select(chain(d.post, inflate.tags, 'url'), '_id url title history')

      var post = chain(d, 'subscribedHash', inflate.tags, 'bodyHtml', 'url', 'tocHtml', 'tmpl', 'reviews', view.display)
      var r = { tmpl: 'inreview', post }
      // $log('displayReview'.yellow, r.post.title)
      return r
    },

    url: d => assign(d, { url :
      d.history.submitted && !d.history.published ? `/posts/review/${d._id}` :
      `${d.htmlHead ? d.htmlHead.canonical : '/posts/preview/'+d._id }`
    }),


    tileList: d =>
      chain(d, inflate.tags, 'url', view.list),


    submitted: d =>
      chain(d, inflate.tags, 'url', view.list),


    byTag: d => {
      var latest = chain(d.posts, inflate.tags, 'url', view.list)
      var related = _.sortBy(
                      _.uniqBy(_.flatten(latest.map(p=>p.tags)), t=>t.slug)
                       .filter(t=>t.slug!=d.slug)
                    , t => -1*t.posts)

      return assign(d, { posts: {latest},
        htmlHead: tmpl("page:tag-meta", d),
        related: related.length > 16 ? _.take(related, 16) : related })
    }

  })

}
// .shareProjections('post', 'subscribedHash reviews url tocHtml bodyHtml displayReview')
// .shareProjections('stat', 'words')


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

// var userCommentByte = (byte) => {
//   var avatar = byte.email ? md5.gravatarUrl(byte.email) :
//     "/static/img/pages/posts/storm.png"
//   return _.extend(_.pick(byte,'_id','name'), {avatar})
// }

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




