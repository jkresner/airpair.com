import Svc from '../services/_service'
import * as OrdersSvc from '../services/orders'
import Booking from '../models/booking'
var logging = false
var svc = new Svc(Booking, logging)


export function getByUsersId(id, cb) {
	var opts = {}
	svc.searchMany({ customerId: id }, opts, cb)
}


export function getByExpertId(id, cb) {
	var opts = {}
	svc.searchMany({ expertId: id }, opts, cb)
}


function create(e, r) {
	if (e) return cb(e)

	var booking = {
		customerId: this.user._id, // consider use case of expert creating booking
		expertId: expert._id,
		type,
		minutes,
		createdById: this.user._id,
		status: 'pending',
		datetime: time,
		gcal: {},
		orderId: r
	}

	svc.create(booking, cb)
}

export function createWithCredit(expert, time, minutes, type, cb)
{
	OrdersSvc.bookUsingCredit.call(this, expert, time, minutes, type, create)
}

export function createWithPAYG(expert, time, minutes, type, payMethod, cb)
{
	OrdersSvc.bookUsingPAYG.call(this, expert, time, minutes, type, payMethod, create)
}

export function confirmBooking()
{
	cb(Error('confirmBooking not implemented'))
}
