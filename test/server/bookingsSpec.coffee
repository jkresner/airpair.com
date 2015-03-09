youtube = require "../../server/services/wrappers/youtube.js"
util = require '../../shared/util'
ordersUtil = require '../../shared/orders'


module.exports = -> describe "API: ".subspec, ->

  @timeout 40000

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initExperts done

  after ->
    SETUP.analytics.restore()

  it "given a YouTube ID, allows a booking to be annotated with YouTube data", (done)->
    SETUP.addAndLoginLocalUserWithPayMethod 'miks', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
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
            done()

  it "fails gracefully with a bogus YouTube id", (done)->
    SETUP.addAndLoginLocalUserWithPayMethod 'mrik', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
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
            done()

  it "fails gracefully with a private YouTube id that it does not own", (done)->
    SETUP.addAndLoginLocalUserWithPayMethod 'misr', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
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
            done()

  #owner of VfA4ELOHjmk is experts@airpair.com
  it.skip "works with a private YouTube id if the owner is in process.env.AUTH_GOOGLE_REFRESH_TOKEN" , (done)->
    SETUP.addAndLoginLocalUserWithPayMethod 'cher', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
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
            done()

  it.skip 'Expert gets a notification that they have been booked', (done) ->

  it.skip 'Can confirm booking by expert', (done) ->
    # addAndLoginLocalUserWithPayMethod 'jpie', (s) ->
      # airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      # POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        # expect(booking1._id).to.exist
        # expect(booking1.orderId).to.exist
        # expect(_.idsEqual(booking1.expertId, data.experts.dros._id)).to.be.true
        # expect(_.idsEqual(booking1.customerId, s._id)).to.be.true
        # expect(booking1.type).to.equal('private')


  it.skip 'Can update booking and send invitations as admin', (done) ->
    SETUP.addAndLoginLocalUserWithPayMethod 'mkis', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
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
            done()
