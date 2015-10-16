// var {select}                =
var ExpertsSvc               = require('./experts')
var PaymethodsSvc            = require('./paymethods')
var {Payout,Order}           = DAL


var get = {

  getPayouts(expert, cb) {
    Payout.getManyByQuery({userId:this.user._id}, cb)
  }

}

var save = {

  payoutOrders(payoutmethod, orders, cb) {
    var total = 0, lines = []
    var userId = this.user._id
    var payout = { _id: Payout.newId(), payMethodId:payoutmethod._id }

    // TODO, after we've paid out all the new orders and
    // migrated old paidout lines to payouts, remove extra expertId query
    // and use the userId
    ExpertsSvc.getMe.call(this, (eee, expert)=>{
      if (eee || !expert) return cb(eee,expert)

      for (var order of orders) {

        var line = _.find(order.lineItems,(l)=>l.info && l.info.expert &&
          l.info.paidout == false && _.idsEqual(l.info.expert._id,expert._id) )

        if (!line) return cb(Error(`Problem paying out line from[${order._id}]`))

        var lineOwed = line.total - line.profit
        line.info.paidout = payout._id
        total += lineOwed

        lines.push({
          order: { _id: order._id, by: order.by, lineItemId: line._id },
          total: lineOwed, info: line.info, type:line.type
        })

      }

      PaymethodsSvc.payout.call(this, total, payout._id, payoutmethod, (e,payment) => {
        if (e) return cb(e)
        payout = _.extend(payout,{userId,total,payment,lines})
        Payout.create(payout, cb)
        Order.updateSetBulk(orders,(e,r)=>{
          if (e) $error('ERROR: payoutOrder => bulk order update'.red, e)
        })
      })

    })
  }

}

module.exports = _.extend(get, save)
