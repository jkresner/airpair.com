import {google,local} from '../identity/auth/providers/index'
import {logout,setTestLogin} from '../identity/auth/actions'
import {setReturnTo,authDone} from '../identity/auth/middleware'


export default function(app) {

  var router = require('express').Router()

  	// Looks at the querystring and save params to the session
    .use(setReturnTo)

    .get('/logout', logout(config.auth))
    .post('/login', local.login)
    .post('/signup', local.signup)
    .post('/subscribe', (req,r,n) => { req.body.password = 'fast-ap-signup'; n() }, local.signup)
    .get('/google', google.oAuth)
    .get('/google/callback', google.oAuth, authDone)

  if (config.testlogin) app.get('/test/setlogin/:id', setTestLogin)

  return router

}
