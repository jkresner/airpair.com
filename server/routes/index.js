import apiRouter from './api'
import postsRouter from './posts'
import WorkshopsService from '../services/workshops'

export default function(app)
{	
	app.use( '/api/v1/', apiRouter(app) )
	app.use( '/posts', postsRouter(app) )	

	app.get( ['/workshops/*', '/:tag/workshops/*'], app.renderHbs('workshops') )
	
	app.get( '/workshops-slide/:id', (req,res) => {
		console.log('slide', req.params.id)
		return new WorkshopsService(req.user).getBySlug(req.params.id, 
			(e,r) => res.status(200).render(`workshopsslide.hbs`, r))
	})
	
	app.get( '/', app.renderHbs('index') )
}