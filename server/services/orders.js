var logging                   = false
var {Order,Paymethod,Expert}  = DAL
var PaymethodsSvc             = require('./paymethods')
var UsersSvc                  = require('./users')
var RequestsSvc               = require('./requests')
var Data                      = require('./orders.data')
var {select,opts,query}       = Data
var OrderUtil                 = require('../../shared/orders.js')
var DateTime                  = util.datetime
var {base}                    = Data


OrderUtil.calculateUnitPrice = (expert, type) => expert.rate + base[type]
OrderUtil.calculateUnitProfit = (expert, type) => base[type] // TODO fix this for requests


var get = {

  getById(id, cb)
  {
    Order.getById(id, cb)
  },

  getByIdForAdmin(id, cb)
  {
    Order.getById(id, cb)
  },

  getMultipleOrdersById(ids, cb)
  {
    Order.getManyByQuery({_id:{$in:ids}}, cb)
  },

  getMyOrders(cb)
  {
    Order.getManyByQuery({userId:this.user._id}, opts.orderByNewest, cb)
  },

  getMyOrdersWithCredit(payMethodId, cb)
  {
    Paymethod.getById(payMethodId, (e,r) => {
      if (e) return cb(e)
      var q = query.creditRemaining(this.user._id, r._id)
      Order.getManyByQuery(q, opts.orderByOldest, cb)
    })
  },

  getMyOrdersForDeal(dealId, cb)
  {
    var q = query.dealMinutesRemaining(this.user._id, dealId)
    Order.getManyByQuery(q, opts.orderByOldest, cb)
  },

  getMyDealOrdersForExpert(expertId, cb)
  {
    var q = query.dealsForExpertWithMinutesRemaining(this.user._id, expertId)
    Order.getManyByQuery(q, opts.orderByOldest, cb)
  },

  getByQueryForAdmin(start, end, userId, cb)
  {
    var q = query.inRange(start,end)
    if (userId) q.userId = userId
    var options = _.extend({},opts.orderByNewest)
    options.select = select.listAdmin
    Order.getManyByQuery(q, options, select.cb.forAdmin(cb))
  },

  getOrdersForPayouts(expert, cb)
  {
    // TODO, after we've paid out all the new orders and
    // migrated old paidout lines to payouts, remove extra expertId query
    // and use the userId
    var q = query.expertPayouts(expert._id)
    // console.log('expert.q', q)
    Order.getManyByQuery(q, opts.orderByNewest, select.cb.forPayout(cb))
  },

}


var Lines = {
  _new(type, qty, unitPrice, total, balance, profit, info) {
    if (unitPrice % 1 != 0) unitPrice = parseFloat(unitPrice.toFixed(2))
    if (total % 1 != 0) total = parseFloat(total.toFixed(2))
    if (profit % 1 != 0) profit = parseFloat(profit.toFixed(2))

    return {_id: Order.newId(), type, qty, unitPrice, total, balance, profit, info}
  },
  credit(paid, total, expires, source)
  {
    total = parseInt(total)
    var info = { name: `$${total} Credit`, source, remaining: total, expires, redeemedLines: [] }
    //-- profit on credit is always 0 because it is calculated on future line items
    //-- When credit expires we add a new line item
    var profit = 0       // ?? var profitAmount = (paid) ? 0 : -1*total
    var paidAmount = (paid) ? total : 0
    return Lines._new('credit',1,paidAmount,paidAmount,total,profit,info)
  },
  redeemedcredit(total, fromLineItem)
  {
    var info = { name: `$${total} Redeemed Credit`, source: fromLineItem._id }
    return Lines._new('redeemedcredit',1,-1*total,-1*total,-1*total,0,info)
  },
  deal(expert, deal, expires, source)
  {
    var total = parseInt(deal.price)
    var exp = { _id: DAL.User.toId(expert._id), name: expert.name, avatar: expert.avatar, userId: DAL.User.toId(expert.userId) }
    var info = { name: `${deal.minutes} Minutes`, source, remaining: deal.minutes, expires, redeemedLines: [],
                 deal: _.pick(deal,'rake','type','minutes','price','target','_id'), expert: exp }
    info.deal._id = DAL.Order.toId(info.deal._id)
    // var profit = (deal.rake/100)*total
    // var qty = (parseInt(deal.minutes)/60).toFixed(1)
    // var unitPrice = (total/qty).toFixed(2)
    var profit = 0 //-- profit is recognized on future lines
    var qty = 1
    return Lines._new('deal',qty,total,total,0,profit,info)
  },
  redeemeddealtime(minutes, unitPrice, fromLineItem)
  {
    var info = { name: `${minutes} Minutes`, source: fromLineItem._id }
    var qty = minutes/60
    var total = -1 * qty * unitPrice
    return Lines._new('redeemeddealtime',qty,-1*unitPrice,total,0,0,info)
  },
  payg(amount)
  {
    //-- payg always has $0 total as it balances against an airpair line item which has a total
    var info = { name: `$${amount} Paid` }
    return Lines._new('payg',0,amount,0,0,0,info)
  },
  discount(coupon, amount, source, user)
  {
    var unitPrice = -1*amount // (how much less they paid, also how much less we get)
    var profit = unitPrice
    //-- not sure maybe profit should be 0 ?? TODO come back and check
    var info = { name: `Discount ($${amount})`, amount, coupon, source, appliedBy: { _id: user._id, name: user.name } }
    return Lines._new('discount',1,unitPrice,unitPrice,0,profit,info)
  },
  booking(bookingId, expert, time, minutes, type, unitPrice, unitProfit)
  {
    var qty = minutes / 60
    var total = qty*unitPrice
    var exp = { _id: expert._id, name: expert.name, avatar: expert.avatar, userId: expert.userId }
    var info = { name: `${minutes} min (${expert.name||expert.user.name})`, type, time, minutes, paidout: false, expert: exp }
    return _.extend({bookingId}, Lines._new('airpair',qty,unitPrice,total,0,qty*unitProfit,info))
  }
}


