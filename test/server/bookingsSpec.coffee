BookingUtil = require("../../shared/bookings")

views = ->

  it "Can get multiTime", itDone ->
    tzBooking = data.bookings.timezones
    tzBooking.datetime = ISODate("2016-06-25T00:00:00.000Z")
    expect(tzBooking.participants.length).to.equal(2)
    expect(tzBooking.participants[0].timeZoneId).to.equal("America/Los_Angeles")
    expect(tzBooking.participants[1].timeZoneId).to.equal("America/Chicago")
    multitime = BookingUtil.multitime(tzBooking)
    expectStartsWith(multitime, "Sat 25 00:00 UTC | Fri 24 5PM PDT | Fri 24 7PM CDT")
    bOld = data.bookings.swap1
    bOld.datetime = ISODate("2015-03-12T03:15:18.576Z")
    multitime2 = BookingUtil.multitime(bOld)
    expectStartsWith(multitime2, "Thu 12 03:15 UTC")
    DONE()


  it "Purpose for pending status", itDone ->
    b = data.bookings.timezones
    b.datetime = ISODate("2016-06-25T00:00:00.000Z")
    expect(b.status).to.equal("pending")
    expect(b.participants.length).to.equal(2)
    expect(b.participants[0].timeZoneId).to.equal("America/Los_Angeles")
    expect(b.participants[1].timeZoneId).to.equal("America/Chicago")
    pendingPurpose = BookingUtil.chatGroup(b).purpose
    expectStartsWith(pendingPurpose, "bookings.airpair.com/558aa2454be238d1956cb8aa Morgan (PDT, San Francisco, CA, USA) + Billy (CDT, Houston, TX, USA). WAITING to confirm 90 mins @ Sat 25 00:00 UTC | Fri 24 5PM PDT | Fri 24 7PM CDT")
    DONE()


  it "Purpose for confirmed status", itDone ->
    b = _.extend _.extend({},data.bookings.timezones), { datetime: ISODate("2016-06-25T00:00:00.000Z"), status: 'confirmed' }
    purpose = BookingUtil.chatGroup(b).purpose
    expectStartsWith(purpose, "bookings.airpair.com/558aa2454be238d1956cb8aa Morgan (PDT, San Francisco, CA, USA) + Billy (CDT, Houston, TX, USA). CONFIRMED 90 mins @ Sat 25 00:00 UTC | Fri 24 5PM PDT | Fri 24 7PM CDT")
    DONE()


  it "Purpose for followup status", itDone ->
    b = _.extend _.extend({},data.bookings.timezones), { datetime: ISODate("2016-06-25T00:00:00.000Z"), status: 'followup' }
    purpose = BookingUtil.chatGroup(b).purpose
    expectStartsWith(purpose, "bookings.airpair.com/558aa2454be238d1956cb8aa Morgan (PDT, San Francisco, CA, USA) + Billy (CDT, Houston, TX, USA). FEEDBACK required to payout expert for 90 mins on Sat 25 00:00 UTC | Fri 24 5PM PDT | Fri 24 7PM CDT")
    DONE()


  it "Purpose for old no timeZoneId bookings", itDone ->
    bOld = data.bookings.swap1
    bOld.datetime = ISODate("2015-03-12T03:30:18.576Z")
    purpose = BookingUtil.chatGroup(bOld).purpose
    expectStartsWith(purpose, "bookings.airpair.com/54dc2d2fd137810a00f2813b Daniel + Adam. FEEDBACK required to payout expert for 60 mins on Thu 12 03:30 UTC")
    DONE()


  it.skip 'New booking from request can be viewed by creator', itDone ->
    SETUP.newBookedRequestWithExistingExpert 'jkgm', {}, {userKey:'gnic',expertId:sExp.cohort.expert._id}, (r1, b1, sCust, sExp2) ->
      GET "/bookings/#{b1._id}", {}, (b2) ->
        # $log('creating'.magenta, data.experts.gnic._id, b2)
        expect(b2.orderId).to.be.undefined
        expect(b2.order._id).to.exist
        expect(b2.order.paidout==false).to.be.true
        expect(b2.requestId).to.be.undefined
        expectIdsEqual(r1._id,b2.request._id)
        expect(b2.request.brief).to.exist
        # expect(b2.request.title).to.exist
        expect(b2.request.adm).to.be.undefined
        expect(b2.request.budget).to.be.undefined
        expect(b2.participants.length).to.equal(2)
        expect(b2.participants[1].chat).to.exist
        expect(b2.participants[1].chat.name).to.equal('gregorynicholas')
        expect(b2.chat).to.be.undefined
        LOGIN "admin", ->
          d = {type:'slack',providerId:"G06UFJCQ2"}
          PUT "/bookings/#{b1._id}/associate-chat", d, {}, (b3) ->
            expect(b3.chat).to.exist
            LOGIN 'gnic', ->
              GET "/bookings/#{b1._id}", {}, (b4) ->
                # $log('b4'.magenta, b4)
                expect(b4.chat).to.exist
                DONE()


  it.skip 'New booking can be viewed by expert', itDone ->


  it.skip 'Can be viewed by additional participants', itDone ->


