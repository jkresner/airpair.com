import * as OAuthProvider from './oauthbase'
import * as LocalProvider from './localbase'
import * as UserService from '../../../services/users'

var localLogin = LocalProvider.init('local-login', (req, email, password, done) => {
  UserService.tryLocalLogin(email, password, done)  
})

var localSignup = LocalProvider.init('local-singup', (req, email, password, done) => {
  UserService.tryLocalSignup(email, password, req.body.name, done)  
})

var googleOAuth = OAuthProvider.init('google', (req, provider, profile, done) => {
  UserService.upsertProviderProfile(req.user, provider, profile, done)  
})


export var local = { login: localLogin, signup: localSignup }
export var google = { oAuth: googleOAuth }