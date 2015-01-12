import {google,local} from '../identity/auth/providers/index'
import {logout,setTestLogin} from '../identity/auth/actions'
var mw = require('../middleware/auth')
var pp = require('../services/wrappers/paypal')
var {addOAuthPayoutmethod} = require('../services/paymethods')


export default function(app) {

  var router = require('express').Router()

    //-- Don't want returnTo over ridden on oauth callbacks
    .get('/paypal/callback', mw.authd, pp.handleOAuthCallback,
      mw.handleOAuthSuccess('paypal', addOAuthPayoutmethod))

    // Looks at the querystring and save to session if ?returnTo=xxx exists
    .use(mw.setReturnTo)

    .get('/logout', logout(config.auth))
    .post('/login', mw.authAlreadyDone, local.login)
    .post('/signup', mw.authAlreadyDone, local.signup)
    .post('/subscribe', mw.authAlreadyDone, mw.setFastSingupPassword, local.signup)
    .get('/google', google.oAuth)
    .get('/google/callback', google.oAuth, mw.authDone)

    .get('/paypal-loginurl', mw.authd, (req,res) =>
      { res.json({url:pp.loginUrl(req)}) })

  if (config.testlogin) app.get('/test/setlogin/:id', setTestLogin)

  return router

}
