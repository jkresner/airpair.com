  # "specs":                "01aTag,01bUser,01cExpert,01dRequest,01eBooking,01fPosts,01gPayouts",
    # "collections":        [ "tags","users","experts","requests","bookings","posts","payouts"]
  # "seed": {
  #   "force":              false,
  #   "clean":              true,
  #   "model":              "User",
  #   "key":                "jkap",
  #   "timeout":            30000
  # },


ordersToDoubleCheck =
  _id: "53d293d006740102005605d9"  # 1500 total, 150 credit + 250 suggested experts@airpair credit ? :/
  _id: "53aafe130503030200270882"  # Cencus unallocated hours in the form of experts@airpair
  _id: "553ecf43e433951100af1043"  # Can't find user for


MIGRATED =
  attrs_gone:  'lineItems marketingTags utm'


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


# no (known) ditry data
checkCONSISTENT = ->
  Orders.find({}).toArray (e, all) ->
    $log("Checking orders", all.length)
    count = 0
    noByUserId = 0
    noRequestId = []

    for o in all
      count++

      expect(o[attr]).to.be.undefined for attr in MIGRATED.attrs_gone
      expectObjectId(o._id)

      orderedByStaff = ORDER.byStaff[o.userId]?

      if o.requestId?
        expectObjectId(o.requestId)
      else
        noRequestId.push o._id

      expectAttr(o, 'by', Object)
      expectAttr(o.by, '_id', ObjectId)

      expectObjectId(o.userId)
      if UserGraph[o.userId]?
        refIncrement UserGraph[o.userId], 'orders'
      else if !orderedByStaff
        $log("order[#{o._id}] by userId[#{o.userId}].USER no longer exists".red, o._id)

      expectAttr(o, 'lines', Array)
      if o.lines[0].type != 'ticket' && o.lines[0].type != 'credit'

        if o.userId.toString() != o.by._id.toString() && !orderedByStaff
            $log("order[#{o._id}] not by userId".magenta,
              "#{UserGraph[o.userId].name}[#{o.userId}]".gray, "#{o.by.name}[#{o.by._id}]".white)
            noByUserId++
            # $log('ticket'.gray, o.by._id)

        for li in o.lines
          expert = null

          if li.suggestion
            if li.suggestion.expert._id?
              expert = li.suggestion.expert
              expectAttr(expert, 'userId', ObjectId)
              if !orderedByStaff
                expect(expert.userId, "suggestion.expert.userId shouldn't be equal to o.UserId: "+JSONSTRING[o._id]).to.not.equal(o.userId.toString())
            else
              $log('FAIL: no expert._id ==> '.red.dim, o._id)
          else if li.info? && li.info.expert?
            expert = li.info.expert
            # , "line.info.expert._id should exist for order #{o._id}").to.exist
            # expect(li.info.expert._id.constructor == ObjectId, "line.info.expert._id should be ObjectId got #{li.info.expert._id.constructor}").to.be.true
            expect(li.info.expert.userId, "line.info.expert.userId should be undefined").to.be.undefined

          if expert?
            expectAttr(expert,'_id', ObjectId)
            if ExpertGraph[expert._id]?
              refIncrement UserGraph[ExpertGraph[expert._id].user], 'ordered'
            else
              $log("no expert[#{expert._id}:#{expert.name}] for order[#{o._id}]...".red.dim)

    # $log('not by userId'.gray, noByUserId)
    $log('no requestId'.gray, noRequestId.length)
    DONE()



orderRenameAttrs = ->
  rename = renameModelAttr('Orders')
  rename 'lineItems', 'lines', false, ->
    DONE()


fixesUserIdsNotEqualExpertUserId = ->
  query = 'company.contacts.userId':{$exists:1}, lines: {$size:1}

  Orders.find(query, {userId:1,company:1,'lines.suggestion.expert':1}).toArray (e, all) ->
    $log('legacy orders'.blue, all.length)
    ups = []
    for o in all
      expectObjectId(o.userId)
      expectAttr(o,'company', Object)
      expect(o.lines.length, "more than one line #{o._id}").to.equal(1)
      # $log(o.lines[0].suggestion)
      expectAttr(o.company.contacts[0], 'userId', String)
      contactUserId = o.company.contacts[0].userId
      orderUserId = o.userId.toString()
      if contactUserId != orderUserId && !ORDER.byStaff[orderUserId]?
        expectAttr(o.lines[0].suggestion, 'expert', Object)
        expectAttr(o.lines[0].suggestion.expert, 'userId', String)
        {expert} = o.lines[0].suggestion
        if expert._id? && expert.userId == orderUserId
          # $log('Got screwed up Order.userId == expert._id'.red)
          # $log('cUID'.gray, contactUserId)
          # $log('oUID'.gray, o.userId)
          # $log('eUID'.gray, expert.userId)
          ups.push updateOne: { q: {_id:o._id}, u: { $set: {userId:ObjectId(contactUserId)} }, upsert: false }
        else
          $log('Got unknown Order.userId blooper'.red, o)

    if ups.length == 0 then return DONE()
    Orders.bulkWrite ups, {ordered:false}, (e,r) ->
      $log('update.ORDER.expertUserIdBlooper'.yellow, r.modifiedCount)
      DONE()


