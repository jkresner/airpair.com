AuthService = require('../../server/services/auth')()

signup = ->

  it 'Can sign up as new user with google', itDone ->
    AuthService.githubAuth.call SETUP.userSession(), data.oauth.airtest1.gh, (e, usr) ->
      data.users.airtest1 = usr
      $log('yo yo', usr)
      LOGIN 'airtest1', ->
        $log('loggedIn')
        GET '/session/full', {}, (s) ->
          expect(s._id).to.equal(usr._id.toString())
          expect(s.email).to.equal(usr.email)
          expect(s.name).to.equal(usr.name)
          expect(s.googleId).to.be.undefined  # not returned from session call
          expect(s.google.id).to.equal(data.oauth.rbrw.id)
          expect(s.emailVerified).to.equal(false)
          expect(s.local).to.be.undefined  # holds password field
          expect(s.roles).to.be.undefined  # new users have undefined roles
          expect(s.cohort.engagement).to.exist
          DONE()



module.exports = ->

  @timeout(6000)

  describe("Signup: ".subspec, signup)
  # describe("Login: ".subspec, login)
  # describe("Password: ".subspec, password)
  # describe("Change and verify e-mail: ".subspec, changeEmail)
  # describe("With analytics: ".subspec, withAnalytics)
