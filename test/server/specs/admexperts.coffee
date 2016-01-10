admin = ->

  SKIP "Delete an expert"
  # IT "Delete by id", ->
  #   SETUP.ensureExpert 'dlim', ->
  #     DB.docById 'User', USERS.dlim._id, (s) ->
  #       expertId = s.cohort.expert._id
  #       LOGIN {key:'admin'}, ->
  #         DELETE "/adm/experts/#{expertId}", ->
  #           DB.docById 'Expert', expertId, (r) ->
  #             expect(r).to.be.null
  #             DONE()

  IT "Get newest experts", ->
    LOGIN {key:'admin'}, ->
      GET "/adm/experts/new", (experts) ->
        expect(experts.length>0).to.be.true
        DONE()


  SKIP "Get recently active experts", ->
    LOGIN {key:'admin'}, ->
      GET "/adm/experts/active", (experts) ->
        expect(experts.length>0).to.be.true
        DONE()


  it "Get experts history", ->
#     LOGIN 'admin', ->
#       # expertId = "524304901c9b0f0200000012" ## Matias
#       expertId = "53cfe315a60ad902009c5954" ## Michael P
#       GET "/experts/#{expertId}/history", {}, (history) ->
#         expect(history.requests.length > 0).to.be.true
#         # $log('history.requests', history.requests.length)
#         for req in history.requests
#           expect(req.calls).to.be.undefined
#           expect(req.adm).to.be.undefined
#           expect(req.suggested.length).to.equal(1)
#           expect(req.by).to.exist
#           expect(req.company).to.be.undefined
#           EXPECT.equalIds(req.suggested[0].expert._id,expertId)
#         $log('bookings', history.bookings.length, history.bookings[0].participants[0])
#         expect(history.bookings.length > 0).to.be.true
#         for booking in (history.bookings)
#           EXPECT.equalIds(booking.expertId, expertId)
#           expect(booking.type).to.exist
#           expect(booking.status).to.exist
#           expect(booking.customerId).to.exist
#           expect(booking.datetime).to.exist
#           expect(booking.minutes).to.exist
#           expect(booking.participants.length>0).to.be.true
#           $log('cust', booking.participants[0])
#           expect(booking.participants[0].role).to.equal('customer')
#           expect(booking.participants[0].info.name).to.exist
#         DONE()


#   IT "Add no tag expert deal available to everyone with not expiration", ->
#     SETUP.createNewExpert 'louf', {}, (s, expert) ->
#       LOGIN 'admin', ->
#         GET "/adm/experts/#{expert._id}", {}, (e1) ->
#           expect(e1.deals.length).to.equal(0)
#           target = type: 'all'
#           deal = { price: 100, minutes: 120, type: 'airpair', target }
#           POST "/experts/#{expert._id}/deal", deal, {}, (e2) ->
#             expect(e2.deals.length).to.equal(1)
#             expect(e2.deals[0].activity).to.be.undefined
#             expect(e2.deals[0].lastTouch).to.be.undefined
#             expect(e2.deals[0].expiry).to.be.undefined
#             expect(e2.deals[0].price).to.equal(100)
#             expect(e2.deals[0].minutes).to.equal(120)
#             expect(e2.deals[0].type).to.equal('airpair')
#             expect(e2.deals[0].description).to.be.undefined
#             expect(e2.deals[0].rake).to.equal(10)
#             expect(e2.deals[0].tag).to.be.undefined
#             expect(e2.deals[0].target.type).to.equal('all')
#             expect(e2.deals[0].target.objectId).to.be.undefined
#             expect(e2.deals[0].code).to.be.undefined
#             db.readDoc 'Expert', expert._id, (e3) ->
#               expect(e3.deals[0].lastTouch.action).to.equal('createDeal')
#               expect(e3.deals[0].lastTouch.utc).to.exist
#               expect(e3.deals[0].activity.length).to.equal(1)
#               expect(e3.deals[0].activity[0].action).to.equal('createDeal')
#               EXPECT.equalIds(e3.deals[0].lastTouch.by._id, USERS.admin._id)
#               expect(e3.deals[0].redeemed.length).to.equal(0)
#               DONE()


#   IT "Add expert deal for a tag with a required code expiring in 7 days", ->
#     SETUP.createNewExpert 'gwil', {}, (s, expert) ->
#       LOGIN 'admin', ->
#         GET "/adm/experts/#{expert._id}", {}, (e1) ->
#           expect(e1.deals.length).to.equal(0)
#           target = type: 'code'
#           deal = { expiry: moment().add(7, 'days'), code: 'cd7'+timeSeed(), price: 120, minutes: 300, type: 'offline', tag: FIXTURE.tags.angular, description: 'code required deal', target }
#           POST "/experts/#{expert._id}/deal", deal, {}, (e2) ->
#             expect(e2.deals.length).to.equal(1)
#             expect(moment(e2.deals[0].expiry).isAfter(moment().add(6,'days'))).to.be.true
#             expect(moment(e2.deals[0].expiry).isBefore(moment().add(8,'days'))).to.be.true
#             expect(e2.deals[0].price).to.equal(120)
#             expect(e2.deals[0].minutes).to.equal(300)
#             expect(e2.deals[0].type).to.equal('offline')
#             expect(e2.deals[0].description).to.equal('code required deal')
#             expect(e2.deals[0].rake).to.equal(10)
#             EXPECT.equalIds(e2.deals[0].tag._id, FIXTURE.tags.angular._id)
#             expect(e2.deals[0].tag.name).to.equal('AngularJS')
#             expect(e2.deals[0].target.type).to.equal('code')
#             expect(e2.deals[0].target.objectId).to.be.undefined
#             expect(e2.deals[0].code).to.equal(deal.code)
#             DONE()


