var util = require('../../shared/util')
import Svc from './_service'
import Order from '../models/order'
import * as PayMethodSvc from './paymethods'
import * as UserSvc from './users'
import * as Validate from '../../shared/validation/billing.js'
var {linesWithCredit,getAvailableCredit} = require('../../shared/orders.js')
var Data = require('./orders.data')

var logging = false
var svc = new Svc(Order, logging)

var base = {
  'opensource': 20,
  'private': 40,
  'nda': 90,
}

function credit(paid, amount, expires, source)
{
  amount = parseInt(amount)
  var info = { name: `$${amount} Credit`, source, remaining: amount, expires, redeemedLines: [] }
  //-- profit on credit is always 0 because it is calculated in future line items
  var profitAmount = 0
  // var profitAmount = (paid) ? 0 : -1*amount
  var paidAmount = (paid) ? amount : 0
  return { type : 'credit', balance: amount, unitPrice: paidAmount, qty: 1, total: paidAmount, profit: profitAmount, info }
}

function discount(coupon, amount, source, user)
{
  var info = { name: `Discount ($${amount})`, amount, coupon, source, appliedBy: { _id: user._id, name: user.name } }
  return { type : 'discount', balance: 0, unitPrice: -1*amount, qty: 1, total:  -1*amount, profit:  -1*amount, info }
}

function airpair(expert, minutes, time, unitPrice, unitProfit)
{
  var qty = minutes / 60
  var exp = { _id: expert._id, name: expert.name, avatar: expert.avatar }
  var info = { name: `${minutes} min (${expert.name})`, time, minutes, paidout: false, expert: exp }
  return { type : 'airpair', unitPrice: unitPrice, qty, total: qty*unitPrice, profit: qty*unitProfit, info }
}


function createOrder(lineItems, payMethod, forUserId, cb) {
  var o = {
    _id: svc.newId(),
    utc: new Date(),
    userId: forUserId, // May be different from the identity (which could be an admin)
    total: 0,
    profit: 0,
    lineItems: lineItems
  }
  o.by = {
    _id:  this.user._id,
    name: this.user.name,
    email: this.user.email
  }

  for (var li of o.lineItems)
  {
    o.total += li.total
    o.profit += li.profit
  }

  if (o.total == 0)
  {
    o.payment = { type: '$0 order' }
    if (logging) $log('createing $0', o)
    svc.create(o, cb)
  }
  else
  {
    o.payMethodId = payMethod._id // What if we delete a payMethod?

    if (payMethod.companyId)
    {
      //-- NOTE need to think through companyId meaning shared card?
      //-- SHouldn't all cards have a companyId and be able to be shared
      //-- theoretically
      o.by.companyId = payMethod.companyId
      // o.by.company: payMethod.info
    }

    if (logging) $log('orders.svc.create', o.lineItems)
    PayMethodSvc.charge(o.total, o._id, payMethod, (e,r) => {
      if (e) return cb(e)
      if (logging) $log('payment.created', r)
      // trackOrder.call(this, o)
      var { id, status, amount, orderId, createdAt, processorAuthorizationCode} = r.transaction
      o.payment = { id, status, amount, orderId, createdAt, processorAuthorizationCode}
      svc.create(o, cb)
    })

  }
}

//-- Assumes we have added the linesItems already
function updateOrder(o, cb) {
  o.total = 0;
  o.profit = 0;

  for (var li of o.lineItems)
  {
    o.total += li.total
    o.profit += li.profit
  }

  if (logging) $log('orders.svc.update', o.lineItems)
  // trackOrderUpdate.call(this, o)
  svc.update(o, cb)
}


export function buyMembership(length, coupon, payMethod, cb)
{
  var inValid = Validate.buyMembership(this.user, length)
  if (inValid) return cb(svc.Forbidden(inValid))

  var total = (length == 12) ? 500 : 300
  var expires = util.dateWithDayAccuracy(moment().add(6,'month'))

  var lineItems = []

  lineItems.push({ type : 'membership', unitPrice: total, qty: 1, total, profit: total,
    info: { name: 'Membership (6 mth)', expires }} )

  if (length == 12)
    lineItems.push( credit(false, 500, expires, '12 Month Membership Promo') )

  if (coupon == "bestpair")
    lineItems.push( discount("bestpair", 50, 'Membership Announcement Promo', this.user) )

  createOrder.call(this, lineItems, payMethod, this.user._id, (e,r) => {
    if (e) return cb(e)
    UserSvc.update.call(this, this.user._id, { membership: { expires } })
    cb(null,r)
  })
}


