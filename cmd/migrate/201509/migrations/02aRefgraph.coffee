global.UserGraph = {}
global.ExpertGraph = {}


userRefs = ->
  Users.find({},{'_id':1,'linked.gp.name':1,'linked.gh.id':1,'name':1}).toArray (e, all) ->
    for o in all
      UserGraph[o._id] = { name: o.name || o.linked.gp.name }
      if (_.get(o,'linked.gh.id'))
        UserGraph[o._id]['gh'] = o.linked.gh.id
    DONE()



expertRefs = ->
  Experts.find({}, {_id:1,userId:1,rate:1,tags:1,user:1}).toArray (e, all) ->
    noRate = []
    crap = []
    for o in all
      expect(o.userId, "userId does not exist for #{o._id}").to.exist
      expect(o.userId.constructor == ObjectId).to.be.true
      expect(o.rate && o.rate > 0, "rate for {o._id}").to.be.true
      for t in o.tags
        expect(o._id.constructor == ObjectId).to.be.true
        expect(o.sort?, "tag no sort #{JSON.stringify(o)}").to.exist
      if !UserGraph[o.userId]
        $log('No user for '.red.dim, o)
      else
        expect(UserGraph[o.userId],"user doc for #{JSON.stringify(o)}").to.exist
        expect(UserGraph[o.userId].expert,"user already has expert[#{UserGraph[o.userId].expert}] #{JSON.stringify(o)}").to.be.undefined
        UserGraph[o.userId].expert = o._id
        ExpertGraph[o._id] = { user: o.userId }

    DONE()


requestRef = ->
  Requests.find({},{by:1,company:1,userId:1,status:1,tags:1,'suggested.expertStatus':1,'suggested.expert':1}).toArray (e, all) ->
    count = 0
    noUser = 0
    for o in all
      count++
      expect(o.by, "by does not exist for #{o._id}[#{count}]").to.exist
      expect(o.userId, "userId does not exist for #{o._id}[#{count}]").to.exist
      expect(o.userId.constructor == ObjectId).to.be.true
      expect(o.status, "status does not exist for #{o._id}[#{count}]").to.exist
      expect(o.tags, "tags does not exist for #{o._id}[#{count}]").to.exist

      # $log('request[]', UserGraph[o.userId])
      if !UserGraph[o.userId]?
        # $log("No user[#{o.userId}] for request[#{o._id}][#{count}]")
        noUser++
      else
        refIncrement UserGraph[o.userId], 'requests'

      for s in o.suggested || []
        expect(s.expert._id, "s.expert._id does not exist for #{o._id}").to.exist
        expect(s.expert._id.constructor == ObjectId, "s.expert._id no an ObjectId for #{o._id}").to.exist
        expect(s.expert.userId, "s.expert.userId should not exist for #{o._id}").to.be.undefined
        expect(s.expertStatus, "s.expertStatus should exist for #{o._id}").to.exist
        # $log('ExpertGraph[s.expert._id]', ExpertGraph[s.expert._id])
        if ExpertGraph[s.expert._id]?
          userId = ExpertGraph[s.expert._id].user
          expect(userId, "s.expert._id => userId #{s}").to.exist
          refIncrement UserGraph[userId], 'suggests'

    $log('noUser', noUser)
    DONE()


tagRefs = ->
  if tagsBySlug?
    return DONE()
  else
    global.tagsBySlug = {}
    global.tagIds = {}
    Tags.find({}).toArray (e, all) ->
      for o in all
        tagsBySlug[o.slug] = o
        tagIds[o._id] = true
      DONE()



bookingRef = ->
  Bookings.find({},{participants:1,createdById:1,customerId:1,expertId:1}).toArray (e, all) ->
    count = 0
    for o in all
      count++
      expect(o.customerId, "customerId does not exist for #{o._id}").to.exist
      expect(o.customerId.constructor == ObjectId, 'customerId should be ObjectId').to.be.true
      expect(o.createdById, "createdById should not exist for #{o._id}").to.be.undefined
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


# v0
# lineItems
#   suggestion
#     _id   (ObjectId)
#     suggestedRate
#     expert
#       _id   (String)
#       paymentMethod

# v1
# lineItems
#   info
#     expert
#       _id   (String)
#     released
#       by
#         _id   (ObjectId)

