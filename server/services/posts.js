var {Post}                   = DAL

var query = {
  cached: { $or: [{ 'history.submitted' : {'$exists': true }}, { 'history.published' : {'$exists': true }}] },
  published: { $and: [ {'history.published' : { '$exists': true }},
                      {'history.published': { '$lt': new Date() }},
                      {'tmpl' : { '$ne': 'blank' }},
                      {'tmpl' : { '$ne': 'faq' }},
                      {'by._id' : { '$ne': '52ad320166a6f999a465fdc5' }} ]}
}
var select = {
  list: '_id by.name by.avatar title tags htmlHead.canonical htmlHead.ogImage htmlHead.description history',
  cb: {
    addUrl(cb) {
      return (e,r) => {
        for (var p of r) {
          var {submitted,published} = p.history
          if (submitted && !published) p.url = `/posts/review/${p._id}`
          else if (p.htmlHead) p.url = p.htmlHead.canonical
        }
        cb(e,r)
      }
    }
  }
}



var get = {

  getById(id, cb) {
    Post.getById(id, cb)
  },

  getAllForCache(cb) {
    Post.getManyByQuery(query.cached, { select: select.list }, select.cb.addUrl(cb))
  },

  getAllPublished(cb) {

    var feat = ['the-tipping-point-of-clientside-performance',
                    'the-definitive-ionic-starter-guide',
                    'optimizing-python-code']
    var pop = ['angularjs-tutorial',
                    'hybrid-apps-ionic-famous-f7-onsen',
                    'nodejs-framework-comparison-express-koa-hapi',
                    'python-tips-and-traps',
                    'top-10-mistakes-nodejs-developers-make',
                    'comprehensive-guide-to-building-scalable-web-app-on-amazon-web-services--part-1',
                    'swift-tutorial-building-an-ios-applicationpart-1',
                    'understand-javascript-array-reduce-in-1-minute',
                    'creating-a-photo-gallery-in-android-studio-with-list-fragments']
    var com = ['switching-from-ios-to-ionic',
                'how-to-create-a-complete-expressjs--nodejs--mongodb-crud-and-rest-skeleton',
                'ntiered-aws-docker-terraform-guide',
                'unit-testing-angularjs-applications',
                'the-legend-of-canvas',
                'moving-from-sql-to-rethinkdb']

    var options = {
      sort: { 'history.published': -1, 'stats.reviews': -1, 'stats.rating': -1 },
      select: '_id by htmlHead.canonical htmlHead.description htmlHead.ogImage github.repoInfo title slug history tags stats'
    }

    Post.getManyByQuery(query.published, options, select.cb.addUrl((e,r) => {
      var featured = _.filter(r, p => _.contains(feat,p.slug))
      r = _.difference(r, featured)
      var latest = r.splice(0,6)
      var top = _.take(_.sortBy(r, (p) => (!p.stats) ? 0
        :  -1*(p.stats.rating-2)*(p.stats.reviews+2) ), 6)
      r = _.difference(r, top)
      var popular = _.filter(r, (p) => _.contains(pop,p.slug))
      var comp = _.filter(r, (p) => _.contains(com,p.slug))
      var archive = _.difference(r, _.union(popular,comp))

      cb(null, { latest, featured, top, popular, comp, archive })
    }))
  },

  //-- used for Rss
  getRecentPublished(cb) {
    var options = { select: select.list, sort: { 'history.published': -1 }, limit: 12 }
    Post.getManyByQuery(query.published, options, select.cb.addUrl(cb))
  },


  // getByIdForContributors(post, cb) {
  //   cb(V2DeprecatedError('Posts.getByIdForContributors'))
  // },

  // getByIdForForking(post, cb) {
  //   cb(V2DeprecatedError('Posts.getByIdForForking'))
  //   // var {slug} = post
  //   // post = selectFromObject(post, select.editInfo)
  //   // post.submit = { repoAuthorized: false, slug }
  //   // if (!this.user.social || !this.user.social.gh) return cb(null, post)
  //   // post.submit.owner = this.user.social.gh.username
  //   // $callSvc(UserSvc.getProviderScopes, this)((e, providers) => {
  //   //   if (e && e.message == "GitHub token auth failed")
  //   //     post.submit.repoAuthorized = false
  //   //   else if (e)
  //   //     return cb(Error(`getByIdForForking. Failed to get user providers scopes for [${this.user._id}][${this.user.social.gh.username}]`))
  //   //   else {
  //   //     var scope = _.find(providers.github, (s) => s.indexOf("repo") != -1)
  //   //     post.submit.repoAuthorized = scope != null
  //   //   }
  //   //   cb(null, post)
  //   // })
  // },

  getByIdForReview(_id, cb) {
    // cb(V2DeprecatedError('svc.Posts.get.getByIdForReview'))
    Post.getById(_id, { select: '_id history title htmlHead' }, cb)
    //   if (e||!r) return cb(e,r)
    //   if (r.published) return cb(null, {published:true, url: r.htmlHead.canonical})
    //   if (!r.submitted) return cb(null, null)
      // select.cb.displayView(this.user==null, null, cb)(e,r)
    // })
  },


  //-- Placeholder for showing similar posts to a currently displayed post
  // getSimilar(original, cb) {
  //   var tagId = original.primarytag._id
  //   var options = Object.assign({ select: select.list }, opts.publishedNewest(3))
  //   Post.getManyByQuery(query.published({'tags._id':tagId}), options, select.cb.addUrl(cb))
  // },

  // getByTag(tag, cb) {
  //   var options = assign({ select: select.list}, opts.publishedNewest())
  //   var q = query.published({'tags._id': tag._id})
  //   Post.getManyByQuery(q, options, select.cb.addUrl((e,r) => cb(null, {latest:r}) ))
  // },

  getPostsInReview(cb) {
    cb(V2DeprecatedError('Posts.getPostsInReview'))
    // var options = { fields: select.list, options: { sort: { 'submitted': -1 } } }
    // svc.searchMany(query.inReview(), options, select.cb.addUrl((e,r)=>{
    //   if (e || r.length != 0) return cb(e, r)
    //   options.options = opts.stale
    //   svc.searchMany(query.stale(), options, select.cb.addUrl(cb))
    // }))
  },

  getReview(post, reviewId, cb) {
    throw Error('getReview.notImplemented')
    // return cb(null, _.find(post.reviews,(r)=>_.idsEqual(r._id,reviewId)))
  },

}



