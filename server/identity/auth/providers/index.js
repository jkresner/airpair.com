import * as OAuthProvider from './oauthbase'
import * as LocalProvider from './localbase'
import * as UserService from '../../../services/users'


function thisSvc(req) {
  return { user: req.user, sessionID: req.sessionID, session: req.session };
}


var localLogin = LocalProvider.init('local-login', (req, email, password, done) => {
  UserService.tryLocalLogin.call(thisSvc(req), email, password, done)
})

var localSignup = LocalProvider.init('local-singup', (req, email, password, done) => {
  UserService.tryLocalSignup.call(thisSvc(req), email, password, req.body.name, done)
})

var googleOAuth = OAuthProvider.init('google', (req, provider, profile, done) => {
  var donedone = function(e, r) {
  	$log('donedone', e, r, done)
  	done(e,r)
  }
  UserService.upsertProviderProfile.call(thisSvc(req), provider, profile, donedone)
})


export var local = { login: localLogin, signup: localSignup }
export var google = { oAuth: googleOAuth }