#   IT "Add expert deal available to one user", ->
#     SETUP.addAndLoginLocalUserWithPayMethod 'del1', (sdel1) ->
#       SETUP.createNewExpert 'dros', {}, (s, expert) ->
#         GET "/experts/me", {}, (e1) ->
#           expect(e1.deals.length).to.equal(0)
#           target = type: 'user', objectId: sdel1._id
#           deal = { price: 20, minutes: 30, type: 'code-review', target }
#           POST "/experts/#{expert._id}/deal", deal, {}, (e2) ->
#             expect(e2.deals.length).to.equal(1)
#             expect(e2.deals[0].expiry).to.be.undefined
#             expect(e2.deals[0].price).to.equal(20)
#             expect(e2.deals[0].minutes).to.equal(30)
#             expect(e2.deals[0].type).to.equal('code-review')
#             expect(e2.deals[0].description).to.be.undefined
#             expect(e2.deals[0].rake).to.equal(10)
#             expect(e2.deals[0].tag).to.be.undefined
#             expect(e2.deals[0].target.type).to.equal('user')
#             EXPECT.equalIds(e2.deals[0].target.objectId,sdel1._id)
#             expect(e2.deals[0].code).to.be.undefined
#             db.readDoc 'Expert', expert._id, (e3) ->
#               expect(e3.deals[0].lastTouch.action).to.equal('createDeal')
#               expect(e3.deals[0].lastTouch.utc).to.exist
#               expect(e3.deals[0].activity.length).to.equal(1)
#               expect(e3.deals[0].activity[0].action).to.equal('createDeal')
#               EXPECT.equalIds(e3.deals[0].lastTouch.by._id, s._id)
#               DONE()


#   IT "Create with invalid deal type, invalid target type & expiry in the past", ->
#     SETUP.createNewExpert 'mper', {}, (s, expert) ->
#       d1 = price: 100, minutes: 120, type: 'nonsicle', target: { type: 'all' }
#       POST "/experts/#{expert._id}/deal", d1, {status:403}, (err1) ->
#         expect(err1.message.indexOf("not a valid deal type")!=-1).to.be.true
#         d2 = price: 10, minutes: 20, type: 'offline', target: { type: 'nobody' }
#         POST "/experts/#{expert._id}/deal", d2, {status:403}, (err2) ->
#           expect(err2.message.indexOf("not a valid deal target")!=-1).to.be.true
#           d3 = expiry: moment().add(-1,'days'), price: 10, minutes: 20, type: 'offline', target: { type: 'all' }
#           POST "/experts/#{expert._id}/deal", d3, {status:403}, (err3) ->
#             expect(err3.message.indexOf("Cannot create already expired deal")!=-1).to.be.true
#             DONE()


#   IT "Add more than one deal to an expert", ->
#     SETUP.createNewExpert 'phlf', {}, (s, expert) ->
#       expect(expert.deals.length).to.equal(0)
#       d1 = { price: 100, minutes: 100, type: 'airpair', target: { type: 'all'} }
#       POST "/experts/#{expert._id}/deal", d1, {}, (e2) ->
#         expect(e2.deals.length).to.equal(1)
#         d2 = { price: 200, minutes: 300, type: 'airpair', target: { type: 'all'} }
#         POST "/experts/#{expert._id}/deal", d2, {}, (e3) ->
#           expect(e3.deals.length).to.equal(2)
#           expect(e3.deals[0].price).to.equal(100)
#           expect(e3.deals[1].price).to.equal(200)
#           DONE()


#   IT "Only admin can specify rake", ->
#     SETUP.createNewExpert 'tmot', {}, (s, expert) ->
#       d1 = { rake:5, price: 100, minutes: 100, type: 'airpair', target: { type: 'all'} }
#       POST "/experts/#{expert._id}/deal", d1, {status:403}, (err) ->
#         EXPECT.startsWith(err.message,"Client does not determine deal rake")
#         LOGIN 'admin', ->
#           d2 = { rake:5, price: 100, minutes: 100, type: 'airpair', target: { type: 'all'} }
#           POST "/experts/#{expert._id}/deal", d2, {}, (e2) ->
#             expect(e2.deals.length).to.equal(1)
#             expect(e2.deals[0].rake).to.equal(5)
#             DONE()


#   IT "Expire deal"

#   IT "Cannot re-activate expert deal"




module.exports = ->

  before (done) ->
    qExists = require('../../../server/services/users.data').query.existing
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
    DB.removeDocs 'User', qExists.byEmails(['airpairtest1@gmail.com']), ->
      DB.ensureExpert 'snug', ->
        done()

  after ->


  DESCRIBE("Admin: ", admin)


