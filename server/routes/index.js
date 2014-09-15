import apiRouter from './api'
import postsRouter from './posts'
import authRouter from './auth'
import WorkshopsService from '../services/workshops'


export default function(app)
{	
	app.use('/v1/auth', authRouter(app))
	app.use('/v1/api', apiRouter(app))
	app.use('/posts', postsRouter(app))	

	app.get( ['/workshops/*', '/:tag/workshops/*'], app.renderHbs('workshops') )
	
	app.get( '/workshops-slide/:id', (req,res) => {
		return new WorkshopsService(req.user).getBySlug(req.params.id, 
			(e,r) => res.status(200).render(`workshopsslide.hbs`, r))
	})
	
	app.get( '/v1', app.renderHbs('index') ) // - while still running v0
	app.get( '/', app.renderHbs('index') )
}