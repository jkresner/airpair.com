var validation = {
  create(user, o) {
    if (!user || !user._id || !user.name || ! user.email)
      return 'Request user details required'

    if (!o.type) return 'Request type required'
  },
  sendVerifyEmailByCustomer(user, original, email) {
    var isOwner = _.idsEqual(original.userId, user._id)
    if (!isOwner) return 'Cannot verify email for request owned by another'

    if (!email || !email.match(/.+@.+\.+.+/))
      return "Invalid email address"
  },
  updateByCustomer(user, original, update)
  {
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

    if (!user.emailVerified &&
      (update.experience ||
      update.brief ||
      update.hours ||
      update.time ||
      update.budget))
      return 'Email verification required to update request'

    if (original.experience && !update.experience) return 'Request experience required'

    if (original.brief && !update.brief) return 'Request brief required'

    if (original.hours && !update.hours) return 'Request hours required'

    if (original.time && !update.time) return 'Request turn around time required'

    if (original.budget && !update.budget) return 'Request budget required'
  },
  updateByAdmin(user, original, update)
  {
    if (!update.status) return 'Request status required'
    if (!update.adm.owner) return 'Request adm owner required'
    if (!update.adm.submitted && original.adm.submitted) return 'Request submitted cannot be over-written'
    // if (!update.newcustomer) return 'Request new customer required'
  },
  farmByAdmin(user, request, tweet) {
    var isAdmin = _.contains(user.roles, 'admin')
    if ( !isAdmin && !isOwner )
      return 'Request must shared by owner or admin'

    if (!request.adm || !request.adm.active) return 'Cannot share request as it is not active'
    if (!request.adm.submitted) return 'Can not share an incompleted request'
    if (request.status != 'waiting') return 'Can not share request while waiting for experts'
    if (request.adm.farmed) return 'Can not share request once'
    if (!tweet) return 'Tweet required for farming'
  },
  sendMessageByAdmin(user, request, message) {
    if (!message.type) return 'Message type required'
    if (!message.subject) return 'Message subject required'
    if (!message.body) return 'Message body required'

    var existing = _.find(request.messages,(m)=>m.type==message.type)
    if (existing) return 'Can not send the same message type once'
  },
  replyByExpert(user, request, expert, reply)
  {
    if (!_.idsEqual(expert.userId,user._id))
      return 'Must be logged in expert to reply to request as expert'

    if (!request.adm || !request.adm.active) return 'Cannot reply to this request, as it is not active'

    // if (!request.suggested.available > 3) return 'Only 4 experts can reply'

    if (!reply.expertComment) return 'Reply comment required'
    if (!reply.expertStatus) return 'Reply status required'
    if (!reply.expertAvailability) return  'Reply availability required'
  },
  deleteById(user, original)
  {
    var isAdmin = _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(original.userId, user._id)

    if ( !isAdmin && !isOwner )
      return 'Request must be deleted by owner'

    if (original.suggested.length > 0)
      return 'Cannot delete request with suggestions'
  },
  addSuggestion(user, original, expert)
  {
    if (!original.adm || !original.adm.active) return 'Cannot addSuggestion to this request, as it is not active'

    if (original.status == 'received') return 'Cannot addSuggestion while request is still in received status'

    var existing = _.find(original.suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
    if (existing)
      return 'Cannot suggest the same expert twice'
  },
  removeSuggestion(user, original, expert)
  {
    if (!original.adm || !original.adm.active) return 'Cannot removeSuggestion to this request, as it is not active'

    var existing = _.find(original.suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
    if (!existing)
      return 'Cannot remove expert not on request'
  }
}

module.exports = validation