ordersRef = ->
  Orders.find({},{userId:1,by:1,lines:1,orderId:1}).toArray (e, all) ->
    count = 0
    noByUserId = 0
    noOrderId = []
    for o in all
      count++
      expect(o.userId, "customerId does not exist for #{o._id}").to.exist
      expect(o.userId.constructor == ObjectId, 'customerId should be ObjectId').to.be.true
      expect(o.by, "by does not exist for #{o._id}").to.exist
      expect(o.by._id, "by._id does not exist for #{o._id}").to.exist
      expect(o.by._id.constructor == ObjectId, 'by._id should be ObjectId for #{o._id}').to.be.true

      if o.orderId?
        expect(o.orderId, "orderId does not exist for #{o._id}[#{count}]").to.exist
        expect(o.orderId.constructor == ObjectId, 'orderId should be ObjectId for #{o._id}').to.be.true
      else
        noOrderId.push o._id

      if UserGraph[o.userId]?
        refIncrement UserGraph[o.userId], 'orders'

      expect(o.lines, "lines should exist for order #{o._id}").to.exist
      if o.lines[0].type != 'ticket' && o.lines[0].type != 'credit'
        if o.userId.toString() != o.by._id.toString() && !ORDER.byStaff[o.userId]
          $log("order[#{o._id}] not by userId".magenta,
            "#{UserGraph[o.userId].name}[#{o.userId}]".gray, "#{o.by.name}[#{o.by._id}]".white)
          noByUserId++
        # $log('ticket'.gray, o.by._id)
      # else
        for li in o.lines
          expertId = null
          if li.suggestion
            if li.suggestion.expert._id?
              expect(li.suggestion.expert._id, "line.suggestion.expert._id should exist for order #{o._id}").to.exist
              expect(li.suggestion.expert._id.constructor == String, "expertId should be String").to.be.true
              expertId = li.suggestion.expert._id
            else
              $log('strange!!!!!!!!!!!!!!!!!!!!'.yellow.bold, o._id)
          else if li.info? && li.info.expert?
            expect(li.info.expert._id, "line.info.expert._id should exist for order #{o._id}").to.exist
            expect(li.info.expert._id.constructor == ObjectId, "line.info.expert._id should be ObjectId got #{li.info.expert._id.constructor}").to.be.true
            expect(li.info.expert.userId, "line.info.expert.userId should be undefined").to.be.undefined
            expertId = li.info.expert._id

          if expertId?
            if ExpertGraph[expertId]?
              refIncrement UserGraph[ExpertGraph[expertId].user], 'ordered'
            else
              $log("no expert[#{expertId}] for order[#{o._id}]...".red.dim)

    $log('not by userId'.gray, noByUserId)
    $log('no orderId'.gray, noOrderId.length)
    DONE()


payoutsRef = ->
  Payouts.find({}, {'userId':1,'lines':1}).toArray (e, all) ->
    unique = {}
    count = 0
    jk = 0
    for o in all
      count++
      if UserGraph[o.userId]?
        refIncrement UserGraph[o.userId], 'paidout'

      for line in o.lines
        expect(line.info.expert._id.constructor == ObjectId, "info.expert._id expecting ObjectId #{o._id}").to.be.true
        expect(line.info.expert.userId, "info.expert.user should be undefined #{o._id}").to.be.undefined

        # if UserGraph[line.info.released.by._id]
        expect(line.info.released.by._id.constructor == ObjectId, "release.by._id expecting ObjectId got #{line.info.released.by._id.constructor} #{o._id}").to.be.true
        if UserGraph[line.info.released.by._id]?
          if !unique[o._id]?
            refIncrement UserGraph[line.info.released.by._id], 'released'
            unique[o._id] = line.info.released.by._id
          else if unique[o._id] is not line.info.released.by._id
            refIncrement UserGraph[line.info.released.by._id], 'released'
            unique[o._id] = line.info.released.by._id

    DONE()


postRef = ->
  Posts.find({}, {'by':1}).toArray (e, all) ->
    count = 0
    for o in all
      count++
      expect(o.by._id, "by.user._id does not exist for #{o._id}").to.exist
      expect(o.by._id.constructor == ObjectId).to.be.true
      if UserGraph[o.by._id]?
        refIncrement UserGraph[o.by._id], 'posts'
      else
        # $log(o)
    DONE()


paymethodRef = ->
  Paymethods.find({}, {'userId':1}).toArray (e, all) ->
    count = 0
    for o in all
      count++
      if UserGraph[o.userId]?
        refIncrement UserGraph[o.userId], 'paymethods'
      else
        # $log(o)
    DONE()


module.exports = ->

  specInit(@)

  describe 'Graph user relationships + expect consistent model form', ->


    IT "Ref Users", userRefs
    IT "Ref Payouts", payoutsRef
    IT "Ref Experts", expertRefs
    IT "Ref Requests", requestRef
    IT "Ref Tags", tagRefs
    IT "Ref Orders", ordersRef
    IT "Ref Bookings", bookingRef
    IT "Ref Posts", postRef
    IT "Ref Paymethods", paymethodRef