removesCreditOrders = ->
  Orders.find({total:0,profit:0,lines:{$size:1}}, {userId:1,lines:1}, q.sortById).toArray (e, all) ->
    $log('v1 credit orders'.blue, all.length)
    toRemove = []
    for o in all
      if o.lines[0].type is 'credit'
        if o.lines[0].info.remaining isnt 0 && o.lines[0].info.remaining < 70
          if idToMoment(o._id).isBefore(moment().add(-3,'month'))
            # $log("o[#{o._id}::#{idToMoment(o._id,'YYYY.MM')}] remaining".yellow, o.lines[0].info.remaining)
            toRemove.push o._id
        # else
          # $log("o[#{o._id}] redeemed".green, o.lines[0].balance)
    if toRemove.length is 0 then return DONE()
    Orders.remove inQuery(toRemove), (e, r) ->
      $log('delete.ORDER.expiredCredit'.yellow, r.result.n)
      DONE()



migrates_v0company_to_by = ->

  Orders.find({by:{$exists:0}}, {userId:1,company:1}, q.sortById).toArray (e, all) ->
    ups = []
    for o in all
      # expect(o.userId, "expecting userId exists for order #{o._id}").to.exist
      # expect(o.userId.constructor == ObjectId, "expecting userId is ObjectId for order #{o._id}").to.be.true
      expect(o.company, "expecting order without by had company").to.exist
      expect(o.company.contacts[0], "expecting at least one contact for #{o._id}").to.exist

      contactUserId = o.company.contacts[0].userId
      if contactUserId?
        expect(contactUserId.constructor == String, "Expecting contact.userId to be String").to.be.true
      # else
        # $log('contactUserId does not exist for #{o._id}'.gray)

      reqBy =
        _id: ObjectId((contactUserId||o.userId).toString())
        avatar: o.company.contacts[0].pic
        name: o.company.contacts[0].fullName
        email: o.company.contacts[0].email
        org: { name: o.company.name, _id: o.company._id }

      if contactUserId && contactUserId == reqBy._id.toString()
        # $log("#{idToMoment(o._id,'YY.MM')} [#{o._id}] by._id => company.contacts[0].userId".cyan, o.company.contacts[0].userId)
      else if o.userId.toString() == reqBy._id.toString()
        # $log("#{idToMoment(o._id,
      else
        $log("setting by._id to something else".red, o.company.contacts[0])

      ups.push( updateOne: { q: {_id:o._id}, u: { $set: {by:reqBy} }, upsert: false } )

    if ups.length == 0 then return DONE()
    Orders.bulkWrite ups, {ordered:false}, (e,r) ->
      $log('update.ORDER.by'.yellow, r.modifiedCount)
      DONE()


fixesExpertObjectIds = ->
  ups = []

  fixV1 = (o) ->
    for l in o.lines
      if l.info.expert?
        expect(l.info.expert._id, "info.expert._id does not exist for [#{o._id}]").to.exist
        # expect(l.info.expert.userId, "info.expert.userId exists for [#{o._id}]").to.exist
        newExpert = _id: ObjectId(l.info.expert._id.toString()), name: l.info.expert.name, avatar: l.info.expert.avatar
        l.info.expert = newExpert
        ups.push( updateOne: { q: {_id:o._id}, u: { $set: {lines:o.lines} }, upsert: false } )

  fixV0 = (o) ->
    if o.lines[0].type != 'ticket'
      for l in o.lines
        if l.suggestion && l.suggestion.expert?
          if !l.suggestion.expert._id
            $log('o', o, l.suggestion)
          else
            expectAttr(l.suggestion.expert, '_id', String)
            l.suggestion.expert._id = ObjectId(l.suggestion.expert._id.toString())
            l.suggestion.expert.userId = ObjectId(l.suggestion.expert.userId.toString())
            ups.push( updateOne: { q: {_id:o._id}, u: { $set: {lines:o.lines} }, upsert: false } )

  queryV1 = 'lines.info.expert':{$exists:1}
  queryV0 = 'lines.suggestion.expert':{$exists:1}  #, lines: {$size:1}
  Orders.find(queryV1, {_id:1,lines:1}).toArray (e1, all1) ->
    fixV1(o) for o in all1
    Orders.find(queryV0, {_id:1,lines:1}).toArray (e0, all0) ->
      fixV0(o) for o in all0
      if ups.length is 0 then return DONE()
      Orders.bulkWrite ups, {ordered:false}, (e,r) ->
        $log('update.ORDER.lines expert._id'.yellow, r.modifiedCount)
        DONE()



unsets = ->
  attrs = '__v company marketingTags utm'
  $unset = {}
  $unset[attr] = 1 for attr in attrs.split(' ')
  $log('unset.ORDER.attrs'.yellow, attrs.gray)
  Orders.updateMany {}, {$unset}, ->
    DONE()






module.exports = ->

  specInit(@)


  DESCRIBE 'MIGRATE', ->

    IT "Renames fields", orderRenameAttrs
    IT "No v0 orders with userId of expert", fixesUserIdsNotEqualExpertUserId
    IT "Removes credit orders older than 3 months", removesCreditOrders
    IT "Fixes expert ObjectIds", fixesExpertObjectIds
    IT "Company replaced with by", migrates_v0company_to_by
    IT "Can unset undesired attrs", unsets


  DESCRIBE 'CHECK', ->
    IT "Consistent", checkCONSISTENT




