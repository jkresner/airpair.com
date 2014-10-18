module.exports = -> describe "API: ", ->

  before (done) ->
    stubAnalytics()
    done()

  after (done) ->
    resotreAnalytics()
    done()


  it 'Can create membership order', (done) ->
    addAndLoginLocalUser 'evan', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (pm) ->
        li1 = type: 'membership', total: 300, unitPrice: 300, qty: 1, info:
          name: '6 month membership', expires: moment().add(6,'month')
        li2 = type: 'credit', total: -300, unitPrice: -300, qty: 1, info:
          name: '$300 credit promotion', redeemed: 0
        o = type: 'membership', total: 300, paymethodId: pm._id, lineItems: [li1, li2]
        POST "/billing/orders/#{pm._id}", o, {}, (r) ->
          expect(r._id).to.exist
          expect(r.total).to.equal(300)
          expect(r.profit).to.equal(0)


  it.skip 'Can create stripe membership order', (done) ->


  it.skip 'Gets $5 off order if member', (done) ->



  it.skip 'Can redeem membership credit', (done) ->



  # it.skip 'Empty result for orderHistory on new user', (done) ->
    # opts = status: 401, unauthenticated: true
    # GET('/tags/angularjs', opts, -> done() )
