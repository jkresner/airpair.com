var validation = {

  create(user, post)
  {
    if (!post.title) return 'Post title required'
    if (!post.by) return 'Post by required'
    if (!post.by.bio) return 'Post author bio required'
  },

  update(user, original, update)
  {
    var isEditor = _.contains(user.roles, 'editor')
    var isOwner = _.idsEqual(original.by.userId, user._id)

    if ( !isEditor && !isOwner )
      return 'Post must be updated by owner'
    if (original.published && !isEditor)
      return 'Must be editor to update a published post'
  },

  publish(user, original, update)
  {
    var isEditor = _.contains(user.roles, 'editor')

    if (!isEditor)
      return 'Post must be published by an editor'
    if (!update.publishReady)
      return "Post must be marked publishReady by author"
    if (!update.slug)
      return 'Post must have slug to be published'
  },

  deleteById(user, original)
  {
    var isEditor = _.contains(user.roles, 'editor')
    var isOwner = _.idsEqual(original.by.userId, user._id)

    if ( !isEditor && !isOwner )
      return 'Post must be deleted by owner'
    if (original.published && !isEditor)
      return 'Must be editor to delete a published post'
  },

  submitForReview(user, original, update)
  {
    var isOwner = _.idsEqual(update.by.userId, user._id)
    if (!isOwner)
      return 'Post can only be submitted for review by its owner'
    if (!update.slug)
      return 'Slug cannot be null'
    if (update.reviewReady)
      return "This post has already been submitted for review"
  },

  updateFromGithub(user, original, update){
    //TODO
    var isOwner = _.idsEqual(original.by.userId, user._id)
  },

  updateGithubFromDb(user, original, update){
    //TODO
    console.log("TODO updateGithubFromDB Validation")
    //only allow user to do this?
  },

  submitForPublication()
  {
    //TODO
    // console.log("(validation) submitForPublication")
  },

  addReview(user, postId, review)
  {
    //TODO
    // console.log("(validation) addReview", user, postId, review)
  },

  addContributor(user, postId){
    //TODO
    // console.log("(validation)", user, postId)
  },

  getUserContributions(cb){
    //TODO
    console.log("validation")
  }

}

module.exports = validation
