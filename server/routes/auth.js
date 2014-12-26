import {google,local} from '../identity/auth/providers/index'
import {logout,setTestLogin} from '../identity/auth/actions'
var mw = require('../middleware/auth')


export default function(app) {

  var router = require('express').Router()

  	// Looks at the querystring and save to session if ?returnTo=xxx exists
    .use(mw.setReturnTo)

    .get('/logout', logout(config.auth))
    .post('/login', mw.authAlreadyDone, local.login)
    .post('/signup', mw.authAlreadyDone, local.signup)
    .post('/subscribe', mw.authAlreadyDone, mw.setFastSingupPassword, local.signup)
    .get('/google', google.oAuth)
    .get('/google/callback', google.oAuth, mw.authDone)

  if (config.testlogin) app.get('/test/setlogin/:id', setTestLogin)

  return router

}
