snggsId = "52127d5fc6a5870200000007"
adamKerrId = "53041710a9a333020000001d"
BookingUtil = require("../../../shared/bookings")


adminTasks = ->

  IT "Can dirty swap available expert", ->
    SETUP.ensureV1LoggedInExpert 'snug', ->
    SETUP.ensureBookingFromRequest 'swap1', (booking) ->
      initalExpert = _.find(booking.participants,(p)=>p.info.name == "Adam Kerr")
      expect(initalExpert.info.name).to.equal("Adam Kerr")
      expect(initalExpert.location).to.exist
      expect(initalExpert.timeZoneId).to.exist
      expect(_.find(booking.participants,(p)=>p.info.name == "Ra'Shaun Stovall")).to.be.undefined
      LOGIN "admin", ->
        expectIdsEqual(booking.expertId,adamKerrId)
        PUT "/adm/bookings/#{booking._id}/#{booking.orderId}/#{booking.request._id}/54e221ed24d2860a003a80ee/swap", {}, {}, (b2) ->
          expectIdsEqual(b2._id,data.bookings.swap1._id)
          expectIdsEqual(b2.expertId,snggsId)
          expect(_.find(b2.participants,(p)=>p.info.name == "Adam Kerr")).to.be.undefined
          newExpert = _.find b2.participants,(p)=>p.info.name == "Ra'Shaun Stovall"
          expect(newExpert.info.name).to.equal("Ra'Shaun Stovall")
          expect(newExpert.location).to.exist
          expect(newExpert.timeZoneId).to.exist
          db.readDoc 'Order', booking.orderId, (o2) ->
            expect(_.where(o2.lineItems,(li)->li.type=='airpair').length).to.equal(1)
            swappedLine = _.find(o2.lineItems,(li)=>li.type=='airpair'&&_.idsEqual(li.info.expert._id,"52127d5fc6a5870200000007"))
            expect(swappedLine).to.exist
            expect(swappedLine.info.expert.name).to.equal("Ra'Shaun Stovall")
            expect(swappedLine.info.name).to.equal("60 min (Ra'Shaun Stovall)")
            expect(swappedLine.info.swapped[0].prevExpert._id).to.equal(adamKerrId)
            PUT "/billing/orders/#{booking.orderId}/release", {}, {}, (released1) ->
              LOGIN 'snug', (sSnug) ->
                GET "/billing/orders/payouts", {}, (orders) ->
                  expect(orders.length>1).to.be.true
                  oBooked = _.find(orders, (o) -> _.idsEqual(o._id,booking.orderId))
                  expect(oBooked).to.exist
                  # Never quite took the test as far as the payout ...
                  DONE()


#   it "Can leave notes on bookings", itDone ->
#     SETUP.ensureV1LoggedInExpert 'snug', ->
#     SETUP.ensureBookingFromRequest 'swap1', (booking) ->
#       expect(booking.notes.length).to.equal(0)
#       LOGIN "admin", ->
#         d = { body: 'A great session and this test note is at least 20 characters' }
#         POST "/adm/bookings/#{booking._id}/note", d, {}, (b1) ->
#           expectIdsEqual(b1._id,data.bookings.swap1._id)
#           expect(b1.notes.length).to.equal(1)
#           d2 = { body: 'Futher this test note again is also at least 20 characters' }
#           POST "/adm/bookings/#{booking._id}/note", d2, {}, (b2) ->
#             expect(b2.notes.length).to.equal(2)
#             expect(b2.notes[0].body).to.equal('A great session and this test note is at least 20 characters')
#             expect(b2.notes[0]._id).to.exist
#             expect(b2.notes[1].body).to.equal('Futher this test note again is also at least 20 characters')
#             expect(b2.notes[1]._id).to.exist
#             expect(b2.notes[0]._id.toString()!=b2.notes[1]._id.toString()).to.be.true
#             DONE()


# scheduling = ->

#   before (done) ->
#     done()


#   # # this was previously broken + skipped
#   it 'Can update booking and create calendar + send invitations as admin', itDone ->
#     stub = SETUP.stubGoogleCalendar 'events', 'insert', data.wrappers.google_cal_create
#     SETUP.addAndLoginLocalUserWhoCanMakeBooking 'mkis', (s) ->
#       airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
#       POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
#         expect(booking1._id).to.exist
#         expect(booking1.customerId).to.exist
#         expect(booking1.minutes).to.equal(120)
#         expect(booking1.orderId).to.exist
#         expect(booking1.type).to.exist
#         expect(booking1.participants.length).to.equal(2)

#         LOGIN 'admin', (sadm) ->
#           ups = start: moment().add(3,'days').format('x'), sendGCal: {notify: true}
#           bUps = _.extend booking1, ups
#           bUps.participants[0].info.email = 'jk@airpair.com'
#           bUps.participants[1].info.email = 'jkresner@gmail.com'
#           PUT "/adm/bookings/#{booking1._id}", bUps, {}, (bs1) ->
#             # $log('bs1'.cyan, bs1.gcal)
#             expect(bs1.gcal).to.exist
#             expect(bs1.gcal.attendees.length).to.equal(2)
#             expect(stub.calledOnce).to.be.true
#             stub.restore()
#             DONE()


