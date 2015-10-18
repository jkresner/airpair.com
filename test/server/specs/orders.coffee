util = require '../../../shared/util'
OrdersUtil = require '../../../shared/orders'

creditOrders = ->

  IT '300 credit purchase', ->
    STORY.newUser 'somr', {login:true,paymethod:true}, (s) ->
      o = total: 300, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, (r) ->
        expect(r._id).to.exist
        expect(_.idsEqual(r.userId, s._id)).to.be.true
        expect(_.idsEqual(r.by._id, s._id)).to.be.true
        expect(r.lines.length).to.equal(1)
        expect(r.lines[0].type).to.equal('credit')
        expect(r.lines[0].unitPrice).to.equal(300)
        expect(r.lines[0].qty).to.equal(1)
        expect(r.lines[0].total).to.equal(300)
        expect(r.lines[0].profit).to.equal(0)
        expect(r.lines[0].balance).to.equal(300)
        expect(r.lines[0].info.remaining).to.equal(300)
        expect(r.lines[0].info.name).to.equal('$300 Credit')
        expect(r.lines[0].info.source).to.equal('$300 Credit Purchase')
        expect(r.total).to.equal(300)
        expect(r.profit).to.equal(0)
        DB.docById 'Order', r._id, (orderDB) ->
          expect(orderDB.payMethod).to.be.undefined
          DONE()


  IT '500 credit purchase', ->
    STORY.newUser 'sora', {login:true,paymethod:true}, (s) ->
      o = total: 500, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, (r) ->
        expect(r._id).to.exist
        expect(_.idsEqual(r.userId, s._id)).to.be.true
        expect(_.idsEqual(r.by._id, s._id)).to.be.true
        expect(r.lines.length).to.equal(1)
        expect(r.lines[0].type).to.equal('credit')
        expect(r.lines[0].unitPrice).to.equal(500)
        expect(r.lines[0].qty).to.equal(1)
        expect(r.lines[0].total).to.equal(500)
        expect(r.lines[0].profit).to.equal(0)
        expect(r.lines[0].balance).to.equal(500)
        # Seems not working from Australia hah
        # threeMonth = moment(util.dateWithDayAccuracy(moment().utc().add(3,'month'))).format('YYYY-MM-DD')
        # $log('r.lines[0].info.expires', r.lines[0].info.expires, threeMonth)
        # expect(r.lines[0].info.expires.indexOf(threeMonth)).to.equal(0)
        expect(r.lines[0].info.remaining).to.equal(500)
        expect(r.lines[0].info.name).to.equal('$500 Credit')
        expect(r.lines[0].info.source).to.equal('$500 Credit Purchase')
        expect(r.total).to.equal(500)
        expect(r.profit).to.equal(0)
        DONE()



  IT '1000 credit purchase with 5% extra', ->
    STORY.newUser 'soik', {login:true,paymethod:true}, (s) ->
      o = total: 1000, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, (r) ->
        expect(r._id).to.exist
        expect(r.lines.length).to.equal(2)
        expect(r.lines[0].type).to.equal('credit')
        expect(r.lines[0].info.name).to.equal('$1000 Credit')
        expect(r.lines[0].info.source).to.equal('$1000 Credit Purchase')
        expect(r.lines[1].type).to.equal('credit')
        expect(r.lines[1].info.name).to.equal('$50 Credit')
        expect(r.lines[1].info.source).to.equal('Credit Bonus (5% on $1000)')
        expect(r.total).to.equal(1000)
        expect(r.profit).to.equal(0)
        DONE()



  IT '5000 credit purchase with 20% extra and coupon discount', ->
    STORY.newUser 'kelf', {login:true,paymethod:true}, (s) ->
      o = total: 5000, payMethodId: s.primaryPayMethodId, coupon: 'letspair'
      POST "/billing/orders/credit", o, (r) ->
        # threeMonth = moment(util.dateWithDayAccuracy(moment().add(3,'month'))).format('YYYY-MM-DD')
        expect(r._id).to.exist
        expect(r.lines.length).to.equal(3)
        expect(r.lines[0].type).to.equal('credit')
        expect(r.lines[0].unitPrice).to.equal(5000)
        expect(r.lines[0].qty).to.equal(1)
        expect(r.lines[0].total).to.equal(5000)
        expect(r.lines[0].profit).to.equal(0)
        expect(r.lines[0].balance).to.equal(5000)
        # expect(r.lines[0].info.expires.indexOf(threeMonth)).to.equal(0)
        expect(r.lines[0].info.remaining).to.equal(5000)
        expect(r.lines[0].info.name).to.equal('$5000 Credit')
        expect(r.lines[0].info.source).to.equal('$5000 Credit Purchase')
        expect(r.lines[1].type).to.equal('credit')
        expect(r.lines[1].unitPrice).to.equal(0)
        expect(r.lines[1].qty).to.equal(1)
        expect(r.lines[1].total).to.equal(0)
        expect(r.lines[1].profit).to.equal(0)
        expect(r.lines[1].balance).to.equal(1000)
        # expect(r.lines[1].info.expires.indexOf(threeMonth)).to.equal(0)
        expect(r.lines[1].info.remaining).to.equal(1000)
        expect(r.lines[1].info.name).to.equal('$1000 Credit')
        expect(r.lines[1].info.source).to.equal('Credit Bonus (20% on $5000)')
        expect(r.lines[2].type).to.equal('discount')
        expect(r.total).to.equal(4900)
        expect(r.profit).to.equal(-100)
        DONE()


  IT 'Admin can give unpaid credit', ->
    STORY.newUser 'chup', {login:true,paymethod:true}, (schup) ->
      LOGIN {key:'admin'}, (sadm) ->
        o = total: 50, toUser: schup, source: 'Angular Workshops Survey Promo'
        POST "/adm/billing/orders/credit", o, (r) ->
          expect(r._id).to.exist
          expect(_.idsEqual(r.userId, schup._id)).to.be.true
          expect(_.idsEqual(r.by._id, sadm._id)).to.be.true
          expect(r.lines.length).to.equal(1)
          expect(r.lines[0].type).to.equal('credit')
          expect(r.lines[0].unitPrice).to.equal(0)
          expect(r.lines[0].qty).to.equal(1)
          expect(r.lines[0].total).to.equal(0)
          expect(r.lines[0].profit).to.equal(0)
          expect(r.lines[0].balance).to.equal(50)
          expect(r.lines[0].info.name).to.equal('$50 Credit')
          expect(r.lines[0].info.remaining).to.equal(50)
          expect(r.lines[0].info.source).to.equal('Angular Workshops Survey Promo from Admin Daemon')
          expect(r.total).to.equal(0)
          expect(r.profit).to.equal(0)
          DONE()


  IT 'Non-admin can not give unpaid credit', ->
    STORY.newUser 'chiu', {login:true,paymethod:true}, (schiu) ->
      o = total: 50, toUserId: schiu._id, source: 'Angular Workshops Survey Promo'
      POST "/adm/billing/orders/credit", o, { status: 403 }, ->
        DONE()


  it 'GetMyOrdersWithCredit returns only orders with Credit'
  # IT 'GetMyOrdersWithCredit returns only orders with Credit', ->
  #   STORY.newUser 'mcas', {login:true,paymethod:true}, (mcas) ->
  #     map = (o) ->
  #       o.userId = require('mongoose').Types.ObjectId(mcas._id)
  #       o
  #     v0Orders = _.map(FIXTURE.v0.orders.jkHist, map)
  #     DB.ensureDocs 'Order', v0Orders, (e,r) ->
  #       o = total: 1000, payMethodId: mcas.primaryPayMethodId
  #       POST "/billing/orders/credit", o, (credit) ->
  #         expect(credit._id).to.exist
  #         GET "/billing/orders/credit/#{mcas.primaryPayMethodId}", (orders) ->
  #           expect(orders.length).to.equal(1)
  #           linesWithCredit = OrdersUtil.linesWithCredit(orders)
  #           expect(linesWithCredit.length).to.equal(2)
  #           expect(OrdersUtil.getAvailableCredit(linesWithCredit)).to.equal(1050)
  #           DONE()



