import * as OAuthProvider from './oauthbase'
import * as LocalProvider from './localbase'
var UserService = require('../../../services/users')


var localLogin = LocalProvider.init('local-login', (req, email, password, done) => {
  $callSvc(UserService.localLogin,req)(email, password, done)
})

var localSignup = LocalProvider.init('local-singup', (req, email, password, done) => {
  $callSvc(UserService.localSignup,req)(email, password, req.body.name, done)
})

var googleOAuth = OAuthProvider.init('google', (req, provider, profile, done) => {
  $callSvc(UserService.googleLogin,req)(profile, done)
})


export var local = { login: localLogin, signup: localSignup }
export var google = { oAuth: googleOAuth }
