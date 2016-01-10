BookingUtil = require("../../../shared/bookings")

util = ->

  beforeEach ->
    STUB.SlackCommon()

  IT "Can get multiTime", ->
    tzBooking = FIXTURE.clone('bookings.timezones')
    tzBooking.datetime = ISODate("2016-06-25T00:00:00.000Z")
    expect(tzBooking.participants.length).to.equal(2)
    expect(tzBooking.participants[0].timeZoneId).to.equal("America/Los_Angeles")
    expect(tzBooking.participants[1].timeZoneId).to.equal("America/Chicago")
    multitime = BookingUtil.multitime(tzBooking)
    EXPECT.startsWith(multitime, "Sat 25 00:00 UTC | Fri 24 5PM PDT | Fri 24 7PM CDT")
    bOld = FIXTURE.clone('bookings.swap1')
    bOld.datetime = ISODate("2015-03-12T03:15:18.576Z")
    multitime2 = BookingUtil.multitime(bOld)
    EXPECT.startsWith(multitime2, "Thu 12 03:15 UTC")
    DONE()


  IT "Purpose for pending status", ->
    b = FIXTURE.clone('bookings.timezones')
    b.datetime = ISODate("2016-06-25T00:00:00.000Z")
    expect(b.status).to.equal("pending")
    expect(b.participants.length).to.equal(2)
    EXPECT.startsWith(b.participants[0].info.name, "Morgan")
    expect(b.participants[0].timeZoneId).to.equal("America/Los_Angeles")
    EXPECT.startsWith(b.participants[1].info.name, "Billy")
    expect(b.participants[1].timeZoneId).to.equal("America/Chicago")
    {name,purpose} = BookingUtil.chatGroup(b)
    EXPECT.startsWith(name, "morgan-billy")
    # During Daylight Savings
    purpose = purpose.replace /ST,/g, "DT,"
    EXPECT.startsWith(purpose, "http://booking.airpa.ir/558aa2454be238d1956cb8aa Morgan (PDT, San Francisco, CA, USA) + Billy (CDT, Houston, TX, USA). WAITING to confirm 90 mins @ Sat 25 00:00 UTC | Fri 24 5PM PDT | Fri 24 7PM CDT")
    DONE()


  IT "Purpose for confirmed status", ->
    b = _.extend _.extend({},FIXTURE.bookings.timezones), { datetime: ISODate("2016-06-25T00:00:00.000Z"), status: 'confirmed' }
    purpose = BookingUtil.chatGroup(b).purpose
    # During Daylight Savings
    purpose = purpose.replace /ST,/g, "DT,"
    EXPECT.startsWith(purpose, "http://booking.airpa.ir/558aa2454be238d1956cb8aa Morgan (PDT, San Francisco, CA, USA) + Billy (CDT, Houston, TX, USA). CONFIRMED 90 mins @ Sat 25 00:00 UTC | Fri 24 5PM PDT | Fri 24 7PM CDT")
    DONE()


  IT "Purpose for followup status", ->
    b = FIXTURE.clone('bookings.specChar')
    b = _.extend b, { datetime: ISODate("2016-05-25T11:30:00.000Z"), status: 'followup' }
    {name,purpose} = BookingUtil.chatGroup(b)
    EXPECT.startsWith(name, "michael-jj")
    # During Daylight Savings
    purpose = purpose.replace /ST,/g, "DT,"
    EXPECT.startsWith(purpose, "http://booking.airpa.ir/559dc6ff476dc61100a02069 Michael (PDT, San Francisco, CA, USA) + JJ (EDT, New York, NY, USA). FEEDBACK required to payout expert for 60 mins on Wed 25 11:30 UTC | 4:30AM PDT | 7:30AM EDT")
    DONE()


  IT "Purpose for old no timeZoneId bookings", ->
    bOld = FIXTURE.clone('bookings.noTimezones')
    bOld.datetime = ISODate("2015-03-12T03:30:18.576Z")
    purpose = BookingUtil.chatGroup(bOld).purpose
    # During Daylight Savings
    purpose = purpose.replace /ST,/g, "DT,"
    EXPECT.startsWith(purpose, "http://booking.airpa.ir/54dc2d2fd137810a00f2813b Daniel + Adam. FEEDBACK required to payout expert for 60 mins on Thu 12 03:30 UTC")
    DONE()


