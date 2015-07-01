snggsId = "52127d5fc6a5870200000007"
adamKerrId = "53041710a9a333020000001d"
BookingUtil = require("../../shared/bookings")


scheduling = ->

  before (done) ->
    done()


  it "Can get multiTime", itDone ->
    tzBooking = data.bookings.timezones
    tzBooking.datetime = ISODate("2016-06-25T00:00:00.000Z")
    expect(tzBooking.participants.length).to.equal(2)
    expect(tzBooking.participants[0].timeZoneId).to.equal("America/Los_Angeles")
    expect(tzBooking.participants[1].timeZoneId).to.equal("America/Chicago")
    multitime = BookingUtil.multitime(tzBooking)
    expectStartsWith(multitime, "Sat 25 12AM UTC | Fri 24 5PM PDT | Fri 24 7PM CDT")
    # $log('BookingUtil'.cyan, BookingUtil.multitime(tzBooking))
    bOld = data.bookings.swap1
    bOld.datetime = ISODate("2015-03-12T03:33:18.576Z")
    multitime2 = BookingUtil.multitime(bOld)
    expectStartsWith(multitime2, "Thu 12 3AM UTC")
    DONE()


  it "Can get purpose for various booking statuses", itDone ->
    bPending = data.bookings.timezones
    bPending.datetime = ISODate("2016-06-25T00:00:00.000Z")
    expect(bPending.status).to.equal("pending")
    expect(bPending.participants.length).to.equal(2)
    expect(bPending.participants[0].timeZoneId).to.equal("America/Los_Angeles")
    expect(bPending.participants[1].timeZoneId).to.equal("America/Chicago")
    pendingPurpose = BookingUtil.chatGroup(bPending).purpose
    expectStartsWith(pendingPurpose, "https://airpair.com/bookings/558aa2454be238d1956cb8aa Morgan (PDT, San Francisco, CA, USA) + Billy (CDT, Houston, TX, USA). WAITING to confirm 90 mins @ Sat 25 12AM UTC | Fri 24 5PM PDT | Fri 24 7PM CDT.")
    bConfirmed = _.extend(bPending,{status:'confirmed'})
    confirmedPurpose = BookingUtil.chatGroup(bConfirmed).purpose
    expectStartsWith(confirmedPurpose, "https://airpair.com/bookings/558aa2454be238d1956cb8aa Morgan (PDT, San Francisco, CA, USA) + Billy (CDT, Houston, TX, USA). CONFIRMED 90 mins @ Sat 25 12AM UTC | Fri 24 5PM PDT | Fri 24 7PM CDT.")
    bFollowup = _.extend(bPending,{status:'followup'})
    followupPurpose = BookingUtil.chatGroup(bFollowup).purpose
    expectStartsWith(followupPurpose, "https://airpair.com/bookings/558aa2454be238d1956cb8aa Morgan (PDT, San Francisco, CA, USA) + Billy (CDT, Houston, TX, USA). FEEDBACK required to payout expert for 90 mins on Sat 25 12AM UTC | Fri 24 5PM PDT | Fri 24 7PM CDT.")
    DONE()


  it "Can get purpose for old no timeZoneId bookings", itDone ->
    bOld = data.bookings.swap1
    bOld.datetime = ISODate("2015-03-12T03:33:18.576Z")
    purpose = BookingUtil.chatGroup(bOld).purpose
    expectStartsWith(purpose, "https://airpair.com/bookings/54dc2d2fd137810a00f2813b Daniel + Adam. FEEDBACK required to payout expert for 60 mins on Thu 12 3AM UTC")
    DONE()


  it "Can dirty swap available expert", itDone ->
    SETUP.ensureV1LoggedInExpert 'snug', ->
    SETUP.ensureBookingFromRequest 'swap1', (booking) ->
      expect(_.find(booking.participants,(p)=>p.info.name == "Adam Kerr")).to.exist
      expect(_.find(booking.participants,(p)=>p.info.name == "Ra'Shaun Stovall")).to.be.undefined
      LOGIN "admin", ->
        expectIdsEqual(booking.expertId,adamKerrId)
        PUT "/adm/bookings/#{booking._id}/#{booking.orderId}/#{booking.request._id}/54e221ed24d2860a003a80ee/swap", {}, {}, (b2) ->
          expectIdsEqual(b2._id,data.bookings.swap1._id)
          expectIdsEqual(b2.expertId,snggsId)
          expect(_.find(b2.participants,(p)=>p.info.name == "Adam Kerr")).to.be.undefined
          expect(b2.participants,(p)=>p.info.name == "Ra'Shaun Stovall").to.exist
          db.readDoc 'Order', booking.orderId, (o2) ->
            expect(_.where(o2.lineItems,(li)->li.type=='airpair').length).to.equal(1)
            swappedLine = _.find(o2.lineItems,(li)=>li.type=='airpair'&&_.idsEqual(li.info.expert._id,"52127d5fc6a5870200000007"))
            expect(swappedLine).to.exist
            expect(swappedLine.info.expert.name).to.equal("Ra'Shaun Stovall")
            expect(swappedLine.info.name).to.equal("60 min (Ra'Shaun Stovall)")
            expect(swappedLine.info.swapped[0].prevExpert._id).to.equal(adamKerrId)
            PUT "/adm/billing/orders/#{booking.orderId}/release", {}, {}, (released1) ->
              LOGIN 'snug', (sSnug) ->
                # $log('sSnug', sSnug)
                GET "/billing/orders/payouts", {}, (orders) ->
                  expect(orders.length).to.equal(1)
                  expectIdsEqual(orders[0]._id,booking.orderId)
                  # Never quite took the test as far as the payout ...
                  DONE()


  it "Can leave notes on bookings", itDone ->
    SETUP.ensureV1LoggedInExpert 'snug', ->
    SETUP.ensureBookingFromRequest 'swap1', (booking) ->
      expect(booking.notes.length).to.equal(0)
      LOGIN "admin", ->
        d = { body: 'A great session and this test note is at least 20 characters' }
        POST "/adm/bookings/#{booking._id}/note", d, {}, (b1) ->
          expectIdsEqual(b1._id,data.bookings.swap1._id)
          expect(b1.notes.length).to.equal(1)
          d2 = { body: 'Futher this test note again is also at least 20 characters' }
          POST "/adm/bookings/#{booking._id}/note", d2, {}, (b2) ->
            expect(b2.notes.length).to.equal(2)
            expect(b2.notes[0].body).to.equal('A great session and this test note is at least 20 characters')
            expect(b2.notes[0]._id).to.exist
            expect(b2.notes[1].body).to.equal('Futher this test note again is also at least 20 characters')
            expect(b2.notes[1]._id).to.exist
            expect(b2.notes[0]._id.toString()!=b2.notes[1]._id.toString()).to.be.true
            DONE()


  # # this was previously broken + skipped
  # it.skip 'Can update booking and send invitations as admin', itDone ->
  #   SETUP.addAndLoginLocalUserWhoCanMakeBooking 'mkis', (s) ->
  #     airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
  #     POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
  #       expect(booking1._id).to.exist
  #       expect(booking1.customerId).to.exist
  #       expect(booking1.minutes).to.equal(120)
  #       expect(booking1.orderId).to.exist
  #       expect(booking1.type).to.exist
  #       expect(booking1.participants.length).to.equal(2)

  #       LOGIN 'admin', (sadm) ->
  #         ups = start: moment().add(3,'days').format('x'), sendGCal: {notify: true}
  #         bUps = _.extend booking1, ups
  #         bUps.participants[0].info.email = 'jk@airpair.com'
  #         bUps.participants[1].info.email = 'jkresner@gmail.com'
  #         PUT "/adm/bookings/#{booking1._id}", bUps, {}, (bs1) ->
  #           $log('bs1', bs1)
  #           expect(bs1.gcal).to.exist
  #           expect(bs1.gcal.attendees.length).to.equal(2)
  #           DONE()


  it 'Can list google calendars', itDone ->
    # use this function if you need an id for a calendar you want to use to test
    stub = SETUP.stubGoogleCalendar 'calendarList', 'list', data.wrappers.google_cal_list
    Wrappers.Calendar.listCalendars (e,calendars) ->
      stub.restore()
      DONE(e) if e?
      # $log('calendars', calendars)
      DONE()


  it 'Can create google calendar event', itDone ->
    stub = SETUP.stubGoogleCalendar 'calendarList', 'list', data.wrappers.google_cal_list
    name = "create calendar test #{timeSeed()}"
    send = false
    description = "it's a test"
    adminInitials = 'jk'
    attendees = [
      {email:"participant1@null.com"},
      {email:"participant2@null.com"},
    ]
    start1 = moment()
    Wrappers.Calendar.createEvent name, send, start1, 60, attendees, description, adminInitials, (e, event1) ->
      stub.restore()
      DONE(e) if e?

      expect(event1).to.exist
      expectExists event1.id
      expect(event1.summary).to.equal name
      expect(event1.description).to.equal description
      expectLength event1.attendees, 2

      startresult1 = moment event1.start.dateTime
      expectDatetime start1, startresult1

      DONE()


  it 'Can update booking by admin and update calendar event', itDone ->

    updateGcal = _.cloneDeep(data.wrappers.google_cal_create)
    Wrappers.Calendar.init()
    stub = sinon.stub Wrappers.Calendar, 'updateEventDateTimes', (id, start, end, cb) -> cb(null, updateGcal)

    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'jkap', (s) ->
      b = data.bookings.admUpdate
      b.createdById = s._id
      db.ensureDocs 'Booking', [b], () ->
        LOGIN 'admin', (sadm) ->
          newDateTime = moment()
          body = _.extend b, {datetime:newDateTime}
          PUT "/adm/bookings/#{b._id}", body, {}, (r) ->
            expectSameMoment(r.datetime, newDateTime)
            expect(stub.calledOnce).to.be.true
            expect(stub.args[0][0]).to.equal(b.gcal.id)
            expectSameMoment(stub.args[0][1],newDateTime)
            expectSameMoment(stub.args[0][2],newDateTime.add(body.minutes,'minutes'))
            stub.restore()
            DONE()


  it.skip "Can add more participants to bookings", itDone ->



