var validation = {

  create(user, expert)
  {
    if ( !user.username ) return `Cannot create expert without username`
    if ( !user.initials ) return `Cannot create expert without initials`
    if ( !user.localization ) return `Cannot create expert without location`
    if ( !user.bio ) return `Cannot create expert without bio`

    var gp = (user.google) ? { gp: user.google } : null
    var social = _.extend(user.social||{},gp||{})
    var socialCount = _.keys(social||{}).length

    if ( socialCount < 2 ) return `Must connect at least 2 social account to create expert profile`

    if ( !expert.rate ) return `Cannot create expert without rate`
    // if ( !expert.brief ) return `Cannot create expert without brief`
    if ( !expert.tags || expert.tags.length == 0 ) return `Cannot create expert without tags`
  },

  updateMe(user, original, ups)
  {
    if ( !_.idsEqual(original._id, ups._id) )
      return `Cannot update expert _id does not match original`

    if ( !_.idsEqual(original.userId, ups.userId) )
      return `Cannot update expert, not your userId`

    var create = validation.create(user, ups)
    if (create) return create.replace('create','update')

    if ( original.breif && !ups.brief ) return `Cannot update expert without brief`
  },

  deleteById(user, expert)
  {
    var isAdmin = _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(expert.userId, user._id)

    if ( !isAdmin && !isOwner )
      return 'Expert can only be deleted by owner'

    $log('deleteById.val'.cyan)
  }

}

module.exports = validation
