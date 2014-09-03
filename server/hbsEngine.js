var fs = require('fs');
var marked = require('marked');
var hbs = require('express-hbs');

export default function(app) {

	var hbsEngine = hbs.express3({ partialsDir: `${app.dir}/server/views/partials` });

	hbs.registerAsyncHelper('mdEntry', (entryId, cb) => {
		var file = entryId.replace('.','');
		fs.readFile(`${app.dir}/server/blog/${file}.md`, 'utf8', (err, md) =>
			cb(new hbs.SafeString(marked(md, { sanitize: false })))
		);
	});

	hbs.registerHelper('isoMoment', date => date.toISOString());

	app.set('views', app.dir + '/server/views');
	app.engine('hbs', hbsEngine);

}