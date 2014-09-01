var fs = require('fs');
var marked = require('marked');
var hbs = require('express-hbs');

export default function(app) {

	hbs.registerAsyncHelper('mdEntry', function(entryId, cb) {
		fs.readFile(`${app.dir}/app/blog/${entryId}.md`, 'utf8', (err, md) =>
			cb(new hbs.SafeString(marked(md, { sanitize: false })))
		);
	});

	hbs.registerHelper('isoMoment', moment => moment.toISOString());

	var hbsEngine = hbs.express3({ partialsDir: `${app.dir}/app/partials` });
	app.engine('hbs', hbsEngine);

	// Temporary for dev 
	app.get('/', (req,res) => res.status(200).render('index.hbs') ); 
	// -- Temporary
}