import Svc from '../services/_service'
import * as OrdersSvc from '../services/orders'
import Booking from '../models/booking'
var logging = false
var svc = new Svc(Booking, logging)


export function getByUserId(id, cb) {
  var opts = {}
  svc.searchMany({ customerId: id }, opts, cb)
}


export function getByExpertId(id, cb) {
  var opts = {}
  svc.searchMany({ expertId: id }, opts, cb)
}


function create(e, r, user, expert, time, minutes, type, cb) {
  if (e) return cb(e)

  var booking = {
    _id: svc.newId(),
    createdById: user._id,
    customerId: user._id, // consider use case of expert creating booking
    expertId: expert._id,
    type,
    minutes,
    status: 'pending',
    datetime: time,
    gcal: {},
    orderId: r._id
  }

  mailman.sendPipelinerNotifyBookingEmail(user.name, expert.name, booking._id, ()=>{})

  svc.create(booking, cb)
}


export function createBooking(expert, time, minutes, type, credit, payMethodId, requestId, cb)
{
  var createCB = (e, r) => create(e, r, this.user, expert, time, minutes, type, cb)
  OrdersSvc.createBookingOrder.call(this, expert, time, minutes, type, credit, payMethodId, requestId, createCB)
}


export function confirmBooking()
{
  cb(Error('confirmBooking not implemented'))
}
