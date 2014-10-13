import {google,local} from '../identity/auth/providers/index'
import {logout,setTestLogin} from '../identity/auth/actions'
import {authd,setReturnTo,authDone} from '../identity/auth/middleware'
import UsersAPI from '../api/users'

export default function(app) {

  var router = require('express').Router()

  	// Looks at the querystring and save params to the session
    .use(setReturnTo)

    .get('/logout', logout(config.auth))
    .post('/login', local.login, authDone)
    .post('/signup', local.signup, authDone)
    .get('/google', google.oAuth)
    .get('/google/callback', google.oAuth, authDone)
    .get('/verify', authd, UsersAPI.verifyEmail)

  if (config.testlogin) app.get('/test/setlogin/:id', setTestLogin)

  return router

}
