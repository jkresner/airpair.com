module.exports = (DAL, Data, DRY) => ({


  validate(user, original, update)
  {
    if (!DRY.role.authorOrEditor(user,original))
      return 'Updated by owner only'

    if (original.tags.length > 0 && !update.tags || update.tags.length == 0)
      return `Must have at least 1 tag`

    if (original.published && !isEditor)
      return `Must be editor to update once published`

    if (!_.idsEqual(original.by._id, update.by._id))
      return `Cannot change author via update`
    if (update.slug)
      return `Cannot update slug`
    if (update.reviews)
      return `Cannot update reviews`
    if (!update.type)
      return `Must have post type`

    // $log('validate', update)

    if (!/^https\:\/\/imgur\.com\//.test(update.assetUrl))
      return `ImgurId required for AssetUrls moving forward`
        // update.assetUrl &&
        // update.assetUrl &&
        // update.assetUrl.indexOf('http://youtu.be/') != 0 &&
        // update.assetUrl.indexOf('https://') != 0)

      // return `AssetUrl must be fully qualified https:// url`
  },


  exec(original, update, cb) {
    var {tags,title,type,assetUrl} = update

    var tagSort = 0
    for (var tag of tags) {
      tag.sort = tagSort++
    }

    var meta = DRY.touchMeta(original.meta, 'updateInfo', this.user)

    // if (original.assetUrl != ups.assetUrl && (original.submitted || original.published))
    //   ups.meta = _.extend(original.meta, _.extend(ups.meta||{},{ogImage:ups.assetUrl}))
    DAL.Post.updateSet(original._id, {tags,type,title,assetUrl,meta}, cb)
  },


  project: Data.Project.info

})



