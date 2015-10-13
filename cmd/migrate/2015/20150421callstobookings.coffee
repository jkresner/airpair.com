# db.requests.update({},{ $unset: { calls : "" } },{ 'multi': true })


# {ObjectId2Date} = util
ObjectId = require('mongodb').ObjectID
inserted = 0
toInsert = 0

logInsert = (b, cb) ->
  (e, r) ->
    inserted++
    if (e)
      $log("e[#{inserted}][#{b._id}]: ".green,e)
    else
      $log("inserted[#{inserted}][#{b._id}]: ".green,r.result.n)

    if inserted >= toInsert
      cb()


bookings = []
existingIds = {}
getAllCalls = (cb) ->
  count = 0
  Requests.find({calls:{$exists:1,$not: {$size: 0}}},{_id:1,by:1,'company.contacts':1,calls:1,userId:1,suggested:1}).toArray (e2, requests) ->
    console.log('requests'.yellow, requests.length)
    for r in requests
      for c in r.calls
        bookingId = c._id
        if (existingIds[bookingId])
          bookingId = new ObjectId()
        existingIds[bookingId] = true

        sugExp = _.find(r.suggested,(s)->s.expert._id.toString()==c.expertId.toString())
        if sugExp and sugExp.expert
          expParticipant =
            _id: new ObjectId()
            role: 'expert'
            info:
              _id: sugExp.expert.userId
              name: sugExp.expert.name
              email: sugExp.expert.gmail
        else
          expParticipant =
            _id: new ObjectId()
            role: 'expert'
            info:
              expertId: c.expertId
              _id: c.expertId
              name: c.expertId.toString()
              email: c.expertId.toString()

        custParticipant =
            _id: new ObjectId()
            role: 'customer'
            info:
              _id: r.userId
              name: if r.by then r.by.name else r.company.contacts[0].fullName
              email: if r.by then r.by.email else r.company.contacts[0].email

        expect(expParticipant.info._id).to.exist
        expect(expParticipant.info.name).to.exist
        expect(expParticipant.info.email).to.exist
        expect(custParticipant.info._id).to.exist
        expect(custParticipant.info.name).to.exist
        expect(custParticipant.info.email).to.exist

        # $log('expParticipant', expParticipant)
        # $log('custParticipant', custParticipant)
        bookings.push
          _id:              bookingId
          customerId:       r.userId
          expertId:         c.expertId
          participants:     [custParticipant,expParticipant]
          type:             c.type
          minutes:          c.duration*60
          createdById:      ObjectId("52ad320166a6f999a465fdc5") # team@airpair.com
          status:           c.status
          datetime:         c.datetime
          gcal:             c.gcal
          recordings:       c.recordings
          notes:            c.notes     # not in v1 schema, but shows it's a migrated call
          requestId:        r._id       # not in v1 schema, but shows it's a migrated call
          # orderId:

        if (bookings.length < 2)
          $log('booking'.white, bookings)

    toInsert = bookings.length
    console.log('bookings'.yellow, bookings.length)
    for b in bookings
      Bookings.insert b, logInsert(b, cb)


module.exports = (done) ->

  $log('Migrating all calls to bookings'.cyan, '20150421callstobookings'.white)

  getAllCalls done
