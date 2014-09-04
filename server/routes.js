import {posts} from './blog/posts';
import {appApi} from './routes_api';


var renderPost = (post, posts) =>
	(req, res) => {
		post.posts = posts;
		res.status(200).render('./post.hbs', post)
	}

export default function(app)
{	
	app.use( '/api', appApi )

	app.get( '/posts', (req,res) => res.status(200).render('./index.hbs') )
	app.get( '/workshops/*', (req,res) => res.status(200).render('./workshops.hbs') )
	
	for (var post of posts) 
	{ 
		app.get(post.url, renderPost(post, posts)); 
	}

	app.get('/', (req,res) => res.status(200).render('index.hbs', {posts:posts}) ); 
}