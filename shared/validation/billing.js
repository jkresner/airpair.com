var validation = {

  getOrdersToPayout(user, expert) {
    var isAdmin = _.contains(user.roles, 'admin')
    var isExpert = _.idsEqual(user._id, expert.userId)

    if (!isAdmin && !isExpert) return `Can only get orders to payout for yourself`
  },

  buyCredit(user, total, coupon, paymethodId) {
    if (total != 500 && total != 1000 && total != 3000 && total != 5000)
      return `Can purchase only 500, 1000, 3000, 5000 amounts of credit`

    if (!paymethodId)
      return `Paymethod requried`
  },

  giveCredit(user, toUser, total, source)
  {
    if (!toUser || !toUser._id) return `To user required`
    if (total > 100 &&
      user.email != 'pg@airpair.com' && user.email != 'jk@airpair.com')
        return `Only pg can give more than $100 in credit`
    if (total > 250 &&
      user.email != 'jk@airpair.com')
        return `Ask JK to give more than $250 in credit`
    if (!source) return `Source required`
  },


  buyDeal(user, expert, dealId, payMethodId) {
    var deal = _.find(expert.deals,(d)=>_.idsEqual(d._id,dealId))
    if (!deal)
      return `Could not find deal`

    if (deal.expiry && moment(deal.expiry).isBefore(moment()))
      return `Deal expired ${deal.expiry}`

    if (!payMethodId)
      return `Paymethod requried`
  },

  addPaymethod(user, paymethod)
  {
    if (!paymethod.type) return `Type required`
  },


  deletePaymethod(user, original)
  {
    var isAdmin = _.contains(user.roles, 'admin')
    var isOwner = _.idsEqual(original.userId, user._id)

    if ( !isAdmin && !isOwner )
      return `PayMethod must be deleted by owner`
  },

  releasePayout(user, order)
  {
    var isAdmin = _.contains(user.roles, 'admin')

    if ( !isAdmin )
      return `Payouts are controlled by admins`

    var payoutLines = _.where(order.lineItems, (l) =>
      l.info && l.info.paidout === false)

    if (payoutLines.length != 1) return `[{payoutLines.length}] Payout lines is invalid for releasing a payout`
    if (payoutLines[0].by) return `Order has already been released`
  },

  payoutOrders(user, payoutmethod, orders)
  {
    var userId = user._id
    var type = (payoutmethod) ? payoutmethod.type : 'none'
    if (type.indexOf('payout') != 0) return `Payment type ${type} not valid for payout`

    if (!_.idsEqual(payoutmethod.userId,userId))
      return `Cannot use Paymethod ${payoutmethod.userID}, it does not belong to you`

    if (!orders || !orders.length || orders.length == 0)
      return `No orders specified for payout`

    for (var i=0;i<orders.length;i++)
    {
      var payoutLine = _.find(orders[i].lineItems,(l) => l && l.info &&
        l.info.expert && l.info.paidout == false && l.info.released
      )
      if (!payoutLine) return `Cannot payout. Order[${orders[i]._id}] does not have payout belonging to you`
    }
  }

  // buyMembership(user, length)
  // {
  //   if (length != 6 && length != 12)
  //     return 'Can purchase only 6 month and 12 month membership'
  // },

}

module.exports = validation
