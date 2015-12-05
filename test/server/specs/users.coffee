anonymous = ->

  IT 'Gets sessionId on anonymous session', ->
    GET '/session/full', { unauthenticated: true }, (s) ->
      expect(s.authenticated).to.be.false
      expect(s.sessionID).to.exist
      DONE()


get = ->

  IT 'Search users', ->
    LOGIN {key:'admin'}, ->
      GET '/adm/users/search/jon', (r) ->
        expect(r.length>0).to.be.true
        # $log('r[0]', r[0])
        expect(r[0]._id).to.exist
        expect(r[0].name).to.exist
        # expect(r[0].avatar).to.exist
        DONE()


update = ->

  IT 'Add location / timezone', ->
    # stubs.timezone.restore()
    STORY.newUser 'chri', {location:undefined,login:true}, (chri) ->
      PUT '/users/me/location', FIXTURE.wrappers.gplaces_succcessful_place, (user) ->
        expect(user.location.name).to.equal('Bengaluru, Karnataka, India')
        expect(user.location.shortName).to.equal('Bengaluru')
        expect(user.location.timeZoneId).to.equal('Asia/Calcutta')
        DONE()

  IT 'Set and unset username', ->
    STORY.newUser 'tybr', (tybr) ->
      expect(tybr.username).to.be.undefined
      username = "tybr#{timeSeed()}"
      PUT '/users/me/username', { username }, (u1) ->
        expect(u1.username).to.equal(username)
        PUT '/users/me/username', { username: "" }, (u2) ->
          expect(u2.username).to.be.undefined
          DONE()

  IT 'Change name', ->
    STORY.newUser 'snug', (s) ->
      EXPECT.startsWith(s.name, "Ra'Shaun")
      PUT '/users/me/name', { name: 'Godly Jacob' }, (u1) ->
        expect(u1.name).to.equal('Godly Jacob')
        DONE()

  IT 'Set initials', ->
    STORY.newUser 'misr', (s) ->
      GET "/session/full", (u0) ->
        EXPECT.equalIds(s._id,u0._id)
        expect(u0.name).to.equal(s.name)
        expect(u0.initials).to.be.undefined
        PUT '/users/me/initials', { initials: 'GJ' }, (u1) ->
          expect(u1.initials).to.equal('GJ')
          DB.docById 'User', s._id, (u2) ->
            expect(u2.initials).to.equal('GJ')
            DONE()

  it "can change bio"

# function profileAuthenticated() {

#   IT('Can update name', () => {
#     STORY.addAndLoginLocalUserWithEmailVerified('sctm', function(s) {
#       $log('here'.cyan)
#       expect(s._id).to.exist
#       expect(s.email).to.exist
#       expect(s.name).to.exist
#       expect(s.avatar).to.exist
#       expect(s.emailVerified).to.equal(true)
#       expect(s.initials).to.be.undefined
#       expect(s.username).to.be.undefined

#       var originalName = s.name

#       PUT('/users/me/name', { name: 'test UP' }, {}, function(s2) {
#         $log('here'.magenta)
#         // expect(r.initials).to.equal('IN')
#         expect(s2.name).to.equal('test UP')
#         GET('/session/full', {}, (s2) => {
#           expect(s2.name).to.equal('test UP')
#           DONE()
#         })
#       })
#     })
#   })

# }




module.exports = ->

  beforeEach ->
    # STUB.sync(Wrappers.Slack, 'checkUserSync', null)
    STUB.cb(Wrappers.Slack, 'getUsers', FIXTURE.wrappers.slack_users_list)
    STUB.cb(Wrappers.Slack, 'getChannels', FIXTURE.wrappers.slack_channels_list)
    STUB.cb(Wrappers.Slack, 'getGroups', FIXTURE.wrappers.slack_groups_list)

  DESCRIBE("anonymous", anonymous)
  DESCRIBE("Get", get)
  DESCRIBE("Update ", update)

