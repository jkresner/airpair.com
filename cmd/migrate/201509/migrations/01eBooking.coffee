

checkCONSISTENT = ->
  Bookings.find({},{participants:1,customerId:1,expertId:1}).toArray (e, all) ->
    count = 0
#     noOrderId = []
    for o in all

#       if o.orderId?
#         expect(o.orderId, "orderId does not exist for #{o._id}[#{count}]").to.exist
#         expect(o.orderId.constructor == ObjectId, 'orderId should be ObjectId for #{o._id}').to.be.true
#       else
#         noOrderId.push o._id

      count++
      expect(o.customerId, "customerId does not exist for #{o._id}").to.exist
      expect(o.customerId.constructor == ObjectId, 'customerId should be ObjectId').to.be.true
      expect(o.expertId, "expertId does not exist for #{o._id}").to.exist
      expect(o.expertId.constructor == ObjectId, 'expertId should be ObjectId for #{o._id}').to.be.true
      # expect(o.orderId, "orderId does not exist for #{o._id}[#{count}]").to.exist
      expect(o.participants, "participants does not exist for #{o._id}").to.exist
      expect(o.participants.length > 1, "participants length should be > 1 for #{o._id}").to.be.true
      for p in o.participants
        expect(p.info._id, "customerId does not exist for #{o._id}").to.exist
        expect(p.info._id.constructor == ObjectId, "participant info._id should be ObjectId #{o._id}").to.be.true
      if UserGraph[o.customerId]?
        refIncrement UserGraph[o.customerId], 'bookings'
      if ExpertGraph[o.expertId]?
        refIncrement UserGraph[ExpertGraph[o.expertId].user], 'booked'

    DONE()



unsets = ->
  attrs = 'createdById gcal.organizer gcal.creator gcal.kind gcal.sequence'
  $unset = {}
  $unset[attr] = 1 for attr in attrs.split(' ')
  $log('unset.BOOKING.attrs'.yellow, attrs.gray)
  Bookings.updateMany {}, {$unset}, ->
    DONE()




module.exports = ->

  specInit(@)


  # DESCRIBE 'MIGRATE', ->
    # IT "Can unset undesired attrs", unsets

  DESCRIBE 'CHECK', ->
    IT "Consistent", checkCONSISTENT

