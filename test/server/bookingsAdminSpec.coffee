snggsId = "52127d5fc6a5870200000007"
adamKerrId = "53041710a9a333020000001d"
BookingUtil = require("../../shared/bookings")

module.exports = -> describe "ADM: ".subspec, ->


  before (done) ->
    done()


  it.only "Can get multiTime", itDone ->
    $log 'time', data.bookings.timezones.datetime
    tzBooking = data.bookings.timezones
    expect(tzBooking.participants.length).to.equal(2)
    expect(tzBooking.participants[0].timezone).to.equal("Pacific Daylight Time")
    expect(tzBooking.participants[1].timezone).to.equal("Central Daylight Time")
    $log('BookingUtil', BookingUtil.multitime(tzBooking))
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


  it.skip "Can add more participants to bookings", itDone ->
