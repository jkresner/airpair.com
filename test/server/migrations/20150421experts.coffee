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

cleanExpertProfileDuplicate = (originId, duplicateId, cb) ->
  orig = new ObjectId(originId)
  expertId = new ObjectId(duplicateId)
  $log('cleanExpertProfileDuplicate'.cyan, expertId)

  update = (bookings,requests,ordersN,ordersO) ->
    toUpdate = bookings.length + requests.length + ordersN.length + ordersO.length
    $log('updating'.cyan, toUpdate, bookings.length, requests.length, ordersN.length, ordersO.length)
    for b in bookings
      Bookings.update {_id:b._id},{ $set:{ expertId:orig }}, logUpdate(b, cb)

    for r in requests
      {suggested} = r
      suggestedExp = _.find(suggested,(s)->s.expert._id.toString()==duplicateId)
      suggestedExp.expert._id = orig
      Requests.update {_id:r._id},{ $set:{ suggested }}, logUpdate(r, cb)

    for o in ordersN
      {lineItems} = o
      line = _.find(lineItems,(l)->l.type=='airpair'&&l.info.expert._id.toString()==duplicateId)
      line.info.expert._id = originId
      Orders.update {_id:o._id},{ $set:{ lineItems }}, logUpdate(o, cb)

    for o in ordersO
      {lineItems} = o
      line = _.find(lineItems,(l)->l.suggestion.expert._id.toString()==duplicateId)
      line.suggestion.expert._id = originId
      Orders.update {_id:o._id},{ $set:{ lineItems }}, logUpdate(o, cb)



  Bookings.find({expertId},{_id:1,expertId:1,participants:1}).toArray (e1, bookings) ->
    Requests.find({'suggested.expert._id':expertId},{_id:1,expertId:1,suggested:1,calls:1}).toArray (e3, requests) ->
      Orders.find({'lineItems.info.expert._id':duplicateId},{_id:1,utc:1,lineItems:1}).toArray (e3, ordersN) ->
        Orders.find({'lineItems.suggestion.expert._id':duplicateId},{_id:1,utc:1,lineItems:1}).toArray (e3, ordersO) ->
          update(bookings,requests,ordersN,ordersO)


expertUsers = {}
getExperts = (cb) ->
  count = 0
  Experts.find({},{_id:1,userId:1,rate:1,name:1}).toArray (e2, experts) ->
    $log('experts', e2, experts.length)
    for expert in experts
      if (expert.userId && expertUsers[expert.userId.toString()])
        count++
      #   # $log('duplicate'.red, count, expert.userId, expert._id, expert.name)
      #   $log(expert.userId)
      # else if (expert.userId)
      #   expertUsers[expert.userId.toString()] = expert
      if (expert.userId && _.contains(dupsUserIds,expert.userId.toString()))
        $log('duplicate'.red, count, expert.userId, expert._id, expert.name)
    $log('dups', count)
    # console.log('experts.length', experts.length)

# ===================== 2015.04.20
# Duplicate Profile:  userId: ObjectId('52f20cf31c67d1a4859d2048')
#                     userId: ObjectId('53711efe1c67d1a4859d31bf')
#                     userId: ObjectId('54f8f2ba2da06c0c00c6b63f')
#                     userId: ObjectId('54fe10ae045ce10c0021ff33')


# Experts
# Original 53711f63481cfc0200c330cf, 53711f23481cfc0200c330ce Duplicate


module.exports = (done) ->

  $log('Cleaning dup'.cyan, '20150421experts'.white)

  # getExperts done
  cleanExpertProfileDuplicate "53711f63481cfc0200c330cf", "53711f23481cfc0200c330ce", done




