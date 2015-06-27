scheduling = ->


  it 'Can suggest time if in pending', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'clew', (s) ->
      pairDateTime = moment().add(2, 'day')
      airpair1 = datetime: pairDateTime, minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (b1) ->
        expect(b1._id).to.exist
        expect(b1.minutes).to.equal(120)
        expect(b1.suggestedTimes.length).to.equal(1)
        expect(b1.suggestedTimes[0]._id).to.exist
        expect(b1.suggestedTimes[0].confirmedById).to.be.undefined
        expect(moment(b1.suggestedTimes[0].time).isSame(pairDateTime)).to.be.true
        expectIdsEqual(b1.suggestedTimes[0].byId, s._id)
        expectIdsEqual(b1.lastTouch.by._id, s._id)
        expect(b1.lastTouch.action).to.equal("create")

        DONE()


  it.skip 'Can not change time if not pending status', itDone ->


  it.skip 'Can not confirm own time', itDone ->


  it.skip 'Can confirm customer booking time by expert', itDone ->
    # addAndLoginLocalUserWithPayMethod 'jpie', (s) ->
      # airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      # POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        # expect(booking1._id).to.exist
        # expect(booking1.orderId).to.exist
        # expect(_.idsEqual(booking1.expertId, data.experts.dros._id)).to.be.true
        # expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
        # expect(booking1.type).to.equal('private')


  it.skip 'Expert can deny booking time and suggest alternative which can be confirmed by customer'


  it.skip 'Can update booking and send invitations as admin', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'mkis', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.orderId).to.exist
        expect(booking1.type).to.exist
        expect(booking1.participants.length).to.equal(2)
        LOGIN 'admin', (sadm) ->
          ups = start: moment().add(3,'days').format('x'), sendGCal: { notify: true }
          bUps = _.extend booking1, ups
          bUps.participants[0].info.email = 'jk@airpair.com'
          bUps.participants[1].info.email = 'jkresner@gmail.com'
          PUT "/adm/bookings/#{booking1._id}", bUps, {}, (bs1) ->
            expect(bs1.gcal).to.exist
            expect(bs1.gcal.attendees.length).to.equal(2)
            DONE()



recordings = ->


  it "given a YouTube ID, allows a booking to be annotated with YouTube data", itDone ->
    listStub = SETUP.stubYouTube 'videos','list',null,data.wrappers.youtube_codereview_list
    SETUP.addAndLoginLocalUserWithPayMethod 'miks', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.orderId).to.exist
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
    SETUP.addAndLoginLocalUserWithPayMethod 'mrik', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.orderId).to.exist
        expect(booking1.type).to.exist
        expect(booking1.participants.length).to.equal(2)
        LOGIN 'admin', (sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "MEv4SuSJgw"}, {status: 400}, (booking) ->
            expect(booking.message).to.equal("No YouTube video found")
            DONE()


  it "fails gracefully with a private YouTube id that it does not own", itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'misr', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.orderId).to.exist
        expect(booking1.type).to.exist
        expect(booking1.participants.length).to.equal(2)
        LOGIN 'admin', (sadm) ->
          url = "/adm/bookings/#{booking1._id}/recording"
          PUT url, {youTubeId: "VfA4ELOHjmk"}, {status: 400}, (booking) ->
            expect(booking.message).to.equal("No YouTube video found")
            DONE()


  #owner of VfA4ELOHjmk is experts@airpair.com
  it.skip "works with a private YouTube id if the owner is in process.env.AUTH_GOOGLE_REFRESH_TOKEN" , (done)->
    SETUP.addAndLoginLocalUserWithPayMethod 'cher', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.orderId).to.exist
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


  it 'Cannot give feedback in pending, confirmed or canceled state', itDone ->
    expect(false).to.be.true
    DONE()


  it 'Cannot give customer feedback if not the customer', itDone ->
    expect(false).to.be.true
    DONE()


  it 'Can give customer feedback as the customer', itDone ->
    expect(false).to.be.true
    DONE()


  it '4 or 5 start feedback releases expert payment', itDone ->
    expect(false).to.be.true
    # sets status to complete with recording
    DONE()


  it 'Cannot give expert feedback if not the expert', itDone ->
    expect(false).to.be.true
    DONE()


  it 'Cannot give expert feedback as the expert', itDone ->
    expect(false).to.be.true
    DONE()




module.exports = ->

  @timeout 40000

  before (done) ->
    SETUP.initExperts done

  beforeEach ->
    @braintreepaymentStub = SETUP.stubBraintreeChargeWithMethod()

  afterEach ->
    @braintreepaymentStub.restore()

  describe("Scheduling: ".subspec, scheduling)
  describe("Recordings: ".subspec, recordings)
  describe.skip("Feedback: ".subspec, feedback)

