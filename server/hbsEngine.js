var fs 				= require('fs')
var marked 		= require('marked')
var hbs 			= require('express-hbs')


function registerHelpers(hbs) 
{
	hbs.registerHelper('assetUrlToMedia', (assetUrl) => {
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
	hbs.registerHelper('dateFormat', (date, format) => {
		if (!date) { return ""; }
		return moment(date).format(format);
	})
}


export default function(app) {

	var hbsEngine = hbs.express3({ partialsDir: `${config.appdir}/server/views/partials` })

	registerHelpers(hbs);
	
	app.set('views', `${config.appdir}/server/views`)
	app.engine('hbs', hbsEngine);

	var combineBaseData = (req, data) => {
		if (!data) { data = {} }
		data.build = config.build
		data.authenticated = req.user && req.user._id 
		data.user = req.user || { sessionID: req.sessionID }
		data.config = { analytics: config.analytics }
		data.campPeriod = moment().format('MMMYY').toLowerCase()
		return data;
	}

	app.renderHbs = (fileName, data) =>
		(req,res) => {
			res.status(200).render(`./${fileName}.hbs`, combineBaseData(req,data))
		}

	app.renderHbsViewData = (fileName, viewDataFn) =>
		(req, res) => {
			viewDataFn(req, (e,data) => {
				res.status(200).render(`./${fileName}.hbs`, combineBaseData(req, { viewData: data } ) )
			})
		}
}