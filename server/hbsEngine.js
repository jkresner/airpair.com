var fs = require('fs');
var marked = require('marked');
var hbs = require('express-hbs');

export default function(app) {

	var hbsEngine = hbs.express3({ partialsDir: `${app.dir}/server/views/partials` });

	hbs.registerAsyncHelper('mdEntry', (md, cb) => {
		cb(new hbs.SafeString(marked(md, { sanitize: false })))
	});

	hbs.registerAsyncHelper('mdToc', (md, cb) => {
		cb(new hbs.SafeString(marked(md, { sanitize: false })))
	});

	hbs.registerHelper('isoMoment', date => moment(date).toISOString());
	hbs.registerHelper('dateFormat', (date, format) => moment(date).format(format));

	app.set('views', app.dir + '/server/views');
	app.engine('hbs', hbsEngine);

	app.renderHbs = (fileName, data) =>
		(req,res) => {
			if (!data) { data = {} }
			data.authenticated = req.isAuthenticated()
			data.user = req.user
			res.status(200).render(`./${fileName}.hbs`, data)
		}
}