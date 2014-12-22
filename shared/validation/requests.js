export function create(o)
{
  var user = this.user

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


export function updateByCustomer(original, update)
{
  var user = this.user

  if (!user || !user._id || !user.name || !user.email)
    return 'Request user details required'

  if (!_.idsEqual(original._id,update._id))
    return 'Updating request must have the same Id ad the original'

  var isOwner = _.idsEqual(original.userId, user._id)
  var isAdmin = _.contains(user.roles, 'admin')
  if ( !isOwner && !isAdmin ) return 'Request can only be updated by owner'

  if ( !isOwner && !original.budget ) return 'Admin can only update completed requests'

  if (!update.type) return 'Request type required'

  if (!update.tags || !(update.tags.length > 0) )
    return 'Request must include at least one technology'

  if (original.experience && !update.experience) return 'Request experience required'

  if (original.brief && !update.brief) return 'Request brief required'

  if (original.hours && !update.hours) return 'Request hours required'

  if (original.time && !update.time) return 'Request turn around time required'

  if (original.budget && !update.budget) return 'Request budget required'
}


export function updateByAdmin(original, update)
{
  if (!update.status) return 'Request status required'
  if (!update.adm.owner) return 'Request adm owner required'
  if (!update.adm.submitted && original.adm.submitted) return 'Request submitted cannot be over-written'
  // if (!update.newcustomer) return 'Request new customer required'
}

export function replyByExpert(request, expert, reply)
{
  var userId = this.user._id

  if (!_.idsEqual(expert.userId,userId))
    return 'Must be logged in expert to reply to request as expert'

  if (!reply.expertComment) return 'Reply comment required'
  if (!reply.expertStatus) return 'Reply status required'
  if (!reply.expertAvailability) return  'Reply availability required'
}

export function deleteById(original)
{
  var isAdmin = _.contains(this.user.roles, 'admin')
  var isOwner = _.idsEqual(original.userId, this.user._id)

  if ( !isAdmin && !isOwner )
    return 'Request must be deleted by owner'

  if (original.suggested.length > 0)
    return 'Cannot delete request with suggestions'
}


export function addSuggestion(original, expert)
{
  var existing = _.find(original.suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
  if (existing)
    return 'Cannot suggest the same expert twice'
}

export function removeSuggestion(original, expert)
{
  var existing = _.find(original.suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
  if (!existing)
    return 'Cannot remove expert not on request'
}


