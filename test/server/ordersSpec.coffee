util = require '../../shared/util'
OrdersUtil = require '../../shared/orders'

module.exports = -> describe "Credit: ".subspec, ->

  @timeout 10000

  it '300 credit purchase', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'somr', (s) ->
      o = total: 300, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, {}, (r) ->
        expect(r._id).to.exist
        expect(_.idsEqual(r.userId, s._id)).to.be.true
        expect(_.idsEqual(r.by._id, s._id)).to.be.true
        expect(r.lineItems.length).to.equal(1)
        expect(r.lineItems[0].type).to.equal('credit')
        expect(r.lineItems[0].unitPrice).to.equal(300)
        expect(r.lineItems[0].qty).to.equal(1)
        expect(r.lineItems[0].total).to.equal(300)
        expect(r.lineItems[0].profit).to.equal(0)
        expect(r.lineItems[0].balance).to.equal(300)
        expect(r.lineItems[0].info.remaining).to.equal(300)
        expect(r.lineItems[0].info.name).to.equal('$300 Credit')
        expect(r.lineItems[0].info.source).to.equal('$300 Credit Purchase')
        expect(r.total).to.equal(300)
        expect(r.profit).to.equal(0)
        DONE()


  it '500 credit purchase', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'sora', (s) ->
      o = total: 500, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, {}, (r) ->
        expect(r._id).to.exist
        expect(_.idsEqual(r.userId, s._id)).to.be.true
        expect(_.idsEqual(r.by._id, s._id)).to.be.true
        expect(r.lineItems.length).to.equal(1)
        expect(r.lineItems[0].type).to.equal('credit')
        expect(r.lineItems[0].unitPrice).to.equal(500)
        expect(r.lineItems[0].qty).to.equal(1)
        expect(r.lineItems[0].total).to.equal(500)
        expect(r.lineItems[0].profit).to.equal(0)
        expect(r.lineItems[0].balance).to.equal(500)
        # Seems not working from Australia hah
        # threeMonth = moment(util.dateWithDayAccuracy(moment().utc().add(3,'month'))).format('YYYY-MM-DD')
        # $log('r.lineItems[0].info.expires', r.lineItems[0].info.expires, threeMonth)
        # expect(r.lineItems[0].info.expires.indexOf(threeMonth)).to.equal(0)
        expect(r.lineItems[0].info.remaining).to.equal(500)
        expect(r.lineItems[0].info.name).to.equal('$500 Credit')
        expect(r.lineItems[0].info.source).to.equal('$500 Credit Purchase')
        expect(r.total).to.equal(500)
        expect(r.profit).to.equal(0)
        DONE()


  it '500 credit purchase with stripe'


  it '1000 credit purchase with 5% extra', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'soik', (s) ->
      o = total: 1000, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, {}, (r) ->
        expect(r._id).to.exist
        expect(r.lineItems.length).to.equal(2)
        expect(r.lineItems[0].type).to.equal('credit')
        expect(r.lineItems[0].info.name).to.equal('$1000 Credit')
        expect(r.lineItems[0].info.source).to.equal('$1000 Credit Purchase')
        expect(r.lineItems[1].type).to.equal('credit')
        expect(r.lineItems[1].info.name).to.equal('$50 Credit')
        expect(r.lineItems[1].info.source).to.equal('Credit Bonus (5% on $1000)')
        expect(r.total).to.equal(1000)
        expect(r.profit).to.equal(0)
        DONE()


  it '3000 credit purchase with declined card'


  it '5000 credit purchase with 20% extra and coupon discount', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'kelf', (s) ->
      o = total: 5000, payMethodId: s.primaryPayMethodId, coupon: 'letspair'
      POST "/billing/orders/credit", o, {}, (r) ->
        # threeMonth = moment(util.dateWithDayAccuracy(moment().add(3,'month'))).format('YYYY-MM-DD')
        expect(r._id).to.exist
        expect(r.lineItems.length).to.equal(3)
        expect(r.lineItems[0].type).to.equal('credit')
        expect(r.lineItems[0].unitPrice).to.equal(5000)
        expect(r.lineItems[0].qty).to.equal(1)
        expect(r.lineItems[0].total).to.equal(5000)
        expect(r.lineItems[0].profit).to.equal(0)
        expect(r.lineItems[0].balance).to.equal(5000)
        # expect(r.lineItems[0].info.expires.indexOf(threeMonth)).to.equal(0)
        expect(r.lineItems[0].info.remaining).to.equal(5000)
        expect(r.lineItems[0].info.name).to.equal('$5000 Credit')
        expect(r.lineItems[0].info.source).to.equal('$5000 Credit Purchase')
        expect(r.lineItems[1].type).to.equal('credit')
        expect(r.lineItems[1].unitPrice).to.equal(0)
        expect(r.lineItems[1].qty).to.equal(1)
        expect(r.lineItems[1].total).to.equal(0)
        expect(r.lineItems[1].profit).to.equal(0)
        expect(r.lineItems[1].balance).to.equal(1000)
        # expect(r.lineItems[1].info.expires.indexOf(threeMonth)).to.equal(0)
        expect(r.lineItems[1].info.remaining).to.equal(1000)
        expect(r.lineItems[1].info.name).to.equal('$1000 Credit')
        expect(r.lineItems[1].info.source).to.equal('Credit Bonus (20% on $5000)')
        expect(r.lineItems[2].type).to.equal('discount')
        expect(r.total).to.equal(4900)
        expect(r.profit).to.equal(-100)
        DONE()


  it 'Admin can give unpaid credit', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'chup', (schup) ->
      LOGIN 'admin', (sadm) ->
        o = total: 50, toUser: schup, source: 'Angular Workshops Survey Promo'
        POST "/adm/billing/orders/credit", o, {}, (r) ->
          expect(r._id).to.exist
          expect(_.idsEqual(r.userId, schup._id)).to.be.true
          expect(_.idsEqual(r.by._id, sadm._id)).to.be.true
          expect(r.lineItems.length).to.equal(1)
          expect(r.lineItems[0].type).to.equal('credit')
          expect(r.lineItems[0].unitPrice).to.equal(0)
          expect(r.lineItems[0].qty).to.equal(1)
          expect(r.lineItems[0].total).to.equal(0)
          expect(r.lineItems[0].profit).to.equal(0)
          expect(r.lineItems[0].balance).to.equal(50)
          expect(r.lineItems[0].info.name).to.equal('$50 Credit')
          expect(r.lineItems[0].info.remaining).to.equal(50)
          expect(r.lineItems[0].info.source).to.equal('Angular Workshops Survey Promo from Admin Daemon')
          expect(r.total).to.equal(0)
          expect(r.profit).to.equal(0)
          DONE()


  it 'Non-admin can not give unpaid credit', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'chiu', (schiu) ->
      o = total: 50, toUserId: schiu._id, source: 'Angular Workshops Survey Promo'
      POST "/adm/billing/orders/credit", o, { status: 403 }, ->
        DONE()


  it 'GetMyOrdersWithCredit returns only orders with Credit', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'mcas', (mcas) ->
      map = (o) ->
        o.userId = require('mongoose').Types.ObjectId(mcas._id)
        o
      v0Orders = _.map(data.v0.orders.jkHist, map)
      db.ensureDocs 'Order', v0Orders, (e,r) ->
        o = total: 1000, payMethodId: mcas.primaryPayMethodId
        POST "/billing/orders/credit", o, {}, (credit) ->
          expect(credit._id).to.exist
          GET "/billing/orders/credit/#{mcas.primaryPayMethodId}", {}, (orders) ->
            expect(orders.length).to.equal(1)
            linesWithCredit = OrdersUtil.linesWithCredit(orders)
            expect(linesWithCredit.length).to.equal(2)
            expect(OrdersUtil.getAvailableCredit(linesWithCredit)).to.equal(1050)
            DONE()


  it 'Signup with offer created credit order'


  it 'Can expire credit'


