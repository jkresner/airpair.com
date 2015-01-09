
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
          $log('orders', orders[0].lineItems)
          expect(orders.length).to.equal(1)
          expect(orders[0].total).to.be.undefined
          expect(orders[0].profit).to.be.undefined
          expect(orders[0].userId).to.equal(customerSession._id)
          expect(orders[0].by.name).to.equal(customerSession.name)
          expect(orders[0].lineItems.length).to.equal(1)
          expect(orders[0].lineItems[0].type).to.equal('airpair')
          expect(orders[0].lineItems[0].info.expert._id).to.equal(booking.expertId)
          $log('inf', orders[0].lineItems[0].info)
          expect(orders[0].lineItems[0].info.paidout).to.equal(false)
          # expect(orders[0].lineItems[0].info.released).to.be.undefined
          # expect(orders[0].lineItems[0].owed).to.exist
          # expect(orders[0].lineItems[0].total).to.be.undefined
          # expect(orders[0].lineItems[0].profit).to.be.undefined
          done()


  it.skip 'Expert can see single transaction released', (done) ->


  it.skip 'Expert can see multiple transactions pending', (done) ->


  it.skip 'Expert can see multiple transactions owed', (done) ->


  it.skip 'Expert can see multiple transactions of mixed status', (done) ->



  it.skip 'Expert can verify paypal payout account', (done) ->
    # d = type: 'other', tags: [data.tags.node]
    # newCompleteRequestForAdmin 'hubr', d, (r) ->
      # msg = type: 'received', subject: "test subject", body: "test body"
      # PUT "/adm/requests/#{r._id}/message", msg, {}, (r1) ->


  it.skip 'Expert can pay out single transaction to their payout account', (done) ->
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
