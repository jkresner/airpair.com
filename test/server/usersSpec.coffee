module.exports = -> describe "API: ".subspec, ->


  before () ->
    SETUP.analytics.stub()

  after ->
    SETUP.analytics.restore()


  it.skip 'Can search users', (done) ->
    done()


  describe "Users", ->


    it 'Can add location / timezone', (done) ->
      SETUP.addAndLoginLocalUserWithEmailVerified 'chri', (chri) ->
        PUT '/users/me/location', data.wrappers.gplaces_succcessful_place, {}, (user) ->
          expect(user.localization.location).to.equal('Bengaluru, Karnataka, India')
          expect(user.localization.timezone).to.equal('India Standard Time')
          done()


    it 'Can set and unset username', (done) ->
      SETUP.addAndLoginLocalUserWithEmailVerified 'tybr', (tybr) ->
        expect(tybr.username).to.be.undefined
        PUT '/users/me/username', { username: "tybr#{timeSeed()}" }, {}, (u1) ->
          expect(u1.username).to.exist
          PUT '/users/me/username', { username: "" }, {}, (u2) ->
            expect(u2.username).to.be.undefined
            done()
