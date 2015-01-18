{payoutSummary} = require('../../shared/orders')

module.exports = -> describe.only "API: ", ->

  @timeout 10000

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initExperts done

  after ->
    SETUP.analytics.restore()

  beforeEach ->
    @payoutStub = SETUP.stubPayPalPayout()
    @braintreepaymentStub = SETUP.stubBraintreeChargeWithMethod()

  afterEach ->
    @payoutStub.restore()
    @braintreepaymentStub.restore()


  it 'New expert sees empty orders list to be paid out', (done) ->
    SETUP.newLoggedInExpert 'tmot', (expert, expertSession) ->
      GET "/billing/orders/payouts", {}, (orders) ->
        expect(orders.length).to.equal(0)
        done()


  it 'Non expert gets 403 on orders to payout', (done) ->
    SETUP.addLocalUser 'bfie', {}, (s) ->
      GET "/billing/orders/payouts", { status: 401 }, (orders) ->
        done()


  it 'Booked expert can see single transaction pending', (done) ->
    SETUP.newBookedRequest 'rusc', {}, 'dymo', (request, booking, customerSession, expertSession) ->
      LOGIN expertSession.userKey, expertSession, ->
        GET "/billing/orders/payouts", {}, (orders) ->
          expect(orders.length).to.equal(1)
          expect(orders[0].total).to.be.undefined
          expect(orders[0].profit).to.be.undefined
          expect(orders[0].userId).to.equal(customerSession._id)
          expect(orders[0].by.name).to.equal(customerSession.name)
          expect(orders[0].lineItems.length).to.equal(1)
          expect(orders[0].lineItems[0].type).to.equal('airpair')
          expect(orders[0].lineItems[0].info.expert._id).to.equal(booking.expertId)
          expect(orders[0].lineItems[0].info.paidout).to.equal(false)
          expect(orders[0].lineItems[0].owed).to.equal(70)
          expect(orders[0].lineItems[0].total).to.be.undefined
          expect(orders[0].lineItems[0].profit).to.be.undefined
          expect(orders[0].lineItems[0].info.released).to.be.undefined
          summary = payoutSummary(orders)
          expect(summary.owed.count).to.equal(0)
          expect(summary.owed.total).to.equal(0)
          expect(summary.paid.count).to.equal(0)
          expect(summary.paid.total).to.equal(0)
          expect(summary.pending.count).to.equal(1)
          expect(summary.pending.total).to.equal(70)
          done()


  it 'Expert can see multiple transactions pending', (done) ->
    SETUP.newBookedRequest 'dros', {}, 'dces', (request1, booking1, customerSession1, expertSession) ->
      SETUP.newBookedRequestWithExistingExpert 'brfi', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
        LOGIN expertSession.userKey, expertSession, ->
          GET "/billing/orders/payouts", {}, (orders) ->
            expect(orders.length).to.equal(2)
            summary = payoutSummary(orders)
            expect(summary.owed.count).to.equal(0)
            expect(summary.owed.total).to.equal(0)
            expect(summary.paid.count).to.equal(0)
            expect(summary.paid.total).to.equal(0)
            expect(summary.pending.count).to.equal(2)
            expect(summary.pending.total).to.equal(140)
            done()


  it 'Expert can see single transaction released', (done) ->
    SETUP.newBookedRequest 'kyau', {}, 'admb', (request, booking, customerSession, expertSession) ->
      LOGIN 'admin', data.users.admin, ->
        PUT "/adm/billing/orders/#{booking.orderId}/release", {}, {}, (released) ->
          expect(released.lineItems.length).to.equal(2)
          expect(released.lineItems[1].info.paidout).to.equal(false)
          expect(released.lineItems[1].info.released).to.exist
          expect(released.lineItems[1].info.released.by).to.exist
          expect(released.lineItems[1].info.released.action).to.equal('release')
          LOGIN expertSession.userKey, expertSession, ->
            GET "/billing/orders/payouts", {}, (orders) ->
              expect(orders.length).to.equal(1)
              expect(orders[0].lineItems.length).to.equal(1)
              expect(orders[0].lineItems[0].type).to.equal('airpair')
              expect(orders[0].lineItems[0].info.paidout).to.equal(false)
              expect(orders[0].lineItems[0].owed).to.equal(70)
              expect(orders[0].lineItems[0].total).to.be.undefined
              expect(orders[0].lineItems[0].profit).to.be.undefined
              expect(orders[0].lineItems[0].info.released).to.exist
              expect(orders[0].lineItems[0].info.released.utc).to.exist
              expect(orders[0].lineItems[0].info.released.by._id).to.equal(data.users.admin._id)
              summary = payoutSummary(orders)
              expect(summary.owed.count).to.equal(1)
              expect(summary.owed.total).to.equal(70)
              expect(summary.paid.count).to.equal(0)
              expect(summary.paid.total).to.equal(0)
              expect(summary.pending.count).to.equal(0)
              expect(summary.pending.total).to.equal(0)
              done()


  it 'Expert can see multiple transactions owed', (done) ->
    SETUP.newBookedRequest 'mikf', {}, 'mper', (request1, booking1, customerSession1, expertSession) ->
      SETUP.newBookedRequestWithExistingExpert 'mfly', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
        LOGIN 'admin', data.users.admin, ->
          PUT "/adm/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
            PUT "/adm/billing/orders/#{booking2.orderId}/release", {}, {}, (released2) ->
              LOGIN expertSession.userKey, expertSession, ->
                GET "/billing/orders/payouts", {}, (orders) ->
                  expect(orders.length).to.equal(2)
                  summary = payoutSummary(orders)
                  expect(summary.owed.count).to.equal(2)
                  expect(summary.owed.total).to.equal(140)
                  expect(summary.paid.count).to.equal(0)
                  expect(summary.paid.total).to.equal(0)
                  expect(summary.pending.count).to.equal(0)
                  expect(summary.pending.total).to.equal(0)
                  done()



  it 'Expert can see multiple transactions of mixed status', (done) ->
    SETUP.newBookedRequest 'hubi', {}, 'phlf', (request1, booking1, customerSession1, expertSession) ->
      SETUP.newBookedRequestWithExistingExpert 'mois', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
        SETUP.newBookedRequestWithExistingExpert 'prak', {}, expertSession, (request3, booking3, customerSession3, expertSession) ->
          LOGIN 'admin', data.users.admin, ->
            PUT "/adm/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
              # PUT "/adm/billing/orders/#{booking2.orderId}/release", {}, {}, (released2) ->
                LOGIN expertSession.userKey, expertSession, ->
                  GET "/billing/orders/payouts", {}, (orders) ->
                    expect(orders.length).to.equal(3)
                    summary = payoutSummary(orders)
                    expect(summary.owed.count).to.equal(1)
                    expect(summary.owed.total).to.equal(70)
                    expect(summary.paid.count).to.equal(0)
                    expect(summary.paid.total).to.equal(0)
                    expect(summary.pending.count).to.equal(2)
                    expect(summary.pending.total).to.equal(140)
                    done()


  it 'Paypal sandbox works', (done) ->
    # These can start failing with 500 INTERNAL ERROR if there isn't enough
    # balance in the test account (really annoying)
    @payoutStub.restore()
    pp = require('../../server/services/wrappers/paypal')
    payoutId = newId()
    pp.payout "expert_engb_verified@airpair.com",90,payoutId,'note', (e,p) ->
      # $log('e', e, 'p', JSON.stringify(p))
      expect(e).to.be.null
      expect(p.items[0].transaction_status).to.equal("SUCCESS")
      done()


  it 'Paypal sandbox passes back error for non existing address', (done) ->
    @payoutStub.restore()
    pp = require('../../server/services/wrappers/paypal')
    payoutId = newId()
    pp.payout "expert_nonexisting@airpair.com",90,payoutId,'note', (e,p) ->
      # $log('e', e, 'p', JSON.stringify(p))
      expect(e).to.exist
      expect(p.items[0].transaction_status).to.equal("UNCLAIMED")
      done()


  it 'Expert can collect a single released transaction to their verified paypal account', (done) ->
    SETUP.newLoggedInExpertWithPayoutmethod 'admb', (expert, expertSession, payoutmethod) ->
      SETUP.newBookedRequestWithExistingExpert 'josh', {}, expertSession, (request, booking, customerSession, expertSession) ->
        SETUP.releaseOrderAndLogExpertBackIn booking.orderId, expertSession, ->
          GET "/billing/orders/payouts", {}, (orders) ->
            expect(orders.length).to.equal(1)
            lineToPayout = orders[0].lineItems[0]
            expect(lineToPayout.info.paidout).to.equal(false)
            expect(lineToPayout.info.released.utc).to.exist
            summary = payoutSummary(orders)
            expect(summary.owed.count).to.equal(1)
            expect(summary.owed.total).to.equal(70)
            d = orders: _.pluck(orders,'_id')
            POST "/payouts/#{payoutmethod._id}", d, {}, (payout) ->
              expect(payout._id).to.exist
              expectIdsEqual(payout.userId, expertSession._id)
              expect(payout.total).to.equal(70)
              expect(payout.payment).to.exist
              expectIdsEqual(payout.payMethodId, payoutmethod._id)
              expect(payout.lines.length).to.equal(1)
              expect(payout.lines[0]._id).to.exist
              expectIdsEqual(payout.lines[0].order._id, orders[0]._id)
              expect(payout.lines[0].order.by.email).to.equal(customerSession.email)
              expectIdsEqual(payout.lines[0].order.lineItemId, lineToPayout._id)
              expect(payout.lines[0].total).to.equal(70)
              expect(payout.lines[0].type).to.equal('airpair')
              GET "/billing/orders/payouts", {}, (orders2) ->
                expect(orders2.length).to.equal(1)
                paidoutLine = orders2[0].lineItems[0]
                expect(paidoutLine.info.paidout).to.equal(payout._id)
                expect(paidoutLine.info.released.utc).to.exist
                summary2 = payoutSummary(orders2)
                expect(summary2.owed.count).to.equal(0)
                expect(summary2.owed.total).to.equal(0)
                expect(summary2.paid.count).to.equal(1)
                expect(summary2.paid.total).to.equal(70)
                expect(summary2.pending.count).to.equal(0)
                expect(summary2.pending.total).to.equal(0)
                POST "/payouts/#{payoutmethod._id}", d, {status:403}, (error) ->
                  expect(error.message.indexOf('Cannot payout.')).to.equal(0)
                  done()



  it 'Expert can not collect single released transaction with no paymethod', (done) ->
    SETUP.newLoggedInExpert 'abha', (expert, expertSession) ->
      SETUP.newBookedRequestWithExistingExpert 'joba', {}, expertSession, (request, booking, customerSession, expertSession) ->
        SETUP.releaseOrderAndLogExpertBackIn booking.orderId, expertSession, ->
          GET "/billing/orders/payouts", {}, (orders) ->
            d = orders: _.pluck(orders,'_id')
            fakePayoutmethodId = newId()
            POST "/payouts/#{fakePayoutmethodId}", d, {status:404}, (error) ->
              done()



  it 'Expert can not pay out single pending transaction to their verified payout account', (done) ->
    SETUP.newLoggedInExpertWithPayoutmethod 'mkod', (expert, expertSession, payoutmethod) ->
      SETUP.newBookedRequestWithExistingExpert 'peco', {}, expertSession, (request, booking, customerSession, expertSession) ->
        LOGIN expertSession.userKey, expertSession, ->
          GET "/billing/orders/payouts", {}, (orders) ->
            d = orders: _.pluck(orders,'_id')
            POST "/payouts/#{payoutmethod._id}", d, {status:403}, (error) ->
              expect(error.message.indexOf('Cannot payout. Order')).to.equal(0)
              done()


  it 'Expert can pay out combined transaction to their payout account', (done) ->
    SETUP.newLoggedInExpertWithPayoutmethod 'mper', (expert, expertSession, payoutmethod) ->
      SETUP.newBookedRequestWithExistingExpert 'hubi', {}, expertSession, (request1, booking1, customerSession1, expertSession) ->
        SETUP.newBookedRequestWithExistingExpert 'brfi', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
          SETUP.newBookedRequestWithExistingExpert 'acob', {}, expertSession, (request3, booking3, customerSession3, expertSession) ->
            LOGIN 'admin', data.users.admin, ->
              PUT "/adm/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
                PUT "/adm/billing/orders/#{booking2.orderId}/release", {}, {}, (released2) ->
                  PUT "/adm/billing/orders/#{booking3.orderId}/release", {}, {}, (released3) ->
                    LOGIN expertSession.userKey, expertSession, ->
                      GET "/billing/orders/payouts", {}, (orders) ->
                        expect(orders.length).to.equal(3)
                        summary = payoutSummary(orders)
                        expect(summary.owed.count).to.equal(3)
                        expect(summary.owed.total).to.equal(210)
                        d = orders: _.pluck(orders,'_id')
                        POST "/payouts/#{payoutmethod._id}", d, {}, (payout) ->
                          expect(payout._id).to.exist
                          expectIdsEqual(payout.userId, expertSession._id)
                          expect(payout.total).to.equal(210)
                          expect(payout.lines.length).to.equal(3)
                          done()


  it 'Expert can see payout history', (done) ->
    SETUP.newLoggedInExpertWithPayoutmethod 'dymo', (expert, expertSession, payoutmethod) ->
      SETUP.newBookedRequestWithExistingExpert 'dysn', {}, expertSession, (request1, booking1, customerSession1, expertSession) ->
        SETUP.newBookedRequestWithExistingExpert 'dily', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
          SETUP.newBookedRequestWithExistingExpert 'chuc', {}, expertSession, (request3, booking3, customerSession3, expertSession) ->
            LOGIN 'admin', data.users.admin, ->
              PUT "/adm/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
                PUT "/adm/billing/orders/#{booking2.orderId}/release", {}, {}, (released2) ->
                  PUT "/adm/billing/orders/#{booking3.orderId}/release", {}, {}, (released3) ->
                    LOGIN expertSession.userKey, expertSession, ->
                      GET "/billing/orders/payouts", {}, (orders) ->
                        d1 = orders: [orders[0]._id,orders[1]._id]
                        POST "/payouts/#{payoutmethod._id}", d1, {}, (payout1) ->
                          expect(payout1.total).to.equal(140)
                          expectIdsEqual(payout1.lines[0].order._id,orders[0]._id)
                          expectIdsEqual(payout1.lines[1].order._id,orders[1]._id)
                          d2 = orders: [orders[2]._id]
                          POST "/payouts/#{payoutmethod._id}", d2, {}, (payout2) ->
                            GET "/payouts/me", {}, (payouts) ->
                              expect(payouts.length).to.equal(2)
                              expect(payouts[0].total).to.equal(140)
                              expect(payouts[1].total).to.equal(70)
                              done()


  it.skip 'Expert can see payout history including v0 payouts', (done) ->


  # it.skip 'Expert can verify venmo account', (done) ->
  # it.skip 'Expert can pay out single transaction to their venmo account', (done) ->
  # it.skip 'Expert can verify bitcoin account', (done) ->
  # it.skip 'Expert can pay out single transaction to their bitcoin account', (done) ->
