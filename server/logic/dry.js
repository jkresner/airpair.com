module.exports = (DAL, Data) => assign(require("../../es/post"), {


  getHeadMD(user, post, cb) {
    if (!post.history.submitted)
      return cb(null, post.md)

    var owner = _.idsEqual(post.by._id, user._id)
                ? global.config.wrappers.gitPublisher.org
                : user.auth.gh.login

    Wrappers.GitPublisher.getFile(user, owner, post.slug, '/post.md', 'edit',
      (e, headMDfile) => cb(e, e ? null : headMDfile.string) )
  },


  getSetPostStats(post, PRs) {
    var {wordcount} = honey.util.String

    if (!post.submitted) return { words: wordcount(post.md) }

    var {_id, md,reviews,forkers} = post

    //-- Assign since we aren't always going to check PRs
    var stats = Object.assign(post.stats||{},
                stat.calcStats({md,reviews,forkers,PRs}, wordcount))

    if (!post.stats
      || post.stats.acceptedPRs != stats.acceptedPRs
      || post.stats.closedPRs != stats.closedPRs
      || post.stats.openPRs != stats.openPRs
      || post.stats.reviews != stats.reviews
      || post.stats.comments != stats.comments
      || post.stats.rating != stats.rating)
    {

      // ?? Unfortunately this is not right, we need to query the github api again to see if they were merged
      // .. post.stats = _.extend(post.stats||{},{acceptedPRs,openPRs,closedPRs})

      DAL.Post.updateSet(_id, {stats}, (ee, r) => {})
    }

    return stats
  },


  similarPosts({post,limit}, cb) {
    //-- TODO, way better logic
    var q = Data.posts.Query.published({'_id':{$ne:post._id},'tags._id':post.tags[0]._id})
    var opts = Data.posts.Opts.publishedNewest(limit||3)

    // $log('simQ'.yellow, q)
    DAL.Post.getManyByQuery(q, opts, cb)
  },


  postSubscribedUsers(post, cb) {
    var {subscribed} = post
    if (!subscribed || subscribed.length == 0) return cb(null,
      [] // not sure.. should at least have author ?
    )
    var uIds = subscribed.map(s=>s.userId)
    DAL.User.getManyByQuery({_id:{$in:uIds}}, Data.reviews.Opts.subscribedUsers, (e, r) => {
      if (e) return cb(e)
      cb(null, r)
    })
  },


  updateReviews(post, reviews, action, user, notifications, cb) {

    var stats = assign(post.stats, stat.comments({reviews}), stat.ratingBasic({reviews}))
    var meta = honey.logic.DRY.touchMeta(post.meta, action, user)

    var ups = {reviews,stats,meta}

    if (!_.find(post.subscribed, s => _.idsEqual(user._id, s.userId))) {
      ups.subscribed = user.subscribed || []
      ups.subscribed.push({userId:user._id,mail:'default'})
    }

    DAL.Post.updateSet(post._id, ups, {'select':'_id stats reviews subscribed'},  (e, post)=> {
      var uIds = post.subscribed.map(s=>s.userId)
      DAL.User.getManyByQuery({_id:{$in:uIds}}, Data.reviews.Opts.subscribedUsers, (ee, users) => {
        if (ee) return cb(ee)
        // if (notifications) notifications()
        // Queue.postReview(post, user, existing)
        cb(null, {post,users})
      })
    })
  }



})