views = ->


  IT 'New booking from request can be viewed by creator', ->
    STORY.newRequest 'jkgm', {reply:{userKey:'gnic'},book:true}, (r1, b1, sCust, sExp2) ->
      GET "/bookings/#{b1._id}", (b2) ->
        expect(b2.orderId).to.be.undefined
        expect(b2.order._id).to.exist
        expect(b2.order.paidout is false).to.be.true
        expect(b2.requestId).to.be.undefined
        EXPECT.equalIds(r1._id,b2.request._id)
        expect(b2.request.brief).to.exist
        expect(b2.request.title).to.exist
        expect(b2.request.adm).to.be.undefined
        expect(b2.request.budget).to.be.undefined
        expect(b2.participants.length).to.equal(2)
        expect(b2.participants[1].chat, 'participants.chat missing').to.exist
        expect(b2.participants[1].info.name).to.equal('gregorynicholas')
        expect(b2.chat).to.be.undefined
        LOGIN {key:"admin"}, (sAdm) ->
          d = {type:'slack',providerId:"G06UFJCQ2"}
          # $log('try associate good!!!'.magenta, b1._id)
          PUT "/bookings/#{b1._id}/associate-chat", d, (b3) ->
            expect(b3.chat, 'b3.chat missing').to.exist
            LOGIN {key:'gnic'}, ->
              GET "/bookings/#{b1._id}", (b4) ->
                expect(b4.chat).to.exist
                DONE()


  # it 'New booking can be viewed by expert', ->
  # it 'Can be viewed by additional participants', ->