//-- Create the order object without saving anything
//-- Use the lines items, paymethod and who the orders is for
function makeOrder(byUser, lines, payMethodId, forUserId, requestId, dealId, errorCB, cb)
{
  var byUserId = DAL.User.toId(byUser._id)
  forUserId = (forUserId) ? DAL.User.toId(forUserId) : byUserId

  var o = {
    _id: DAL.Order.newId(),
    utc: new Date(),
    userId: forUserId, // May be different from the identity (which could be an admin)
    total: 0,
    profit: 0,
    lines: lines,
    by: {
      _id:  byUserId,
      name: byUser.name,
      email: byUser.email,
      avatar: byUser.avatar || require('../util/md5').gravatarUrl(byUser.email)
    }
  }

  for (var li of o.lines)
  {
    o.total += li.total
    o.profit += li.profit
  }

  if (requestId)
    o.requestId = requestId

  if (dealId)
    o.dealId = dealId

  if (o.total == 0)
    o.payment = { type: '$0 order' }

  if (logging)
    $log('makeOrder'.cyan, o.total, payMethodId, dealId, errorCB, cb)

  if (!payMethodId && o.total == 0) cb(null, o)
  else
  {
    PaymethodsSvc.getById.call({user:byUser}, payMethodId, (e,payMethod) => {
      if (e || !payMethod || !payMethod.userId) return errorCB(e || Error(`Could not find payMethod ${payMethodId}`))

      o.payMethod = payMethod // only for passing around, the object won't get saved to db
      o.payMethodId = payMethod._id // TODO: consider/test what happens if we delete a payMethod?

      if (payMethod.companyId)
        o.by.companyId = payMethod.companyId

      //-- so when employees order it comes up in primary account
      o.userId = payMethod.userId

      cb(null, o)
    })
  }
}


function chargeAndTrackOrder(o, errorCB, saveCB)
{
  analytics.event.call({user:o.by},'order', {_id:o._id,total:o.total})
  if (o.total == 0) saveCB(null, o)
  else
  {
    if (logging) $log('orders.svc.charge', o)
    PaymethodsSvc.charge(o.total, o._id, o.payMethod, (e,r) => {
      if (e) {
        $log('e', e)
        return errorCB(e)
      }
      if (logging) $log('payment.created', r)
      trackOrderPayment.call(this, o)

      if (r.type == "braintree") {
        var { id, status, total, orderId, createdAt, processorAuthorizationCode} = r.transaction
        o.payment = { id, type:'braintree', status, total, orderId, createdAt, processorAuthorizationCode}
      }
      else if (r.type == "stripe") {
        var { id, type, amount, created } = r
        o.payment = { id, type, status: "authorized", total:amount, orderId: o._id, created }
      }

      //-- Mongoose is useless ... so we manually make sure this doesn't get through
      if (o.payMethod) delete o.payMethod

      saveCB(null, o)
    })
  }
}



function trackOrderPayment(order) {
  var d = {byName:order.by.name,total:order.total, _id:order._id}
  mailman.sendTemplate('pipeliner-notify-purchase', d, 'pipeliners')
  analytics.event.call({user:order.by},'payment', {orderId:order._id, total:order.total})
}


