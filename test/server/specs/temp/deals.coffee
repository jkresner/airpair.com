ordersUtil = require '../../shared/orders'

orderDeals = ->

  before (done) ->
    SETUP.initExperts done

  beforeEach ->
    @braintreepaymentStub = SETUP.stubBraintreeChargeWithMethod()

  afterEach ->
    @braintreepaymentStub.restore()

  it 'Can get expert by dealId or code', itDone ->
    code = "codealn#{timeSeed()}"
    SETUP.createNewExpert 'tmot', {}, (sExp, expert) ->
      deal = { price: 100, code, minutes: 300, type: 'airpair', target: { type: 'all' }, tag: data.tags.angular }
      POST "/experts/#{expert._id}/deal", deal, {}, (e2) ->
        expect(e2.deals.length).to.equal(1)
        dealId = e2.deals[0]._id
        SETUP.addAndLoginLocalUserWithPayMethod 'del1', (s) ->
          GET "/experts/deal/#{dealId}", {}, (e3) ->
            expect(e3.deals.length).to.equal(1)
            EXPECT.equalIds(dealId,e3.deals[0]._id)
            EXPECT.equalIds(expert._id, e3._id)
            GET "/experts/deal/#{code}", {}, (e4) ->
              expect(e4.deals.length).to.equal(1)
              EXPECT.equalIds(dealId,e4.deals[0]._id)
              EXPECT.equalIds(expert._id, e4._id)
              DONE()


  it 'Can get deal order for expert booking', itDone ->
    SETUP.createNewExpert 'admb', {}, (sExp, expert) ->
      deal = { price: 100, minutes: 300, type: 'airpair', target: { type: 'all' } }
      POST "/experts/#{expert._id}/deal", deal, {}, (e2) ->
        SETUP.addAndLoginLocalUserWhoCanMakeBooking 'del5', (s) ->
          b = dealId: e2.deals[0]._id, payMethodId: s.primaryPayMethodId
          POST "/billing/orders/deal/#{expert._id}", b, {}, (order) ->
            GET "/billing/orders/expert/#{expert._id}", {}, (orders) ->
              expect(orders.length).to.equal(1)
              DONE()

            # expect(e4.deals.length).to.equal(1)
            # EXPECT.equalIds(dealId,e4.deals[0]._id)
            # EXPECT.equalIds(expert._id, e4._id)



  it.skip 'Can not get expert by dealId if not belonging to target type', itDone ->

  it.skip 'Can get expert by expired dealId but not purchase deal', itDone ->


  it 'Can purchase 5 hour bulk deal available to all and redeem with bookings', itDone ->
    SETUP.createNewExpert 'louf', {}, (sExp, expert) ->
      deal = price: 150, minutes: 300, type: 'airpair', target: { type: 'all' }, tag: data.tags.angular
      POST "/experts/#{expert._id}/deal", deal, {}, (e2) ->
        SETUP.addAndLoginLocalUserWhoCanMakeBooking 'del3', (s) ->
          GET "/experts/#{expert._id}", {}, (expertToBook) ->
            expect(expertToBook.deals.length).to.equal(1)
            b = dealId: expertToBook.deals[0]._id, payMethodId: s.primaryPayMethodId
            POST "/billing/orders/deal/#{expert._id}", b, {}, (order) ->
              expect(order._id).to.exist
              airpair1 = dealId: b.dealId, datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
              POST "/bookings/#{expert._id}", airpair1, {}, (booking1) ->
                expect(booking1._id).to.exist
                expect(booking1.orderId).to.exist
                EXPECT.equalIds(booking1.expertId, expert._id)
                EXPECT.equalIds(booking1.customerId, s._id)
                expect(booking1.type).to.equal('private')
                expect(booking1.minutes).to.equal(120)
                expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
                expect(booking1.status).to.equal('pending')
                GET "/billing/orders", {}, (orders1) ->
                  expect(orders1.length).to.equal(2)
                  dealOrder = orders1[1]
                  redeemOrder = orders1[0]
                  expect(dealOrder.total).to.equal(deal.price)
                  expect(dealOrder.profit).to.equal(0)
                  expect(dealOrder.lines.length).to.equal(1)
                  expect(dealOrder.payment.type).to.equal('braintree')
                  expect(dealOrder.payment.status).to.equal('submitted_for_settlement')
                  expect(dealOrder.lines[0].type).to.equal('deal')
                  expect(dealOrder.lines[0].total).to.equal(150)
                  expect(dealOrder.lines[0].qty).to.equal(1)
                  expect(dealOrder.lines[0].unitPrice).to.equal(150)
                  expect(dealOrder.lines[0].balance).to.equal(0)
                  expect(dealOrder.lines[0].info.remaining).to.equal(180)
                  expect(dealOrder.lines[0].info.redeemedLines.length).to.equal(1)
                  EXPECT.equalIds(dealOrder.lines[0].info.expert._id,expert._id)
                  EXPECT.equalIds(dealOrder.lines[0].info.deal._id,b.dealId)

                  expect(_.idsEqual(redeemOrder._id,booking1.orderId)).to.be.true
                  expect(redeemOrder.payment.type).to.equal('$0 order')
                  redeemedLineId = redeemOrder.lines[0]._id
                  expect(_.idsEqual(redeemedLineId, dealOrder.lines[0].info.redeemedLines[0].lineItemId)).to.be.true

                  expect(redeemOrder.total).to.equal(0)
                  expect(redeemOrder.profit).to.equal(6)
                  expect(redeemOrder.lines.length).to.equal(2)
                  expect(redeemOrder.lines[0].type).to.equal('redeemeddealtime')
                  expect(redeemOrder.lines[0].total).to.equal(-60)
                  expect(redeemOrder.lines[0].unitPrice).to.equal(-30)
                  expect(redeemOrder.lines[0].qty).to.equal(2)
                  expect(redeemOrder.lines[0].balance).to.equal(0)
                  EXPECT.equalIds(redeemOrder.lines[1].bookingId._id,booking1._id)
                  # EXPECT.equalIds(redeemOrder.lines[1].bookingId,booking1._id)
                  expect(redeemOrder.lines[1].type).to.equal('airpair')
                  expect(redeemOrder.lines[1]._id).to.exist
                  expect(redeemOrder.lines[1].total).to.equal(60)
                  expect(redeemOrder.lines[1].qty).to.equal(2)
                  expect(redeemOrder.lines[1].unitPrice).to.equal(30)
                  expect(redeemOrder.lines[1].balance).to.equal(0)
                  expect(redeemOrder.lines[1].profit).to.equal(6)
                  expect(redeemOrder.lines[1].info.expert.name).to.equal("Lou Franco")
                  expect(redeemOrder.lines[1].info.type).to.equal('private')
                  expect(redeemOrder.lines[1].info.paidout).to.equal(false)

                  lines1 = ordersUtil.linesWithMinutesRemaining(orders1)
                  availableMinutes1 = ordersUtil.getAvailableMinutesRemaining(lines1)
                  expect(lines1.length).to.equal(1)
                  expect(availableMinutes1).to.equal(180)
                  airpair2 = dealId: b.dealId, datetime: moment().add(3, 'day'), minutes: 60, type: 'opensource', payMethodId: s.primaryPayMethodId
                  POST "/bookings/#{expert._id}", airpair2, {}, (booking2) ->
                    expect(booking2._id).to.exist
                    expect(booking2.minutes).to.equal(60)
                    expect(booking2.type).to.equal('opensource')
                    GET "/billing/orders", {}, (orders2) ->
                      expect(orders2.length).to.equal(3)
                      expect(orders2[1].total).to.equal(0)
                      expect(orders2[1].payment.type).to.equal('$0 order')
                      lines2 = ordersUtil.linesWithMinutesRemaining(orders2)
                      expect(lines2.length).to.equal(1)
                      availableMinutes2 = ordersUtil.getAvailableCredit(lines2)
                      expect(availableMinutes2).to.equal(120)
                      airpair3 = dealId: b.dealId, datetime: moment().add(4, 'day'), minutes: 180, type: 'private', payMethodId: s.primaryPayMethodId
                      POST "/bookings/#{expert._id}", airpair3, { status: 400 }, (err) ->
                        EXPECT.startsWith(err.message,'Not enough remaining minutes.')
                        db.readDoc 'Order', dealOrder._id, (orderDB) ->
                          expect(orderDB.payMethod).to.be.undefined
                          DONE()



  it 'Cant see or purchase deal targeted to another user'

  it 'Cant purchase deal targeted to code without knowing code'

  it 'Cant purchase expired deal' #, itDone ->
    # SETUP.addAndLoginLocalUserWithPayMethod 'del4', (s) ->
    #   expect(false).to.be.true


  it 'Can use deal with decimal rate and 90 and 120 min increments', itDone ->
    db.ensureDoc 'User', data.users.josh, (e1, u) ->
      db.ensureDoc 'Order', data.orders.deal90mindec, (e2, o) ->
        LOGIN 'josh', (sJosh) ->
          dealId = o.lines[0].info.deal._id
          dB1 = { dealId, datetime: moment().add(3, 'hour'), minutes: 120, type: 'offline', payMethodId: sJosh.primaryPayMethodId }
          POST "/bookings/#{data.experts.snug._id}", dB1, {}, (b1) ->
            db.readDoc 'Order', b1.orderId, (o2) ->
              expect(o2.total).to.equal(0)
              expect(o2.profit).to.equal(40)
              expect(o2.lines.length).to.equal(2)
              expect(o2.lines[0].type).to.equal('redeemeddealtime')
              expect(o2.lines[0].unitPrice).to.equal(-111.11)
              expect(o2.lines[0].total).to.equal(-222.22)
              expect(o2.lines[0].profit).to.equal(0)
              expect(o2.lines[1].type).to.equal('airpair')
              expect(o2.lines[1].unitPrice).to.equal(111.11)
              expect(o2.lines[1].total).to.equal(222.22)
              expect(o2.lines[1].qty).to.equal(2)
              # expect(o2.lines[1].profit).to.equal(222.22*0.18)
              # expect(o2.lines[1].profit).to.equal(o.total)
              expect(o2.lines[1].profit).to.equal(40)
              dB2 = { dealId, datetime: moment().add(4, 'hour'), minutes: 90, type: 'opensource', payMethodId: sJosh.primaryPayMethodId }
              POST "/bookings/#{data.experts.snug._id}", dB2, {}, (b2) ->
                db.readDoc 'Order', b2.orderId, (o2) ->
                  expect(o2.total).to.equal(0)
                  expect(o2.profit).to.equal(30)
                  expect(o2.lines.length).to.equal(2)
                  expect(o2.lines[0].type).to.equal('redeemeddealtime')
                  expect(o2.lines[0].unitPrice).to.equal(-111.11)
                  expect(o2.lines[0].total).to.equal(-166.67)
                  expect(o2.lines[0].profit).to.equal(0)
                  expect(o2.lines[1].type).to.equal('airpair')
                  expect(o2.lines[1].unitPrice).to.equal(111.11)
                  expect(o2.lines[1].total).to.equal(166.67)
                  expect(o2.lines[1].qty).to.equal(1.50)
                  DONE()


module.exports = ->

  describe "Deals: ".subspec, orderDeals
