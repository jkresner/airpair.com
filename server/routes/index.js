import authRouter from './auth'
import admRouter from './adm'
import apiRouter from './api'
import dynamicRouter from './dynamic'
import * as redirects from './redirects'
var whiteListedRoutes = require('../../shared/routes')

export default function(app, cb)
{	
  //-- Have to redirects from the db first so they take precedence
  redirects.init(app, ()=>{
    app.use('/v1/auth', authRouter(app))
    app.use('/v1/api', apiRouter(app))
    app.use('/v1/adm', admRouter(app))
    app.use(dynamicRouter(app)) 
    app.get( ['/','/v1'], app.renderHbs('index') )
    app.get( whiteListedRoutes, app.renderHbs('base') )  

    cb()
  })
}