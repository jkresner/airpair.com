import {logout,setTestLogin} from '../identity/auth/actions'
var auth                     = require('../identity/auth/providers/index')
var mw                       = require('../middleware/auth')
var Router                    = require('express').Router

var routes = {

signup: Router()
  .use(mw.authAlreadyDone)
  .use(mw.setReturnTo)
  .use(mw.noCrawl('/'))
  .get('/github', auth.github.oAuth)
  .get('/github/callback', auth.github.oAuth, mw.authDone),

v1: Router()
  //-- Don't want returnTo over ridden on oauth callbacks
  .get('/paypal/callback', mw.authd, Wrappers.PayPal.handleOAuthCallback,
    mw.handleOAuthSuccess('paypal', 'paymethods', 'addOAuthPayoutmethod'))

  // Looks at the querystring and save to session if ?returnTo=xxx exists
  .use(mw.setReturnTo)
  .use(mw.noCrawl('/'))

  .post('/login', auth.local.login)
  .post('/signup', auth.local.signup)
  // .post('/signup-so', mw.authAlreadyDone, mw.setFastSingupPassword('so'), auth.local.signup)
  .get('/google', auth.google.oAuth)
  .get('/google/callback', auth.google.oAuth, mw.authDone)
  .get('/paypal-loginurl', mw.authd, (req,res) => res.json({url:Wrappers.PayPal.loginUrl()}) ),

connect: Router()
  .get('/google/callback', auth.google.oAuth, mw.authDone)
  .get('/github/callback', mw.authd, auth.github.oAuth, mw.authDone)
  .get('/twitter/callback', mw.authd, auth.twitter.oAuth, mw.authDone)
  .get('/stackexchange/callback', mw.authd, auth.stackexchange.oAuth, mw.authDone)
  .get('/linkedin/callback', mw.authd, auth.linkedin.oAuth, mw.authDone)
  .get('/bitbucket/callback', mw.authd, auth.bitbucket.oAuth, mw.authDone)
  .get('/angellist/callback', mw.authd, auth.angellist.oAuth, mw.authDone)
  .get('/slack/callback', mw.authd, auth.slack.oAuth, mw.authDone)
  .use(mw.setReturnTo)
  .get('/google', auth.google.oAuth)
  .get('/github', mw.authd, auth.github.oAuth)
  .get('/twitter', mw.authd, auth.twitter.oAuth)
  .get('/stackexchange', mw.authd, auth.stackexchange.oAuth)
  .get('/linkedin', mw.authd, auth.linkedin.oAuth)
  .get('/bitbucket', mw.authd, auth.bitbucket.oAuth)
  .get('/angellist', mw.authd, auth.angellist.oAuth)
  .get('/slack', mw.authd, auth.slack.oAuth)

}

module.exports = function(app) {

  app.get('/logout', mw.setReturnTo, logout(config.auth))

  app.use('/signup', routes.signup)
  app.use('/v1/auth', routes.v1)
  app.use('/auth', routes.connect)

  if (config.testlogin) app.get('/test/setlogin/:id', setTestLogin)
}
