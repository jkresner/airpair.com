util = require '../../shared/util'
ordersUtil = require '../../shared/orders'


module.exports = -> describe "API: ", ->

  @timeout 40000

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initExperts done

  after ->
    SETUP.analytics.restore()

  beforeEach ->
    SETUP.clearIdentity()

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
    addAndLoginLocalUserWithPayMethod 'cher', (s) ->
      airpair1 = time: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(booking1._id).to.exist
        expect(booking1.customerId).to.exist
        expect(booking1.minutes).to.equal(120)
        expect(booking1.orderId).to.exist
        expect(booking1.type).to.exist
        expect(booking1.participants.length).to.equal(2)
        LOGIN 'admin', data.users.admin, (sadm) ->
          ups = start: moment().add(3,'days').format('x'), sendGCal: { notify: true }
          bUps = _.extend booking1, ups
          bUps.participants[0].info.email = 'jk@airpair.com'
          bUps.participants[1].info.email = 'jkresner@gmail.com'
          PUT "/adm/bookings/#{booking1._id}", bUps, {}, (bs1) ->
            expect(bs1.gcal).to.exist
            expect(bs1.gcal.attendees.length).to.equal(2)
            done()


  # it.skip 'Can save youtube recording as admin', (done) ->

