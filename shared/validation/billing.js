export function deletePayMethodById(user, original)
{
  var isAdmin = _.contains(user.roles, 'admin')
  var isOwner = _.idsEqual(original.userId, user._id)

  if ( !isAdmin && !isOwner )
    return 'PayMethod must be deleted by owner'
}
