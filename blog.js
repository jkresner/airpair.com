var posts = [	
	{ id: '0902', tag: 'angularjs', title: 'Getting started with AngularJS 1.3', by: 'hackerpreneur' },
	{ id: '0901', tag: 'javascript', title: 'Using ES6 Harmony with NodeJS', by: 'hackerpreneur' },
	{ id: '0828', tag: 'angularjs', title: 'Setting up my First AngularJS App', by: 'hackerpreneur' },
	{ id: '0827', tag: 'mean-stack', title: 'Starting a Mean Stack App', by: 'hackerpreneur' }
];

import initHBSEngine from './handlebars'

export function blogInit(app)
{	
	initHBSEngine(app);

	var getPost = (post) => {
		post.date = moment(post.id+'2014','MMDDYYYY');
		post.published = post.date.format('DD MMMM, YYYY');	
		post.url = `/posts/${post.tag}/${post.title.toLowerCase().replace(/ /g, '-')}`;
		$log('post.url', post.url);
		app.get(post.url, (req,res,next) => 
			res.status(200).render('./blog/template.hbs', post)); 
	}

	app.get( '/posts', (req,res) => res.status(200).render('./index.hbs') )
	
	for (var post of posts) {
		getPost(post);
	}
};