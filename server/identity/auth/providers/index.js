import * as OAuthProvider from './oauthbase'
import * as LocalProvider from './localbase'
import * as UserService from '../../../services/users'


var localLogin = LocalProvider.init('local-login', (req, email, password, done) => {
  $callSvc(UserService.tryLocalLogin,req)(email, password, done)
})

var localSignup = LocalProvider.init('local-singup', (req, email, password, done) => {
  $callSvc(UserService.tryLocalSignup,req)(email, password, req.body.name, done)
})

var googleOAuth = OAuthProvider.init('google', (req, provider, profile, done) => {
  $callSvc(UserService.upsertProviderProfile,req)(provider, profile, done)
})


export var local = { login: localLogin, signup: localSignup }
export var google = { oAuth: googleOAuth }
