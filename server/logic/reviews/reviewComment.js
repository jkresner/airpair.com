module.exports = (DAL, Data, DRY) => ({


  validate(user, reviewId, post, comment)
  {
    if (post.reviews.length < 1) return `Post review length ${post.reviews.length} invalid`
    // var review = _.find(post.reviews, r => _.idsEqual(user._id, v.by._id))
    // if (existing)

    // $log('valid.reviewReply'.yellow, post._id, original, reply)
    if (!comment.said)
      return `Comment required`
  },


  exec(reviewId, post, comment, cb) {
    // But we'd have to look at mongo consistency updates :/
    var {user} = this
    var {reviews} = post

    var review = _.find(reviews, r => _.idsEqual(r._id, reviewId))
    review.replies.push(assign(comment,{_id: DAL.Post.newId(), by: user._id}))

    var notifications =  () => {
    //   var threadParticipants =
    //     _.uniq( _.union([author,review.by],_.pluck(review.replies,'by')), (p)=>p.email)

    //   var thisParticipant = _.find(threadParticipants, (p)=>p.email == this.user.email)
    //   if (thisParticipant) threadParticipants = _.without(threadParticipants, thisParticipant)

    //   mailman.sendTemplateMails('post-review-reply-notification',
    //     selectTmpl.reviewReplyNotify(post,reply), threadParticipants)
    }

    DRY.updateReviews(post, reviews, 'postreview:comment', user, notifications, cb)
  },


  project: Data.Project.review


})


