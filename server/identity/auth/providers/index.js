import * as OAuthProvider from './oauthbase'
import * as LocalProvider from './localbase'
var UserService = require('../../../services/users')
var {setFirebaseToken} = require('../../../middleware/auth')

var fbTokenWrapper = (req, done) => {
  return (e, user, info) => {
    if (user) {
      var token = setFirebaseToken(user, req.session, req.sessionID);
      user.firebaseToken = token;
      req.session.firebaseToken = token;
    }
    done(e, user, info);
  }
}

var localLogin = LocalProvider.init('local-login', (req, email, password, done) => {
  $callSvc(UserService.localLogin,req)(email, password, fbTokenWrapper(req,done))
})

var localSignup = LocalProvider.init('local-singup', (req, email, password, done) => {
  $callSvc(UserService.localSignup,req)(email, password, req.body.name, fbTokenWrapper(req,done))
})

var googleOAuth = OAuthProvider.init('google', require('passport-google-oauth').OAuth2Strategy, (req, provider, profile, done) => {
  $callSvc(UserService.googleLogin,req)(profile, fbTokenWrapper(req,done))
})

var githubOAuth = OAuthProvider.init('github', require('passport-github').Strategy, (req, provider, profile, done) => {
  $callSvc(UserService.connectProvider,req)('github', profile, done)
})

var twitterOAuth = OAuthProvider.init('twitter', require('passport-twitter').Strategy, (req, provider, profile, done) => {
  $callSvc(UserService.connectProvider,req)('twitter', profile, done)
})

export var local = { login: localLogin, signup: localSignup }
export var google = { oAuth: googleOAuth }
export var github = { oAuth: githubOAuth }
export var twitter = { oAuth: twitterOAuth }
