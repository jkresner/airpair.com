
export function deleteById(user, original)
{
  var isAdmin = _.contains(user.roles, 'admin')
  var isOwner = _.idsEqual(original.userId, user._id)

  if ( !isAdmin && !isOwner )
    return 'Expert can only be deleted by owner'
}
