util = require '../../shared/util'

module.exports = -> describe "Membership: ", ->

  @timeout 10000

  before (done) ->
    stubAnalytics()
    done()

  after (done) ->
    resotreAnalytics()
    done()


  it 'Can create 6 month membership order', (done) ->
    addAndLoginLocalUser 'evan', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (pm) ->
        mem = length: 6
        POST "/billing/orders/membership/#{pm._id}", mem, {}, (r) ->
          expect(r._id).to.exist
          expect(r.lineItems.length).to.equal(1)
          expect(r.total).to.equal(300)
          expect(r.profit).to.equal(300)
          GET '/session/full', {}, (s) ->
            sixMonth = moment(util.dateWithDayAccuracy(moment().add(6,'month'))).format('YYYY-MM-DD')
            expect( s.membership.expires.indexOf(sixMonth) ).to.equal( 0 )
            done()


  it 'Can create 6 month membership order with coupon', (done) ->
    addAndLoginLocalUser 'ahas', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (pm) ->
        mem = length: 6, coupon: 'bestpair'
        POST "/billing/orders/membership/#{pm._id}", mem, {}, (r) ->
          expect(r._id).to.exist
          expect(r.lineItems.length).to.equal(2)
          expect(r.lineItems[0].type).to.equal('membership')
          expect(r.lineItems[1].type).to.equal('discount')
          expect(r.total).to.equal(250)
          expect(r.profit).to.equal(250)
          done()


  it 'Can create 12 month membership order', (done) ->
    addAndLoginLocalUser 'usha', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (pm) ->
        mem = length: 12
        POST "/billing/orders/membership/#{pm._id}", mem, {}, (r) ->
          expect(r._id).to.exist
          expect(r.lineItems.length).to.equal(2)
          expect(r.lineItems[0].type).to.equal('membership')
          expect(r.lineItems[1].type).to.equal('credit')
          expect(r.total).to.equal(500)
          # expect(r.profit).to.equal(0)
          done()


  it 'Can create 12 month membership order with coupon', (done) ->
    addAndLoginLocalUser 'uris', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (pm) ->
        mem = length: 12, coupon: 'bestpair'
        POST "/billing/orders/membership/#{pm._id}", mem, {}, (r) ->
          expect(r._id).to.exist
          expect(r.lineItems.length).to.equal(3)
          expect(r.lineItems[0].type).to.equal('membership')
          expect(r.lineItems[1].type).to.equal('credit')
          expect(r.lineItems[2].type).to.equal('discount')
          expect(r.total).to.equal(450)
          expect(r.profit).to.equal(-50)
          done()


  it.skip 'Can create stripe membership order', (done) ->


  # it.skip 'Empty result for orderHistory on new user', (done) ->
    # opts = status: 401, unauthenticated: true
    # GET('/tags/angularjs', opts, -> done() )