scheduling = ->

  before -> config.calendar.on = true
  after -> config.calendar.on = false

  it 'New booking has default prefered uncomfirmed time', itDone ->
    # expect("email to expert to include preferred time").to.be.true
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'clew', (s) ->
      pairDateTime = moment().add(2, 'day')
      airpair1 = datetime: pairDateTime, minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (b1) ->
        expect(b1._id).to.exist
        expect(b1.status).to.equal("pending")
        expect(b1.minutes).to.equal(120)
        expect(b1.suggestedTimes.length).to.equal(1)
        expect(b1.suggestedTimes[0]._id).to.exist
        expect(b1.suggestedTimes[0].confirmedById).to.be.undefined
        expectIdsEqual(b1.suggestedTimes[0].byId, s._id)
        expect(moment(b1.suggestedTimes[0].time).isSame(pairDateTime)).to.be.true
        expect(b1.lastTouch).to.be.undefined
        expect(b1.activity).to.be.undefined
        expect(b1.notes).to.be.undefined
        db.readDoc 'Booking', b1._id, (b2) ->
          expectTouch(b2.lastTouch, s._id, "create")
          expect(b2.activity.length).to.equal(1)
          expect(b2.notes.length).to.equal(0)
          DONE()


  it 'Can suggest time if in pending', itDone ->
    time1 = moment().add(1, 'day')
    SETUP.newBookedExpert 'chle', {datetime:time1}, (s, b1) ->
      expect(b1.suggestedTimes.length).to.equal(1)
      expectSameMoment(b1.suggestedTimes[0].time,time1)
      time2 = moment().add(3, 'day')
      d = { _id:b1._id, time:time2}
      PUT "/bookings/#{b1._id}/suggest-time", d, {}, (b2) ->
        expect(b2.status).to.equal("pending")
        expect(b2.suggestedTimes.length).to.equal(2)
        expectSameMoment(b2.suggestedTimes[0].time,time1)
        expectIdsEqual(b2.suggestedTimes[0].byId, s._id)
        expectSameMoment(b2.suggestedTimes[1].time,time2)
        expectIdsEqual(b2.suggestedTimes[1].byId, s._id)
        db.readDoc 'Booking', b1._id, (b3) ->
          expect(b3.activity.length).to.equal(2)
          expectTouch(b3.activity[0], s._id, "create")
          expectTouch(b3.activity[1], s._id, "suggest-time")
          expectTouch(b3.lastTouch, s._id, "suggest-time")
          LOGIN 'dros', (sDros) ->
            time3 = moment().add(4, 'day')
            d2 = { _id:b1._id, time:time3}
            PUT "/bookings/#{b1._id}/suggest-time", d2, {}, (b4) ->
              expect(b4.status).to.equal("pending")
              expect(b4.suggestedTimes.length).to.equal(3)
              expectSameMoment(b4.suggestedTimes[0].time,time1)
              expectSameMoment(b4.suggestedTimes[1].time,time2)
              expectSameMoment(b4.suggestedTimes[2].time,time3)
              expectIdsEqual(b4.suggestedTimes[2].byId, sDros._id)
              db.readDoc 'Booking', b1._id, (b5) ->
                expect(b5.activity.length).to.equal(3)
                expectTouch(b5.lastTouch, sDros._id, "suggest-time")
                expectTouch(b5.activity[1],s._id,"suggest-time")
                expectTouch(b5.activity[2],sDros._id,"suggest-time")
                DONE()


  it 'Can not confirm own suggested time', itDone ->
    SETUP.newBookedExpert 'grnv', {}, (s, b1) ->
      timeId = b1.suggestedTimes[0]._id
      PUT "/bookings/#{b1._id}/confirm-time", {_id:b1._id, timeId}, {status:403}, (err) ->
        expectStartsWith(err.message, 'Cannot confirm your own time')
        DONE()


  it 'Can confirm customer booking suggested time by expert', itDone ->
    stubCal = SETUP.stubGoogleCalendar 'events', 'insert', data.wrappers.google_cal_create
    # email notifications sent
    # stubMail = SETUP.stub mailman, 'send'
    stubPairBot = sinon.stub pairbot, 'sendSlackMsg', ->
    datetime = moment().add(10, 'day')
    slackChatId = "G06UFP6AX"
    SETUP.newBookedExpert 'gniv', {datetime,slackChatId}, (s, b1) ->
      LOGIN 'dros', (sDros) ->
        timeId = b1.suggestedTimes[0]._id
        PUT "/bookings/#{b1._id}/confirm-time", {_id:b1._id, timeId}, {}, (b2) ->
          expect(b2.lastTouch).to.be.undefined
          expect(b2.activity).to.be.undefined
          expect(b2.notes).to.be.undefined
          expect(b2.status).to.equal("confirmed")
          expectSameMoment(b2.datetime, datetime)
          expect(stubPairBot.calledOnce).to.be.true
          expect(stubPairBot.args[0][0]).to.equal("G06UFP6AX")
          expect(stubPairBot.args[0][1]).to.equal('booking-confirm-time')
          expect(stubPairBot.args[0][2].byName).to.equal(sDros.name)
          expect(b2.suggestedTimes.length).to.equal(1)
          expectIdsEqual(b2.suggestedTimes[0].byId,s._id)
          expectIdsEqual(b2.suggestedTimes[0].confirmedById,sDros._id)
          stubPairBot.restore()
          expect(stubCal.calledOnce).to.be.true
          stubCal.restore()
          db.readDoc 'Booking', b1._id, (b3) ->
            expectTouch(b3.lastTouch, sDros._id, "confirm-time")
            expectTouch(b3.activity[0],s._id, "create")
            expectTouch(b3.activity[1],sDros._id, "confirm-time")
            DONE()


  it 'Expert can suggest alternative which can be confirmed by customer', itDone ->
    stubCal = SETUP.stubGoogleCalendar 'events', 'insert', data.wrappers.google_cal_create
    # email notifications sent
    # stubMail = SETUP.stub mailman, 'send'
    stubPairBot = sinon.stub pairbot, 'sendSlackMsg', ->
    datetime = moment().add(11, 'day')
    SETUP.newBookedExpert 'kelf', {datetime,expertId:data.experts.gnic._id}, (s, b1) ->
      LOGIN 'gnic', (sGnic) ->
        time2 = moment().add(17, 'day')
        d = { _id:b1._id, time:time2}
        PUT "/bookings/#{b1._id}/suggest-time", d, {}, (b2) ->
          expect(b2.lastTouch).to.be.undefined
          expect(b2.activity).to.be.undefined
          expect(b2.notes).to.be.undefined
          expect(b2.status).to.equal("pending")
          expectSameMoment(b2.datetime, datetime)
          expect(b2.suggestedTimes.length).to.equal(2)
          expect(stubPairBot.calledOnce).to.be.false
          LOGIN s.userKey, ->
            expectIdsEqual(b2.suggestedTimes[1].byId,sGnic._id)
            timeId = b2.suggestedTimes[1]._id
            PUT "/bookings/#{b1._id}/confirm-time", {_id:b1._id, timeId}, {}, (b3) ->
              expect(b3.status).to.equal("confirmed")
              expectSameMoment(b3.datetime, time2)
              expect(stubPairBot.calledOnce).to.be.false
              stubPairBot.restore()
              expect(stubCal.calledOnce).to.be.true
              expect(b3.suggestedTimes.length).to.equal(2)
              expectSameMoment(b3.suggestedTimes[0].time,datetime)
              expectIdsEqual(b3.suggestedTimes[0].byId,s._id)
              expect(b3.suggestedTimes[0].confirmedById).to.be.undefined
              expectSameMoment(b3.suggestedTimes[1].time,time2)
              expectIdsEqual(b3.suggestedTimes[1].byId,sGnic._id)
              expectIdsEqual(b3.suggestedTimes[1].confirmedById,s._id)
              stubCal.restore()
              db.readDoc 'Booking', b1._id, (bDb1) ->
                expectTouch(bDb1.lastTouch, s._id, "confirm-time")
                expectTouch(bDb1.activity[0],s._id, "create")
                expectTouch(bDb1.activity[1],sGnic._id, "suggest-time")
                expectTouch(bDb1.activity[2],s._id, "confirm-time")
                DONE()


  it 'Can only suggest or confirm datetime on a pending booking'



