var posts = [	
	{ id: '0827', tag: 'mean-stack', title: 'Starting a Mean Stack App', by: 'hackerpreneur' },
	{ id: '0828', tag: 'mean-stack', title: 'My First AngularJS App', by: 'hackerpreneur' },
	{ id: '0829', tag: 'mean-stack', title: 'Using ES6 (Harmony) with NodeJS', by: 'hackerpreneur' }
];

var moment = require('moment');
var marked = require('marked');
var fs = require('fs');

var hbs = require('express-hbs');
var hbsEngine = hbs.express3({ partialsDir: [] });

hbs.registerAsyncHelper('mdEntry', function(entryId, cb) {
	fs.readFile(__dirname + '/app/blog/'+entryId+'.md', 'utf8', function(err, md) {
		cb(new hbs.SafeString(marked(md, { sanitize: false })));
	});
});

hbs.registerHelper('isoMoment', function(moment) {
	return moment.toISOString();
});

module.exports = function(app)
{	
	app.engine('hbs', hbsEngine);
 
	var getPost = function(post, day) {
		post.date = moment(post.id+'2014','MMDDYYYY');
		post.published = post.date.format('DD MMMM, YYYY');	
		post.url = '/'+post.by+'/'+post.tag+'/'+post.title.toLowerCase().replace(/ /g, '-');
		app.get(post.url, function(req,res,next) { 
			res.status(200).render('./blog/template.hbs', post); 
		}); 
	}

	for (var i = 0; i < posts.length; i++) {
		getPost(posts[i], i);
	}
};