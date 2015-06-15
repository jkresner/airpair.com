module.exports = -> describe "ADM: ".subspec, ->


  before (done) ->
    done()


  it "Can dirty swap available expert", itDone ->
    snggsId = "52127d5fc6a5870200000007"
    adamKerrId = "53041710a9a333020000001d"
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
