var {Post}                   = DAL
var query = {
  cached: { $or: [{ 'history.submitted' : {'$exists': true }}, { 'history.published' : {'$exists': true }}] },
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

  // getAllForCache(cb) {
    // Post.getManyByQuery(query.cached, { select: select.list }, select.cb.addUrl(cb))
  // },

}


var saveReviews = {

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

}

module.exports = get
