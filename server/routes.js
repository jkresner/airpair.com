import {posts} from './blog/posts';
import {appApi} from './routes_api';

var renderPost = (post, posts) =>
	(req, res) => {
		post.posts = posts;
		res.status(200).render('./post.hbs', post)
	}

var renderHbs = (fileName, data) =>
  (req,res) => res.status(200).render(`./${fileName}.hbs`, data)


export default function(app)
{	
	app.get( ['/workshops/*', '/:tag/workshops/*'], renderHbs('workshops') )
	
	app.use( '/api', appApi )

	for (var post of posts) 
	{ 
		app.get(post.url, renderPost(post, posts)); 
	}	

	app.get( ['/posts', '/'], renderHbs('index', {posts:posts}) )
}