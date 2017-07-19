module.exports = (DAL, Data, {role,updateReviews}) => ({


  validate(user, reviewId, post, vote)
  {
    // var existing = _.find(original.votes, (v)=>_.idsEqual(user._id, v.by._id))
    // if (existing)
    //   return `You already voted on this review[${original}]`
    // var isOwner = _.idsEqual(original.by._id, user._id)
    // if (isOwner)
    //   return `Can not upvote yourself`

    if (role.author(user, post))
      return `Can not vote on reviews of your own post`

    var review = _.find(post.reviews, r => _.idsEqual(r._id, reviewId))
    var isOwner = _.idsEqual(review.by, user._id)
    if (isOwner) return `Can not vote on your own review`

    if (!vote.val) return `Your vote must be up, down or indifferent`
    else if (vote.val != -1 &&
             vote.val != 0 &&
             vote.val != 1)
      return `Vote value unrecognized`
  },


  exec(reviewId, post, vote, cb) {
    var {user} = this
    var {reviews} = post
    var review = _.find(reviews, r => _.idsEqual(r._id, reviewId))
    var {votes} = review
    var existing = _.find(votes, v => _.idsEqual(v.by, user._id))
    if (existing) existing.val = vote.val
    else votes.push(assign(vote, { _id: DAL.Post.newId(), by: user._id }))
    //   return `You already voted on this review[${original}]`

    var notifications =  () => {}

    updateReviews(post, reviews, 'postreview:vote', user, notifications, cb)
  },


  project: Data.Project.review


})


