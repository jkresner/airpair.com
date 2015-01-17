util = require '../../shared/util'
ordersUtil = require '../../shared/orders'


module.exports = -> describe "Booking: ", ->

  @timeout 5000

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initExperts done

  after ->
    SETUP.analytics.restore()

  beforeEach ->
    SETUP.clearIdentity()


  it 'Book 2 hour with pay as you go private', (done) ->
    addAndLoginLocalUserWithPayMethod 'jpie', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
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
          expect(order.lineItems.length).to.equal(2)
          expect(order.lineItems[0].type).to.equal('payg')
          expect(order.lineItems[0].total).to.equal(0)
          expect(order.lineItems[0].unitPrice).to.equal(280)
          expect(order.lineItems[0].qty).to.equal(0)
          expect(order.lineItems[0].info.name).to.equal('$280 Paid')
          expect(order.lineItems[1].type).to.equal('airpair')
          expect(order.lineItems[1].total).to.equal(280)
          expect(order.lineItems[1].qty).to.equal(2)
          expect(order.lineItems[1].unitPrice).to.equal(140)
          expect(order.lineItems[1].info.paidout).to.equal(false)
          expect(order.lineItems[1].info.type).to.equal('private')
          expect(_.idsEqual(order.lineItems[1].info.expert._id, data.experts.dros._id)).to.be.true
          expect(order.total).to.equal(280)
          expect(order.profit).to.equal(60)
          done()



  it 'Book 2 hour with pay as you go opensource', (done) ->
    addAndLoginLocalUserWithPayMethod 'crus', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'opensource', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        GET "/billing/orders", {}, (orders) ->
          order = _.find(orders, (o) -> _.idsEqual(o._id,booking1.orderId))
          expect(order.lineItems.length).to.equal(2)
          expect(order.lineItems[0].type).to.equal('payg')
          expect(order.lineItems[0].total).to.equal(0)
          expect(order.lineItems[0].unitPrice).to.equal(260)
          expect(order.lineItems[0].qty).to.equal(0)
          expect(order.lineItems[0].info.name).to.equal('$260 Paid')
          expect(order.lineItems[1].type).to.equal('airpair')
          expect(order.lineItems[1].total).to.equal(260)
          expect(order.lineItems[1].qty).to.equal(2)
          expect(order.lineItems[1].unitPrice).to.equal(130)
          expect(order.lineItems[1].info.paidout).to.equal(false)
          expect(order.lineItems[1].info.type).to.equal('opensource')
          expect(order.total).to.equal(260)
          expect(order.profit).to.equal(40)
          done()



  it 'Book 3 hour at 150 from 500 credit', (done) ->
    addAndLoginLocalUserWithPayMethod 'ckni', (s) ->
      o = total: 500, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, {}, (r) ->
        airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'opensource', credit: 500, payMethodId: s.primaryPayMethodId
        POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
          expect(booking1._id).to.exist
          expect(booking1.minutes).to.equal(120)
          expect(booking1.orderId).to.exist
          expect(booking1.type).to.equal('opensource')
          GET "/billing/orders", {}, (orders1) ->
            expect(orders1.length).to.equal(2)
            creditOrder = orders1[1]
            redeemOrder = orders1[0]
            expect(creditOrder.total).to.equal(500)
            expect(creditOrder.lineItems.length).to.equal(1)
            expect(creditOrder.payment.type).to.equal('braintree')
            expect(creditOrder.payment.status).to.equal('submitted_for_settlement')
            expect(creditOrder.lineItems[0].type).to.equal('credit')
            expect(creditOrder.lineItems[0].total).to.equal(500)
            expect(creditOrder.lineItems[0].qty).to.equal(1)
            expect(creditOrder.lineItems[0].unitPrice).to.equal(500)
            expect(creditOrder.lineItems[0].balance).to.equal(500)
            expect(creditOrder.lineItems[0].info.remaining).to.equal(240)
            expect(creditOrder.lineItems[0].info.redeemedLines.length).to.equal(1)

            expect(_.idsEqual(redeemOrder._id,booking1.orderId)).to.be.true
            expect(redeemOrder.payment.type).to.equal('$0 order')
            redeemedLineId = redeemOrder.lineItems[0]._id
            expect(_.idsEqual(redeemedLineId, creditOrder.lineItems[0].info.redeemedLines[0].lineItemId)).to.be.true

            expect(redeemOrder.total).to.equal(0)
            expect(redeemOrder.profit).to.equal(40)
            expect(redeemOrder.lineItems.length).to.equal(2)
            expect(redeemOrder.lineItems[0].type).to.equal('redeemedcredit')
            expect(redeemOrder.lineItems[0].total).to.equal(-260)
            expect(redeemOrder.lineItems[0].unitPrice).to.equal(-260)
            expect(redeemOrder.lineItems[0].qty).to.equal(1)
            expect(redeemOrder.lineItems[0].balance).to.equal(-260)
            expect(redeemOrder.lineItems[1].type).to.equal('airpair')
            expect(redeemOrder.lineItems[1]._id).to.exist
            expect(redeemOrder.lineItems[1].total).to.equal(260)
            expect(redeemOrder.lineItems[1].qty).to.equal(2)
            expect(redeemOrder.lineItems[1].unitPrice).to.equal(130)
            expect(redeemOrder.lineItems[1].balance).to.equal(0)
            expect(redeemOrder.lineItems[1].profit).to.equal(40)
            expect(redeemOrder.lineItems[1].info.expert.name).to.equal("Daniel Roseman")
            expect(redeemOrder.lineItems[1].info.type).to.equal('opensource')

            lines1 = ordersUtil.linesWithCredit(orders1)
            availableCredit1 = ordersUtil.getAvailableCredit(lines1)
            expect(lines1.length).to.equal(1)
            expect(availableCredit1).to.equal(240)
            airpair2 = time: moment().add(3, 'day'), minutes: 60, type: 'private', credit: 240, payMethodId: s.primaryPayMethodId
            POST "/bookings/#{data.experts.dros._id}", airpair2, {}, (booking2) ->
              expect(booking2._id).to.exist
              expect(booking2.minutes).to.equal(60)
              expect(booking2.type).to.equal('private')
              GET "/billing/orders", {}, (orders2) ->
                expect(orders2.length).to.equal(3)
                expect(orders2[1].total).to.equal(0)
                expect(orders2[1].payment.type).to.equal('$0 order')
                lines2 = ordersUtil.linesWithCredit(orders2)
                expect(lines2.length).to.equal(1)
                availableCredit2 = ordersUtil.getAvailableCredit(lines2)
                expect(availableCredit2).to.equal(100)
                airpair3 = time: moment().add(4, 'day'), minutes: 60, type: 'private', credit: 200, payMethodId: s.primaryPayMethodId
                POST "/bookings/#{data.experts.dros._id}", airpair3, { status: 400 }, (err) ->
                  expect(err.message.indexOf('ExpectedCredit $200')).to.equal(0)
                  done()


  it 'Fail to Book 1 hour at 150 with no credit or payMethodId', (done) ->
    addAndLoginLocalUserWithPayMethod 'jasp', (s) ->
      airpair = time: moment().add(1, 'day'), minutes: 60, type: 'private', credit: 150, payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair, { status: 400 }, (err, resp) ->
        expect(err.message.indexOf('ExpectedCredit $150')).to.equal(0)
        done()


  it 'Book 90 mins at 270 from 50 credit and 220 payg', (done) ->
    addAndLoginLocalUserWithPayMethod 'ajac', (s) ->
      LOGIN 'admin', data.users.admin, (sadm) ->
        oCred = total: 50, toUser: s, source: 'Test'
        POST "/adm/billing/orders/credit", oCred, {}, (r) ->
          LOGIN 'ajac', s, (sajac) ->
            airpair1 = time: moment().add(2, 'day'), minutes: 90, type: 'private', credit: 50, payMethodId: s.primaryPayMethodId
            POST "/bookings/#{data.experts.tmot._id}", airpair1, {}, (booking1) ->
              expect(booking1._id).to.exist
              expect(booking1.orderId).to.exist
              expect(_.idsEqual(booking1.expertId, data.experts.tmot._id)).to.be.true
              expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
              expect(booking1.type).to.equal('private')
              expect(booking1.minutes).to.equal(90)
              expect(_.idsEqual(booking1.createdById, s._id)).to.be.true
              expect(booking1.status).to.equal('pending')
              GET "/billing/orders", {}, (orders) ->
                expect(orders.length).to.equal(2)
                order = _.find(orders, (o) -> _.idsEqual(o._id,booking1.orderId))
                expect(order.total).to.equal(235)
                expect(order.profit).to.equal(45)
                expect(order.payment.status).to.equal('submitted_for_settlement')
                expect(order.lineItems.length).to.equal(3)
                expect(order.lineItems[0].type).to.equal('payg')
                expect(order.lineItems[0].total).to.equal(0)
                expect(order.lineItems[0].unitPrice).to.equal(235)
                expect(order.lineItems[0].qty).to.equal(0)
                expect(order.lineItems[0].info.name).to.equal('$235 Paid')
                expect(order.lineItems[1].type).to.equal('redeemedcredit')
                expect(order.lineItems[1].total).to.equal(-50)
                expect(order.lineItems[1].unitPrice).to.equal(-50)
                expect(order.lineItems[1].qty).to.equal(1)
                expect(order.lineItems[1].balance).to.equal(-50)
                expect(order.lineItems[1].info.name).to.equal('$50 Redeemed Credit')
                oldestOrder = orders[1]
                expect(_.idsEqual(order.lineItems[1]._id, oldestOrder.lineItems[0].info.redeemedLines[0].lineItemId)).to.be.true
                expect(order.lineItems[2].type).to.equal('airpair')
                expect(order.lineItems[2].total).to.equal(285)
                expect(order.lineItems[2].qty).to.equal(1.5)
                expect(order.lineItems[2].unitPrice).to.equal(190)
                expect(order.lineItems[2].info.paidout).to.equal(false)
                expect(_.idsEqual(order.lineItems[2].info.expert._id, data.experts.tmot._id)).to.be.true
                done()


  it 'Team members can use company credit for order', (done) ->
    testDb.setupCompanyWithPayMethodAndTwoMembers 'ldhm', 'matt', 'eddb', (cid, pmid, cAdm, cMem) ->
      LOGIN 'matt', cAdm, (smatt) ->
        GET '/billing/paymethods', {}, (mattPms) ->
          expect(mattPms.length).to.equal(1)
          expect(mattPms[0]._id).to.exist
          o = total: 500, payMethodId: mattPms[0]._id
          POST "/billing/orders/credit", o, {}, (oCredit) ->
            expect(oCredit.total).to.equal(500)
            expect(_.idsEqual(oCredit.payMethodId,pmid)).to.be.true
            LOGIN 'eddb', cMem, (seddb) ->
              GET '/billing/paymethods', {}, (eddbPms) ->
                expect(eddbPms.length).to.equal(1)
                airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'opensource', credit: 500, payMethodId: eddbPms[0]._id
                POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1)  ->
                  expect(booking1._id).to.exist
                  expect(booking1.minutes).to.equal(120)
                  expect(booking1.orderId).to.exist
                  expect(booking1.type).to.equal('opensource')
                  done()


  it.skip 'Team members can not user anther companys credit for order', (done) ->


  it 'Book 2 hour with pay as you go off request', (done) ->
    addAndLoginLocalUserWithPayMethod 'petc', (s) ->
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget: 300}), {}, (r) ->
          LOGIN 'abha', data.users.abha, (sAbha) ->
            GET "/requests/review/#{r._id}", {}, (rAbha) ->
              reply = expertComment: "good", expertAvailability: "ok", expertStatus: "available"
              expertId = rAbha.suggested[0].expert._id
              PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r2) ->
                LOGIN 'petc', s, (sCustomer) ->
                  GET "/requests/#{r._id}/book/#{expertId}", {}, (review) ->
                    suggestion = _.find(review.suggested,(s)=> _.idsEqual(s.expert._id,expertId))
                    airpair1 = time: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: s.primaryPayMethodId, request: { requestId: review._id, suggestion }
                    POST "/bookings/#{expertId}", airpair1, {}, (booking1) ->
                      expect(booking1._id).to.exist
                      expect(booking1.minutes).to.equal(60)
                      expect(booking1.orderId).to.exist
                      expect(booking1.type).to.equal('private')
                      GET "/billing/orders", {}, (orders1) ->
                        expect(orders1.length).to.equal(1)
                        expect(_.idsEqual(orders1[0].requestId,r._id)).to.be.true
                        LOGIN 'admin', data.users.admin, ->
                          GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
                            expect(rAdm.length).to.equal(1)
                            expect(rAdm[0].suggested.length).to.equal(1)
                            expect(rAdm[0].adm.active).to.be.true
                            expect(rAdm[0].adm.submitted).to.exist
                            expect(rAdm[0].adm.reviewable).to.exist
                            expect(rAdm[0].adm.booked).to.exist
                            expect(rAdm[0].status).to.equal('booked')
                            done()


  it 'Book 1 hour of Adam Bliss by Ari Lerner', (done) ->
    SETUP.newCompleteRequest 'aril', data.requests.ariwadam, (request, sAril) ->
      GET "/requests/review/#{request._id}", {}, (r) ->
        expect(r.suggested.length).to.equal(3)
        expect(r.suggested[0].suggestedRate.total).to.equal(130)
        adamB = r.suggested[0].expert
        expect(adamB._id).to.exist
        expect(adamB.name).to.equal('Adam Bliss')
        GET "/requests/#{request._id}/book/#{adamB._id}", {}, (r2) ->
          expect(r2.suggested.length).to.equal(3)
          expect(r2.suggested[0].expert.name).to.equal('Adam Bliss')
          expect(r2.suggested[0].suggestedRate.total).to.equal(130)
          suggestion = r2.suggested[0]
          airpair1 = time: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: sAril.primaryPayMethodId, request: { requestId: r._id, suggestion }
          POST "/bookings/#{adamB._id}", airpair1, {}, (booking1) ->
            expect(booking1._id).to.exist
            GET "/billing/orders", {}, (orders) ->
              expect(orders.length).to.equal(1)
              expect(orders[0].total).to.equal(130)
              expect(orders[0].profit).to.equal(45)
              expect(orders[0].lineItems.length).to.equal(2)
              expect(orders[0].lineItems[0].type).to.equal('payg')
              expect(orders[0].lineItems[1].type).to.equal('airpair')
              expect(orders[0].lineItems[1].unitPrice).to.equal(130)
              done()


  it 'Book 1 opensource hour of Adam Bliss', (done) ->
    SETUP.newCompleteRequest 'rusc', data.requests.ariwadam, (request, sAril) ->
      GET "/requests/review/#{request._id}", {}, (r) ->
        expect(r.suggested.length).to.equal(3)
        expect(r.suggested[0].suggestedRate.total).to.equal(130)
        adamB = r.suggested[0].expert
        GET "/requests/#{request._id}/book/#{adamB._id}", {}, (r2) ->
          expect(r2.suggested[0].expert.name).to.equal('Adam Bliss')
          expect(r2.suggested[0].suggestedRate.total).to.equal(130)
          suggestion = r2.suggested[0]
          airpair1 = time: moment().add(2, 'day'), minutes: 60, type: 'opensource', payMethodId: sAril.primaryPayMethodId, request: { requestId: r._id, suggestion }
          POST "/bookings/#{adamB._id}", airpair1, {}, (booking1) ->
            GET "/billing/orders", {}, (orders) ->
              expect(orders.length).to.equal(1)
              expect(orders[0].total).to.equal(120)
              expect(orders[0].profit).to.equal(35)
              expect(orders[0].lineItems.length).to.equal(2)
              expect(orders[0].lineItems[0].type).to.equal('payg')
              expect(orders[0].lineItems[1].type).to.equal('airpair')
              expect(orders[0].lineItems[1].unitPrice).to.equal(120)
              done()


  it.skip 'Should be shaping order data from users view', (done) ->
    expect(orders[0].profit).to.be.undefined

  it.skip 'Book 3 hour from package', (done) ->
    $log('can deduct by quantity instead of credit')

  it.skip 'Can book another hour after buying more credit', (done) ->
  it.skip 'With the multiple credit line items, first lineitem gets deducted', (done) ->
  it.skip 'Gets $5 off booking if member', (done) ->
  it.skip 'Can redeem membership credit', (done) ->
