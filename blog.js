var posts = [	
	{ id: '0827', tag: 'mean-stack', title: 'Starting a Mean Stack App', by: 'hackerpreneur' },
	{ id: '0828', tag: 'mean-stack', title: 'My First AngularJS App', by: 'hackerpreneur' },
	{ id: '0829', tag: 'mean-stack', title: 'Using ES6 (Harmony) with NodeJS', by: 'hackerpreneur' }
];

module.exports = function(app)
{	
	require('./handlebars')(app);

	var getPost = function(post, day) {
		post.date = moment(post.id+'2014','MMDDYYYY');
		post.published = post.date.format('DD MMMM, YYYY');	
		post.url = '/posts/'+post.tag+'/'+post.title.toLowerCase().replace(/ /g, '-');
		app.get(post.url, function(req,res,next) { 
			res.status(200).render('./blog/template.hbs', post); 
		}); 
	}

	app.get('/posts', function(req,res,next) { 
		res.status(200).render('./index.hbs'); 
	}); 

	for (var i = 0; i < posts.length; i++) {
		getPost(posts[i], i);
	}
};