recordings = ->


  it "given a YouTube ID, allows a booking to be annotated with YouTube data", itDone ->
    listStub = SETUP.stubYouTube 'videos','list',null,data.wrappers.youtube_codereview_list
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'miks', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.orderId).to.exist
        expect(booking1.order).to.be.undefined
        expect(booking1.type).to.exist
        expect(booking1.participants.length).to.equal(2)
        LOGIN 'admin',(sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "MEv4SuSJgwk"}, {}, (booking) ->
            expect(booking.status).to.equal("followup")
            expect(booking.recordings.length).to.equal(1)
            expect(booking.recordings[0].data.title).to.equal("Online Rails Code Review with RoR Expert Edward Anderson - AirPair")
            expect(booking.recordings[0].type).to.equal("youtube")
            listStub.restore()
            DONE()


  it "fails gracefully with a bogus YouTube id", itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'mrik', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        LOGIN 'admin', (sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "MEv4SuSJgw"}, {status: 400}, (booking) ->
            expect(booking.message).to.equal("No YouTube video found")
            DONE()


  it "fails gracefully with a private YouTube id that it does not own", itDone ->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'misr', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        LOGIN 'admin', (sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "VfA4ELOHjmk"}, {status: 400}, (booking) ->
            expect(booking.message).to.equal("No YouTube video found")
            DONE()


  #owner of VfA4ELOHjmk is experts@airpair.com
  it.skip "works with a private YouTube id if the owner is in process.env.AUTH_GOOGLE_REFRESH_TOKEN" , (done)->
    SETUP.addAndLoginLocalUserWhoCanMakeBooking 'cher', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.order).to.exist
        expect(booking1.type).to.exist
        expect(booking1.participants.length).to.equal(2)
        LOGIN 'admin', (sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "VfA4ELOHjmk"}, {}, (booking) ->
            expect(booking.message).to.equal("No YouTube video found")
            DONE()


  it.skip "Can delete recording" , (done)->


  it.skip "Can set alternate recording source" , (done)->
    # screenhero etc.


