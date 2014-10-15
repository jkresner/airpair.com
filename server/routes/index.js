import authRouter from './auth'
import admRouter from './adm'
import apiRouter from './api'
import dynamicRouter from './dynamic'
import * as redirects from './redirects'
import {emailv} from '../identity/auth/middleware'
var whiteListedRoutes = require('../../shared/routes')


export default function(app, cb)
{

  //-- Have to redirects from the db first so they take precedence
  redirects.init(app, ()=>{
    app.use('/v1/auth', authRouter(app))
    app.use('/v1/api', apiRouter(app))
    app.use('/v1/adm', admRouter(app))
    app.use(dynamicRouter(app))
    app.get('/verify_success', app.renderHbs('verify_success') )
    app.get('/verify_failed', app.renderHbs('verify_failed') )
    app.get('/email_not_verified', app.renderHbs('email_not_verified') )
    app.get( ['/','/v1'], emailv, app.renderHbs('index') )
    app.get( whiteListedRoutes, app.renderHbs('base') )

    cb()
  })

}
