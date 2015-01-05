import Svc from './_service'
import Order from '../models/order'
import * as PayMethodSvc from './paymethods'
import * as UserSvc from './users'
import * as Validate from '../../shared/validation/billing.js'
import * as md5     from '../util/md5'
var RequestsSvc = require('./requests')
var Data = require('./orders.data')
var Util = require('../../shared/util')
var OrderUtil = require('../../shared/orders.js')

var base = {
  'opensource': 20,
  'private': 30
}


OrderUtil.calculateUnitPrice = (expert, type) => expert.rate + base[type]
OrderUtil.calculateUnitProfit = (expert, type) => base[type] // TODO fix this for requests


var logging = false
var svc = new Svc(Order, logging)


var base = {
  'opensource': 20,
  'private': 30
}

export function getByIdForAdmin(id, cb)
{
  svc.getById(id, cb)
}

export function getMyOrders(cb)
{
  var opts = { options: { sort: { 'utc': 1 } } }
  svc.searchMany({userId:this.user._id}, opts, cb)
}


export function getMyOrdersWithCredit(payMethodId, cb)
{
  PayMethodSvc.getById.call(this, payMethodId, (e,r) => {
    if (e) return cb(e)
    var query = Data.query.creditRemaining(this.user._id, payMethodId)
    svc.searchMany(query, { options: Data.options.ordersByDate }, cb)
  })
}


export function getByQueryForAdmin(start, end, userId, cb)
{
  var opts = { fields: Data.select.listAdmin, options: Data.options.orderByDate }
  var query = Data.query.inRange(start,end)
  if (userId) query.userId = userId
  svc.searchMany(query, opts, (e,r) => {
    for (var o of r) {
      if (o.company)
        o.by = { name: o.company.contacts[0].fullName, email: o.company.contacts[0].email }
      o.by.avatar = md5.gravatarUrl(o.by.email)
    }
    cb(null, r)
  })
}



var newLine = (type, qty, unitPrice, total, balance, profit, info) => {
  return {_id: svc.newId(),type, qty, unitPrice, total, balance, profit, info}
}


var Lines = {
  credit(paid, total, expires, source)
  {
    total = parseInt(total)
    var info = { name: `$${total} Credit`, source, remaining: total, expires, redeemedLines: [] }
    //-- profit on credit is always 0 because it is calculated on future line items
    //-- When credit expires we add a new line item
    var profit = 0       // ?? var profitAmount = (paid) ? 0 : -1*total
    var paidAmount = (paid) ? total : 0
    return newLine('credit',1,paidAmount,paidAmount,total,profit,info)
  },
  redeemedcredit(total, fromLineItem)
  {
    var info = { name: `$${total} Redeemed Credit`, source: fromLineItem._id }
    return newLine('redeemedcredit',1,-1*total,-1*total,-1*total,0,info)
  },
  payg(amount)
  {
    //-- payg always has $0 total as it balances against an airpair line item which has a total
    var info = { name: `$${amount} Paid` }
    return newLine('payg',0,amount,0,0,0,info)
  },
  discount(coupon, amount, source, user)
  {
    var unitPrice = -1*amount // (how much less they paid, also how much less we get)
    var profit = unitPrice
    //-- not sure maybe profit should be 0 ?? TODO come back and check
    var info = { name: `Discount ($${amount})`, amount, coupon, source, appliedBy: { _id: user._id, name: user.name } }
    return newLine('discount',1,unitPrice,unitPrice,0,profit,info)
  },
  airpair(expert, time, minutes, type, unitPrice, unitProfit)
  {
    var qty = minutes / 60
    var total = qty*unitPrice
    var exp = { _id: expert._id, name: expert.name, avatar: expert.avatar }
    var info = { name: `${minutes} min (${expert.name})`, type, time, minutes, paidout: false, expert: exp }
    return newLine('airpair',qty,unitPrice,total,0,qty*unitProfit,info)
  }
}


