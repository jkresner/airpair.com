# {ObjectId2Date} = util
ObjectId = require('mongodb').ObjectID
updated = 0
toUpdate = 0

logUpdate = (o, cb) ->
  (e, r) ->
    updated++
    $log("Updated[#{updated}][#{o._id}]: ".green,e,r.result.n)
    if updated >= toUpdate
      cb()

addBookingIdToAirPairOrderLine = (booking, cb) ->
  $log('booking'.cyan, booking._id, booking.orderId)
  Orders.findOne {_id:booking.orderId}, {_id:1,utc:1,lineItems:1}, (e3, order) ->
    if e3
      $log('e3'.red, e3)
    else if !order?
      $log('!order'.red, booking.orderId)
      toUpdate = toUpdate - 1
    else
      apLine = _.find(order.lineItems,(li)->li.type == 'airpair')
      $log('apLine'.green, apLine.bookingId, apLine._id)
      apLine.bookingId = booking._id
      Orders.update {_id:order._id},{ $set:{ lineItems: order.lineItems }}, logUpdate(order, cb)


module.exports = (done) ->

  Bookings.find({requestId:{$exists:0}},{_id:1,orderId:1}).toArray (e2, bookings) ->
    toUpdate = bookings.length
    for b in bookings
      addBookingIdToAirPairOrderLine(b,done)
