export function create(user, o)
{
  if (!user || !user._id || !user.name || ! user.email)
    return 'Request user details required'

  if (!o.type) return 'Request type required'

  // if (!o.tags || !(o.tags.length > 0) )
    // return 'Request must include at least one technology'

  // if (!o.experience) return 'Request experience required'

  // if (!o.brief) return 'Request brief required'

  // if (!o.hours) return 'Request hours required'

  // if (!o.time) return 'Request turn around time required'

  // if (!o.budget) return 'Request budget required'
}



export function update(user, original, update)
{
  if (!user || !user._id || !user.name || ! user.email)
    return 'Request user details required'

  var isOwner = _.idsEqual(original.userId, user._id)
  if ( !isOwner )
    return 'Request can only be updated by owner'

  if (!update.type) return 'Request type required'

  if (!update.tags || !(update.tags.length > 0) )
    return 'Request must include at least one technology'

  if (original.experience && !update.experience) return 'Request experience required'

  if (original.brief && !update.brief) return 'Request brief required'

  if (original.hours && !update.hours) return 'Request hours required'

  if (original.time && !update.time) return 'Request turn around time required'

  if (original.budget && !update.budget) return 'Request budget required'
}
