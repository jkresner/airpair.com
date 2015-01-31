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
  },

  submitForPublication()
  {
    console.log("(validation) submitForPublication")
  },

  addReview(user, postId, review)
  {
    console.log("(validation) addReview", user, postId, review)
  }

}

module.exports = validation
