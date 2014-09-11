import {google} from '../identity/auth/providers/index'
import {logout,shakeDone} from '../identity/auth/actions'
import {setReturnTo,setMixpanelId,ensureAuthd} from '../identity/auth/middleware'

$log('google', google)

export default function(app) {
  
  var router = require('express').Router()

  // Use middleware (only on auth routes) to look at the
  // querystring and save params to the session
  router.use(setReturnTo)
  router.use(setMixpanelId)

  router.get('/logout', logout(config.auth) )
  router.get('/login', app.renderHbs('login') )
  
  router.get('/google', google.shake )
  router.get('/google/callback', google.shake, shakeDone)

  return router

}