export function buyCredit(total, coupon, payMethod, cb)
{
  var inValid = Validate.buyCredit(this.user, coupon, total)
  if (inValid) return cb(svc.Forbidden(inValid))

  var expires = util.dateWithDayAccuracy(moment().add(3,'month'))

  var lineItems = []
  lineItems.push(credit(true, total, expires, `$${total} Credit Purchase`))

  if (total == 1000)
    lineItems.push(credit(false, 50, expires, `Credit Bonus (5% on $${total})`))
  if (total == 3000)
    lineItems.push(credit(false, 300, expires, `Credit Bonus (10% on $${total})`))
  if (total == 5000)
    lineItems.push(credit(false, 1000, expires, `Credit Bonus (20% on $${total})`))

  if (coupon == "letspair")
    lineItems.push( discount("letspair", 100, 'Credit Announcement Promo', this.user) )

  createOrder.call(this, lineItems, payMethod, this.user._id, cb)
}


export function giveCredit(toUserId, total, source, cb)
{
  var expires = util.dateWithDayAccuracy(moment().add(3,'month'))

  var lineItems = []
  lineItems.push(credit(false, total, expires, source))

  createOrder.call(this, lineItems, null, toUserId, cb)
}


export function getMyOrders(cb)
{
  svc.searchMany({userId:this.user._id}, null, cb)
}


function getOrdersWithCredit(userId, cb)
{
  var query = Data.query.creditRemaining(userId)
  query = {userId} // TODO fix query
  svc.searchMany(query, { options: Data.options.ordersByDate }, cb)
}

export function getMyOrdersWithCredit(cb)
{
  getOrdersWithCredit(this.user._id, cb)
}


export function bookUsingCredit(expert, time, minutes, type, cb)
{
  var unitPrice = expert.rate + base[type]
  var total = minutes/60 * unitPrice
  var profit = base[type] //-- Make this real

  getOrdersWithCredit(this.user._id, (e, orders) => {
    var lines = linesWithCredit(orders)
    var availablCredit = getAvailableCredit(lines)
    if (availablCredit < total)
      return cb(Error(`Not enough credit ${availablCredit} for booking ${expert.name} for ${minutes} minutes @ ${total}`))

    var need = total
    var ordersToUpdate = []
    for (var o of orders) {
      for (var li of o.lineItems) {
        if (need > 0 && li.type == 'credit' && li.info.remaining > 0)
        {
          var deducted = need
          if (li.info.remaining > need) {
            var orderIdWithLineItem = o._id
            o.lineItems.push(airpair(expert, minutes, time, unitPrice, profit))
          }
          else
            deducted = li.info.remaining

          li.info.remaining = li.info.remaining - deducted
          li.info.redeemedLines.push({ lineItemId: li._id, amount: deducted, partial: deducted!=need })

          need = need - deducted
          ordersToUpdate = _.union(ordersToUpdate,[o._id])
        }
      }
    }

    ordersToUpdate = _.map(ordersToUpdate, (id) => _.find(orders,(o)=> _.idsEqual(o._id, id) ) )
    svc.updateBulk(ordersToUpdate, (e,r) => cb(e,orderIdWithLineItem))
  })
}


export function bookUsingPAYG(expert, time, minutes, type, payMethod, cb)
{
  var unitPrice = expert.rate + base[type]
  var total = minutes/60 * unitPrice
  var profit = base[type] //-- Make this real

  var lineItems = []
  lineItems.push(airpair(expert, minutes, time, unitPrice, profit))

  createOrder.call(this, lineItems, payMethod, this.user._id, (e,r) => cb(e,(r)?r._id:null))
}


export function addCouponToExistingOrder(orderId, coupon, cb)
{
  return cb('addCouponToExistingOrder not implemented')
}

// function trackOrder(order) {
// 	var props = {
// 		//timeFromVisit:, //revenue:, //visitedContent:
// 	}
// 	var context = {}
//   analytics.track(this.user, null, 'Customer Payment', props, context)

//   notifications.broadcast(`Customer Paid  ${order.total}`, this.user)

//   requestSvc.getById order.requestId, (e, request) =>
// }
