module.exports = -> describe "API: ".subspec, ->



  describe "Users", ->

    it 'Search users'

    it 'Add location / timezone', itDone ->
      stubs.timezone.restore()
      SETUP.addAndLoginLocalUserWithEmailVerified 'chri', (chri) ->
        PUT '/users/me/location', data.wrappers.gplaces_succcessful_place, {}, (user) ->
          expect(user.localization.location).to.equal('Bengaluru, Karnataka, India')
          expect(user.localization.timezone).to.equal('India Standard Time')
          stubs.timezone = SETUP.stubGoogleTimezone()
          DONE()


    it 'Set and unset username', itDone ->
      SETUP.addAndLoginLocalUserWithEmailVerified 'tybr', (tybr) ->
        expect(tybr.username).to.be.undefined
        PUT '/users/me/username', { username: "tybr#{timeSeed()}" }, {}, (u1) ->
          expect(u1.username).to.exist
          PUT '/users/me/username', { username: "" }, {}, (u2) ->
            expect(u2.username).to.be.undefined
            DONE()