var save = {

  addForker(post, cb) {
    cb(V2DeprecatedError('Posts.addForker'))
    // github2.addContributor(this.user, org, post.slug, (e, fork) => {
    //   if (e) return cb(e)
    //   var { name, email, social } = this.user
    //   post.forkers = post.forkers || []
    //   var existing = _.find(post.forkers, (f) => _.idsEqual(f.userId,this.user._id))
    //   if (!existing)
    //     post.forkers.push({ userId: this.user._id, name, email, social })
    //   post.stats = PostsUtil.calcStats(post)
    //   svc.update(post._id, post, select.cb.statsView(cb))
    // })
  }

}


var saveReviews = {

  review(post, review, cb) {
    cb(V2DeprecatedError('svc.Posts.save.review'))
    // review.by = _.pick(this.user,'_id','name','email')
    // review.type = `post-survey-inreview`
    // if (post.published) review.type.replace('inreview','published')

    // var reviews = post.reviews || []
    // reviews.push(review)

    // var stats = PostsUtil.calcStats(Object.assign(post,{reviews}))
    // Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))

    // //-- Probably better doing the db hit as we ensure the right email if the user
    // //-- changed it at any point
    // User.getById(post.by.userId, (ee, user) => {
    //   mailman.sendTemplate('post-review-notification',
    //     selectTmpl.reviewNotify(post,review), user)
    // })
  },

  reviewUpdate(post, original, reviewUpdated, cb) {
    cb(V2DeprecatedError('svc.Posts.save.reviewUpdate'))
    // var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    // reviewUpdated.updated = new Date
    // review = _.extend(review,reviewUpdated)
    // var stats = PostsUtil.calcStats(post)
    // var {reviews} = post.reviews
    // Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  },

  reviewReply(post, original, reply, cb) {
    cb(V2DeprecatedError('svc.Posts.save.reviewReply'))
    // Damn this is annoying... alternative is to stuff the email into the author object
    // But we'd have to look at mongo consistency updates :/
    // User.getById(post.by.userId, (ee, author) => {
    //   var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    //   reply._id = Post.newId()
    //   reply.by = _.pick(this.user,'_id','name','email')
    //   review.replies.push(reply)

    //   var threadParticipants =
    //     _.uniq( _.union([author,review.by],_.pluck(review.replies,'by')), (p)=>p.email)

    //   var thisParticipant = _.find(threadParticipants, (p)=>p.email == this.user.email)
    //   if (thisParticipant) threadParticipants = _.without(threadParticipants, thisParticipant)

    //   mailman.sendTemplateMails('post-review-reply-notification',
    //     selectTmpl.reviewReplyNotify(post,reply), threadParticipants)

    //   var stats = PostsUtil.calcStats(post)
    //   var {reviews} = post
    //   Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
    // })
  },

  reviewUpvote(post, original, cb) {
    cb(V2DeprecatedError('svc.Posts.save.reviewUpvote'))
    // var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    // var vote = { _id: Post.newId(), val: 1, by: _.pick(this.user,'_id','name','email') }
    // review.votes.push(vote)
    // stats = PostsUtil.calcStats(post)
    // var {reviews} = post
    // Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  },

  reviewDelete(post, original, cb) {
    cb(V2DeprecatedError('svc.Posts.save.reviewDelete'))
    // var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    // var reviews = _.without(post.reviews,review)
    // var stats = PostsUtil.calcStats(_.extend(post,{reviews}))
    // Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  }

}

module.exports = Object.assign(get,save,saveReviews)
