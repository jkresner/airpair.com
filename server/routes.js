import posts from './services/posts';
import {appApi} from './routes_api';
import workshopsService from './services/workshops';

var renderPost = (post, posts) =>
	(req, res) => {
		post.posts = posts;
		res.status(200).render('./post.hbs', post)
	}

var renderHbs = (fileName, data) =>
  (req,res) => res.status(200).render(`./${fileName}.hbs`, data)


export default function(app)
{	
	app.use( '/api/v1/', appApi )

	app.get( ['/workshops/*', '/:tag/workshops/*'], renderHbs('workshops') )

	app.get( '/workshops-slide/:id', (req,res) => {
		new workshopsService(req.user).getBySlug(req.params.id, (e,r) => {
			res.status(200).render(`workshopsslide.hbs`, r)
		})
	})
	
	for (var post of posts) 
	{ 
		app.get(post.url, renderPost(post, posts)); 
	}	

	app.get( ['/posts', '/'], renderHbs('index', {posts:posts}) )
}