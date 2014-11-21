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
    addAndLoginLocalUserWithPayMethod 'somr', (s) ->
      o = total: 500
      POST "/billing/orders/credit/#{s.primaryPayMethodId}", o, {}, (r) ->
        threeMonth = moment(util.dateWithDayAccuracy(moment().add(3,'month'))).format('YYYY-MM-DD')
        expect(r._id).to.exist
        expect(r.lineItems.length).to.equal(1)
        expect(r.lineItems[0].info.amount).to.equal(500)
        expect(r.lineItems[0].info.expires.indexOf(threeMonth)).to.equal(0)
        expect(r.lineItems[0].info.remaining).to.equal(500)
        expect(r.total).to.equal(500)
        expect(r.profit).to.equal(0)
        done()


  it.skip '$500 credit purchase with stripe', (done) ->


  it '$3000 credit purchase with 10% extra', (done) ->
    addAndLoginLocalUserWithPayMethod 'soik', (s) ->
      o = total: 3000
      POST "/billing/orders/credit/#{s.primaryPayMethodId}", o, {}, (r) ->
        expect(r._id).to.exist
        expect(r.lineItems.length).to.equal(2)
        expect(r.lineItems[0].type).to.equal('credit')
        expect(r.lineItems[1].type).to.equal('credit')
        expect(r.total).to.equal(3000)
        expect(r.profit).to.equal(-300)
        done()


  it '$5000 credit purchase with 20% extra and coupon discount', (done) ->
    addAndLoginLocalUserWithPayMethod 'kelf', (s) ->
      o = total: 5000, coupon: 'letspair'
      POST "/billing/orders/credit/#{s.primaryPayMethodId}", o, {}, (r) ->
        expect(r._id).to.exist
        expect(r.lineItems.length).to.equal(3)
        expect(r.lineItems[0].type).to.equal('credit')
        expect(r.lineItems[1].type).to.equal('credit')
        expect(r.lineItems[2].type).to.equal('discount')
        expect(r.total).to.equal(4900)
        expect(r.profit).to.equal(-1100)
        done()


  it.skip 'Signup with offer created credit order', (done) ->


  it.skip 'GetMyOrdersWithCredit returns only orders with Credit', (done) ->


  it.skip 'Can expire credit', (done) ->


