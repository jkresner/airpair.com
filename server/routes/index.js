import authRouter from './auth'
import admRouter from './adm'
import apiRouter from './api'
import dynamicRouter from './dynamic'
import * as redirects from './redirects'
import UsersAPI from '../api/users'
import {authd,emailv} from '../identity/auth/middleware'
var whiteListedRoutes = require('../../shared/routes')


export default function(app, cb)
{
	function handleVerify(req, res, next) {
		UsersAPI.svc.verifyEmail.apply({user:req.user}, [req.query.hash, function(e, r) {
			if (e) res.redirect('/email_verification_failed')
			else {
				req.user.emailVerified = r.emailVerified;
				res.redirect('/email_verified')
			}
			next();
		}]);
	}


	//-- Have to redirects from the db first so they take precedence
	redirects.init(app, () => {
		app.use('/v1/auth', authRouter(app))
		app.get('/v1/email-verify', authd, handleVerify)
		app.get('/v1/emailv-test', authd, emailv, function(req, res) { res.status(200).end() })
		app.use('/v1/api', apiRouter(app))
		app.use('/v1/adm', admRouter(app))
		app.use(dynamicRouter(app))
		app.get( ['/','/v1'], app.renderHbs('index') )
		app.get( whiteListedRoutes, app.renderHbs('base') )

		cb()
	})
}
