create = ->

  IT "Cannot get my expert profile as anonymous user", ->
    GET "/experts/me", { status: 401 }, (r) ->
      DONE()


  IT "Cannot create / update expert profile as anonymous user", ->
    PAGE "/", {}, ->
      POST "/experts/me", {_id: newId(), user: USERS['jk'] }, { status: 401 }, (r) ->
        PUT "/experts/me", {_id: newId(), user: USERS['jk'] }, { status: 401 }, (r) ->
          DONE()


  IT "Cannot create expert profile without required user info", ->
    d = rate: 80, breif: 'yo', tags: [FIXTURE.tags.angular]
    STORY.newUser 'alyr', {login:true,data:{location:null}}, (salyr, salyrKey) ->
      POST "/experts/me", d, { status: 403 }, (r) ->
        expectStartsWith(r.message, "Cannot create expert without username")
        PUT "/users/me/username", { username: salyrKey }, (r) ->
          POST "/experts/me", d, { status: 403 }, (r) ->
            expectStartsWith(r.message, "Cannot create expert without initials")
            PUT "/users/me/initials", { initials: 'ar' }, (r) ->
              POST "/experts/me", d, { status: 403 }, (r) ->
                expectStartsWith(r.message, "Cannot create expert without location")
                PUT "/users/me/location", FIXTURE.wrappers.localization_melbourne.locationData, (r) ->
                  expect(r.location).to.exist
                  POST "/experts/me", d, { status: 403 }, (r) ->
                    expectStartsWith(r.message, "Cannot create expert without bio")
                    PUT "/users/me/bio", { bio: 'a bio'}, (r) ->
                      POST "/experts/me", d, { status: 403 }, (r) ->
                        expectStartsWith(r.message, "Must connect at least 2 social account to create expert profile")
                        DONE()


  IT "Can create expert profile with required user info", ->
    d = rate: 80, breif: 'yo', tags: [FIXTURE.tags.angular]
    DB.ensureDoc 'User', USERS.ape1, ->
      DB.removeDocs 'Expert', { userId: USERS.ape1._id }, ->
        LOGIN {key:'ape1'}, (s) ->
          PUT "/users/me/username", { username: 'apexpert1' }, ->
            PUT "/users/me/initials", { initials: 'ap' }, ->
              PUT "/users/me/location", FIXTURE.wrappers.localization_melbourne.locationData, ->
                PUT "/users/me/bio", { bio: 'a bio for apexpert 1'}, ->
                  POST "/experts/me", d, (expert) ->
                    $log('expert', expert)
                    expect(expert._id).to.exist
                    # expect(expert.lastTouch).to.exist
                    expect(expert.name).to.equal(USERS.ape1.name)
                    expect(expert.username).to.equal('apexpert1')
                    expect(expert.initials).to.equal('ap')
                    expect(expert.location).to.equal('Melbourne VIC, Australia')
                    expectStartsWith(expert.timezone, 'Australia')
                    expect(expert.gh.login).to.equal('airpairtest1')
                    expect(expert.gh.provider).to.be.undefined
                    expect(expert.gp.id).to.equal('107399914803761861041')
                    expect(expert.gp.name).to.be.undefined
                    expect(expert.actvity).to.be.undefined
                    # DB.docById 'User', s._id, (user) ->
                      # expect(user.cohort.expert._id).to.exist
                    DONE()



# migrate = ->

