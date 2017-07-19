module.exports = (DAL, Data, DRY) => ({


  validate(user, post, original) {
    // var isEditor = _.contains(user.roles, 'editor')
    // var isReviewer = _.idsEqual(original.by._id, user._id)

    // if (!isEditor && !isReviewer)
    //   return `Review[${original._id}] does not belong to you`

    // var isEditor = _.contains(user.roles, 'editor')
    // var isAdmin =  _.contains(user.roles, 'admin')
    // var isOwner = _.idsEqual(original.by._id, user._id)

    // if (!isAdmin && !isEditor && !isOwner) return `Cannot delete review[${original._id}] not belonging to you`
  },


  exec(post, original, cb) {
    // var meta = touchMeta(post.meta, 'reviewDelete', this.user)
    // var review = _.find(post.reviews, r => _.idsEqual(r._id,original._id))
    // var reviews = _.without(post.reviews,review)
    // var stats = Shared.posts.calcStats(_.extend(post,{reviews}))

    // Post.updateSet(post._id, {reviews,stats,meta}, cb)
  },


  project: Data.Project.review


})



 // review(post, review, cb) {
  //   cb(V2DeprecatedError('svc.Posts.save.review'))
  //   // review.by = _.pick(this.user,'_id','name','email')
  //   // review.type = `post-survey-inreview`
  //   // if (post.published) review.type.replace('inreview','published')

  //   // var reviews = post.reviews || []
  //   // reviews.push(review)

  //   // var stats = PostsUtil.calcStats(Object.assign(post,{reviews}))
  //   // Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))

  //   // //-- Probably better doing the db hit as we ensure the right email if the user
  //   // //-- changed it at any point
  //   // User.getById(post.by.userId, (ee, user) => {
  //   //   mailman.sendTemplate('post-review-notification',
  //   //     selectTmpl.reviewNotify(post,review), user)
  //   // })
  // },

  // reviewUpdate(post, original, reviewUpdated, cb) {
  //   cb(V2DeprecatedError('svc.Posts.save.reviewUpdate'))
  //   // var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
  //   // reviewUpdated.updated = new Date
  //   // review = _.extend(review,reviewUpdated)
  //   // var stats = PostsUtil.calcStats(post)
  //   // var {reviews} = post.reviews
    // Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  // },

  // reviewReply(post, original, reply, cb) {
  //   cb(V2DeprecatedError('svc.Posts.save.reviewReply'))
  //   // Damn this is annoying... alternative is to stuff the email into the author object
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
  // },

  // reviewUpvote(post, original, cb) {
  //   cb(V2DeprecatedError('svc.Posts.save.reviewUpvote'))
    // var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    // var vote = { _id: Post.newId(), val: 1, by: _.pick(this.user,'_id','name','email') }
    // review.votes.push(vote)
    // stats = PostsUtil.calcStats(post)
    // var {reviews} = post
    // Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  // },

  // reviewDelete(post, original, cb) {
    // cb(V2DeprecatedError('svc.Posts.save.reviewDelete'))
    // var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    // var reviews = _.without(post.reviews,review)
    // var stats = PostsUtil.calcStats(_.extend(post,{reviews}))
    // Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  // }
