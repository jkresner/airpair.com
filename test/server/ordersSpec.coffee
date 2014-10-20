util = require '../../shared/util'

module.exports = -> describe "Credit: ", ->

  @timeout 10000

  before (done) ->
    stubAnalytics()
    done()

  after (done) ->
    resotreAnalytics()
    done()


  it '$500 credit purchase', (done) ->
    addAndLoginLocalUser 'somr', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (pm) ->
        o = total: 500
        POST "/billing/orders/credit/#{pm._id}", o, {}, (r) ->
          threeMonth = moment(util.dateWithDayAccuracy(moment().add(3,'month'))).format('YYYY-MM-DD')
          expect(r._id).to.exist
          expect(r.lineItems.length).to.equal(1)
          expect(r.lineItems[0].info.amount).to.equal(500)
          expect(r.lineItems[0].info.expires.indexOf(threeMonth)).to.equal(0)
          expect(r.lineItems[0].info.remaining).to.equal(500)
          expect(r.total).to.equal(500)
          expect(r.profit).to.equal(0)
          done()


  # it '$3000 credit purchase with 10%', (done) ->
  #   addAndLoginLocalUser 'soik', (s) ->
  #     d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
  #     POST '/billing/paymethods', d, {}, (pm) ->
  #       POST "/billing/orders/credit/#{pm._id}", mem, {}, (r) ->
  #         expect(r._id).to.exist
  #         expect(r.lineItems.length).to.equal(2)
  #         expect(r.lineItems[0].type).to.equal('membership')
  #         expect(r.lineItems[1].type).to.equal('discount')
  #         expect(r.total).to.equal(250)
  #         expect(r.profit).to.equal(250)
  #         done()


  # it.skip 'Team members can access credit from order', (done) ->

  # it '$2000 credit purchase with 20%', (done) ->
  #   addAndLoginLocalUser 'usha', (s) ->
  #     d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
  #     POST '/billing/paymethods', d, {}, (pm) ->
  #       mem = length: 12
  #       POST "/billing/orders/membership/#{pm._id}", mem, {}, (r) ->
  #         expect(r._id).to.exist
  #         expect(r.lineItems.length).to.equal(2)
  #         expect(r.lineItems[0].type).to.equal('membership')
  #         expect(r.lineItems[1].type).to.equal('credit')
  #         expect(r.total).to.equal(500)
  #         expect(r.profit).to.equal(0)
  #         done()

