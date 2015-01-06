import {google,local} from '../identity/auth/providers/index'
import {logout,setTestLogin} from '../identity/auth/actions'
var mw = require('../middleware/auth')

export default function(app) {

  var router = require('express').Router()

  	// Looks at the querystring and save to session if ?returnTo=xxx exists
    .use(mw.setReturnTo)

    .get('/logout', logout(config.auth))
    .post('/login', mw.authAlreadyDone, local.login, mw.setFirebaseTokenOnSession)
    .post('/signup', mw.authAlreadyDone, local.signup, mw.setFirebaseTokenOnSession)
    .post('/subscribe', mw.authAlreadyDone, mw.setFastSingupPassword, local.signup, mw.setFirebaseTokenOnSession)
    .get('/google', google.oAuth)
    .get('/google/callback', google.oAuth, mw.setFirebaseTokenOnSession, mw.authDone)

  if (config.testlogin) app.get('/test/setlogin/:id', setTestLogin)

  return router

}
