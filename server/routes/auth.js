import {google,local} from '../identity/auth/providers/index'
import {logout,shakeDone} from '../identity/auth/actions'
import {setReturnTo,setMixpanelId,ensureAuthd} from '../identity/auth/middleware'


export default function(app) {
  
  var router = require('express').Router()

  // Use middleware (only on auth routes) to look at the
  // querystring and save params to the session
  router.use(setReturnTo)
  router.use(setMixpanelId)

  console.log('config.auth', config.auth)

  router.get('/logout', logout(config.auth) )
  router.get('/login*', app.renderHbs('login') )

  router.post('/login', local.login )


  router.get('/google', google.oAuth )
  router.get('/google/callback', google.oAuth, shakeDone)

  return router

}