//-- Create the order object without saving anything
//-- Use the lineItems, paymethod and who the orders is for
function makeOrder(byUser, lineItems, payMethodId, forUserId, requestId, errorCB, cb)
{
  var byUserId = svc.idFromString(byUser._id)
  forUserId = (forUserId) ? svc.idFromString(forUserId) : byUserId

  var o = {
    _id: svc.newId(),
    utc: new Date(),
    userId: forUserId, // May be different from the identity (which could be an admin)
    total: 0,
    profit: 0,
    lineItems: lineItems,
    by: {
      _id:  byUserId,
      name: byUser.name,
      email: byUser.email
    }
  }

  for (var li of o.lineItems)
  {
    o.total += li.total
    o.profit += li.profit
  }

  if (requestId)
    o.requestId = requestId

  if (o.total == 0)
    o.payment = { type: '$0 order' }


  if (!payMethodId && o.total == 0) cb(null, o)
  else
  {
    PayMethodSvc.getById.call({user:byUser}, payMethodId, (e,payMethod) => {
      if (e || !payMethod || !payMethod.userId) return errorCB(e || `Could not find payMethod ${payMethodId}`)

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
  analytics.track(o.by, null, 'Order', o)
  if (o.total == 0) saveCB(null, o)
  else
  {
    if (logging) $log('orders.svc.charge', o)
    PayMethodSvc.charge(o.total, o._id, o.payMethod, (e,r) => {
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

      saveCB(null, o)
    })
  }
}



function trackOrderPayment(order) {

  mailman.sendPipelinerNotifyPurchaseEmail(order.by.name, order.total, ()=>{})

  analytics.track(order.by, null, 'Payment', {orderId:order._id, total:order.total})

 // var props = {
 //   //timeFromVisit:, //revenue:, //visitedContent:
 // }
 // var context = {}
  // analytics.track(this.user, null, 'Customer Payment', props, context)

  // notifications.broadcast(`Customer Paid  ${order.total}`, this.user)

  // requestSvc.getById order.requestId, (e, request) =>
}

//-- Assumes we have added the linesItems already
// function updateOrder(o, cb) {
//   o.total = 0;
//   o.profit = 0;

//   for (var li of o.lineItems)
//   {
//     o.total += li.total
//     o.profit += li.profit
//   }

//   logging = true
//   if (logging) $log('orders.svc.update', o.lineItems, o.total)
//   // trackOrderUpdate.call(this, o)
//   svc.update(o, cb)
// }


export function buyCredit(total, coupon, payMethodId, cb)
{
  var expires = Util.dateWithDayAccuracy(moment().add(3,'month'))

  var lineItems = []
  lineItems.push(Lines.credit(true, total, expires, `$${total} Credit Purchase`))


  if (total == 1000)
    lineItems.push(Lines.credit(false, 50, expires, `Credit Bonus (5% on $${total})`))
  if (total == 3000)
    lineItems.push(Lines.credit(false, 300, expires, `Credit Bonus (10% on $${total})`))
  if (total == 5000)
    lineItems.push(Lines.credit(false, 1000, expires, `Credit Bonus (20% on $${total})`))

  if (coupon == "letspair")
    lineItems.push( Lines.discount("letspair", 100, 'Credit Announcement Promo', this.user) )


  makeOrder(this.user, lineItems, payMethodId, null, null, cb, (e, order) => {
    // $log('buyCredit.order', order)
    chargeAndTrackOrder(order, cb, (e,o) => svc.create(o, cb))
  })
}


export function giveCredit(toUser, total, source, cb)
{
  var expires = Util.dateWithDayAccuracy(moment().add(3,'month'))

  var fullSource = `${source} from ${this.user.name}`
  var lineItems = []
  lineItems.push(Lines.credit(false, total, expires, fullSource))

  var forUser = {
    _id: this.user._id, // airpair account manager
    name: toUser.name,
    email: toUser.email
  }

  mailman.sendGotCreditEmail(toUser, total, this.user, ()=>{})
  makeOrder(forUser, lineItems, null, toUser._id, null, cb, (e, order) =>
    chargeAndTrackOrder(order, cb, (e,o) => svc.create(o, cb))
  )
}


function _createBookingOrder(expert, time, minutes, type, credit, payMethodId, request, lineItems, total, cb)
{
  var requestId = (request) ? request._id : null
  if (credit && credit > 0)
  {
    bookUsingCredit.call(this, expert, minutes, total, lineItems, credit, payMethodId, requestId, cb)
  }
  else
  {
    lineItems.unshift(Lines.payg(total))
    makeOrder(this.user, lineItems, payMethodId, null, requestId, cb, (e, order) => {
      chargeAndTrackOrder(order, cb, (e,o) => {
        if (request)
          RequestsSvc.updateWithBookingByCustomer.call(this, request, o, () => { $log('booking off request') })
        svc.create(o, cb)
      })
    })
  }
}


export function createBookingOrder(expert, time, minutes, type, credit, payMethodId, requestSuggestion, cb)
{
  if (requestSuggestion) {
    this.machineCall = true // so we get back all data for the request
    RequestsSvc.getRequestForBookingExpert.call(this, requestSuggestion.requestId, expert._id, (e, request) => {
      if (e) return cb(e)
      //-- TODO look at the data from db instead of being passed from client
      expert = requestSuggestion.suggestion.expert
      expert.rate = requestSuggestion.suggestion.suggestedRate.expert
      var unitPrice = requestSuggestion.suggestion.suggestedRate.total
      var unitProfit = requestSuggestion.suggestion.suggestedRate.total - expert.rate
      var total = minutes/60 * unitPrice
      var lineItems = [Lines.airpair(expert, time, minutes, type, unitPrice, unitProfit)]
      _createBookingOrder.call(this, expert, time, minutes, type, credit, payMethodId, request, lineItems, total, cb)
    })
  }
  else {
    var unitPrice = OrderUtil.calculateUnitPrice(expert,type)
    var unitProfit = OrderUtil.calculateUnitProfit(expert, type)
    var total = minutes/60 * unitPrice
    var lineItems = [Lines.airpair(expert, time, minutes, type, unitPrice, unitProfit)]
    _createBookingOrder.call(this, expert, time, minutes, type, credit, payMethodId, null, lineItems, total, cb)
  }
}



export function bookUsingCredit(expert, minutes, total, lineItems, expectedCredit, payMethodId, requestId, cb)
{
  getMyOrdersWithCredit.call(this, payMethodId, (e, orders) => {
    var lines = OrderUtil.linesWithCredit(orders)
    var availablCredit = OrderUtil.getAvailableCredit(lines)
    if (expectedCredit != availablCredit)
      return cb(Error(`ExpectedCredit $${expectedCredit}, not found. ${availablCredit} found.`))

    var need = total
    var ordersToUpdate = []
    for (var o of orders) {
      for (var li of o.lineItems) {
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

    // $log('bookUsingCredit.payMethodId', payMethodId)
    // $log('bookUsingCredit.lineItems', lineItems)

    // console.log('bookUsingCredit', lineItems)
    makeOrder(this.user, lineItems, payMethodId, null, requestId, cb, (e, order) => {

      chargeAndTrackOrder(order, cb, (e,o) => {
        // console.log('inserting cred redeemed order', order.total, order._id, order.userId)
        svc.updateAndInsertOneBulk(ordersToUpdate, o, (e,r) => cb(e,o))
      })
    })
  })
}


// export function buyMembership(length, coupon, payMethod, cb)
// {
//   var inValid = Validate.buyMembership(this.user, length)
//   if (inValid) return cb(svc.Forbidden(inValid))

//   var total = (length == 12) ? 500 : 300
//   var expires = Util.dateWithDayAccuracy(moment().add(6,'month'))

//   var lineItems = []

//   lineItems.push({ type : 'membership', unitPrice: total, qty: 1, total, profit: total,
//     info: { name: 'Membership (6 mth)', expires }} )

//   if (length == 12)
//     lineItems.push( Lines.credit(false, 500, expires, '12 Month Membership Promo') )

//   if (coupon == "bestpair")
//     lineItems.push( Lines.discount("bestpair", 50, 'Membership Announcement Promo', this.user) )

//   createOrder.call(this, lineItems, payMethod, this.user._id, (e,r) => {
//     if (e) return cb(e)
//     UserSvc.update.call(this, this.user._id, { membership: { expires } })
//     cb(null,r)
//   })
// }


