module.exports = {

  expertPayoutSummary(orders) {
    var lines = []
    var result = {
      pending: { count:0, total:0 },
      owed: { count:0, total:0 },
      paid: { count:0, total:0 }
    }
    orders.forEach(function(order){
      order.lineItems.forEach(function(li){
        if (li.type == 'airpair' && li.info) lines.push(li)
      })
    })

    lines.forEach(function(line) {
      if (line.info.paidout) {
        result.paid.count += 1
        result.paid.total += line.owed
      }
      else
      {
        if (line.info.released) {
          result.owed.count += 1
          result.owed.total += line.owed
        }
        else {
          result.pending.count += 1
          result.pending.total += line.owed
        }
      }
    })

    return result
  },

  linesWithCredit(orders) {
    var lines = []
    orders.forEach(function(order){
      order.lineItems.forEach(function(li){
        if (li.type == 'credit' && li.info && li.info.remaining > 0) lines.push(li)
      })
    })

    // return _.sort(lines, (li) => li._id)
    return lines
  },

  getAvailableCredit(lines) {
    if (lines.length == 0) return 0
    var remaining = []

    lines.forEach(function(li){
      remaining.push(li.info.remaining)
    })

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
        runningBalance = runningBalance + (li.balance || 0)
        li.runningBalance = runningBalance
      })
    }

    return lines.reverse()
  }

}
