import {logout,setTestLogin} from '../identity/auth/actions'
var auth                     = require('../identity/auth/providers/index')
var mw                       = require('../middleware/auth')
var pp                       = require('../services/wrappers/paypal')
var {addOAuthPayoutmethod}   = require('../services/paymethods')


export default function(app) {

  var router = require('express').Router()

    //-- Don't want returnTo over ridden on oauth callbacks
    .get('/paypal/callback', mw.authd, pp.handleOAuthCallback,
      mw.handleOAuthSuccess('paypal', addOAuthPayoutmethod))
    // .get('/coinbase/callback', mw.authd,

    // Looks at the querystring and save to session if ?returnTo=xxx exists
    .use(mw.setReturnTo)

    .get('/logout', logout(config.auth))
    .post('/login', mw.authAlreadyDone, auth.local.login, mw.setFirebaseTokenOnSession)
    .post('/signup', mw.authAlreadyDone, auth.local.signup, mw.setFirebaseTokenOnSession)
    .post('/signup-home', mw.authAlreadyDone, mw.setFastSingupPassword('home'), auth.local.signup, mw.setFirebaseTokenOnSession)
    .post('/signup-so', mw.authAlreadyDone, mw.setFastSingupPassword('so'), auth.local.signup, mw.setFirebaseTokenOnSession)
    .post('/signup-postcomp', mw.authAlreadyDone, mw.setFastSingupPassword('postcomp'), auth.local.signup, mw.setFirebaseTokenOnSession)
    .post('/subscribe', mw.authAlreadyDone, mw.setFastSingupPassword('subscribe'), auth.local.signup, mw.setFirebaseTokenOnSession)
    .get('/google', auth.google.oAuth)
    .get('/google/callback', auth.google.oAuth, mw.setFirebaseTokenOnSession, mw.authDone)
    .get('/paypal-loginurl', mw.authd, (req,res) =>
      { res.json({url:pp.loginUrl(req)}) })

  app.use('/v1/auth', router)


  var connect = require('express').Router()
    .get('/google/callback', auth.google.oAuth, mw.setFirebaseTokenOnSession, mw.authDone)
    .get('/github/callback', mw.authd, auth.github.oAuth, mw.authDone)
    .get('/twitter/callback', mw.authd, auth.twitter.oAuth, mw.authDone)
    .get('/stackexchange/callback', mw.authd, auth.stackexchange.oAuth, mw.authDone)
    .get('/linkedin/callback', mw.authd, auth.linkedin.oAuth, mw.authDone)
    .get('/bitbucket/callback', mw.authd, auth.bitbucket.oAuth, mw.authDone)
    .get('/angellist/callback', mw.authd, auth.angellist.oAuth, mw.authDone)

    .use(mw.setReturnTo)
    .get('/google', auth.google.oAuth)
    .get('/github', mw.authd, auth.github.oAuth)
    .get('/twitter', mw.authd, auth.twitter.oAuth)
    .get('/stackexchange', mw.authd, auth.stackexchange.oAuth)
    .get('/linkedin', mw.authd, auth.linkedin.oAuth)
    .get('/bitbucket', mw.authd, auth.bitbucket.oAuth)
    .get('/angellist', mw.authd, auth.angellist.oAuth)

  app.use('/auth', connect)

  app.get('/logout', mw.setReturnTo, logout(config.auth))

  if (config.testlogin) app.get('/test/setlogin/:id', setTestLogin)

  return router

}
