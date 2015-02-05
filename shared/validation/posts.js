var postsUtil = require('../posts')

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
    if (original.reviewReady){
      if (original.md !== update.md)
        return "Updating markdown must happen through git flow"
      if (original.slug !== update.slug)
        return "Cannot change slug after post is in review"
    }
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
    if (original.reviewReady != null)
      return 'Must be editor to delete a post in review'
  },

  submitForReview(user, post)
  {
    var isOwner = _.idsEqual(post.by.userId, user._id)
    if (!isOwner)
      return 'Post can only be submitted for review by its owner'
    if (!post.slug)
      return 'Must provide a slug'
    if (post.reviewReady)
      return `This post has already been submitted for review`
    if (!post.md)
      return `Posts markdown required`
    var wordcount = postsUtil.wordcount(post.md)
    if (postsUtil.wordsTogoForReview(wordcount) > 0)
      return `Post word count [${wordcount}] too short for review`
  },

  updateFromGithub(user, original, update){
    var isEditor = user.roles && _.contains(user.roles, "editor")
    var isAuthor =  _.idsEqual(original.by.userId, user._id)
    if (! isAuthor && !isEditor)
      return "Not authorized"
    if (original.published && isAuthor)
      return "Only AirPair editors can update a published post"
  },

  updateGithubHead(user, original, update){
    if (! _.idsEqual(original.by.userId, user._id))
      return "Not authorized"
    if (!update.commitMessage)
      return "Commit Message required"
    if (!update.md)
      return "MarkDown empty"
    //maybe allow editors as well?
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

  addForker(user, postId){
    //TODO
    // console.log("(validation)", user, postId)
  }
}

module.exports = validation