#   IT "Can update expert profile as new v1 user", ->
#     SETUP.createNewExpert 'ape1', {}, (s, expert) ->
#       expect(expert.lastTouch.action, 'create')
#       expect(expert.rate, 70)
#       expect(!_.idsEqual(s._id,expert._id))
#       GET "/experts/me", {}, (exp2) ->
#         expect(exp2._id).to.exist
#         expect(exp2.lastTouch).to.exist
#         expect(exp2.name).to.equal(USERS.ape1.name)
#         expect(exp2.username).to.equal(expert.username)
#         expect(exp2.initials).to.equal(expert.initials)
#         expect(exp2.location).to.equal('Melbourne VIC, Australia')
#         expect(exp2.timezone).to.equal('Australian Eastern Standard Time')
#         expect(exp2.bio).to.equal(expert.bio)
#         expect(exp2.breif).to.equal(expert.breif)
#         expect(exp2.rate).to.equal(70)
#         expect(exp2.tags.length).to.equal(1)
#         expect(exp2.gh.username).to.equal('airpairtest1')
#         expect(exp2.gh.followers).to.exist
#         expect(exp2.gp.id).to.equal('107399914803761861041')
#         expect(exp2.gp._json.picture).to.equal('https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg')
#         exp2.rate = 150
#         PUT "/experts/#{expert._id}/me", exp2, {}, (expert2) ->
#           expect(expert.lastTouch.action, 'update')
#           expect(expert.rate, 150)
#           DONE()



#   IT "Cannot create multiple expert profiles for one user", ->
#     SETUP.createNewExpert 'erij', {}, (s, exp1) ->
#       d = _.omit(exp1,'_id')
#       POST "/experts/me", d, {status:400}, (exp2) ->
#         db.readDocs 'Expert', {userId:ObjectId(s._id)}, (r) ->
#           expect(r.length).to.equal(1)
#           DONE()



