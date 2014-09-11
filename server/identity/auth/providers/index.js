import * as OAuthProvider from './oauthbase'
import * as LocalProvider from './localbase'
import UserService from '../../../services/users'


var localLogin = LocalProvider.init('local-login', (req, email, password, done) => {
  $log('verifyCallBack.local.login', email, password)
  new UserService().tryLocalLogin(email, password, done)  
})

// var localSignup = Provider.init('local-singup', (req, email, password, name, done) => {
//   new UserService().tryLocalSignup(req.user, provider, profile, done)  
// })

var googleOAuth = OAuthProvider.init('google', (req, provider, profile, done) => {
  new UserService().upsertProviderProfile(req.user, provider, profile, done)  
})


export var local = { login: localLogin }
export var google = { oAuth: googleOAuth }