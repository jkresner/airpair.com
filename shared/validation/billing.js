export function buyMembership(user, length)
{
	if (length != 6 && length != 12)
		return 'Can purchase only 6 month and 12 month membership'
}


export function buyCredit(user, coupon, total)
{
	if (total != 500 && total != 1000 && total != 3000 && total != 5000)
		return 'Can purchase only 500, 1000, 3000, 5000 amounts of credit'

	// TODO validate coupon usage
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
