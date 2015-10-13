{ObjectId2Date} = util
ObjectId = require('mongodb').ObjectID
updated = 0
toUpdate = 0

logUpdate = (o, cb) ->
  (e, r) ->
    updated++
    $log("Updated[#{updated}][#{o._id}]: ".green,e,r.result.n)
    # if updated >= toUpdate
      # cb()

assignCallBookingsAnOrderId = (order, call, cb) ->
  Bookings.findOne {_id:call.callId},{_id:1,requestId:1,orderId:1}, (e1, booking) ->
    if (!booking)
      $log('redeemedCall'.red, call.callId, 'has no booking'.white)
    else if (booking.orderId)
      $log('redeemedCall'.magenta, call.callId, 'booking alredy has orderId'.white, booking.orderId)
    else
      $log('booking to be updated with'.blue, booking._id, order._id)
      Bookings.update {_id:booking._id},{ $set:{ orderId:order._id }}, logUpdate(booking, cb)


orderCount = 0
module.exports = (done) ->

  Orders.find({'lineItems.redeemedCalls.callId':{$exists:1}},{_id:1,'lineItems.redeemedCalls':1}).toArray (e2, orders) ->
    toUpdate = orders.length
    $log('orderCount', toUpdate)
    for o in orders
      $log('o'.red, ObjectId2Date(o._id), o.lineItems.length)
      for line in o.lineItems
        for call in line.redeemedCalls || []
          assignCallBookingsAnOrderId(o, call, done)
