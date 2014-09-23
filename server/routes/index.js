import authRouter from './auth'
import admRouter from './adm'
import apiRouter from './api'
import dynamicRouter from './dynamic'


export default function(app)
{	
	app.use('/v1/auth', authRouter(app))
	app.use('/v1/api', apiRouter(app))
	app.use('/v1/adm', admRouter(app))
	app.use(dynamicRouter(app))	
	
	app.get( ['/','/v1'], app.renderHbs('index') )
	app.get( ['/*'], app.renderHbs('base') )	
}