var fs = require('fs');
var marked = require('marked');
var hbs = require('express-hbs');

export default function(app) {

	var hbsEngine = hbs.express3({ partialsDir: `${app.dir}/server/views/partials` });

	hbs.registerHelper('assetUrlToMedia', (assetUrl, cb) => {
		var mediaHtml = `<img src="${assetUrl}" />`;
		if (assetUrl.indexOf('http://youtu.be/') == 0) {
      var youTubeId = assetUrl.replace('http://youtu.be/', '');
      mediaHtml = `<iframe width="640" height="360" frameborder="0" allowfullscreen="" src="//www.youtube-nocookie.com/embed/${youTubeId}"></iframe>`
    } 
		return new hbs.SafeString(mediaHtml);
	});

	hbs.registerAsyncHelper('mdToHtml', (md, cb) => {
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