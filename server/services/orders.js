var util = require('../../shared/util')
var mongoose = require('mongoose')
import Svc from './_service'
import * as Validate from '../../shared/validation/billing.js'
import Order from '../models/order'
import * as PayMethodSvc from './payMethods'
import * as UserSvc from './users'

var logging = false
var svc = new Svc(Order, logging)


function credit(paid, amount, expires, source)
{
	var info = { name: `Credit ($${amount})`, amount, source, remaining: amount, expires, redeemedLines: [] }
	//-- profit on credit is always 0 because it is calculated in future line items
	var paidAmount = (paid) ? amount : 0
	var profitAmount = (paid) ? 0 : -1*amount
	return { type : 'credit', unitPrice: paidAmount, qty: 1, total: paidAmount, profit: profitAmount, expires, info }
}

function discount(coupon, amount, source, user)
{
	var info = { name: `Discount ($${amount})`, amount, coupon, source, appliedBy: { _id: user._id, name: user.name } }
	return { type : 'discount', unitPrice: -1*amount, qty: 1, total:  -1*amount, profit:  -1*amount, info }
}


function createOrder(lineItems, payMethod, cb) {
	var o = {
		_id: new mongoose.Types.ObjectId().toString(),
		utc: new Date(),
		userId: this.user._id,
		total: 0,
		profit: 0,
		lineItems: lineItems,
		payMethodId: payMethod._id // What if we delete a payMethod?
	}
	o.by = {
		_id:  this.user._id,
		name: this.user.name,
		email: this.user.email
	}
	if (payMethod.companyId)
	{
		//-- NOTE need to think through companyId meaning shared card?
		//-- SHouldn't all cards have a companyId and be able to be shared
		//-- theoretically
		o.by.companyId = payMethod.companyId
		// o.by.company: payMethod.info
	}

  for (var li of o.lineItems)
  {
  	o.total += li.total
  	o.profit += li.profit
  }

  if (o.total == 0) {
  	$log('createing $0', o)
  	if (logging)
  	// Create order without charge
  	svc.create(e, cb)
  } else {
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

	createOrder.call(this, lineItems, payMethod, (e,r) => {
		if (e) return cb(e)
		UserSvc.update.call(this, this.user._id, { membership: { expires } })
		cb(null,r)
	})
}


export function buyCredit(total, coupon, payMethod, cb)
{
	var inValid = Validate.buyCredit(this.user, total)
  if (inValid) return cb(svc.Forbidden(inValid))

	var expires = util.dateWithDayAccuracy(moment().add(3,'month'))

	var lineItems = []
	lineItems.push(credit(true, total, expires, `Credit Exrta ($${total})`))

	if (total == 1000)
		lineItems.push(credit(false, 50, expires, `Credit Exrta (5%)`))
	if (total == 3000)
		lineItems.push(credit(false, 300, expires, `Credit Exrta (10%)`))
	if (total == 5000)
		lineItems.push(credit(false, 1000, expires, `Credit Exrta (20%)`))

	createOrder.call(this, lineItems, payMethod, cb)
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
