var validation = {

  // buyMembership(user, length)
  // {
  //   if (length != 6 && length != 12)
  //     return 'Can purchase only 6 month and 12 month membership'
  // },


  getOrdersToPayout(user, expert) {
    var isAdmin = _.contains(user.roles, 'admin')
    var isExpert = _.idsEqual(user._id, expert.userId)

    if (!isAdmin && !isExpert) return "Can only get orders to payout for yourself"
  },


  buyCredit(user, total, coupon, paymethodId) {
    if (total != 500 && total != 1000 && total != 3000 && total != 5000)
      return 'Can purchase only 500, 1000, 3000, 5000 amounts of credit'

    if (!paymethodId)
      return 'Paymethod requried'
  },

  giveCredit(user, toUser, total, source)
  {
    if (!toUser || !toUser._id) return 'To user required'
    if (total > 100) return 'Can give up to $100 in credit'
    if (!source) return 'Source required'
  },


  addPaymethod(user, paymethod)
  {
    if (!paymethod.type) return 'Type required'
  },


  deletePaymethod(user, original)
  {
    var isAdmin = _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(original.userId, user._id)

    if ( !isAdmin && !isOwner )
      return 'PayMethod must be deleted by owner'
  },

  releasePayout(user, order)
  {
    var isAdmin = _.contains(user.roles, 'admin')

    if ( !isAdmin )
      return 'Payouts are controlled by admins'

    var payoutLines = _.where(order.lineItems, (l) =>
      l.info && l.info.paidout === false)

    if (payoutLines.length != 1) return `[{payoutLines.length}] Payout lines is invalid for releasing a payout`
    if (payoutLines[0].by) return `Order has already been released`
  }

}

module.exports = validation
