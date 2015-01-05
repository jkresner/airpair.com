var validation = {

  // buyMembership(user, length)
  // {
  //   if (length != 6 && length != 12)
  //     return 'Can purchase only 6 month and 12 month membership'
  // },

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
  }

}

module.exports = validation
