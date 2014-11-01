import * as OAuthProvider from './oauthbase'
import * as LocalProvider from './localbase'
import {localLogin,localSignup,googleLogin,cbSession}
	from '../../../services/users'

var logging = true

var doneWrap = (cb) =>
	(e, r, info) => {
		if (logging) $log('auth.done', e, info)
		if (e) return cb(e)
		if (info) return cb(null, false, info)
		cbSession( (ee,session) => {
			if (ee) {
				$log('auth.done.session.ee', ee)
				cb(ee)
			}
			cb(null, session)
		})(e, r)
	}



var login = LocalProvider.init('local-login',
	(req, email, password, done) =>
  	localLogin.call($ctx(req), email, password, doneWrap(done))
)

var signup = LocalProvider.init('local-singup',
	(req, email, password, done) =>
  	localSignup.call($ctx(req), email, password, req.body.name, doneWrap(done))
)

var googleOAuth = OAuthProvider.init('google',
	(req, provider, profile, done) => {

	  if (req.user)
	  	done(Error("Google connect not yet impl"))
	  else
	  	googleLogin.call($ctx(req), provider, profile, doneWrap(done))
	}
)

// var twitterOAuth = LocalProvider.init('twitter',
// 	(req, provider, profile, done) => {
//   	connectProvider.call($ctx(req), provider, profile, done)
//   }
// })


export var local = { login, signup }
export var google = { oAuth: googleOAuth }
