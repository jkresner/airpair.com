module.exports = ({Post}, Data, {touchMeta}) => ({


  validate(user, updates) {

  },


  exec(updates, cb) {

  },


  // project: Data.Project.profile


})



  // create(user, post)
  // {
  //   if (!post.title) return `Post title required`
  //   if (!post.by) return `Post by required`
  //   if (!post.by.bio) return `Post author bio required`
  // },

  // update(user, original, update)
  // {
  //   var isEditor = _.contains(user.roles, 'editor')

  //   if (!Roles.isOwnerOrEditor(user, original))
  //     return `Post must be updated by owner`

  //   if (original.published && !isEditor)
  //     return `Must be editor to update a published post`

  //   if (!_.idsEqual(original.by.userId, update.by.userId))
  //     return `Cannot change author via update`
  //   if (update.slug)
  //     return `Cannot update slug`
  //   if (update.reviews)
  //     return `Cannot update reviews`
  //   if (update.publishHistory)
  //     return `Cannot update publishHistory`
  //   if (update.editHitory)
  //     return `Cannot update editHitory`
  //   if (update.forkers)
  //     return `Cannot update forkers`
  //   if (update.github)
  //     return `Cannot update github`
  //   if (update.AssetUrl &&
  //       update.assetUrl.indexOf('http://youtu.be/') != 0 &&
  //       update.assetUrl.indexOf('https://') != 0)

  //     return `AssetUrl must be fully qualified https:// url`
  // },

