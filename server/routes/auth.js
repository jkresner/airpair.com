import {google,local} from '../identity/auth/providers/index'
import {logout,setTestLogin} from '../identity/auth/actions'
import {setReturnTo,setMixpanelId,authDone} from '../identity/auth/middleware'


export default function(app) {
  
  var router = require('express').Router()

  // Use middleware (only on auth routes) to look at the
  // querystring and save params to the session
    .use(setReturnTo)
    .use(setMixpanelId)

    .get('/logout', logout(config.auth))
    .post('/login', local.login, authDone)
    .post('/signup', local.signup, authDone)
    .get('/google', google.oAuth)
    .get('/google/callback', google.oAuth, authDone)

  if (config.testlogin) app.get('/test/setlogin/:id', setTestLogin)

  return router

}