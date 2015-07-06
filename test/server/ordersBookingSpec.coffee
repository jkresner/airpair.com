ordersUtil = require '../../shared/orders'

module.exports = -> describe "Booking: ".subspec, ->

  @timeout 8000

  before (done) ->
    SETUP.initExperts done

  beforeEach ->
    @braintreepaymentStub = SETUP.stubBraintreeChargeWithMethod()

  afterEach ->
    if @braintreepaymentStub
      @braintreepaymentStub.restore()

  it 'Book 2 hour with pay as you go private', itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'jpie', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.orderId).to.exist
        expect(booking1.order).to.be.undefined
        expect(_.idsEqual(booking1.expertId, data.experts.dros._id)).to.be.true
        expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
        expect(_.idsEqual(booking1.createdById, s._id)).to.be.true
        expect(booking1.type).to.equal('private')
        expect(booking1.minutes).to.equal(120)
        expect(booking1.status).to.equal('pending')
        expect(booking1.participants.length).to.equal(2)
        expect(booking1.participants[0].role).to.equal('customer')
        expect(booking1.participants[0].info.email).to.exist
        expect(booking1.participants[0].info.name).to.exist
        expect(booking1.participants[1].role).to.equal('expert')
        expect(booking1.participants[1].info.email).to.exist
        expect(booking1.participants[1].info.name).to.exist
        GET "/billing/orders", {}, (orders) ->
          order = _.find(orders, (o) -> _.idsEqual(o._id,booking1.orderId))
          expect(order.total).to.equal(280)
          expect(order.profit).to.equal(60)
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
          expectIdsEqual(order.lineItems[1].info.expert._id, data.experts.dros._id)
          # expectIdsEqual(order.lineItems[1].bookingId,booking1._id)
          expectIdsEqual(order.lineItems[1].bookingId._id,booking1._id)
          DONE()

  it 'Book 2 hour with pay as you go private two gets email + name on participant', itDone ->
    SETUP.createNewExpert 'louf', {rate:140}, (sExp, expert) ->
      SETUP.addAndLoginLocalUserWhoCanMakeBooking 'jkjk', (s) ->
        airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
        POST "/bookings/#{expert._id}", airpair1, {}, (booking1) ->
          expect(booking1._id).to.exist
          expect(_.idsEqual(booking1.expertId, expert._id)).to.be.true
          expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
          expect(booking1.participants.length).to.equal(2)
          expect(booking1.participants[0].role).to.equal('customer')
          expect(booking1.participants[0].info.email).to.exist
          expect(booking1.participants[0].info.name).to.exist
          expect(booking1.participants[1].role).to.equal('expert')
          expect(booking1.participants[1].info.email).to.exist
          expect(booking1.participants[1].info.name).to.exist
          DONE()


  it 'Book 2 hour with pay as you go opensource', itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'crus', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'opensource', payMethodId: s.primaryPayMethodId
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
          DONE()


  it 'Book 3 hour at 150 from 500 credit', itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'ckni', (s) ->
      o = total: 500, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, {}, (r) ->
        airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'opensource', credit: 500, payMethodId: s.primaryPayMethodId
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
            # expectIdsEqual(redeemOrder.lineItems[1].bookingId,booking1._id)
            expectIdsEqual(redeemOrder.lineItems[1].bookingId._id,booking1._id)
            expect(redeemOrder.lineItems[1]._id).to.exist
            expect(redeemOrder.lineItems[1].total).to.equal(260)
            expect(redeemOrder.lineItems[1].qty).to.equal(2)
            expect(redeemOrder.lineItems[1].unitPrice).to.equal(130)
            expect(redeemOrder.lineItems[1].balance).to.equal(0)
            expect(redeemOrder.lineItems[1].profit).to.equal(40)
            expect(redeemOrder.lineItems[1].info.expert.name).to.equal("Daniel Roseman")
            expect(redeemOrder.lineItems[1].info.type).to.equal('opensource')
            expect(redeemOrder.lineItems[1].info.paidout).to.equal(false)

            lines1 = ordersUtil.linesWithCredit(orders1)
            availableCredit1 = ordersUtil.getAvailableCredit(lines1)
            expect(lines1.length).to.equal(1)
            expect(availableCredit1).to.equal(240)
            airpair2 = datetime: moment().add(3, 'day'), minutes: 60, type: 'private', credit: 240, payMethodId: s.primaryPayMethodId
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
                airpair3 = datetime: moment().add(4, 'day'), minutes: 60, type: 'private', credit: 200, payMethodId: s.primaryPayMethodId
                POST "/bookings/#{data.experts.dros._id}", airpair3, { status: 400 }, (err) ->
                  expect(err.message.indexOf('ExpectedCredit $200')).to.equal(0)
                  DONE()


  it 'Fail to Book 1 hour at 150 with no credit or payMethodId', itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'jasp', (s) ->
      airpair = datetime: moment().add(1, 'day'), minutes: 60, type: 'private', credit: 150, payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair, { status: 400 }, (err, resp) ->
        expect(err.message.indexOf('ExpectedCredit $150')).to.equal(0)
        DONE()


  it 'Book 90 mins at 270 from 50 credit and 220 payg', itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'ajac', (s) ->
      LOGIN 'admin', (sadm) ->
        oCred = total: 50, toUser: s, source: 'Test'
        POST "/adm/billing/orders/credit", oCred, {}, (r) ->
          LOGIN s.userKey, (sajac) ->
            airpair1 = datetime: moment().add(2, 'day'), minutes: 90, type: 'private', credit: 50, payMethodId: s.primaryPayMethodId
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
                db.readDoc 'Order', order._id, (orderDB) ->
                  expect(orderDB.payMethod).to.be.undefined
                  DONE()


  it 'Team members can use company credit for order', itDone ->
    SETUP.setupCompanyWithPayMethodAndTwoMembers 'ldhm', 'matt', 'eddb', (cid, pmid, cAdm, cMem) ->
      LOGIN cAdm.userKey, (smatt) ->
        GET '/billing/paymethods', {}, (mattPms) ->
          expect(mattPms.length).to.equal(1)
          expect(mattPms[0]._id).to.exist
          o = total: 500, payMethodId: mattPms[0]._id
          POST "/billing/orders/credit", o, {}, (oCredit) ->
            expect(oCredit.total).to.equal(500)
            expect(_.idsEqual(oCredit.payMethodId,pmid)).to.be.true
            LOGIN cMem.userKey, (seddb) ->
              GET '/billing/paymethods', {}, (eddbPms) ->
                expect(eddbPms.length).to.equal(1)
                airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'opensource', credit: 500, payMethodId: eddbPms[0]._id
                POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1)  ->
                  expect(booking1._id).to.exist
                  expect(booking1.minutes).to.equal(120)
                  expect(booking1.orderId).to.exist
                  expect(booking1.type).to.equal('opensource')
                  DONE()


  it.skip 'Team members can not user anther companys credit for order', (done) ->


  it 'Book 2 hour with pay as you go off request', itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'petc', (s) ->
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget: 300,title:'test'}), {}, (r) ->
          LOGIN 'abha', (sAbha) ->
            GET "/requests/review/#{r._id}", {}, (rAbha) ->
              reply = expertComment: "good", expertAvailability: "ok", expertStatus: "available"
              expertId = rAbha.suggested[0].expert._id
              PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r2) ->
                LOGIN s.userKey, (sCustomer) ->
                  GET "/requests/#{r._id}/book/#{expertId}", {}, (review) ->
                    suggestion = _.find(review.suggested,(s)=> _.idsEqual(s.expert._id,expertId))
                    airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: s.primaryPayMethodId, request: { requestId: review._id, suggestion }
                    POST "/bookings/#{expertId}", airpair1, {}, (booking1) ->
                      expect(booking1._id).to.exist
                      expect(booking1.minutes).to.equal(60)
                      expect(booking1.orderId).to.exist
                      expect(booking1.type).to.equal('private')
                      GET "/billing/orders", {}, (orders1) ->
                        expect(orders1.length).to.equal(1)
                        expect(_.idsEqual(orders1[0].requestId,r._id)).to.be.true
                        LOGIN 'admin', ->
                          GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
                            expect(rAdm.length).to.equal(1)
                            expect(rAdm[0].suggested.length).to.equal(1)
                            expect(rAdm[0].adm.active).to.be.true
                            expect(rAdm[0].adm.submitted).to.exist
                            expect(rAdm[0].adm.reviewable).to.exist
                            expect(rAdm[0].adm.booked).to.exist
                            expect(rAdm[0].status).to.equal('booked')
                            DONE()


  it 'Book 2 hour with 10 welcome credit off request', itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'crus', (s) ->
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget: 300,title:'test'}), {}, (r) ->
          LOGIN 'rbig', (sRbig) ->
            GET "/requests/review/#{r._id}", {}, (rRbig) ->
              reply = expertComment: "good", expertAvailability: "ok", expertStatus: "available"
              expertId = rRbig.suggested[0].expert._id
              PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r2) ->
                LOGIN 'admin', (sadm) ->
                  oCred = total: 10, toUser: s, source: 'Welcome'
                  POST "/adm/billing/orders/credit", oCred, {}, (rOcred) ->
                    LOGIN s.userKey, (sajac) ->
                      GET "/requests/#{r._id}/book/#{expertId}", {}, (review) ->
                        suggestion = _.find(review.suggested,(s)=> _.idsEqual(s.expert._id,expertId))
                        airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: s.primaryPayMethodId, credit: 10, request: { requestId: review._id, suggestion }
                        POST "/bookings/#{expertId}", airpair1, {}, (booking1) ->
                          GET "/billing/orders", {}, (orders) ->
                            expect(orders.length).to.equal(2)
                            expect(orders[0].requestId).to.exist
                            expect(orders[0].lineItems.length).to.equal(3) # credit + payg + airpair
                            GET "/requests/#{orders[0].requestId}", {}, (request) ->
                              expect(request.status).to.equal("booked")
                              DONE()


  it 'Book 1 hour of Adam Bliss by Ari Lerner', itDone ->
    SETUP.newCompleteRequest 'aril', data.requests.ariwadam, (request, sAril) ->
      GET "/requests/review/#{request._id}", {}, (r) ->
        expect(r.suggested.length).to.equal(3)
        expect(r.suggested[0].suggestedRate.total).to.equal(130)
        adamB = r.suggested[0].expert
        expect(adamB._id).to.exist
        expect(adamB.name).to.equal('Adam Bliss')
        expect(adamB.username).to.exist
        GET "/requests/#{request._id}/book/#{adamB._id}", {}, (r2) ->
          expect(r2.suggested.length).to.equal(3)
          expect(r2.suggested[0].expert.name).to.equal('Adam Bliss')
          expect(r2.suggested[0].suggestedRate.total).to.equal(130)
          suggestion = r2.suggested[0]
          airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: sAril.primaryPayMethodId, request: { requestId: r._id, suggestion }
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
              DONE()


  it 'Book 1 opensource hour of Adam Bliss', itDone ->
    SETUP.newCompleteRequest 'rusc', data.requests.ariwadam, (request, sAril) ->
      GET "/requests/review/#{request._id}", {}, (r) ->
        expect(r.suggested.length).to.equal(3)
        expect(r.suggested[0].suggestedRate.total).to.equal(130)
        adamB = r.suggested[0].expert
        GET "/requests/#{request._id}/book/#{adamB._id}", {}, (r2) ->
          expect(r2.suggested[0].expert.name).to.equal('Adam Bliss')
          expect(r2.suggested[0].suggestedRate.total).to.equal(130)
          suggestion = r2.suggested[0]
          airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'opensource', payMethodId: sAril.primaryPayMethodId, request: { requestId: r._id, suggestion }
          POST "/bookings/#{adamB._id}", airpair1, {}, (booking1) ->
            GET "/billing/orders", {}, (orders) ->
              expect(orders.length).to.equal(1)
              expect(orders[0].total).to.equal(120)
              expect(orders[0].profit).to.equal(35)
              expect(orders[0].lineItems.length).to.equal(2)
              expect(orders[0].lineItems[0].type).to.equal('payg')
              expect(orders[0].lineItems[1].type).to.equal('airpair')
              expect(orders[0].lineItems[1].unitPrice).to.equal(120)
              DONE()


  it.skip 'Should be shaping order data from users view', ->
    expect(orders[0].profit).to.be.undefined

  it.skip 'Book 3 hour from package', ->
    $log('can deduct by quantity instead of credit')

  it 'Can book another hour after buying more credit'
  it 'With the multiple credit line items, first lineitem gets deducted'
  it 'Gets $5 off booking if member'
  it 'Can redeem membership credit'