function bookUsingDeal(bookingId, expert, time, minutes, type, dealId, cb)
{
  // Make sure to test before making available again
  // cb(V2DeprecatedError('Orders.bookUsingDeal'))
  get.getMyOrdersForDeal.call(this, dealId, (e, orders) => {
    var linesWithMins = OrderUtil.linesWithMinutesRemaining(orders)
    var availableMinutes = OrderUtil.getAvailableMinutesRemaining(linesWithMins)
    if (availableMinutes < minutes)
      return cb(Error(`Not enough remaining minutes. ${availableMinutes} found.`))

    var {deal} = linesWithMins[0].info
    var unitPrice = (deal.price/(deal.minutes/60))
    var profit = (deal.rake/100)*deal.price
    var unitProfit = (profit/(deal.minutes/60))
    // $log('profit', profit, unitPrice, 'unitProfit'.white, unitProfit)
    var lines = [Lines.booking(bookingId, expert, time, minutes, type, unitPrice, unitProfit)]

    var need = minutes
    var ordersToUpdate = []
    for (var o of orders) {
      for (var li of o.lines) {
        if (need > 0 && li.type == 'deal' && li.info.remaining > 0)
        {
          var deducted = need
          if (li.info.remaining < need)
            deducted = li.info.remaining

          var redeemedLine = Lines.redeemeddealtime(deducted, unitPrice, li)
          lines.unshift(redeemedLine)
          li.info.remaining = li.info.remaining - deducted
          li.info.redeemedLines.push({ lineItemId: redeemedLine._id, minutes: deducted, partial: deducted!=need })

          ordersToUpdate = _.union(ordersToUpdate,[o._id])
          need = need - deducted
        }
      }
    }

    ordersToUpdate = _.map(ordersToUpdate, (id) => _.find(orders,(o)=> _.idsEqual(o._id, id) ) )

    makeOrder(this.user, lines, null, null, null, dealId, cb, (e, order) => {

      chargeAndTrackOrder(order, cb, (e,o) => {
        // console.log('inserting deal minutes redeemed order', order.total, order._id, order.userId)
        Order.bulkOperation([o], ordersToUpdate, [], (e,r) => cb(e,o))
      })
    })
  })
}

function bookUsingCredit(expert, minutes, total, lineItems, expectedCredit, payMethodId, request, cb)
{
  get.getMyOrdersWithCredit.call(this, payMethodId, (e, orders) => {
    var linesWithCredit = OrderUtil.linesWithCredit(orders)
    var availablCredit = OrderUtil.getAvailableCredit(linesWithCredit)
    if (expectedCredit != availablCredit)
      return cb(Error(`ExpectedCredit $${expectedCredit}, not found. ${availablCredit} found.`))

    var need = total
    var ordersToUpdate = []
    for (var o of orders) {
      for (var li of o.lines) {
        if (need > 0 && li.type == 'credit' && li.info.remaining > 0)
        {
          var deducted = need
          if (li.info.remaining < need)
            deducted = li.info.remaining

          var redeemedLine = Lines.redeemedcredit(deducted, li)
          lineItems.unshift(redeemedLine)
          li.info.remaining = li.info.remaining - deducted
          li.info.redeemedLines.push({ lineItemId: redeemedLine._id, amount: deducted, partial: deducted!=need })

          ordersToUpdate = _.union(ordersToUpdate,[o._id])

          need = need - deducted
        }
      }
    }

    if (need > 0) {
      lineItems.unshift(Lines.payg(need))
    }

    ordersToUpdate = _.map(ordersToUpdate, (id) => _.find(orders,(o)=> _.idsEqual(o._id, id) ) )

    // console.log('bookUsingCredit', lineItems)
    var requestId = (request) ? request._id : null
    makeOrder(this.user, lineItems, payMethodId, null, requestId, null, cb, (e, order) => {

      chargeAndTrackOrder(order, cb, (e,o) => {
        if (request) $callSvc(RequestsSvc.updateWithBookingByCustomer,this)(request, o, (e,r) => {})
        // console.log('inserting cred redeemed order', order.total, order._id, order.userId)
        Order.bulkOperation([o], ordersToUpdate, [], (e,r) => cb(e,o))
      })
    })
  })
}



function _createBookingOrder(expert, time, minutes, type, credit, payMethodId, request, lines, total, cb)
{
  // $log('_createBookingOrder.expert', expert)
  if (credit && credit > 0)
  {
    bookUsingCredit.call(this, expert, minutes, total, lines, credit, payMethodId, request, cb)
  }
  else
  {
    var requestId = (request) ? request._id : null
    lines.unshift(Lines.payg(total))
    makeOrder(this.user, lines, payMethodId, null, requestId, null, cb, (e, order) => {
      chargeAndTrackOrder(order, cb, (e,o) => {
        if (request) $callSvc(RequestsSvc.updateWithBookingByCustomer,this)(request, o, (e,r) => {})
        Order.create(o, cb)
      })
    })
  }
}



