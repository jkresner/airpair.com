get = ->

  IT 'Search users', ->
    LOGIN 'admin', =>
      GET '/adm/users/search/jon', (r) =>
        expect(r.length>0).to.be.true
        expect(r[0]._id).to.exist
        expect(r[0].name).to.exist
        @todo('expect(r[0].avatar).to.exist')
        DONE()


update = ->

  SKIP 'Add location / timezone', ->
    # STUB.Timezone('madridLocationData')
    # STORY.newUser 'chri', {location:undefined,login:true}, (chri) =>
    #   $log('chri'.white, chri)
    #   PUT '/users/me/location', FIXTURE.wrappers.madridLocationData, (user) =>
    #     $log('chri'.white, user)
    #     # expect(user.location.name).to.equal('Bengaluru, Karnataka, India')
    #     # expect(user.location.shortName).to.equal('Bengaluru')
    #     # expect(user.location.timeZoneId).to.equal('Asia/Calcutta')
    #     DONE()

  IT 'Set and unset username', ->
    username = "dily#{@testSeed}"
    STORY.newUser 'dily', (dily) =>
      expect(dily.username).to.equal(username)
      PUT '/users/me/username', { username: "" }, (u2) =>
        expect(u2.username).to.be.undefined
        PUT '/users/me/username', { username }, (u1) =>
          expect(u1.username).to.equal(username)
          DONE()

  IT 'Change name', ->
    STORY.newUser 'snug', (s) ->
      EXPECT.startsWith(s.name, "Ra'Shaun")
      PUT '/users/me/name', { name: 'Godly Jacob' }, (u1) =>
        expect(u1.name).to.equal('Godly Jacob')
        DONE()

  IT 'Set initials', ->
    STORY.newUser 'misr', (s) =>
      GET "/session/full", (u0) =>
        EXPECT.equalIds(s._id,u0._id)
        expect(u0.name).to.equal(s.name)
        expect(u0.initials).to.be.undefined
        PUT '/users/me/initials', { initials: 'GJ' }, (u1) =>
          expect(u1.initials).to.equal('GJ')
          DB.docById 'User', s._id, (u2) =>
            expect(u2.initials).to.equal('GJ')
            DONE()

  SKIP "Change bio"


DESCRIBE("Get", get)
DESCRIBE("Update ", update)

