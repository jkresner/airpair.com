export function createMembership(user, length)
{
	if (length != 6 && length != 12)
		return 'Can purchase only 6 month and 12 month membership'
}


export function createOrder(user, original)
{
	if (original.lineItems.length < 0)
		return 'Order must have at least 1 lineItem'
}


export function deletePayMethodById(user, original)
{
  var isAdmin = _.contains(user.roles, 'admin')
  var isOwner = _.idsEqual(original.userId, user._id)

  if ( !isAdmin && !isOwner )
    return 'PayMethod must be deleted by owner'
}
