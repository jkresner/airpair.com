var validation = {

  getHistory(user, expert)
  {
    var isAdmin = _.contains(user.roles||[], 'admin')
    var isOwner = _.idsEqual(expert.userId, user._id)

    if ( !isAdmin && !isOwner )
      return 'Cannot view another expert history that is not your own'
  },

  create(user, expert)
  {
    if ( !user.username ) return `Cannot create expert without username`
    if ( !user.initials ) return `Cannot create expert without initials`
    if ( !user.location ) return `Cannot create expert without location`
    if ( !user.bio ) return `Cannot create expert without bio`

    var socialCount = _.keys(user.auth||{}).length

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

  updateAvailability(user, original, availability)
  {
    var isAdmin = _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(original.userId, user._id)

    if ( !isOwner && !isAdmin )
      return `Cannot update expert[${original._id}], not your userId`

    if (!availability.status) return `Expert availability status required`
    if (availability.status != 'busy' && availability.status != 'ready')
      return `Expert status [${availability.status}] not recognized`
    if (availability.status == 'busy' && !availability.busyUntil)
      return `Expert busy status requires date busy until`
    if (availability.status == 'ready' && !availability.minRate)
      return `Expert availability minRate required`
    if (availability.status == 'ready' && !availability.hours)
      return `Expert availability hours required`
    // if (!availability.times) return `Expert availability status required`

  },

  deleteById(user, expert)
  {
    var isAdmin = _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(expert.userId, user._id)

    if ( !isAdmin && !isOwner )
      return `Expert can only be deleted by owner`
  },

  createDeal(user, expert, deal)
  {
    var isAdmin = _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(expert.userId, user._id)

    if ( !isAdmin && !isOwner )
      return `You can only create deals for yourself`

    if (deal.expiry && moment(deal.expiry).isBefore(moment()))
      return `Cannot create already expired deal`

    if (deal.code && deal.code.length > 20)
      return `Code must be 20 characters or less`

    if (!deal.price) return `Deal price required`
    if (!deal.minutes) return `Deal time purchased required`

    if (!deal.type) return `Deal type required`
    if (!_.contains(['airpair', 'offline', 'code-review', 'article', 'workshop'],deal.type))
      return `${deal.type} not a valid deal type`

    if (!deal.target.type) return `Deal target type required`
    if (!_.contains(['all','user','company','newsletter','past-customers','code'],deal.target.type))
      return `${deal.target.type} not a valid deal target`

    if (deal.rake && !isAdmin) return `Client does not determine deal rake...`
    if (deal.tagId && !cache.tags[deal.tagId])
      return `Could not resolve tag[${deal.tagId}] specified for your deal`
  },

  expireDeal(user, expert, dealId, expiry)
  {
    var isAdmin = _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(expert.userId, user._id)

    if ( !isAdmin && !isOwner )
      return `Cannot edit deals belonging to other experts`

    var deal = _.find(expert.deals,(d)=>_.idsEqual(d._id,dealId))
    if (!deal)
      return `Cannot find deal[${dealId}] belonging you[{expert._id}]`

    if (deal.expiry && moment(deal.expiry).isBefore(moment()))
      return `Cannot deactivate already deactivated deal[${dealId}] belonging to[{expert._id}]`
  },

  addNote(user, expert, note)
  {
    if (!note || !note.length || note.length < 20) return `Note must be minimum 20 characters`
  }
}

module.exports = validation
