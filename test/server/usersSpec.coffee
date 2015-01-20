module.exports = -> describe "API: ", ->


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
