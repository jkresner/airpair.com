var fs 				= require('fs')
var marked 		= require('marked')
var hbs 			= require('express-hbs')
import {getSession} from './../services/users'

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
    return moment(date).format(format)
  })

  hbs.registerHelper('JSON', (o) =>
    new hbs.handlebars.SafeString(JSON.stringify(o))
  )

  hbs.registerHelper('JSONID', (o) =>
    new hbs.handlebars.SafeString(JSON.stringify(_.pick(o,'_id')))
  )

}

export default function(app) {

  var hbsEngine = hbs.express3({ partialsDir: `${config.appdir}/server/views/partials` })

  registerHelpers(hbs);

  app.set('views', `${config.appdir}/server/views`)
  app.engine('hbs', hbsEngine);

  var combineBaseData = (req, data) => {
    if (!data) data = {}
    data.build = config.build
    data.authenticated = !!(req.user && req.user._id)
    data.config = { analytics: config.analytics, bundle: config.bundle, chat: config.chat }
    data.campPeriod = moment().format('MMMYY').toLowerCase()
    return data;
  }

  app.renderErrorPage = (error) =>
    (req,res) => {
      getSession.call(req, (e,session) => {
        res.status(error.status||400).render(`./error.hbs`, combineBaseData(req,{error,session}))
      })
    }

  app.renderHbs = (fileName, data) =>
    (req,res) => {
      getSession.call(req, (e,session) => {
        res.status(200).render(`./${fileName}.hbs`, combineBaseData(req,{viewData:data,session}))
      })
    }

  app.renderHbsAdmin = (fileName, data) =>
    (req,res) => {
      res.status(200).render(`./${fileName}.hbs`, combineBaseData(req,{session:req.user}))
    }

  app.renderHbsViewData = (partialName, pageMeta, viewDataFn) =>
    (req, res) => {
      getSession.call(req,(e,session)=>
        viewDataFn(req, (e,data) => {
          if (data.tmpl && data.tmpl != 'default')
            data[`${partialName}${data.tmpl}Render`] = true
          else
            data[`${partialName}Render`] = true

          if (!data.meta) data.meta = pageMeta
          var canonical = (data.meta) ? data.meta.canonical : ""
          res.status(200).render(`./baseServer.hbs`,
            combineBaseData(req, { viewData: data, partialName, canonical, session } ) )
        })
      )
	}
}
