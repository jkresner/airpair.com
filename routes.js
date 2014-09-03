import {posts} from './app/blog/posts';

var renderPost = (post, posts) =>
	(req, res) => {
		post.posts = posts;
		res.status(200).render('./blog/template.hbs', post)
	}

export default function(app)
{	
	app.get( '/posts', (req,res) => res.status(200).render('./index.hbs') )
	
	for (var post of posts) 
	{ 
		app.get(post.url, renderPost(post, posts)); 
	}

	app.get('/', (req,res) => res.status(200).render('index.hbs', {posts:posts}) ); 
}