scheduling = ->

  before ->
    config.calendar.on = true

  beforeEach ->
    STUB.SlackCommon()

  after ->
    config.calendar.on = false


  IT 'New booking has default prefered uncomfirmed time', ->
    # expect("email to expert to include preferred time").to.be.true
    STORY.newUser 'clew', {login:true,location:true,paymethod:true}, (s) ->
      pairDateTime = moment().add(2, 'day')
      airpair1 = datetime: pairDateTime, minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, (b1) ->
        expect(b1._id).to.exist
        expect(b1.status).to.equal("pending")
        expect(b1.minutes).to.equal(120)
        expect(b1.suggestedTimes.length).to.equal(1)
        expect(b1.suggestedTimes[0]._id).to.exist
        expect(b1.suggestedTimes[0].confirmedById).to.be.undefined
        EXPECT.equalIds(b1.suggestedTimes[0].byId, s._id)
        expect(moment(b1.suggestedTimes[0].time).isSame(pairDateTime)).to.be.true
        expect(b1.lastTouch).to.be.undefined
        expect(b1.activity).to.be.undefined
        expect(b1.notes).to.be.undefined
        DB.docById 'Booking', b1._id, (b2) ->
          # EXPECT.touch(b2.lastTouch, s._id, "create")
          expect(b2.activity.length).to.equal(1)
          expect(b2.notes.length).to.equal(0)
          DONE()



  IT 'Can suggest time if in pending', ->
    time1 = moment().add(1, 'day')
    STORY.newBooking 'chle', data:{datetime:time1}, (s, b1) ->
      expect(b1.suggestedTimes.length).to.equal(1)
      EXPECT.equalMoments(b1.suggestedTimes[0].time,time1)
      time2 = moment().add(3, 'day')
      d = { _id:b1._id, time:time2}
      PUT "/bookings/#{b1._id}/suggest-time", d, {}, (b2) ->
        expect(b2.status).to.equal("pending")
        expect(b2.suggestedTimes.length).to.equal(2)
        expect(b2.suggestedTimes[0]._id).to.exist
        expect(b2.suggestedTimes[1]._id).to.exist
        EXPECT.equalMoments(b2.suggestedTimes[0].time,time1)
        EXPECT.equalIds(b2.suggestedTimes[0].byId, s._id)
        EXPECT.equalMoments(b2.suggestedTimes[1].time,time2)
        EXPECT.equalIds(b2.suggestedTimes[1].byId, s._id)
        DB.docById 'Booking', b1._id, (b3) ->
          expect(b3.activity.length).to.equal(2)
          EXPECT.touch(b3.activity[0], s._id, "create")
          EXPECT.touch(b3.activity[1], s._id, "suggest-time")
          EXPECT.touch(b3.lastTouch, s._id, "suggest-time")
          LOGIN {key:'dros'}, (sDros) ->
            time3 = moment().add(4, 'day')
            d2 = { _id:b1._id, time:time3}
            PUT "/bookings/#{b1._id}/suggest-time", d2, {}, (b4) ->
              expect(b4.status).to.equal("pending")
              expect(b4.suggestedTimes.length).to.equal(3)
              EXPECT.equalMoments(b4.suggestedTimes[0].time,time1)
              EXPECT.equalMoments(b4.suggestedTimes[1].time,time2)
              EXPECT.equalMoments(b4.suggestedTimes[2].time,time3)
              EXPECT.equalIds(b4.suggestedTimes[2].byId, sDros._id)
              DB.docById 'Booking', b1._id, (b5) ->
                expect(b5.activity.length).to.equal(3)
                EXPECT.touch(b5.lastTouch, sDros._id, "suggest-time")
                EXPECT.touch(b5.activity[1],s._id,"suggest-time")
                EXPECT.touch(b5.activity[2],sDros._id,"suggest-time")
                DONE()


  IT 'Can not confirm own suggested time', ->
    STORY.newBooking 'grnv', {}, (s, b1) ->
      timeId = b1.suggestedTimes[0]._id
      GET "/bookings", ->
        PUT "/bookings/#{b1._id}/confirm-time", {_id:b1._id, timeId}, {status:403}, (err) ->
          EXPECT.startsWith(err.message, 'Cannot confirm your own time')
          DONE()


  IT 'Can confirm customer booking suggested time by expert', ->
    stubCal = STUB.wrapper('Calendar').api('events.insert').fix('google_cal_create')
    # $log('stubCal', stubCal)
    # email notifications sent
    # stubMail = SETUP.stub mailman, 'send'
    spyPairbot = STUB.spy pairbot, 'sendSlackMsg'
    datetime = moment().add(10, 'day')
    slackChatId = "G06UFP6AX"
    STORY.newBooking 'gniv', data:{datetime,slackChatId}, (s, b1) ->
      LOGIN {key:'dros'}, (sDros) ->
        timeId = b1.suggestedTimes[0]._id
        PUT "/bookings/#{b1._id}/confirm-time", {_id:b1._id, timeId}, {}, (b2) ->
          expect(b2.lastTouch).to.be.undefined
          expect(b2.activity).to.be.undefined
          expect(b2.notes).to.be.undefined
          expect(b2.status).to.equal("confirmed")
          EXPECT.equalMoments(b2.datetime, datetime)
          expect(spyPairbot.calledOnce).to.be.true
          expect(spyPairbot.args[0][0]).to.equal("G06UFP6AX")
          expect(spyPairbot.args[0][1]).to.equal('booking-confirm-time')
          expect(spyPairbot.args[0][2].byName).to.equal(sDros.name)
          expect(b2.suggestedTimes.length).to.equal(1)
          EXPECT.equalIds(b2.suggestedTimes[0].byId,s._id)
          EXPECT.equalIds(b2.suggestedTimes[0].confirmedById,sDros._id)
          expect(stubCal.calledOnce).to.be.true
          DB.docById 'Booking', b1._id, (b3) ->
            EXPECT.touch(b3.lastTouch, sDros._id, "confirm-time")
            EXPECT.touch(b3.activity[0],s._id, "create")
            EXPECT.touch(b3.activity[1],FIXTURE.users.admin._id, "associate-chat")
            EXPECT.touch(b3.activity[2],sDros._id, "confirm-time")
            DONE()


  IT 'Expert can suggest alternative which can be confirmed by customer', ->
    stubCal = STUB.wrapper('Calendar').api('events.insert').fix('google_cal_create')
    # email notifications sent
    stubMail = STUB.callback mailman, 'send', {}
    stubPairBot = STUB.callback pairbot, 'sendSlackMsg', {}
    datetime = moment().add(11, 'day')
    STORY.newBooking 'kelf', data:{datetime,expertKey:'gnic'}, (s, b1) ->
      expect(b1.suggestedTimes.length).to.equal(1)
      suggestedTimeOriginal = b1.suggestedTimes[0]
      expect(suggestedTimeOriginal._id).to.exist
      DB.docById 'Booking', b1._id, (b1raw) ->
        EXPECT.ObjectId(b1raw.suggestedTimes[0]._id)
      LOGIN {key:'gnic'}, (sGnic) ->
        time2 = moment().add(17, 'day')
        d = { _id:b1._id, time:time2}
        PUT "/bookings/#{b1._id}/suggest-time", d, (b2) ->
          expect(b2.lastTouch).to.be.undefined
          expect(b2.activity).to.be.undefined
          expect(b2.notes).to.be.undefined
          expect(b2.status).to.equal("pending")
          EXPECT.equalMoments(b2.datetime, datetime)
          expect(b2.suggestedTimes.length).to.equal(2)
          expect(b2.suggestedTimes[0]._id).to.exist
          expect(b2.suggestedTimes[1]._id).to.exist
          expect(stubPairBot.calledOnce).to.be.false
          LOGIN {key:s.userKey}, ->
            EXPECT.equalIds(b2.suggestedTimes[1].byId,sGnic._id)
            timeId = b2.suggestedTimes[1]._id
            PUT "/bookings/#{b1._id}/confirm-time", {_id:b1._id, timeId}, {}, (b3) ->
              expect(b3.status).to.equal("confirmed")
              EXPECT.equalMoments(b3.datetime, time2)
              expect(stubPairBot.calledOnce).to.be.false
              expect(stubCal.calledOnce).to.be.true
              expect(b3.suggestedTimes.length).to.equal(2)
              EXPECT.equalMoments(b3.suggestedTimes[0].time,datetime)
              EXPECT.equalIds(b3.suggestedTimes[0].byId,s._id)
              expect(b3.suggestedTimes[0].confirmedById).to.be.undefined
              EXPECT.equalMoments(b3.suggestedTimes[1].time,time2)
              EXPECT.equalIds(b3.suggestedTimes[1].byId,sGnic._id)
              EXPECT.equalIds(b3.suggestedTimes[1].confirmedById,s._id)
              DB.docById 'Booking', b1._id, (bDb1) ->
                EXPECT.touch(bDb1.lastTouch, s._id, "confirm-time")
                EXPECT.touch(bDb1.activity[0],s._id, "create")
                EXPECT.touch(bDb1.activity[1],sGnic._id, "suggest-time")
                EXPECT.touch(bDb1.activity[2],s._id, "confirm-time")
                DONE()



