export function create(user, o)
{
  if (!user || !user._id || !user.name || ! user.email)
    return 'Request user details required'

  if (!o.tags || !(o.tags.length > 0) )
    return 'Request must include at least one technology'

  if (!o.type) return 'Request type required'

  if (!o.experience) return 'Request experience required'

  if (!o.brief) return 'Request brief required'

  if (!o.hours) return 'Request hours required'

  if (!o.time) return 'Request turn around time required'

  if (!o.budget) return 'Request turn around time required'
}



export function update(user, original, update)
{
  if (!user || !user._id || !user.name || ! user.email)
    return 'Request user details required'

  var isOwner = _.idsEqual(original.userId, user._id)
  if ( !isOwner )
    return 'Request can only be updated by owner'

  if (!update.tags || !(update.tags.length > 0) )
    return 'Request must include at least one technology'

  if (!update.type) return 'Request type required'

  if (!update.experience) return 'Request experience required'

  if (!update.brief) return 'Request brief required'

  if (!update.hours) return 'Request hours required'

  if (!update.time) return 'Request turn around time required'

  if (!update.budget) return 'Request turn around time required'
}