#   IT "Can update expert profile as existing v0 expert", ->
#     SETUP.ensureV0Expert 'azv0', ->
#       db.readDoc 'User', USERS.azv0._id, (azv0User) ->
#         expect(_.keys(azv0User).length).to.equal(16)
#         expect(azv0User._id).to.exist
#         expect(azv0User.email).to.exist
#         expect(azv0User.name).to.exist
#         expect(azv0User.bitbucket).to.exist
#         expect(azv0User.bitbucketId).to.exist
#         expect(azv0User.github).to.exist
#         expect(azv0User.githubId).to.exist
#         expect(azv0User.google).to.exist
#         expect(azv0User.googleId).to.exist
#         expect(azv0User.linkedin).to.exist
#         expect(azv0User.linkedinId).to.exist
#         expect(azv0User.stack).to.exist
#         expect(azv0User.stackId).to.exist
#         expect(azv0User.twitter).to.exist
#         expect(azv0User.twitterId).to.exist
#         expect(azv0User.emailVerified).to.be.true
#         expect(azv0User.cohort).to.be.undefined
#         expect(azv0User.bookmarks).to.be.undefined
#         expect(azv0User.tags).to.be.undefined
#         expect(azv0User.siteNotifications).to.be.undefined
#         expect(azv0User.roles).to.be.undefined
#         db.readDoc 'Expert', FIXTURE.experts.azv0._id, (azv0Exp) ->
#           expect(_.keys(azv0Exp).length).to.equal(24)
#           expect(azv0Exp._id).to.exist
#           expect(azv0Exp.availability).to.exist
#           expect(azv0Exp.bb).to.exist
#           expect(azv0Exp.bookMe).to.exist
#           expect(azv0Exp.brief).to.exist
#           expect(azv0Exp.email).to.exist
#           expect(azv0Exp.gh).to.exist
#           expect(azv0Exp.gmail).to.exist
#           expect(azv0Exp.homepage).to.exist
#           expect(azv0Exp.hours).to.exist
#           expect(azv0Exp.in).to.exist
#           expect(azv0Exp.karma).to.exist
#           expect(azv0Exp.minRate).to.exist
#           expect(azv0Exp.name).to.exist
#           expect(azv0Exp.pic).to.exist
#           expect(azv0Exp.rate).to.exist
#           expect(azv0Exp.so).to.exist
#           expect(azv0Exp.status).to.exist
#           expect(azv0Exp.tags).to.exist
#           expect(azv0Exp.timezone).to.exist
#           expect(azv0Exp.tw).to.exist
#           expect(azv0Exp.updatedAt).to.exist
#           expect(azv0Exp.userId).to.exist
#           expect(azv0Exp.username).to.exist
#           expect(azv0Exp.user).to.be.undefined
#           expect(azv0Exp.lastTouch).to.be.undefined
#           expect(azv0Exp.activity).to.be.undefined
#           expect(azv0Exp.settings).to.be.undefined
#           expect(azv0Exp.mojo).to.be.undefined
#           expect(azv0Exp.matching).to.be.undefined
#           LOGIN 'azv0', (sAzv0) ->
#             eData = tags: azv0Exp.tags, rate: 150, username: azv0Exp.username, initials: 'az', bio: 'a bio for az'
#             SETUP.applyToBeAnExpert eData, (exp) ->
#               expectIdsEqual(exp._id,azv0Exp._id)
#               expectIdsEqual(exp.userId,azv0User._id)
#               db.readDoc 'User', USERS.azv0._id, (azv0U2) ->
#                 expectIdsEqual(azv0U2._id, azv0User._id)
#                 expect(azv0U2.email).to.exist
#                 expect(azv0U2.name).to.exist
#                 # TODO after v0 is gone, impl wiping
#                 $log("## TODO after v0 is gone, impl wiping".white)
#                 # expect(azv0U2.bitbucket).to.be.undefined
#                 # expect(azv0U2.bitbucketId).to.be.undefined
#                 # expect(azv0U2.github).to.be.undefined
#                 # expect(azv0U2.githubId).to.be.undefined
#                 # expect(azv0U2.linkedin).to.be.undefined
#                 # expect(azv0U2.linkedinId).to.be.undefined
#                 # expect(azv0U2.stack).to.be.undefined
#                 # expect(azv0U2.stackId).to.be.undefined
#                 # expect(azv0U2.twitter).to.be.undefined
#                 # expect(azv0U2.twitterId).to.be.undefined
#                 expect(azv0U2.social).to.exist
#                 expect(azv0U2.social.bb.username).to.equal(azv0User.bitbucket.username)
#                 expect(azv0U2.social.gh.username).to.equal(azv0User.github.username)
#                 expect(azv0U2.social.in.id).to.equal(azv0User.linkedin.id)
#                 expect(azv0U2.social.so.link).to.equal(azv0User.stack.link)
#                 expect(azv0U2.social.tw.username).to.equal(azv0User.twitter.username)
#                 expect(azv0U2.google).to.exist
#                 expect(azv0U2.googleId).to.equal(azv0User.googleId)
#                 expect(azv0U2.initials).to.equal('az')
#                 expect(azv0U2.username).to.equal(azv0Exp.username)
#                 expect(azv0U2.bio).to.equal('a bio for az')
#                 expect(azv0U2.localization).to.exist
#                 expect(azv0U2.siteNotifications).to.exist
#                 # expect(azv0U2.local).to.exist # doesn't have to exist
#                 expect(azv0U2.cohort).to.exist
#                 expect(azv0U2.bookmarks).to.exist
#                 expect(azv0U2.tags).to.exist
#                 expect(azv0U2.roles).to.exist
#                 expect(azv0U2.roles.length).to.equal(0)
#                 expect(azv0U2.emailVerified).to.be.true
#                 db.readDoc 'Expert', FIXTURE.experts.azv0._id, (azv0E2) ->
#                   expectIdsEqual(azv0U2.cohort.expert._id, azv0E2._id)
#                   expect(azv0E2.brief).to.exist
#                   expect(azv0E2.gmail).to.exist
#                   expect(azv0E2.pic).to.exist
#                   expect(azv0E2.rate).to.exist
#                   expect(azv0E2.tags).to.exist
#                   expect(azv0E2.userId).to.exist
#                   expect(azv0E2.lastTouch).to.exist
#                   expect(azv0E2.activity).to.exist
#                   expect(azv0E2.activity.length).to.equal(1)
#                   expect(azv0E2.user).to.exist
#                   expect(azv0E2.user.google).to.be.undefined
#                   expect(azv0E2.user.googleId).to.be.undefined
#                   expect(azv0E2.user.social.bb.username).to.equal(azv0User.bitbucket.username)
#                   expect(azv0E2.user.social.gh.username).to.equal(azv0User.github.username)
#                   expect(azv0E2.user.social.in.id).to.equal(azv0User.linkedin.id)
#                   expect(azv0E2.user.social.so.link).to.equal(azv0User.stack.link.replace('http://stackoverflow.com/users/',''))
#                   expect(azv0E2.user.social.tw.username).to.equal(azv0User.twitter.username)
#                   expect(azv0E2.user.social.gp.id).to.equal(azv0User.googleId)
#                   expect(azv0E2.user.name).to.equal(azv0User.name)
#                   expect(azv0E2.user.email).to.equal(azv0User.email)
#                   expect(azv0E2.user.emailVerified).to.equal(true)
#                   expect(azv0E2.user.initials).to.equal('az')
#                   expect(azv0E2.user.username).to.equal(azv0Exp.username)
#                   expect(azv0E2.user.bio).to.equal('a bio for az')
#                   expect(azv0E2.user.localization).to.exist
#                   # To soon phase out
#                   expect(azv0E2.bookMe).to.exist
#                   expect(azv0E2.availability).to.exist
#                   expect(azv0E2.hours).to.exist
#                   expect(azv0E2.minRate).to.exist
#                   expect(azv0E2.status).to.exist
#                   expect(azv0E2.updatedAt).to.exist
#                   # v0 Phased out
#                   expect(azv0E2.bb).to.be.undefined
#                   expect(azv0E2.email).to.be.undefined
#                   expect(azv0E2.gh).to.be.undefined
#                   expect(azv0E2.homepage).to.be.undefined
#                   expect(azv0E2.in).to.be.undefined
#                   expect(azv0E2.name).to.be.undefined
#                   expect(azv0E2.so).to.be.undefined
#                   expect(azv0E2.timezone).to.be.undefined
#                   expect(azv0E2.tw).to.be.undefined
#                   expect(azv0E2.username).to.be.undefined
#                   expect(azv0E2.karma).to.be.undefined
#                   # props that would exist upon other operations
#                   expect(azv0E2.settings).to.be.undefined
#                   expect(azv0E2.mojo).to.be.undefined
#                   expect(azv0E2.matching).to.be.undefined
#                   DONE()