var save = {

  buyDeal(expert, dealId, payMethodId, cb)
  {
    var deal = _.find(expert.deals,(d)=>_.idsEqual(d._id,dealId))
    var expires = util.dateWithDayAccuracy(moment().add(3,'month'))
    var lines = []

    //(expert, dealId, total, minutes, rake, expires, source)
    lines.push(Lines.deal(expert, deal, expires, `$${deal.price} Special w ${expert.name||expert.user.name}`))

    makeOrder(this.user, lines, payMethodId, null, null, dealId, cb, (e, order) => {
      // $log('buyCredit.order', order)
      chargeAndTrackOrder(order, cb, (e,o) => Order.create(o, cb))
    })
  },

  buyCredit(total, coupon, payMethodId, cb)
  {
    var expires = util.dateWithDayAccuracy(moment().add(3,'month'))

    var lines = []
    lines.push(Lines.credit(true, total, expires, `$${total} Credit Purchase`))


    if (total == 1000)
      lines.push(Lines.credit(false, 50, expires, `Credit Bonus (5% on $${total})`))
    if (total == 3000)
      lines.push(Lines.credit(false, 300, expires, `Credit Bonus (10% on $${total})`))
    if (total == 5000)
      lines.push(Lines.credit(false, 1000, expires, `Credit Bonus (20% on $${total})`))

    if (coupon == "letspair")
      lines.push(Lines.discount("letspair", 100, 'Credit Announcement Promo', this.user) )

    makeOrder(this.user, lines, payMethodId, null, null, null, cb, (e, order) => {
      // $log('buyCredit.order', order)
      chargeAndTrackOrder(order, cb, (e,o) => Order.create(o, cb))
    })
  },

  giveCredit(toUser, total, source, cb)
  {
    var expires = util.dateWithDayAccuracy(moment().add(3,'month'))

    var fullSource = `${source} from ${this.user.name}`
    var lines = []
    lines.push(Lines.credit(false, total, expires, fullSource))

    var forUser = {
      _id: this.user._id, // airpair account manager
      name: toUser.name,
      email: toUser.email
    }

    mailman.sendTemplate('customer-got-credit', {total,fromName:this.user.name}, toUser)
    makeOrder(forUser, lines, null, toUser._id, null, null, cb, (e, order) =>
      chargeAndTrackOrder(order, cb, (e,o) => Order.create(o, cb))
    )
  },

  createBookingOrder(bookingId, expert, time, minutes, type, credit, payMethodId, requestSuggestion, dealId, cb)
  {
    if (dealId) {
      bookUsingDeal.call(this, bookingId, expert, time, minutes, type, dealId, cb)
    }
    else if (requestSuggestion) {
      this.machineCall = true // so we get back all data for the request
      RequestsSvc.getRequestForBookingExpert.call(this, requestSuggestion.requestId, expert, (e, request) => {
        if (e) return cb(e)
        //-- TODO look at the data from db instead of being passed from client
        // $log('suggested expert'.white, requestSuggestion.suggestion.expert)
        // $log('suggested expert'.yellow, requestSuggestion.suggestion)
        // expert = requestSuggestion.suggestion.expert
        // $log('suggested rate', requestSuggestion.suggestion.expert.rate)
        expert.rate = requestSuggestion.suggestion.suggestedRate.expert
        var unitPrice = requestSuggestion.suggestion.suggestedRate.total
        if (type == 'opensource') unitPrice = unitPrice - 10
        var unitProfit = unitPrice - expert.rate
        var total = minutes/60 * unitPrice
        var lines = [Lines.booking(bookingId, expert, time, minutes, type, unitPrice, unitProfit)]
        _createBookingOrder.call(this, expert, time, minutes, type, credit, payMethodId, request, lines, total, cb)
      })
    }
    else {
      var unitPrice = OrderUtil.calculateUnitPrice(expert,type)
      var unitProfit = OrderUtil.calculateUnitProfit(expert, type)
      var total = minutes/60 * unitPrice
      var lines = [Lines.booking(bookingId, expert, time, minutes, type, unitPrice, unitProfit)]
      _createBookingOrder.call(this, expert, time, minutes, type, credit, payMethodId, null, lines, total, cb)
    }
  },

  releasePayout(order, booking, cb)
  {
    var {lines} = order

    var payoutLine = _.find(lines, (li) =>
      li.info && li.info.paidout === false)

    payoutLine.info.released = svc.newTouch.call(this,'release')

    Order.updateSet(order._id, {lines}, (e,r)=>{
      if (booking && booking.chat) {
        var d = {byName:this.user.name,bookingId:booking._id}
        pairbot.sendSlackMsg(booking.chat.providerId, 'expert-payment-released', d)
      }

      cb(e,util.selectFromObject(r, select.listPayout))
    })
  }
}


module.exports = _.extend(get, save)