#   it 'Can update booking by admin and update calendar event', itDone ->
#     updateGcal = _.cloneDeep(data.wrappers.google_cal_create)
#     stub = SETUP.stubGoogleCalendar 'events', 'patch', updateGcal
#     SETUP.addAndLoginLocalUserWhoCanMakeBooking 'jkap', (s) ->
#       b = data.bookings.admUpdate
#       b.createdById = s._id
#       db.ensureDocs 'Booking', [b], () ->
#         LOGIN 'admin', (sadm) ->
#           newDateTime = moment()
#           body = _.extend b, {datetime:newDateTime}
#           PUT "/adm/bookings/#{b._id}", body, {}, (r) ->
#             $log('stub', stub.calledOnce)
#             expectSameMoment(r.datetime, newDateTime)
#             expect(stub.calledOnce).to.be.true
#             # expect(stub.args[0][0]).to.equal(b.gcal.id)
#             # expectSameMoment(stub.args[0][1],newDateTime)
#             # expectSameMoment(stub.args[0][2],newDateTime.add(body.minutes,'minutes'))
#             stub.restore()
#             DONE()


#   it.skip "Can add more participants to bookings", itDone ->



# calendar = ->

#   it 'Can list google calendars', itDone ->
#     # use this function if you need an id for a calendar you want to use to test
#     stub = SETUP.stubGoogleCalendar 'calendarList', 'list', data.wrappers.google_cal_list
#     Wrappers.Calendar.listCalendars (e,calendars) ->
#       # $log('calendars', calendars)
#       expect(e).to.be.null
#       expect(calendars.length > 1).to.be.true
#       stub.restore()
#       DONE()


#   it 'Can create google calendar event', itDone ->
#     stub = SETUP.stubGoogleCalendar 'events', 'insert', data.wrappers.google_cal_create
#     name = data.wrappers.google_cal_create.summary
#     description = data.wrappers.google_cal_create.description
#     start1 = data.wrappers.google_cal_create.start.dateTime
#     attendees = [{email:"participant1@null.com"},{email:"participant2@null.com"}]
#     send = false
#     adminInitials = 'jk'
#     Wrappers.Calendar.createEvent name, send, start1, 60, attendees, description, adminInitials, (e, event1) ->
#       # $log('e', e, event1)
#       expect(event1).to.exist
#       expectExists event1.id
#       expect(event1.summary).to.equal name
#       expect(event1.description).to.equal description
#       expectLength event1.attendees, 2
#       expectSameMoment(start1, event1.start.dateTime)
#       stub.restore()
#       DONE()


#   it.skip 'Can create and update gcal event through api wrapper', itDone ->
#     # stub = SETUP.stubGoogleCalendar 'events', 'patch', data.wrappers.google_cal_create
#     gcal = data.bookings.admUpdate.gcal
#     # set to 3pm
#     start1 = moment('20150701:15','YYYYMMDDHH:mm').utc()
#     $log start1.toISOString()
#     adminInitials = 'ap'
#     sendnotifications = false

#     Wrappers.Calendar.createEvent gcal.summary, sendnotifications, start1, 60, gcal.attendees, gcal.description, adminInitials, (err, event) ->
#       return DONE(err) if err?

#       result1 = moment event.start.dateTime
#       start2 = moment('20150710:15','YYYYMMDDHH:mm').utc()
#       end2 = moment('20150711:15','YYYYMMDDHH:mm').utc()
#       expectExists event.id
#       expect(event.kind).to.equal gcal.kind
#       expect(event.summary).to.equal gcal.summary
#       expect(event.description).to.equal gcal.description
#       expectLength event.attendees, 2

#       expectSameMoment(start1.toISOString(), event.start.dateTime)
#       expectDatetime start1, result1

#       Wrappers.Calendar.updateEventDateTimes event.id, start2, end2, (err2, event2) ->
#         return DONE(err2) if err2?

#         result2 = moment event2.start.dateTime
#         expectExists event2.id
#         expect(event2.id).to.equal event.id
#         expectSameMoment(start2, event2.start.dateTime)
#         expectDatetime start2, result2
#         expectSameMoment(end2, event2.end.dateTime)
#         DONE()



module.exports = ->

  @timeout 100000

  describe.only "ADM: ".subspec, ->

    describe "Tasks: ".subspec, adminTasks

  # describe "Scheduling: ".subspec, ->

  #   beforeEach -> config.calendar.on = true
  #   afterEach -> config.calendar.on = false

  #   describe "Adm Scheduling: ".subspec, scheduling
  #   describe "Calendar Wrapper: ".subspec, calendar