recordings = ->

  beforeEach ->
    STUB.SlackCommon()

  # describe.skip "YouTube Wrapper", ->

  #   @timeout 9000000

  # it "can get all channels", itDone ->
  #   Wrappers.YouTube.getAllChannels (e,r) ->
  #     DONE()

  # it.skip "can get all videos", itDone ->
  #   Wrappers.YouTube.getAllVideos (e,r) ->
  #     DONE()

  # it "can update all video privacy", itDone ->
  #   Wrappers.YouTube.updateAllPrivacy 'private', (e,r) ->
  #     DONE()



  IT "given a YouTube ID, allows a booking to be annotated with YouTube data", ->
    listStub = STUB.wrapper('YouTube').api('videos.list').fix('youtube_api_codereview_list')
    slackGroupSearchStub = STUB.wrapper('Slack').cb('searchGroupsByName','slack_groups_list')
    STORY.newUser 'miks', {login:true,location:true,paymethod:true}, (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.orderId).to.exist
        expect(booking1.order).to.be.undefined
        expect(booking1.type).to.exist
        expect(booking1.participants.length).to.equal(2)
        LOGIN {key:'admin'},(sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "MEv4SuSJgwk"}, {}, (booking) ->
            expect(booking.status).to.equal("followup")
            expect(booking.recordings.length).to.equal(1)
            # expect(booking.recordings[0].title).to.equal("Online Rails Code Review with RoR Expert Edward Anderson - AirPair")
            expect(booking.recordings[0].type).to.equal("youtube")
            # listStub.restore()
            DONE()


  IT "fails gracefully with a bogus YouTube id", ->
    STORY.newUser 'mrik', {login:true,location:true,paymethod:true}, (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, {}, (booking1) ->
        LOGIN {key:'admin'}, (sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "MEv4SuSJgw"}, {status: 400}, (booking) ->
            expect(booking.message).to.equal("No YouTube video found")
            DONE()


  IT "fails gracefully with a private YouTube id that it does not own", ->
    STORY.newUser 'misr', {login:true,location:true,paymethod:true}, (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, {}, (booking1) ->
        LOGIN {key:'admin'}, (sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "VfA4ELOHjmk"}, {status: 400}, (booking) ->
            expect(booking.message).to.equal("No YouTube video found")
            DONE()


  #owner of VfA4ELOHjmk is experts@airpair.com
  it.skip "works with a private YouTube id if the owner is in process.env.AUTH_GOOGLE_REFRESH_TOKEN" , ->
    # SETUP.addAndLoginLocalUserWhoCanMakeBooking 'cher', (s) ->
    #   airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
    #   POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, {}, (booking1) ->
    #     expect(booking1._id).to.exist
    #     expect(booking1.customerId).to.exist
    #     expect(booking1.minutes).to.equal(120)
    #     expect(booking1.order).to.exist
    #     expect(booking1.type).to.exist
    #     expect(booking1.participants.length).to.equal(2)
    #     LOGIN {key:'admin'}, (sadm) ->
    #       url = "/adm/bookings/#{booking1._id}/recording"
    #       PUT url, {youTubeId: "VfA4ELOHjmk"}, {}, (booking) ->
    #         expect(booking.message).to.equal("No YouTube video found")
    #         DONE()


  it "Delete recording"


  it "Set alternate recording source"
    # screenhero etc.


feedback = ->

  # beforeEach ->
  #   @listStub = SETUP.stubYouTube 'videos','list',null,FIXTURE.wrappers.youtube_codereview_list

  # afterEach ->
  #   @listStub.restore()


  it 'Cannot insert expert or booking review more than once by the same user'
    # SETUP.addAndLoginLocalUser "stcx", (s) ->
    #   review = type: 'expert-review', by: { _id: ObjectId(s._id), name: s.name, email: s.email }
    #   jkgm = _.extend _.cloneDeep(FIXTURE.experts.jkgm), { reviews:[review] }
    #   db.ensureDocs 'Expert', [jkgm], ->
    #     db.readDoc 'Expert', jkgm._id, (r1) ->
    #       $log('r1'.yellow, r1.reviews.length)
    #       expect(r1.reviews.length).to.equal(1)
    #       review2 = _.extend {update:1}, review
    #       jkgm.reviews.push(review2)
    #       twoReviews = jkgm.reviews
    #       # db.Models.Expert.findOneAndUpdate {_id:r1._id},{$set:{reviews:twoReviews}}, (e2, r2) ->
    #         # $log('reviews2'.yellow, e2, r2.reviews)
    #         # db.ensureDocs 'Expert', [jkgm], ->
    #         # db.readDoc 'Expert', jkgm._id, (r2) ->
    #           # expect(r1.reviews.length).to.equal(1)
    #         DONE()


  it 'Cannot give feedback in pending, confirmed or canceled state'
  # describe.skip 'Skip', ->

  #   IT 'Cannot give feedback in pending, confirmed or canceled state', ->
  #     SETUP.newBookedExpert 'stco', {}, (s, b1) ->
  #       expect(b1.status).to.equal('pending')
  #       PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", {}, {status:403}, (e) ->
  #         EXPECT.startsWith(e.message,"Booking [#{b1._id}] must be in folloup or complete state")
  #         LOGIN {key:'dros'}, (sDros) ->
  #           timeId = b1.suggestedTimes[0]._id
  #           PUT "/bookings/#{b1._id}/confirm-time", {_id:b1._id, timeId}, {}, (b2) ->
  #             expect(b2.status).to.equal("confirmed")
  #             LOGIN {key:s.userKey}, (s2) ->
  #               PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", {}, {status:403}, (e2) ->
  #                 EXPECT.startsWith(e2.message,"Booking [#{b1._id}] must be in folloup or complete state")
  #                 LOGIN {key:"admin"}, ->
  #                   d = _.extend(_.pick(b2,'type','minutes','createdById','status','datetime','gcal'),{status:'canceled'})
  #                   PUT "/adm/bookings/#{b1._id}", d, {}, (b3) ->
  #                     expect(b3.status).to.equal("canceled")
  #                     LOGIN {key:s.userKey}, (s3) ->
  #                       PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", {}, {status:403}, (e3) ->
  #                         EXPECT.startsWith(e3.message,"Booking [#{b1._id}] must be in folloup or complete state")
  #                         DONE()

  it 'Can give booking feedback as the customer without expert feedback'
  # IT 'Can give booking feedback as the customer without expert feedback', ->
  #   SETUP.newBookingInFollowupState 'stcx', {}, (b1, sCust, sExp) ->
  #     PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", {}, {status:403}, (e) ->
  #       EXPECT.startsWith(e.message,"Booking customer feedback review required")
  #       rev1 = { questions: [
  #         { idx: 0, key: 'rating', promt: 'How many stars?', answer: "Awesome 1" }] }
  #       body1 = { review: rev1 }
  #       PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", body1, {}, (b3) ->
  #         expect(b3.status).to.equal('followup')
  #         expect(b3.reviews.length).to.equal(1)
  #         EXPECT.equalIds(b3.reviews[0].by._id,sCust._id)
  #         expect(b3.reviews[0].type).to.equal('booking-customer-feedback')
  #         expect(b3.reviews[0].questions.length).to.equal(1)
  #         expect(b3.reviews[0].questions[0].key).to.equal('rating')
  #         expect(b3.reviews[0].questions[0].answer).to.equal('Awesome 1')
  #         ## TODO update feedback
  #         ## TODO check using db.readDoc
  #         DONE()


  #   IT 'Can give customer feedback as the customer with expert feedback', ->

  it 'Cannot give customer feedback if not a customer'
  #   IT 'Cannot give customer feedback if not a customer', ->
  #     SETUP.newBookedExpert 'stec', {}, (s, b1) ->
  #       LOGIN {key:'admin'}, (sadm) ->
  #         PUT "/adm/bookings/#{b1._id}/recording", {youTubeId: "MEv4SuSJgwk"}, {}, (b2) ->
  #           expect(b2.status).to.equal("followup")
  #           LOGIN {key:'dros'}, ->
  #             PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", {}, {status:403}, (e) ->
  #               EXPECT.startsWith(e.message,"Not a customer on booking")
  #               DONE()



  # IT 'Cannot release a payment if not customer or admin', ->
  #   STORY.newExpert 'dros', { payoutmethod: true }, (expert, expertSession, payoutmethod) ->
  #     expertKey = expertSession.userKey
  #     STORY.newBooking 'anca', data:{expertKey}, (s, booking1) ->
  #       LOGIN {key:expertKey}, ->
  #         PUT "/billing/orders/#{booking1.orderId}/release", {}, {status:403}, (err) ->
  #           EXPECT.startsWith(err.message, "Payout[#{booking1.orderId}] must be released by owner")
  #           GET "/billing/orders/payouts", {}, (orders) ->
  #             expect(orders.length).to.equal(1)
  #             expect(orders[0].lines.length).to.equal(1)
  #             expect(orders[0].lines[0].type).to.equal('airpair')
  #             expect(orders[0].lines[0].info.released).to.be.undefined
  #             summary = payoutSummary(orders)
  #             expect(summary.owed.count).to.equal(0)
  #             expect(summary.paid.count).to.equal(0)
  #             expect(summary.pending.count).to.equal(1)
  #             DONE()



module.exports = ->

  @timeout 60000

  before (done) ->
    global.moment = require("moment-timezone")
    DB.ensureExpert 'gnic', ->
      DB.ensureExpert 'dros', ->
        done()

  beforeEach ->
    cache.slack_users = FIXTURE.wrappers.slack_users_list
    STUB.BraintreeCharge()

  after ->
    cache.slack_users = undefined


  DESCRIBE("Util", util)
  DESCRIBE("Viewing", views)
  DESCRIBE("Scheduling", scheduling)
  DESCRIBE("Recordings", recordings)
  # DESCRIBE("Feedback", feedback)
  # DESCRIBE("Escrow", escrow)