feedback = ->

  beforeEach ->
    @listStub = SETUP.stubYouTube 'videos','list',null,data.wrappers.youtube_codereview_list

  afterEach ->
    @listStub.restore()


  it.skip 'Cannot insert expert or booking review more than once by the same user', itDone ->
    SETUP.addAndLoginLocalUser "stcx", (s) ->
      review = type: 'expert-review', by: { _id: ObjectId(s._id), name: s.name, email: s.email }
      jkgm = _.extend _.cloneDeep(data.experts.jkgm), { reviews:[review] }
      db.ensureDocs 'Expert', [jkgm], ->
        db.readDoc 'Expert', jkgm._id, (r1) ->
          $log('r1'.yellow, r1.reviews.length)
          expect(r1.reviews.length).to.equal(1)
          review2 = _.extend {update:1}, review
          jkgm.reviews.push(review2)
          twoReviews = jkgm.reviews
          db.Models.Expert.findOneAndUpdate {_id:r1._id},{$set:{reviews:twoReviews}}, (e2, r2) ->
            $log('reviews2'.yellow, e2, r2.reviews)
            # db.ensureDocs 'Expert', [jkgm], ->
            # db.readDoc 'Expert', jkgm._id, (r2) ->
              # expect(r1.reviews.length).to.equal(1)
            DONE()


  describe.skip 'Skip', ->

    it 'Cannot give feedback in pending, confirmed or canceled state', itDone ->
      SETUP.newBookedExpert 'stco', {}, (s, b1) ->
        expect(b1.status).to.equal('pending')
        PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", {}, {status:403}, (e) ->
          expectStartsWith(e.message,"Booking [#{b1._id}] must be in folloup or complete state")
          ## todo test confirmed
          ## todo test canceled
          DONE()


    it 'Can give customer feedback as the customer without expert feedback', itDone ->
      SETUP.newBookedExpert 'stcx', {}, (s, b1) ->
        LOGIN 'admin', (sadm) ->
          PUT "/adm/bookings/#{b1._id}/recording", {youTubeId: "MEv4SuSJgwk"}, {}, (b2) ->
            expect(b2.status).to.equal("followup")
            LOGIN s.userKey, ->
              PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", {}, {status:403}, (e) ->
                expectStartsWith(e.message,"Booking customer feedback review required")
                rev1 = { questions: [
                  { idx: 0, key: 'rating', promt: 'How many stars?', answer: "Awesome" }] }
                body1 = { review: rev1 }
                PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", body1, {}, (b3) ->
                  expect(b3.reviews.length).to.equal(1)
                  DONE()


    it 'Can give customer feedback as the customer with expert feedback', itDone ->


    it 'Cannot give customer feedback if not a customer', itDone ->
      SETUP.newBookedExpert 'stec', {}, (s, b1) ->
        LOGIN 'admin', (sadm) ->
          PUT "/adm/bookings/#{b1._id}/recording", {youTubeId: "MEv4SuSJgwk"}, {}, (b2) ->
            expect(b2.status).to.equal("followup")
            LOGIN 'dros', ->
              PUT "/bookings/#{b1._id}/#{b1.expertId}/customer-feedback", {}, {status:403}, (e) ->
                expectStartsWith(e.message,"Not a customer on booking")
                DONE()


    it 'Can update customer feedback', itDone ->

    it 'Cannot give expert feedback if not the expert', itDone ->

    it 'Cannot give expert feedback as the expert', itDone ->



module.exports = ->

  @timeout 40000

  before (done) ->
    SETUP.ensureV1LoggedInExpert 'gnic', (sExp) ->
      SETUP.initExperts done

  beforeEach ->
    @braintreepaymentStub = SETUP.stubBraintreeChargeWithMethod()

  afterEach ->
    @braintreepaymentStub.restore()

  describe("Views: ".subspec, views)
  describe("Scheduling: ".subspec, scheduling)
  describe("Recordings: ".subspec, recordings)
  describe("Feedback: ".subspec, feedback)

