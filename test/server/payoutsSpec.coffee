{expertPayoutSummary} = require('../../shared/orders')

module.exports = -> describe "API: ", ->

  @timeout 40000

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initExperts done

  after ->
    SETUP.analytics.restore()

  beforeEach ->
    SETUP.clearIdentity()


  it 'New expert sees empty orders list to be paid out', (done) ->
    SETUP.newLoggedInExpert 'tmot', (expert, expertSession) ->
      GET "/billing/orders/payouts/#{expert._id}", {}, (orders) ->
        expect(orders.length).to.equal(0)
        done()


  it 'Non expert gets 403 on orders to payout', (done) ->
    SETUP.addLocalUser 'bfie', {}, (s) ->
      GET "/billing/orders/payouts/#{data.experts.tmot._id}", { status: 401 }, (orders) ->
        done()


  it 'Booked expert can see single transaction pending', (done) ->
    SETUP.newBookedRequest 'rusc', {}, 'admb', (request, booking, customerSession, expertSession) ->
      LOGIN expertSession.userKey, expertSession, ->
        GET "/billing/orders/payouts/#{booking.expertId}", {}, (orders) ->
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
          summary = expertPayoutSummary(orders)
          expect(summary.owed.count).to.equal(0)
          expect(summary.owed.total).to.equal(0)
          expect(summary.paid.count).to.equal(0)
          expect(summary.paid.total).to.equal(0)
          expect(summary.pending.count).to.equal(1)
          expect(summary.pending.total).to.equal(70)
          done()


  it 'Expert can see multiple transactions pending', (done) ->
    SETUP.newBookedRequest 'rusc', {}, 'admb', (request1, booking1, customerSession1, expertSession) ->
      SETUP.newBookedRequestWithExistingExpert 'brfi', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
        LOGIN expertSession.userKey, expertSession, ->
          GET "/billing/orders/payouts/#{expertSession.expertId}", {}, (orders) ->
            expect(orders.length).to.equal(2)
            summary = expertPayoutSummary(orders)
            expect(summary.owed.count).to.equal(0)
            expect(summary.owed.total).to.equal(0)
            expect(summary.paid.count).to.equal(0)
            expect(summary.paid.total).to.equal(0)
            expect(summary.pending.count).to.equal(2)
            expect(summary.pending.total).to.equal(140)
            done()


  it 'Expert can see single transaction released', (done) ->
    SETUP.newBookedRequest 'rusc', {}, 'admb', (request, booking, customerSession, expertSession) ->
      LOGIN 'admin', data.users.admin, ->
        PUT "/adm/billing/orders/#{booking.orderId}/release", {}, {}, (released) ->
          expect(released.lineItems.length).to.equal(2)
          expect(released.lineItems[1].info.paidout).to.equal(false)
          expect(released.lineItems[1].info.released).to.exist
          expect(released.lineItems[1].info.released.by).to.exist
          expect(released.lineItems[1].info.released.action).to.equal('release')
          LOGIN expertSession.userKey, expertSession, ->
            GET "/billing/orders/payouts/#{booking.expertId}", {}, (orders) ->
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
              summary = expertPayoutSummary(orders)
              expect(summary.owed.count).to.equal(1)
              expect(summary.owed.total).to.equal(70)
              expect(summary.paid.count).to.equal(0)
              expect(summary.paid.total).to.equal(0)
              expect(summary.pending.count).to.equal(0)
              expect(summary.pending.total).to.equal(0)
              done()


  it 'Expert can see multiple transactions owed', (done) ->
    SETUP.newBookedRequest 'rusc', {}, 'admb', (request1, booking1, customerSession1, expertSession) ->
      SETUP.newBookedRequestWithExistingExpert 'brfi', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
        LOGIN 'admin', data.users.admin, ->
          PUT "/adm/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
            PUT "/adm/billing/orders/#{booking2.orderId}/release", {}, {}, (released2) ->
              LOGIN expertSession.userKey, expertSession, ->
                GET "/billing/orders/payouts/#{expertSession.expertId}", {}, (orders) ->
                  expect(orders.length).to.equal(2)
                  summary = expertPayoutSummary(orders)
                  expect(summary.owed.count).to.equal(2)
                  expect(summary.owed.total).to.equal(140)
                  expect(summary.paid.count).to.equal(0)
                  expect(summary.paid.total).to.equal(0)
                  expect(summary.pending.count).to.equal(0)
                  expect(summary.pending.total).to.equal(0)
                  done()



  it 'Expert can see multiple transactions of mixed status', (done) ->
    SETUP.newBookedRequest 'rusc', {}, 'admb', (request1, booking1, customerSession1, expertSession) ->
      SETUP.newBookedRequestWithExistingExpert 'brfi', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
        SETUP.newBookedRequestWithExistingExpert 'brif', {}, expertSession, (request3, booking3, customerSession3, expertSession) ->
          LOGIN 'admin', data.users.admin, ->
            PUT "/adm/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
              # PUT "/adm/billing/orders/#{booking2.orderId}/release", {}, {}, (released2) ->
                LOGIN expertSession.userKey, expertSession, ->
                  GET "/billing/orders/payouts/#{expertSession.expertId}", {}, (orders) ->
                    expect(orders.length).to.equal(3)
                    summary = expertPayoutSummary(orders)
                    expect(summary.owed.count).to.equal(1)
                    expect(summary.owed.total).to.equal(70)
                    expect(summary.paid.count).to.equal(0)
                    expect(summary.paid.total).to.equal(0)
                    expect(summary.pending.count).to.equal(2)
                    expect(summary.pending.total).to.equal(140)
                    done()



  it 'Expert can verify paypal payout account', (done) ->
    # d = type: 'other', tags: [data.tags.node]
    # newCompleteRequestForAdmin 'hubr', d, (r) ->
      # msg = type: 'received', subject: "test subject", body: "test body"
      # PUT "/adm/requests/#{r._id}/message", msg, {}, (r1) ->


  it.skip 'Expert can pay out single released transaction to their verified payout account', (done) ->

  it.skip 'Expert can not pay out single released transaction with no paymethod', (done) ->

  it.skip 'Expert can not pay out single pending transaction to their verified payout account', (done) ->
    # d = type: 'other', tags: [data.tags.node]
    # newCompleteRequestForAdmin 'hubr', d, (r) ->
      # msg = type: 'received', subject: "test subject", body: "test body"
      # PUT "/adm/requests/#{r._id}/message", msg, {}, (r1) ->


  it.skip 'Expert can pay out combined transaction to their payout account', (done) ->



  it.skip 'Expert can verify venmo account', (done) ->


  it.skip 'Expert can pay out single transaction to their venmo account', (done) ->



  it.skip 'Expert can verify bitcoin account', (done) ->


  it.skip 'Expert can pay out single transaction to their bitcoin account', (done) ->


  it.skip 'Expert can see payout history', (done) ->


  it.skip 'Expert can see payout history including v0 payouts', (done) ->