admin = ->

  IT "Delete by id", ->
    SETUP.ensureExpert 'dlim', ->
      DB.docById 'User', USERS.dlim._id, (s) ->
        expertId = s.cohort.expert._id
        LOGIN {key:'admin'}, ->
          DELETE "/adm/experts/#{expertId}", ->
            DB.docById 'Expert', expertId, (r) ->
              expect(r).to.be.null
              DONE()

  IT "Get newest experts", ->
    LOGIN {key:'admin'}, ->
      GET "/adm/experts/new", (experts) ->
        expect(experts.length>0).to.be.true
        DONE()


  IT "Get recently active experts", ->
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
#           expectIdsEqual(req.suggested[0].expert._id,expertId)
#         $log('bookings', history.bookings.length, history.bookings[0].participants[0])
#         expect(history.bookings.length > 0).to.be.true
#         for booking in (history.bookings)
#           expectIdsEqual(booking.expertId, expertId)
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
#               expectIdsEqual(e3.deals[0].lastTouch.by._id, USERS.admin._id)
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
#             expectIdsEqual(e2.deals[0].tag._id, FIXTURE.tags.angular._id)
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
#             expectIdsEqual(e2.deals[0].target.objectId,sdel1._id)
#             expect(e2.deals[0].code).to.be.undefined
#             db.readDoc 'Expert', expert._id, (e3) ->
#               expect(e3.deals[0].lastTouch.action).to.equal('createDeal')
#               expect(e3.deals[0].lastTouch.utc).to.exist
#               expect(e3.deals[0].activity.length).to.equal(1)
#               expect(e3.deals[0].activity[0].action).to.equal('createDeal')
#               expectIdsEqual(e3.deals[0].lastTouch.by._id, s._id)
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
#         expectStartsWith(err.message,"Client does not determine deal rake")
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
    global.USERS = FIXTURE.users
    SETUP.ensureExpert 'snug', ->
      done()

  after ->
    global.USERS = null

  DESCRIBE("Create: ", create)
  # DESCRIBE("Migrate: ", migrate)
  DESCRIBE("Admin: ", admin)


