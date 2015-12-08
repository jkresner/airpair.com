{payoutSummary} = require('../../../shared/orders')

releaseOrderAndLogExpertBackIn = (orderId, expertSession, cb) ->
  LOGIN {key:'admin'}, ->
    PUT "/billing/orders/#{orderId}/release", {}, (released) ->
      LOGIN {key:expertSession.userKey}, cb


get = ->


  IT 'Non expert gets 403 on orders to payout', ->
    STORY.newUser 'bfie', (s) ->
      GET "/billing/orders/payouts", { status: 403 }, (orders) ->
        DONE()


  IT 'New expert sees empty orders list to be paid out', ->
    STORY.newExpert 'tmot', (eSession, expert) ->
      GET "/billing/orders/payouts", (orders) ->
        expect(orders.length).to.equal(0)
        DONE()


  IT 'Booked expert can see single transaction pending', ->
    STORY.newExpert 'dymo', (s, expert) ->
      opts = book: true, reply: { userKey: s.userKey }
      STORY.newRequest 'rusc', opts, (request, booking, customerSession, expertSession) ->
        LOGIN {key:s.userKey}, ->
          GET "/billing/orders/payouts", (orders) ->
            expect(orders.length).to.equal(1)
            expect(orders[0].total).to.be.undefined
            expect(orders[0].profit).to.be.undefined
            expect(orders[0].userId).to.equal(customerSession._id)
            expect(orders[0].by.name).to.equal(customerSession.name)
            expect(orders[0].lines.length).to.equal(1)
            expect(orders[0].lines[0].type).to.equal('airpair')
            expect(orders[0].lines[0].info.expert._id).to.equal(booking.expertId)
            expect(orders[0].lines[0].info.paidout).to.equal(false)
            expect(orders[0].lines[0].owed).to.equal(70)
            expect(orders[0].lines[0].total).to.be.undefined
            expect(orders[0].lines[0].profit).to.be.undefined
            expect(orders[0].lines[0].info.released).to.be.undefined
            summary = payoutSummary(orders)
            expect(summary.owed.count).to.equal(0)
            expect(summary.owed.total).to.equal(0)
            expect(summary.paid.count).to.equal(0)
            expect(summary.paid.total).to.equal(0)
            expect(summary.pending.count).to.equal(1)
            expect(summary.pending.total).to.equal(70)
            DONE()



  IT 'Expert can see multiple transactions pending', ->
    STORY.newExpert 'dces', (sExp, expert) ->
      opts = book: true, reply: { userKey: sExp.userKey }
      STORY.newRequest 'dros', opts, (request1, booking1, customerSession1, expertSession) ->
        opts2 = book: true, reply: { userKey: sExp.userKey }
        STORY.newRequest 'brfi', opts2, (request2, booking2, customerSession2, expertSession) ->
          LOGIN {key:sExp.userKey}, ->
            GET "/billing/orders/payouts", (orders) ->
              expect(orders.length).to.equal(2)
              summary = payoutSummary(orders)
              expect(summary.owed.count).to.equal(0)
              expect(summary.owed.total).to.equal(0)
              expect(summary.paid.count).to.equal(0)
              expect(summary.paid.total).to.equal(0)
              expect(summary.pending.count).to.equal(2)
              expect(summary.pending.total).to.equal(140)
              DONE()


  IT 'Expert can see single transaction released by admin', ->
    STORY.newExpert 'admb', (sExp, expert) ->
      opts = book: true, reply: { userKey: sExp.userKey }
      STORY.newRequest 'kyau', opts, (request, booking, customerSession, expertSession) ->
        LOGIN { key:'admin' }, ->
          PUT "/billing/orders/#{booking.orderId}/release", {}, (released) ->
            expect(released.lines.length).to.equal(2)
            expect(released.lines[1].info.paidout).to.equal(false)
            expect(released.lines[1].info.released).to.exist
            expect(released.lines[1].info.released.by).to.exist
            expect(released.lines[1].info.released.action).to.equal('release')
            LOGIN {key:sExp.userKey}, ->
              GET "/billing/orders/payouts", (orders) ->
                expect(orders.length).to.equal(1)
                expect(orders[0].lines.length).to.equal(1)
                expect(orders[0].lines[0].type).to.equal('airpair')
                expect(orders[0].lines[0].info.paidout).to.equal(false)
                expect(orders[0].lines[0].owed).to.equal(70)
                expect(orders[0].lines[0].total).to.be.undefined
                expect(orders[0].lines[0].profit).to.be.undefined
                expect(orders[0].lines[0].info.released).to.exist
                expect(orders[0].lines[0].info.released.utc).to.exist
                EXPECT.equalIds(orders[0].lines[0].info.released.by._id, FIXTURE.users.admin._id)
                summary = payoutSummary(orders)
                expect(summary.owed.count).to.equal(1)
                expect(summary.owed.total).to.equal(70)
                expect(summary.paid.count).to.equal(0)
                expect(summary.paid.total).to.equal(0)
                expect(summary.pending.count).to.equal(0)
                expect(summary.pending.total).to.equal(0)
                DONE()


  it 'Expert can see multiple transactions owed'
  # IT 'Expert can see multiple transactions owed', ->
  #   SETUP.newBookedRequest 'mikf', {}, 'mper', (request1, booking1, customerSession1, expertSession) ->
  #     SETUP.newBookedRequestWithExistingExpert 'mfly', {}, expertSession, (request2, booking2, customerSession2, expertSession) ->
  #       LOGIN 'admin', ->
  #         PUT "/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
  #           PUT "/billing/orders/#{booking2.orderId}/release", {}, {}, (released2) ->
  #             LOGIN expertSession.userKey, ->
  #               GET "/billing/orders/payouts", {}, (orders) ->
  #                 expect(orders.length).to.equal(2)
  #                 summary = payoutSummary(orders)
  #                 expect(summary.owed.count).to.equal(2)
  #                 expect(summary.owed.total).to.equal(140)
  #                 expect(summary.paid.count).to.equal(0)
  #                 expect(summary.paid.total).to.equal(0)
  #                 expect(summary.pending.count).to.equal(0)
  #                 expect(summary.pending.total).to.equal(0)
  #                 DONE()



  IT 'Expert can see multiple transactions of mixed status', ->
    STORY.newExpert 'phlf', (sExp, expert) ->
      opts = book: true, reply: { userKey: sExp.userKey }
      opts1 = book: true, reply: { userKey: sExp.userKey }
      STORY.newRequest 'hubi', opts1, (request1, booking1, customerSession1, expertSession) ->
        STORY.newRequest 'acob', opts1, (request2, booking2, customerSession2, expertSession) ->
          STORY.newRequest 'jkjk', opts1, (request3, booking3, customerSession3, expertSession) ->
            LOGIN {key:'admin'},  ->
              PUT "/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
                # PUT "/billing/orders/#{booking2.orderId}/release", {}, {}, (released2) ->
                LOGIN {key:sExp.userKey}, ->
                  GET "/billing/orders/payouts", (orders) ->
                    expect(orders.length).to.equal(3)
                    summary = payoutSummary(orders)
                    expect(summary.owed.count).to.equal(1)
                    expect(summary.owed.total).to.equal(70)
                    expect(summary.paid.count).to.equal(0)
                    expect(summary.paid.total).to.equal(0)
                    expect(summary.pending.count).to.equal(2)
                    expect(summary.pending.total).to.equal(140)
                    DONE()


  IT 'Paypal sandbox works', ->
    # These can start failing with 500 INTERNAL ERROR if there isn't enough
    # balance in the test account (really annoying)
    @payoutStub.restore()
    pp = require('../../../server/services/wrappers/paypal')
    payoutId = DATA.newId()
    pp.payout "expert_engb_verified@airpair.com",90,payoutId,'note', (e,p) ->
      # $log('e', e, 'p', JSON.stringify(p))
      expect(e).to.be.null
      expect(p.items[0].transaction_status).to.equal("SUCCESS")
      DONE()


  IT 'Paypal sandbox passes back error for non existing address', ->
    @payoutStub.restore()
    pp = require('../../../server/services/wrappers/paypal')
    payoutId = DATA.newId()
    pp.payout "expert_nonexisting@airpair.com",90,payoutId,'note', (e,p) ->
      # $log('e', e, 'p', JSON.stringify(p))
      expect(e).to.exist
      expect(p.items[0].transaction_status).to.equal("UNCLAIMED")
      DONE()


  IT 'Expert can collect a single released transaction to their verified paypal account', ->
    STORY.newExpert 'admb', {payoutmethod:true}, (expert, expertSession, payoutmethod) ->
      opts = book:true, payoutmethod:true, reply: expertSession
      STORY.newRequest 'jbay', opts, (request, booking, customerSession) ->
        releaseOrderAndLogExpertBackIn booking.orderId, expertSession, ->
          GET "/billing/orders/payouts", (orders) ->
            expect(orders.length).to.equal(1)
            lineToPayout = orders[0].lines[0]
            expect(lineToPayout.info.paidout).to.equal(false)
            expect(lineToPayout.info.released.utc).to.exist
            summary = payoutSummary(orders)
            expect(summary.owed.count).to.equal(1)
            expect(summary.owed.total).to.equal(70)
            d = orders: _.pluck(orders,'_id')
            POST "/payouts/#{payoutmethod._id}", d, (payout) ->
              expect(payout._id).to.exist
              EXPECT.equalIds(payout.userId, expertSession._id)
              expect(payout.total).to.equal(70)
              expect(payout.payment).to.exist
              EXPECT.equalIds(payout.payMethodId, payoutmethod._id)
              expect(payout.lines.length).to.equal(1)
              expect(payout.lines[0]._id).to.exist
              EXPECT.equalIds(payout.lines[0].order._id, orders[0]._id)
              expect(payout.lines[0].order.by.email).to.equal(customerSession.email)
              EXPECT.equalIds(payout.lines[0].order.lineItemId, lineToPayout._id)
              expect(payout.lines[0].total).to.equal(70)
              expect(payout.lines[0].type).to.equal('airpair')
              GET "/billing/orders/payouts", (orders2) ->
                expect(orders2.length).to.equal(1)
                paidoutLine = orders2[0].lines[0]
                expect(paidoutLine.info.paidout).to.equal(payout._id)
                expect(paidoutLine.info.released.utc).to.exist
                summary2 = payoutSummary(orders2)
                expect(summary2.owed.count).to.equal(0)
                expect(summary2.owed.total).to.equal(0)
                expect(summary2.paid.count).to.equal(1)
                expect(summary2.paid.total).to.equal(70)
                expect(summary2.pending.count).to.equal(0)
                expect(summary2.pending.total).to.equal(0)
                POST "/payouts/#{payoutmethod._id}", d, {status:403}, (error) ->
                  expect(error.message.indexOf('Cannot payout.')).to.equal(0)
                  DONE()


  it 'Can collect a single payout released by the customer'
  # it.skip 'Can collect a single payout released by the customer', ->
  #   pairbotStub = sinon.stub(pairbot,'sendSlackMsg',->)
  #   db.ensureDoc 'Chat', data.chats.tst1, ->
  #   SETUP.newLoggedInExpertWithPayoutmethod 'gior', (expert, expertSession, payoutmethod) ->
  #     SETUP.newBookedExpert 'jkap', {expertId:expert._id, payoutmethodId:payoutmethod._id}, (s, booking1) ->
  #       LOGIN "admin", ->
  #         providerId = data.chats.tst1.providerId
  #         PUT "/adm/bookings/#{booking1._id}/associate-chat", {type:'slack',providerId}, {}, (bChat) ->
  #           LOGIN s.userKey, ->
  #             PUT "/billing/orders/#{booking1.orderId}/release", {}, {}, (released1) ->
  #               expect(released1.lines.length).to.equal(2)
  #               expect(released1.lines[1].info.paidout).to.equal(false)
  #               expect(released1.lines[1].info.released).to.exist
  #               expect(released1.lines[1].info.released.action).to.equal('release')
  #               EXPECT.equalIds(released1.lines[1].info.released.by._id, s._id)
  #               expect(pairbotStub.calledOnce, "pairbot not called").to.be.true
  #               expect(pairbotStub.args[0][0]).to.equal(providerId)
  #               expect(pairbotStub.args[0][1]).to.equal('expert-payment-released')
  #               expect(pairbotStub.args[0][2].byName).to.equal(s.name)
  #               EXPECT.equalIds(pairbotStub.args[0][2].bookingId,booking1._id)
  #               pairbotStub.restore()
  #               PUT "/billing/orders/#{booking1.orderId}/release", {}, {status:403}, (err2) ->
  #                 EXPECT.startsWith(err2.message, "Order[#{booking1.orderId}] has already been released")
  #                 LOGIN expertSession.userKey, ->
  #                   GET "/billing/orders/payouts", {}, (orders) ->
  #                     expect(orders.length).to.equal(1)
  #                     expect(orders[0].lines.length).to.equal(1)
  #                     expect(orders[0].lines[0].type).to.equal('airpair')
  #                     expect(orders[0].lines[0].info.released).to.exist
  #                     expect(orders[0].lines[0].info.released.utc).to.exist
  #                     EXPECT.equalIds(orders[0].lines[0].info.released.by._id, s._id)
  #                     summary = payoutSummary(orders)
  #                     expect(summary.owed.count).to.equal(1)
  #                     expect(summary.paid.count).to.equal(0)
  #                     expect(summary.pending.count).to.equal(0)
  #                     DONE()


  IT 'Cannot release a payment if not customer or admin', ->
    STORY.newExpert 'dros', { payoutmethod: true }, (expert, expertSession, payoutmethod) ->
      expertKey = expertSession.userKey
      STORY.newBooking 'anca', data:{expertKey}, (s, booking1) ->
        LOGIN {key:expertKey}, ->
          PUT "/billing/orders/#{booking1.orderId}/release", {}, {status:403}, (err) ->
            EXPECT.startsWith(err.message, "Payout[#{booking1.orderId}] must be released by owner")
            GET "/billing/orders/payouts", {}, (orders) ->
              expect(orders.length).to.equal(1)
              expect(orders[0].lines.length).to.equal(1)
              expect(orders[0].lines[0].type).to.equal('airpair')
              expect(orders[0].lines[0].info.released).to.be.undefined
              summary = payoutSummary(orders)
              expect(summary.owed.count).to.equal(0)
              expect(summary.paid.count).to.equal(0)
              expect(summary.pending.count).to.equal(1)
              DONE()


  it 'Expert can not collect single released transaction with no paymethod'
  # IT 'Expert can not collect single released transaction with no paymethod', ->
  #   STORY.newLoggedInExpert 'abha', (expert, expertSession) ->
  #     STORY.newBookedRequestWithExistingExpert 'jbbb', {}, expertSession, (request, booking, customerSession, expertSession) ->
  #       STORY.releaseOrderAndLogExpertBackIn booking.orderId, expertSession, ->
  #         GET "/billing/orders/payouts", {}, (orders) ->
  #           d = orders: _.pluck(orders,'_id')
  #           fakePayoutmethodId = newId()
  #           POST "/payouts/#{fakePayoutmethodId}", d, {status:404}, (error) ->
  #             DONE()



  IT 'Expert can not pay out single pending transaction to their verified payout account', ->
    STORY.newExpert 'mkod', {payoutmethod:true}, (expert, expertSession, payoutmethod) ->
      expertKey = expertSession.userKey
      STORY.newBooking 'peco', data:{expertKey}, (request, booking, customerSession) ->
        LOGIN {key:expertKey}, (sExp) ->
          GET "/billing/orders/payouts", (orders) ->
            d = orders: _.pluck(orders,'_id')
            POST "/payouts/#{payoutmethod._id}", d, {status:403}, (error) ->
              expect(error.message.indexOf('Cannot payout. Order')).to.equal(0)
              DONE()


  IT 'Expert can pay out combined transaction to their payout account', ->
    STORY.newExpert 'mper', {payoutmethod:true}, (expert, expertSession, payoutmethod) ->
      expertKey = expertSession.userKey
      STORY.newBooking 'rusc', data:{expertKey,minutes:60}, (request1, booking1, customerSession1) ->
        STORY.newBooking 'kaun', data:{expertKey,minutes:60}, (request2, booking2, customerSession2) ->
          STORY.newBooking 'spur', data:{expertKey,minutes:60}, (request3, booking3, customerSession3) ->
            LOGIN {key:'admin'}, ->
              PUT "/billing/orders/#{booking1.orderId}/release", {}, (released1) ->
                PUT "/billing/orders/#{booking2.orderId}/release", {}, (released2) ->
                  PUT "/billing/orders/#{booking3.orderId}/release", {}, (released3) ->
                    LOGIN {key:expertKey}, ->
                      GET "/billing/orders/payouts", (orders) ->
                        expect(orders.length).to.equal(3)
                        summary = payoutSummary(orders)
                        expect(summary.owed.count).to.equal(3)
                        expect(summary.owed.total).to.equal(210)
                        d = orders: _.pluck(orders,'_id')
                        POST "/payouts/#{payoutmethod._id}", d, (payout) ->
                          expect(payout._id).to.exist
                          EXPECT.equalIds(payout.userId, expertSession._id)
                          expect(payout.total).to.equal(210)
                          expect(payout.lines.length).to.equal(3)
                          DONE()


  IT 'Expert can see payout history', ->
    STORY.newExpert 'louf', {payoutmethod:true}, (expert, expertSession, payoutmethod) ->
      opts = data:{expertKey:expertSession.userKey,minutes:60}
      STORY.newBooking 'dysn', opts, (request1, booking1, customerSession1) ->
        STORY.newBooking 'dily', opts, (request2, booking2, customerSession2) ->
          STORY.newBooking 'chuc', opts, (request3, booking3, customerSession3) ->
            LOGIN {key: 'admin'}, ->
              PUT "/billing/orders/#{booking1.orderId}/release", {}, (released1) ->
                PUT "/billing/orders/#{booking2.orderId}/release", {}, (released2) ->
                  PUT "/billing/orders/#{booking3.orderId}/release", {}, (released3) ->
                    LOGIN {key: expertSession.userKey}, (s) ->
                      GET "/billing/orders/payouts", (orders) ->
                        d1 = orders: [orders[0]._id,orders[1]._id]
                        POST "/payouts/#{payoutmethod._id}", d1, (payout1) ->
                          expect(payout1.total).to.equal(140)
                          EXPECT.equalIds(payout1.lines[0].order._id,orders[1]._id)
                          EXPECT.equalIds(payout1.lines[1].order._id,orders[0]._id)
                          d2 = orders: [orders[2]._id]
                          POST "/payouts/#{payoutmethod._id}", d2, (payout2) ->
                            expect(payout2.total).to.equal(70)
                            GET "/payouts/me", (payouts) ->
                              expect(payouts.length).to.equal(2)
                              expect(payouts[0].total).to.equal(140)
                              expect(payouts[1].total).to.equal(70)
                              DONE()


  it 'Expert can collect payment from part deal completion'
  # IT 'Expert can collect payment from part deal completion', ->
  #   STORY.newExpert 'snug', {payoutmethod:true}, (expert, expertSession, payoutmethod) ->
  #     deal = { price: 1200, minutes: 500, type: 'offline', target: { type: 'all' } }
  #     POST "/experts/#{expert._id}/deal", deal, {}, (e2) ->
  #       expect(e2.deals.length).to.equal(1)
  #       expect(e2.deals[0].rake).to.equal(10)
  #       STORY.addAndLoginLocalUserWhoCanMakeBooking 'del4', (s) ->
  #         b = dealId: e2.deals[0]._id, payMethodId: s.primaryPayMethodId
  #         POST "/billing/orders/deal/#{expert._id}", b, {}, (order) ->
  #           b1 = dealId: b.dealId, datetime: moment().add(2, 'day'), minutes: 250, type: 'offline', payMethodId: s.primaryPayMethodId
  #           POST "/bookings/#{expert._id}", b1, {}, (booking) ->
  #             expect(booking._id).to.exist
  #             LOGIN 'admin', ->
  #               PUT "/billing/orders/#{booking.orderId}/release", {}, {}, (released1) ->
  #                 expect(released1._id).to.exist
  #                 LOGIN expertSession.userKey, ->
  #                   GET "/billing/orders/payouts", {}, (orders) ->
  #                     expect(orders.length).to.equal(1)
  #                     d1 = orders: [orders[0]._id]
  #                     POST "/payouts/#{payoutmethod._id}", d1, {}, (payout1) ->
  #                       expect(payout1.total).to.equal(540)
  #                       EXPECT.equalIds(payout1.lines[0].order._id,orders[0]._id)
  #                       GET "/payouts/me", {}, (payouts) ->
  #                         expect(payouts.length).to.equal(1)
  #                         expect(payouts[0].total).to.equal(540)
  #                         DONE()



  it 'Expert can see payout history including v0 payouts', ->
  # IT 'Expert can see payout history including v0 payouts', ->
    # {v0Payout} = FIXTURE.orders
    # $log('v0Payout', v0Payout)
    # SETUP.ensureExpert 'evan', (sEvan) ->
    #   DB.ensureDocs 'Order', [v0Payout], ->
    #     LOGIN {key:'evan'}, ->
    #       GET "/billing/orders/payouts", (orders) ->
    #         expect(orders.length).to.equal(1)
    #         expect(orders[0].lines.length).to.equal(1)
    #         li = orders[0].lines[0]
    #         expect(li.owed).to.equal(70)
    #         expect(li.type).to.equal('airpair')
    #         expect(li.suggestion).to.be.undefined
    #         EXPECT.equalIds(li.info.expert.userId,sEvan._id)
    #         expect(li.info.paidout).to.be.true
    #         expect(li.info.bookingIds.length).to.equal(1)
    #         DONE()


module.exports = ->

  @timeout 10000

  before (done) ->
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
      done()

  beforeEach (done) ->
    @payoutStub = STUB.PayPalPayout()
    STUB.SlackCommon()
    STUB.BraintreeCharge()
    done()


  DESCRIBE("Get", get)





