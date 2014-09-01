var fs = require('fs');
var marked = require('marked');
var hbs = require('express-hbs');

hbs.registerAsyncHelper('mdEntry', function(entryId, cb) {
	fs.readFile(__dirname + '/app/blog/'+entryId+'.md', 'utf8', function(err, md) {
		cb(new hbs.SafeString(marked(md, { sanitize: false })));
	});
});

hbs.registerHelper('isoMoment', function(moment) {
	return moment.toISOString();
});

module.exports = function initHBSEngine (app) {

	var hbsEngine = hbs.express3({ partialsDir: __dirname + '/app/partials' });
	app.engine('hbs', hbsEngine);

	// Temporary for dev 
	// app.engine('html', hbsEngine);
	app.get('/', function(req,res) { res.status(200).render('index.hbs'); }); 
	// -- Temporary

}