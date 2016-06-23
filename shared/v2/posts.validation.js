var {validSlug,wordcount,wordsTogoForReview} = require('../posts')
post: {
  isOwner(user, post) {
    return idsEqual(user._id, post.by.userId)
  },
  isOwnerOrEditor(user, post) {
    var isEditor = _.contains(user.roles, 'editor')
    var isOwner = idsEqual(user._id, post.by.userId)

    return isAdmin(user) || isEditor || isOwner
  },
  isForker(user, post) {
    return _.find(post.forkers, (f)=>idsEqual(user._id, f.userId))
  }
}


var validation = {


  review(user, post, review)
  {
    var existing = _.find(post.reviews, (r)=>_.idsEqual(user._id, r.by._id))
    if (existing)
      return `You have already reviewed ${post.title}`

    if (_.idsEqual(user._id,post.by.userId))
      return `Cannot review your own post.`

    if (!post.published && !post.submitted)
      return `Cannot review. Post [${post._id}] has not been submitted or published`

    var rating = _.find(review.questions, (q)=> q.key == 'rating')
    if (!rating || !(rating.answer > 0 && rating.answer < 6) )
      return `5 star rating required`

    var feedback = _.find(review.questions, (q)=> q.key == 'feedback')
    if (!feedback || !feedback.answer)
      return `5 star feedback required`
  },

  reviewUpdate(user, post, original, update)
  {
    var isOwner = _.idsEqual(original.by._id, user._id)
    if (!isOwner) return `Can only update your own review`
  },

  reviewReply(user, post, original, reply)
  {
    // $log('valid.reviewReply'.yellow, post._id, original, reply)
    if (!reply.comment)
      return `Reply comment required`
  },

  reviewUpvote(user, post, original)
  {
    var existing = _.find(original.votes, (v)=>_.idsEqual(user._id, v.by._id))
    if (existing)
      return `You already voted on this review[${original}]`
    var isOwner = _.idsEqual(original.by._id, user._id)
    if (isOwner)
      return `Can not upvote yourself`
  },

  reviewDelete(user, post, original)
  {
    var isEditor = _.contains(user.roles, 'editor')
    var isAdmin =  _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(original.by._id, user._id)

    if (!isAdmin && !isEditor && !isOwner) return `Cannot delete review[${original._id}] not belonging to you`
  }

}

module.exports = validation
