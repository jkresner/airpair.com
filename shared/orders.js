module.exports = {

  linesWithCredit(orders) {
    var lines = []
    for (var order of orders) {
      for (var li of order.lineItems)
      {
        if (li.type == 'credit' && li.info.remaining > 0) lines.push(li)
      }
    }
    // return _.sort(lines, (li) => li._id)
    return lines
  },

  getAvailableCredit(lines) {
    if (lines.length == 0) return 0
    var remaining = []
    for (var li of lines) remaining.push(li.info.remaining)
    return _.reduce(remaining, function(memo, num){ return memo + num; }, 0)
  },

  ordersToLinesWithRunningBalance(orders) {
    if (!orders || orders.length == 0) return []

    var lines = []
    orders.forEach((o) =>
      _.map(o.lineItems, (li) => {
        li.orderId = o._id
        lines.push(li)
      })
    )

    if (lines.length > 0)
    {
      var runningBalance = 0
      lines = _.sortBy(lines, (l) => l._id)

      lines.forEach(function(li){
        runningBalance = runningBalance + li.info.amount
        li.runningBalance = runningBalance
      })
    }

    return lines.reverse()
  }

}
