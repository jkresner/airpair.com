var {validSlug,wordcount,wordsTogoForReview} = require('../posts')
var Roles = require('../roles').post


var validation = {

  getByIdForEditing(user, post) {
    if (!Roles.isOwner(user, post) &&
        !Roles.isForker(user, post))
      return `Post cannot be edited by you, did you fork it already?`
  },

  // getByIdForPreview(user, post) {
  //   if (!Roles.isOwnerOrEditor(user, post))
  //     return `Post not available for preview`
  // },

  getByIdForSubmitting(user, post) {
    if (!Roles.isOwner(user, post))
      return `Post cannot be submitted by you. It is not yours.`
  },

  getByIdForPublishing(user, post) {
    if (!Roles.isOwnerOrEditor(user, post))
      return `Post not available for publishing by you`
  },

  create(user, post)
  {
    if (!post.title) return `Post title required`
    if (!post.by) return `Post by required`
    if (!post.by.bio) return `Post author bio required`
  },

  update(user, original, update)
  {
    var isEditor = _.contains(user.roles, 'editor')

    if (!Roles.isOwnerOrEditor(user, original))
      return `Post must be updated by owner`

    if (original.published && !isEditor)
      return `Must be editor to update a published post`

    if (!_.idsEqual(original.by.userId, update.by.userId))
      return `Cannot change author via update`
    if (update.slug)
      return `Cannot update slug`
    if (update.reviews)
      return `Cannot update reviews`
    if (update.publishHistory)
      return `Cannot update publishHistory`
    if (update.editHitory)
      return `Cannot update editHitory`
    if (update.forkers)
      return `Cannot update forkers`
    if (update.github)
      return `Cannot update github`
    if (update.AssetUrl &&
        update.assetUrl.indexOf('http://youtu.be/') != 0 &&
        update.assetUrl.indexOf('https://') != 0)

      return `AssetUrl must be fully qualified https:// url`
  },

  publish(user, post, publishData)
  {
    var isEditor = _.contains(user.roles, 'editor')
    var isAdmin =  _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(post.by.userId, user._id)

    if (!isEditor && !isAdmin && !isOwner)
      return `Cannot publish post not belonging to you`
    if (!isEditor && post.reviews < 3)
      return `Must have at least 3 reviews to be published`

    if (!_.idsEqual(post.by.userId, publishData.by.userId) &&
      !isAdmin)
      return `Only admins can change post authors`

    if (!post.submitted)
      return `Post must be submitted for review before being published`
    // if (!post.publishedCommit)
      // return `Post must have propogated commit to be published`
    // if (post.published && !publishedOverride)
    //   return `Post already published...`
    if (!post.slug)
      return `Post must have a slug to be published`
    if (!validSlug(post.slug))
      return `${post.slug} not a valid post slug to publish`

    if (!publishData.tmpl)
      return `Post template name must be provided`
    if (!publishData.meta)
      return `Post meta data required`
    if (!publishData.meta.title ||
        !publishData.meta.canonical ||
        !publishData.meta.description)
      return `Post meta title, canonical & description required`
    if (!publishData.meta.ogTitle ||
        !publishData.meta.ogImage ||
        !publishData.meta.ogDescription)
      return `Post open graph title, image & description required`
    if (publishData.meta.ogImage.indexOf('https://') != 0)
      return `Open graph image & asset url must be fully qualified https:// url`
  },

  deleteById(user, original)
  {
    var isEditor = _.contains(user.roles, 'editor')
    var isOwner = _.idsEqual(original.by.userId, user._id)

    if ( !isEditor && !isOwner )
      return `Post must be deleted by owner`
    if (original.published && !isEditor)
      return `Must be editor to delete a published post`
    if (original.submitted != null && !isEditor)
      return `Must be editor to delete a post in review`
  },

  submitForReview(user, post, slug)
  {
    var isOwner = _.idsEqual(post.by.userId, user._id)
    if (!isOwner)
      return `Post can only be submitted for review by its owner`
    if (!user.social || !user.social.gh)
      return `User must authorize GitHub to submit post for review`
    if (!slug)
      return `Must have slug to submit for review`
    if (!validSlug(slug))
      return `${slug} not a valid post slug to submit for review`
    if (slug.length > 50)
      return `${slug} is too long, you don't want an ugly long url, it's not good for SEO!`
    if (slug.indexOf('--') != -1)
      return `We don't like double '--' in slugs, looks ugly when sharing your post around!`
    if (post.submitted)
      return `This post has already been submitted for review`
    if (!post.md)
      return `Posts markdown required`
    if (post.github)
      return `Post already has associated git repo`
    if (!post.published) {
      var wcount = wordcount(post.md)
      if (wordsTogoForReview(wcount) > 0)
        return `Post word count [${wcount}] too short for review`
    }
  },

  propagateMDfromGithub(user, post){
    var isEditor = user.roles && _.contains(user.roles, "editor")
    var isOwner =  _.idsEqual(post.by.userId, user._id)
    if (!isOwner && !isEditor)
      return `Not authorized`
    if (post.published && !isEditor)
      return `Only editors can update published posts`
  },

  updateMarkdown(user, original, update){
    var isOwner = _.idsEqual(original.by.userId, user._id)
    var isForker = Roles.isForker(user, original)

    if (!original.submitted)
    {
      if (!isOwner) return `Cannot update markdown of draft post [${original.title}] not authored by you.`
    }
    else
    {
      if (!user.social || !user.social.gh)
        return `User must authorize GitHub to update post markdown in git repo`

      if (!isOwner && !isForker)
        return `Cannot update markdown of ${original.title}. You must <a href="/posts/fork/${original._id}">fork it</a> first.`

      var md = update.md
      if (!md || md == '')
        return `Markdown empty`

      var commitMessage = update.commitMessage
      if (!commitMessage || commitMessage == '')
        return `Commit Message required`
    }
  },

  addForker(user, post){
    var isOwner = _.idsEqual(post.by.userId, user._id)
    if (isOwner)
      return `Cannot fork your own post - ${post.title}. Please edit your post via the AirPair editor.`
    if (!user.social || !user.social.gh)
      return `User must <a href="/auth/github?returnTo=/posts/me?fork=${post._id}" target="_self">authorize GitHub</a> to fork repository`
    if (!post.github)
      return `Can not fork post as it has no git repo`
    if (!post.submitted)
      return `Can not fork post that is not yet submitted for review`
  },

  clobberFork(user, post){
    console.log("clobbering validation")
    //TODO handle the case where the user isn't a forker
  },

  getGitHEAD(user, post){
    // var isOwner = _.idsEqual(post.by.userId, user._id)

    if (!user.social || !user.social.gh)
      return `User must <a href="/auth/github?returnTo=/posts/edit/${post._id}" target="_self">authorize GitHub</a> to pull from GitHub`
  },

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