bookingOrders = ->


  IT 'Book 2 hour with pay as you go private', ->
    STORY.newUser 'jpie', {login:true,paymethod:true,location:true}, (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.orderId).to.exist
        expect(booking1.order).to.be.undefined
        expect(_.idsEqual(booking1.expertId, FIXTURE.experts.dros._id)).to.be.true
        expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
        # expect(_.idsEqual(booking1.createdById, s._id)).to.be.true
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
        GET "/billing/orders", (orders) ->
          order = _.find(orders, (o) -> _.idsEqual(o._id,booking1.orderId))
          expect(order.total).to.equal(280)
          expect(order.profit).to.equal(60)
          expect(order.lines.length).to.equal(2)
          expect(order.lines[0].type).to.equal('payg')
          expect(order.lines[0].total).to.equal(0)
          expect(order.lines[0].unitPrice).to.equal(280)
          expect(order.lines[0].qty).to.equal(0)
          expect(order.lines[0].info.name).to.equal('$280 Paid')
          expect(order.lines[1].type).to.equal('airpair')
          expect(order.lines[1].total).to.equal(280)
          expect(order.lines[1].qty).to.equal(2)
          expect(order.lines[1].unitPrice).to.equal(140)
          expect(order.lines[1].info.paidout).to.equal(false)
          expect(order.lines[1].info.type).to.equal('private')
          expectIdsEqual(order.lines[1].info.expert._id, FIXTURE.experts.dros._id)
          expectIdsEqual(order.lines[1].bookingId._id,booking1._id)
          DONE()


  IT 'Book 2 hour with pay as you go private two gets email + name on participant', ->
    STORY.newExpert 'louf', {rate:140}, (sExp, expert) ->
      STORY.newUser 'jkjk', {login:true,paymethod:true,location:true}, (s) ->
        airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
        POST "/bookings/#{expert._id}", airpair1, (booking1) ->
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


  IT 'Book 2 hour with pay as you go opensource', ->
    STORY.newUser 'crus', {login:true,paymethod:true,location:true}, (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'opensource', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, {}, (booking1) ->
        GET "/billing/orders", {}, (orders) ->
          order = _.find(orders, (o) -> _.idsEqual(o._id,booking1.orderId))
          expect(order.lines.length).to.equal(2)
          expect(order.lines[0].type).to.equal('payg')
          expect(order.lines[0].total).to.equal(0)
          expect(order.lines[0].unitPrice).to.equal(260)
          expect(order.lines[0].qty).to.equal(0)
          expect(order.lines[0].info.name).to.equal('$260 Paid')
          expect(order.lines[1].type).to.equal('airpair')
          expect(order.lines[1].total).to.equal(260)
          expect(order.lines[1].qty).to.equal(2)
          expect(order.lines[1].unitPrice).to.equal(130)
          expect(order.lines[1].info.paidout).to.equal(false)
          expect(order.lines[1].info.type).to.equal('opensource')
          expect(order.total).to.equal(260)
          expect(order.profit).to.equal(40)
          DONE()


  IT 'Book 3 hour at 150 from 500 credit', ->
    STORY.newUser 'usha', {login:true,paymethod:true,location:true}, (s) ->
      o = total: 500, payMethodId: s.primaryPayMethodId
      POST "/billing/orders/credit", o, (r) ->
        airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'opensource', credit: 500, payMethodId: s.primaryPayMethodId
        POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, (booking1) ->
          expect(booking1._id).to.exist
          expect(booking1.minutes).to.equal(120)
          expect(booking1.orderId).to.exist
          expect(booking1.type).to.equal('opensource')
          GET "/billing/orders", (orders1) ->
            expect(orders1.length).to.equal(2)
            creditOrder = orders1[1]
            redeemOrder = orders1[0]
            $log('creditOrder'.white, creditOrder)
            $log('redeemOrder'.white, redeemOrder)
            expect(creditOrder.total).to.equal(500)
            expect(creditOrder.lines.length).to.equal(1)
            expect(creditOrder.payment.type).to.equal('braintree')
            expect(creditOrder.payment.status).to.equal('submitted_for_settlement')
            expect(creditOrder.lines[0].type).to.equal('credit')
            expect(creditOrder.lines[0].total).to.equal(500)
            expect(creditOrder.lines[0].qty).to.equal(1)
            expect(creditOrder.lines[0].unitPrice).to.equal(500)
            expect(creditOrder.lines[0].balance).to.equal(500)
            expect(creditOrder.lines[0].info.remaining).to.equal(240)
            expect(creditOrder.lines[0].info.redeemedLines.length).to.equal(1)

            expect(_.idsEqual(redeemOrder._id,booking1.orderId)).to.be.true
            expect(redeemOrder.payment.type).to.equal('$0 order')
            redeemedLineId = redeemOrder.lines[0]._id
            expect(_.idsEqual(redeemedLineId, creditOrder.lines[0].info.redeemedLines[0].lineItemId)).to.be.true

            expect(redeemOrder.total).to.equal(0)
            expect(redeemOrder.profit).to.equal(40)
            expect(redeemOrder.lines.length).to.equal(2)
            expect(redeemOrder.lines[0].type).to.equal('redeemedcredit')
            expect(redeemOrder.lines[0].total).to.equal(-260)
            expect(redeemOrder.lines[0].unitPrice).to.equal(-260)
            expect(redeemOrder.lines[0].qty).to.equal(1)
            expect(redeemOrder.lines[0].balance).to.equal(-260)
            expect(redeemOrder.lines[1].type).to.equal('airpair')
            # expectIdsEqual(redeemOrder.lines[1].bookingId,booking1._id)
            expectIdsEqual(redeemOrder.lines[1].bookingId._id,booking1._id)
            expect(redeemOrder.lines[1]._id).to.exist
            expect(redeemOrder.lines[1].total).to.equal(260)
            expect(redeemOrder.lines[1].qty).to.equal(2)
            expect(redeemOrder.lines[1].unitPrice).to.equal(130)
            expect(redeemOrder.lines[1].balance).to.equal(0)
            expect(redeemOrder.lines[1].profit).to.equal(40)
            expect(redeemOrder.lines[1].info.expert.name).to.equal("Daniel Roseman")
            expect(redeemOrder.lines[1].info.type).to.equal('opensource')
            expect(redeemOrder.lines[1].info.paidout).to.equal(false)

            lines1 = OrdersUtil.linesWithCredit(orders1)
            availableCredit1 = OrdersUtil.getAvailableCredit(lines1)
            expect(lines1.length).to.equal(1)
            expect(availableCredit1).to.equal(240)
            airpair2 = datetime: moment().add(3, 'day'), minutes: 60, type: 'private', credit: 240, payMethodId: s.primaryPayMethodId
            POST "/bookings/#{FIXTURE.experts.dros._id}", airpair2, (booking2) ->
              expect(booking2._id).to.exist
              expect(booking2.minutes).to.equal(60)
              expect(booking2.type).to.equal('private')
              GET "/billing/orders", (orders2) ->
                expect(orders2.length).to.equal(3)
                expect(orders2[1].total).to.equal(0)
                expect(orders2[1].payment.type).to.equal('$0 order')
                lines2 = OrdersUtil.linesWithCredit(orders2)
                expect(lines2.length).to.equal(1)
                availableCredit2 = OrdersUtil.getAvailableCredit(lines2)
                expect(availableCredit2).to.equal(100)
                airpair3 = datetime: moment().add(4, 'day'), minutes: 60, type: 'private', credit: 200, payMethodId: s.primaryPayMethodId
                POST "/bookings/#{FIXTURE.experts.dros._id}", airpair3, { status: 400 }, (err) ->
                  expect(err.message.indexOf('ExpectedCredit $200')).to.equal(0)
                  DONE()


  IT 'Fail to Book 1 hour at 150 with no credit or payMethodId', ->
    STORY.newUser 'jasp', {login:true,paymethod:true,location:true}, (s) ->
      airpair = datetime: moment().add(1, 'day'), minutes: 60, type: 'private', credit: 150, payMethodId: s.primaryPayMethodId
      POST "/bookings/#{FIXTURE.experts.dros._id}", airpair, { status: 400 }, (err, resp) ->
        expect(err.message.indexOf('ExpectedCredit $150')).to.equal(0)
        DONE()


  IT 'Book 90 mins at 270 from 50 credit and 220 payg', ->
    STORY.newUser 'ajac', {login:true,paymethod:true,location:true}, (s, sUserKey) ->
      LOGIN {key:'admin'}, (sadm) ->
        oCred = total: 50, toUser: s, source: 'Test'
        POST "/adm/billing/orders/credit", oCred, {}, (r) ->
          LOGIN {key:sUserKey}, (sajac) ->
            airpair1 = datetime: moment().add(2, 'day'), minutes: 90, type: 'private', credit: 50, payMethodId: s.primaryPayMethodId
            POST "/bookings/#{FIXTURE.experts.tmot._id}", airpair1, {}, (booking1) ->
              expect(booking1._id).to.exist
              expect(booking1.orderId).to.exist
              expect(_.idsEqual(booking1.expertId, FIXTURE.experts.tmot._id)).to.be.true
              expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
              expect(booking1.type).to.equal('private')
              expect(booking1.minutes).to.equal(90)
              # expect(_.idsEqual(booking1.createdById, s._id)).to.be.true
              expect(booking1.status).to.equal('pending')
              GET "/billing/orders", (orders) ->
                expect(orders.length).to.equal(2)
                order = _.find(orders, (o) -> _.idsEqual(o._id,booking1.orderId))
                expect(order.total).to.equal(235)
                expect(order.profit).to.equal(45)
                expect(order.payment.status).to.equal('submitted_for_settlement')
                expect(order.lines.length).to.equal(3)
                expect(order.lines[0].type).to.equal('payg')
                expect(order.lines[0].total).to.equal(0)
                expect(order.lines[0].unitPrice).to.equal(235)
                expect(order.lines[0].qty).to.equal(0)
                expect(order.lines[0].info.name).to.equal('$235 Paid')
                expect(order.lines[1].type).to.equal('redeemedcredit')
                expect(order.lines[1].total).to.equal(-50)
                expect(order.lines[1].unitPrice).to.equal(-50)
                expect(order.lines[1].qty).to.equal(1)
                expect(order.lines[1].balance).to.equal(-50)
                expect(order.lines[1].info.name).to.equal('$50 Redeemed Credit')
                oldestOrder = orders[1]
                expect(_.idsEqual(order.lines[1]._id, oldestOrder.lines[0].info.redeemedLines[0].lineItemId)).to.be.true
                expect(order.lines[2].type).to.equal('airpair')
                expect(order.lines[2].total).to.equal(285)
                expect(order.lines[2].qty).to.equal(1.5)
                expect(order.lines[2].unitPrice).to.equal(190)
                expect(order.lines[2].info.paidout).to.equal(false)
                expect(_.idsEqual(order.lines[2].info.expert._id, FIXTURE.experts.tmot._id)).to.be.true
                DB.docById 'Order', order._id, (orderDB) ->
                  expect(orderDB.payMethod).to.be.undefined
                  DONE()


  it 'Team members can use company credit for order'
  # IT 'Team members can use company credit for order', ->
  #   SETUP.setupCompanyWithPayMethodAndTwoMembers 'ldhm', 'matt', 'eddb', (cid, pmid, cAdm, cMem) ->
  #     LOGIN {key:cAdm.userKey}, (smatt) ->
  #       GET '/billing/paymethods', {}, (mattPms) ->
  #         expect(mattPms.length).to.equal(1)
  #         expect(mattPms[0]._id).to.exist
  #         o = total: 500, payMethodId: mattPms[0]._id
  #         POST "/billing/orders/credit", o, {}, (oCredit) ->
  #           expect(oCredit.total).to.equal(500)
  #           expect(_.idsEqual(oCredit.payMethodId,pmid)).to.be.true
  #           LOGIN cMem.userKey, (seddb) ->
  #             GET '/billing/paymethods', {}, (eddbPms) ->
  #               expect(eddbPms.length).to.equal(1)
  #               airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'opensource', credit: 500, payMethodId: eddbPms[0]._id
  #               POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, {}, (booking1)  ->
  #                 expect(booking1._id).to.exist
  #                 expect(booking1.minutes).to.equal(120)
  #                 expect(booking1.orderId).to.exist
  #                 expect(booking1.type).to.equal('opensource')
  #                 DONE()



  it 'Book 2 hour with pay as you go off request'
  # IT 'Book 2 hour with pay as you go off request', ->
  #   STORY.newUser 'petc', {login:true,paymethod:true,location:true}, (s) ->
  #     d = tags: [FIXTURE.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
  #     POST '/requests', d, {}, (r0) ->
  #       PUT "/requests/#{r0._id}", _.extend(r0,{budget: 300,title:'test'}), {}, (r) ->
  #         LOGIN {key:'abha'}, (sAbha) ->
  #           GET "/requests/review/#{r._id}", {}, (rAbha) ->
  #             reply = expertComment: "good", expertAvailability: "ok", expertStatus: "available"
  #             expertId = rAbha.suggested[0].expert._id
  #             PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r2) ->
  #               LOGIN {key:s.userKey}, (sCustomer) ->
  #                 GET "/requests/#{r._id}/book/#{expertId}", {}, (review) ->
  #                   suggestion = _.find(review.suggested,(s)=> _.idsEqual(s.expert._id,expertId))
  #                   airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: s.primaryPayMethodId, request: { requestId: review._id, suggestion }
  #                   POST "/bookings/#{expertId}", airpair1, {}, (booking1) ->
  #                     expect(booking1._id).to.exist
  #                     expect(booking1.minutes).to.equal(60)
  #                     expect(booking1.orderId).to.exist
  #                     expect(booking1.type).to.equal('private')
  #                     GET "/billing/orders", {}, (orders1) ->
  #                       expect(orders1.length).to.equal(1)
  #                       expect(_.idsEqual(orders1[0].requestId,r._id)).to.be.true
  #                       LOGIN {key:'admin'}, ->
  #                         GET "/adm/requests/user/#{s._id}", (rAdm) ->
  #                           expect(rAdm.length).to.equal(1)
  #                           expect(rAdm[0].suggested.length).to.equal(1)
  #                           expect(rAdm[0].adm.active).to.be.true
  #                           expect(rAdm[0].adm.submitted).to.exist
  #                           expect(rAdm[0].adm.reviewable).to.exist
  #                           expect(rAdm[0].adm.booked).to.exist
  #                           expect(rAdm[0].status).to.equal('booked')
  #                           DONE()


  it 'Book 2 hour with 10 welcome credit off request'
  # IT 'Book 2 hour with 10 welcome credit off request', ->
  #   STORY.newUser 'crus', {login:true,paymethod:true,location:true}, (s) ->
  #     d = tags: [FIXTURE.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
  #     POST '/requests', d, {}, (r0) ->
  #       PUT "/requests/#{r0._id}", _.extend(r0,{budget: 300,title:'test'}), {}, (r) ->
  #         LOGIN 'rbig', (sRbig) ->
  #           GET "/requests/review/#{r._id}", {}, (rRbig) ->
  #             reply = expertComment: "good", expertAvailability: "ok", expertStatus: "available"
  #             expertId = rRbig.suggested[0].expert._id
  #             PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r2) ->
  #               LOGIN 'admin', (sadm) ->
  #                 oCred = total: 10, toUser: s, source: 'Welcome'
  #                 POST "/adm/billing/orders/credit", oCred, {}, (rOcred) ->
  #                   LOGIN s.userKey, (sajac) ->
  #                     GET "/requests/#{r._id}/book/#{expertId}", {}, (review) ->
  #                       suggestion = _.find(review.suggested,(s)=> _.idsEqual(s.expert._id,expertId))
  #                       airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: s.primaryPayMethodId, credit: 10, request: { requestId: review._id, suggestion }
  #                       POST "/bookings/#{expertId}", airpair1, {}, (booking1) ->
  #                         GET "/billing/orders", {}, (orders) ->
  #                           expect(orders.length).to.equal(2)
  #                           expect(orders[0].requestId).to.exist
  #                           expect(orders[0].lines.length).to.equal(3) # credit + payg + airpair
  #                           GET "/requests/#{orders[0].requestId}", {}, (request) ->
  #                             expect(request.status).to.equal("booked")
  #                             DONE()

  it 'Book 1 hour of Adam Bliss by Ari Lerner'
  # IT 'Book 1 hour of Adam Bliss by Ari Lerner', ->
  #   SETUP.newCompleteRequest 'aril', FIXTURE.requests.ariwadam, (request, sAril) ->
  #     GET "/requests/review/#{request._id}", {}, (r) ->
  #       expect(r.suggested.length).to.equal(3)
  #       expect(r.suggested[0].suggestedRate.total).to.equal(130)
  #       adamB = r.suggested[0].expert
  #       expect(adamB._id).to.exist
  #       expect(adamB.name).to.equal('Adam Bliss')
  #       expect(adamB.username).to.exist
  #       GET "/requests/#{request._id}/book/#{adamB._id}", {}, (r2) ->
  #         expect(r2.suggested.length).to.equal(3)
  #         expect(r2.suggested[0].expert.name).to.equal('Adam Bliss')
  #         expect(r2.suggested[0].suggestedRate.total).to.equal(130)
  #         suggestion = r2.suggested[0]
  #         airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: sAril.primaryPayMethodId, request: { requestId: r._id, suggestion }
  #         POST "/bookings/#{adamB._id}", airpair1, {}, (booking1) ->
  #           expect(booking1._id).to.exist
  #           GET "/billing/orders", {}, (orders) ->
  #             expect(orders.length).to.equal(1)
  #             expect(orders[0].total).to.equal(130)
  #             expect(orders[0].profit).to.equal(45)
  #             expect(orders[0].lines.length).to.equal(2)
  #             expect(orders[0].lines[0].type).to.equal('payg')
  #             expect(orders[0].lines[1].type).to.equal('airpair')
  #             expect(orders[0].lines[1].unitPrice).to.equal(130)
  #             DONE()

  it 'Book 1 opensource hour of Adam Bliss'
  # IT 'Book 1 opensource hour of Adam Bliss', ->
  #   SETUP.newCompleteRequest 'rusc', FIXTURE.requests.ariwadam, (request, sAril) ->
  #     GET "/requests/review/#{request._id}", {}, (r) ->
  #       expect(r.suggested.length).to.equal(3)
  #       expect(r.suggested[0].suggestedRate.total).to.equal(130)
  #       adamB = r.suggested[0].expert
  #       GET "/requests/#{request._id}/book/#{adamB._id}", {}, (r2) ->
  #         expect(r2.suggested[0].expert.name).to.equal('Adam Bliss')
  #         expect(r2.suggested[0].suggestedRate.total).to.equal(130)
  #         suggestion = r2.suggested[0]
  #         airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'opensource', payMethodId: sAril.primaryPayMethodId, request: { requestId: r._id, suggestion }
  #         POST "/bookings/#{adamB._id}", airpair1, {}, (booking1) ->
  #           GET "/billing/orders", {}, (orders) ->
  #             expect(orders.length).to.equal(1)
  #             expect(orders[0].total).to.equal(120)
  #             expect(orders[0].profit).to.equal(35)
  #             expect(orders[0].lines.length).to.equal(2)
  #             expect(orders[0].lines[0].type).to.equal('payg')
  #             expect(orders[0].lines[1].type).to.equal('airpair')
  #             expect(orders[0].lines[1].unitPrice).to.equal(120)
  #             DONE()


prodData = ->

  before -> SETUP.analytics.on()
  after -> SETUP.analytics.off()

  IT 'Richard can re-book byron', ->
    {byrn} = FIXTURE.experts
    SETUP.ensureExpert 'byrn', ->
    STORY.newUser 'ricd', {login:true,paymethod:true}, (s) ->
      request = _.extend {userId:s._id}, _.omit(FIXTURE.requests.preMigrateRebook,'userId')
      expect(request.budget, 150)
      expect(request.suggested[1].expert.rate, 110)
      DB.ensureDoc 'Request', request, ->
        GET "/requests/#{request._id}/book/#{byrn._id}", (r2) ->
          expect(r2.suggested[1].expert.name).to.equal("Byron Sommardahl")
          suggestion = r2.suggested[1]
          book = datetime: moment().add(1, 'day'), minutes: 60, type: 'private', payMethodId: s.primaryPayMethodId, request: { requestId: request._id, suggestion }
          POST "/bookings/#{byrn._id}", book, (booking1) ->
            expect(booking1.orderId).to.exist
            DB.docById 'Order', booking1.orderId, (order) ->
              expect(order.total).to.equal(146)
              DONE()


module.exports = ->

  @timeout 10000

  before (done) ->
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
    SETUP.ensureExpert 'dros', ->
    @braintreepaymentStub = SETUP.stubBraintreeChargeWithMethod()
    SETUP.ensureExpert 'tmot', ->
      done()

  after ->
    @braintreepaymentStub.restore()

  beforeEach ->
    STUB.sync(Wrappers.Slack, 'checkUserSync', null)
    STUB.cb(Wrappers.Slack, 'getUsers', FIXTURE.wrappers.slack_users_list)
    STUB.cb(Wrappers.Slack, 'getChannels', FIXTURE.wrappers.slack_channels_list)
    STUB.cb(Wrappers.Slack, 'getGroups', FIXTURE.wrappers.slack_groups_list)


  DESCRIBE "Credit", creditOrders
  DESCRIBE "Bookings", bookingOrders
  DESCRIBE "Prod data", prodData

