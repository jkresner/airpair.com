module.exports = {

  getOrdersListSummary(r) {
    var summary = { total: 0, byCount: 0, profit: 0, count: r.length, paid: 0 }
    var customers = {}
    for (var i = 0; i < r.length; i++) {
      summary.profit += r[i].profit
      summary.total += r[i].total
      if (r[i].total > 0) {
        summary.paid += 1
        if (!customers[r[i].userId]) {
          summary.byCount += 1
          customers[r[i].userId] = true
        }
      }
    }
    return summary
  },

  lineForPayout(order) {
    return _.find(order.lineItems,(l) =>
      l.info && l.info.expert && l.info.paidout != null)
  },

  payoutSummary(orders) {
    var lines = []
    var result = {
      pending: { count:0, total:0 },
      owed: { count:0, total:0 },
      paid: { count:0, total:0 },
      total: 0
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

    result.total = result.pending.total + result.owed.total + result.paid.total
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

  linesWithMinutesRemaining(orders) {
    var lines = []
    orders.forEach(function(order){
      order.lineItems.forEach(function(li){
        if (li.type == 'deal' && li.info && li.info.remaining > 0) lines.push(li)
      })
    })

    return lines
  },

  getAvailableMinutesRemaining(lines) {
    if (lines.length == 0) return 0
    var remaining = []

    lines.forEach(function(li){
      remaining.push(li.info.remaining)
    })

    //-- How does this work if lines are for different experts?
    return _.reduce(remaining, function(memo, num){ return memo + num; }, 0)
  },

  getExpertsWithAvailableMins(orders) {
    if (!orders || orders.length == 0) return {}
    var experts = {}
    orders.forEach((o) =>
      o.lineItems.forEach((li) => {
        if (li.type == 'deal') {
          if (!experts[li.info.expert._id])
            experts[li.info.expert._id] = { _id: li.info.expert._id, name: li.info.expert.name, lines: [li], remaining: li.info.remaining }
          else
            experts[li.info.expert._id].remaining += li.info.remaining
        }
      })
    )
    return _.values(experts)
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
