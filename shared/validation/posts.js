var {validSlug,wordcount,wordsTogoForReview} = require('../posts')


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

    //-- Consider if editors should be allowed to update posts
    //-- Rather than fork like everyone else...

    if ( !isEditor && !isOwner )
      return 'Post must be updated by owner'
    if (original.published && !isEditor)
      return 'Must be editor to update a published post'
    if (!validSlug(update.slug))
      return '${post.slug} not a valid post slug'
    if (original.submitted){
      if (original.md !== update.md)
        return "Updating markdown must happen through git flow"
      if (original.slug !== update.slug)
        return "Cannot change slug after post is in review"
    }
  },

  publish(user, post, publishedOverride)
  {
    var isEditor = _.contains(user.roles, 'editor')
    var isOwner = _.idsEqual(post.by.userId, user._id)

    if (!isEditor && !isOwner)
      return `Cannot publish post not belonging to you`
    if (!isEditor && post.reviews < 5)
      return `Must have at least 5 reviews to be published`

    // if (!update.publishReady)
    // return "Post must be marked publishReady by author"
    if (!post.submitted)
      return `Post must be submitted for review before being published`
    if (!post.publishedCommit)
      return `Post must have propogated commit to be published`
    if (post.published && !publishedOverride)
      return `Post already published...`
    if (!post.slug)
      return `Post must have a slug to be published`
    if (!validSlug(post.slug))
      return `${post.slug} not a valid post slug to publish`
  },

  deleteById(user, original)
  {
    var isEditor = _.contains(user.roles, 'editor')
    var isOwner = _.idsEqual(original.by.userId, user._id)

    if ( !isEditor && !isOwner )
      return `Post must be deleted by owner`
    if (original.published && !isEditor)
      return `Must be editor to delete a published post`
    if (original.submitted != null)
      return `Must be editor to delete a post in review`
  },

  submitForReview(user, post)
  {
    var isOwner = _.idsEqual(post.by.userId, user._id)
    if (!isOwner)
      return `Post can only be submitted for review by its owner`
    if (!user.social || !user.social.gh)
      return `User must authorize GitHub to submit post for review`
    if (!post.slug)
      return `Post must have slug to submit for review`
    if (!validSlug(post.slug))
      return `${post.slug} not a valid post slug to publish`
    if (post.submitted)
      return `This post has already been submitted for review`
    if (!post.md)
      return `Posts markdown required`
    if (post.github)
      return `Post already has associated git repo`
    var wcount = wordcount(post.md)
    if (wordsTogoForReview(wcount) > 0)
      return `Post word count [${wordcount}] too short for review`
  },

  propagateMDfromGithub(user, post){
    var isEditor = user.roles && _.contains(user.roles, "editor")
    var isAuthor =  _.idsEqual(post.by.userId, user._id)
    if (!isAuthor && !isEditor)
      return `Not authorized`
    if (post.published && isAuthor)
      return `Only editors can update published posts`
  },

  updateGithubHead(user, original, postMD, commitMessage){
    var isOwner = _.idsEqual(original.by.userId, user._id)
    if (!isOwner)
      return `Post head can only be updated by its owner`
    if (!user.social || !user.social.gh)
      return `User must authorize GitHub to become a contributor`
    if (!commitMessage)
      return `Commit Message required`
    if (!postMD)
      return `MarkDown empty`
    //maybe allow editors as well?
  },

  addReview(user, postId, review)
  {
    //TODO
    // console.log("(validation) addReview", user, postId, review)
  },

  addForker(user, post){
    if (!user.social || !user.social.gh)
      return `User must authorize GitHub to become a contributor`
    if (!post.github)
      return `Can not fork post as it has no git repo`
    if (!post.submitted)
      return `Can not fork post not yet submitted for review`
    //TODO
    // console.log("(validation)", user, postId)
  }
}

module.exports = validation
