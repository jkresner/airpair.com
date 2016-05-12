// var generateToc         = require('./postsToc')
// var md5                 = require('../util/md5')
// var PostsUtil           = require('../../shared/posts')


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
  // generateToc(md) {
  //   marked(generateToc(md))
  // },
  // mapReviews(reviews) {
  //   return _.map(reviews,(rev)=> {
  //     rev.by = userCommentByte(rev.by)
  //     rev.votes = _.map(rev.votes || [], (vote) =>
  //       _.extend(vote, {by: userCommentByte(vote.by)}) )
  //     rev.replies = _.map(rev.replies || [], (reply) =>
  //       _.extend(reply, {by: userCommentByte(reply.by)}) )
  //     return rev
  //   }) || []
  // },
  // mapForkers(forkers) {
  //   return _.map(forkers,(f)=> {
  //     var ff = userCommentByte(f)
  //     ff.username = f.social.gh.username
  //     ff.userId = f.userId
  //     return ff
  //   })
  // },
  url(post) {
    if (post.submitted && !post.published) return `/posts/review/${post._id}`
    else if (post.htmlHead) return post.htmlHead.canonical
  },
  tmpl: {
    reviewNotify(post, review) {
      var {_id,title} = post
      var rating = _.find(review.questions,(q)=>q.key=='rating').answer
      var comment = _.find(review.questions,(q)=>q.key=='feedback').answer
      return { _id, title , comment, rating, reviewerFullName: review.by.name }
    },
    reviewReplyNotify(post, reply) {
      var {_id,title} = post
      var {comment,by} = reply
      return { _id, title , comment, replierFullName: by.name }
    },
  },
  cb: {
    inflateHtml,
    addUrl(cb) {
      return (e,r) => {
        for (var p of r)
          p.url = select.url(p)
        cb(e,r)
      }
    },
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
    // statsView(cb) {
    //   return (e,r) => {
    //     if (e || !r) return cb(e,r)
    //     r = selectFromObject(r, select.stats)
    //     r.reviews = select.mapReviews(r.reviews)
    //     r.forkers = select.mapForkers(r.forkers || [])
    //     r.url = select.url(r)
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
    },
    // displayView(isAnon, similarFn, cb) {
    //   return inflateHtml(isAnon, (e,r) => {
    //     // $log('inflateHtml', isAnon, e)

    //     if (e || !r) return cb(e,r)
    //     if (r.submitted) {
    //       r.stats = r.stats || PostsUtil.calcStats(r)
    //       r.publishReady = (r.stats.reviews > 2) && (r.stats.rating > 3.5)
    //     }

    //     if (!r.published)
    //       r.htmlHead = { noindex: true }
    //     else
    //       //-- Stop using disqus once deployed the review system
    //       r.showDisqus = moment(r.published) < moment('20150201', 'YYYYMMDD')

    //     r.htmlHead.ogTypePost = true

    //     r.forkers = select.mapForkers(r.forkers || [])
    //     r.reviews = select.mapReviews(r.reviews)
    //     if (r.reviews.length > 0)
    //       r = PostsUtil.extendWithReviewsSummary(r)

    //     if (!similarFn)
    //       similarFn = (p, done) => done(null,[])

    //     r.by.firstName = util.firstName(r.by.name)

    //     similarFn(r, (ee,similar) => {
    //       for (var p of similar) p.tags = inflatedTags(p)
    //       r.similar = similar
    //       r.url = r.htmlHead.canonical
    //       cb(null, r)
    //     })
    //   })
    // }
  }
}


var andQuery = (query, andCondition) => {
  if (andCondition) query.push(andCondition)
  return { '$and': query }
}

var query = {

  // cached() {
  //   return { $or: [
  //     { 'history.submitted' : {'$exists': true }},
  //     { 'history.published' : {'$exists': true }}]}
  // },

  published(andCondition) {
    var query = [
      {'history.published' : { '$exists': true }} ,
      {'history.published': { '$lt': new Date() }}
    ]

    return andQuery(query, andCondition)
  },

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

}


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








