util = require '../../shared/util'
ordersUtil = require '../../shared/orders'

module.exports = -> describe "Booking: ", ->

  @timeout 5000

  before (done) ->
    stubAnalytics()
    testDb.ensureExpert(data.users.dros, data.experts.dros, done)

  after (done) ->
    resotreAnalytics()
    done()

  afterEach -> cookie = null


  it 'Book 2 hour with pay as you go', (done) ->
    addAndLoginLocalUserWithPayMethod 'jpie', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private'
      POST "/bookings/payg/#{data.experts.dros._id}/#{s.primaryPayMethodId}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.orderId).to.exist
        expect(_.idsEqual(booking1.expertId, data.experts.dros._id)).to.be.true
        expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
        expect(booking1.type).to.equal('private')
        expect(booking1.minutes).to.equal(120)
        expect(_.idsEqual(booking1.createdById, s._id)).to.be.true
        expect(booking1.status).to.equal('pending')
        GET "/billing/orders", {}, (orders) ->
          order = _.find(orders, (o) -> _.idsEqual(o._id,booking1.orderId))
          expect(order.lineItems.length).to.equal(1)
          expect(order.lineItems[0].type).to.equal('airpair')
          expect(order.lineItems[0].info.paidout).to.equal(false)
          expect(_.idsEqual(order.lineItems[0].info.expert._id, data.experts.dros._id)).to.be.true
          expect(order.total).to.equal(300)
          expect(order.profit).to.equal(80)
          done()


  it.skip 'Book 2 hour with pay as you go off request', (done) ->


  it 'Fail to Book 1 hour at $150 with no credit', (done) ->
    addAndLoginLocalUserWithPayMethod 'jasp', (s) ->
      airpair = time: moment().add(1, 'day'), minutes: 60, type: 'private'
      POST "/bookings/credit/#{data.experts.dros._id}", airpair, { status: 400 }, (err, resp) ->
        expect(err.message.indexOf('Not enough credit')).to.equal(0)
        done()


  it 'Book 3 hour at $150 from $500 credit', (done) ->
    addAndLoginLocalUserWithPayMethod 'ckni', (s) ->
      o = total: 500
      POST "/billing/orders/credit/#{s.primaryPayMethodId}", o, {}, (r) ->
        airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private'
        POST "/bookings/credit/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
          expect(booking1._id).to.exist
          expect(booking1.minutes).to.equal(120)
          expect(booking1.orderId).to.exist
          GET "/billing/orders", {}, (orders1) ->
            lines1 = ordersUtil.linesWithCredit(orders1)
            availableCredit1 = ordersUtil.getAvailableCredit(lines1)
            expect(lines1.length).to.equal(1)
            expect(availableCredit1).to.equal(200)
            airpair2 = time: moment().add(3, 'day'), minutes: 60, type: 'private'
            POST "/bookings/credit/#{data.experts.dros._id}", airpair2, {}, (booking2) ->
              expect(booking2._id).to.exist
              expect(booking2.minutes).to.equal(60)
              GET "/billing/orders", {}, (orders2) ->
                lines2 = ordersUtil.linesWithCredit(orders2)
                availableCredit2 = ordersUtil.getAvailableCredit(lines2)
                expect(lines2.length).to.equal(1)
                expect(availableCredit2).to.equal(50)
                airpair3 = time: moment().add(4, 'day'), minutes: 60, type: 'private'
                POST "/bookings/credit/#{data.experts.dros._id}", airpair3, { status: 400 }, (err) ->
                  expect(err.message.indexOf('Not enough credit')).to.equal(0)
                  done()



  it.skip 'Can book another hour after buying more credit', (done) ->
  it.skip 'With the multiple credit line items, first lineitem gets deducted', (done) ->
  it.skip 'Gets $5 off booking if member', (done) ->
  it.skip 'Can redeem membership credit', (done) ->
  it.skip 'Team members can access credit from order', (done) ->