calendar = ->

  it 'Can create and update gcal event through api wrapper', itDone ->
    # stub = SETUP.stubGoogleCalendar 'events', 'patch', data.wrappers.google_cal_create
    gcal = data.bookings.admUpdate.gcal
    start1 = moment()
    adminInitials = 'ap'
    sendnotifications = false

    Wrappers.Calendar.createEvent gcal.summary, sendnotifications, start1, 60, gcal.attendees, gcal.description, adminInitials, (err, event) ->
      return DONE(err) if err?

      result1 = moment event.start.dateTime
      start2 = moment(start1).add 10, 'days'
      end2 = moment(start2).add 60, 'minutes'
      expectExists event.id
      expect(event.kind).to.equal gcal.kind
      expect(event.summary).to.equal gcal.summary
      expect(event.description).to.equal gcal.description
      expectLength event.attendees, 2
      expectDatetime start1, result1

      Wrappers.Calendar.updateEventDateTimes event.id, start2, end2, (err2, event2) ->
        return DONE(err2) if err2?

        result2 = moment event2.start.dateTime
        expectExists event2.id
        expect(event2.id).to.equal event.id
        expectDatetime start2, result2
        DONE()



module.exports = ->

  @timeout 100000

  describe "ADM: ".subspec, ->
    describe "Scheduling: ".subspec, scheduling

  describe "Calendar: ".subspec, ->
    describe "Wrapper: ".subspec, calendar
