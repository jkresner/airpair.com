var marked 		     = require('marked')
var hbs 			     = require('express-hbs')
var {getSession}   = require('./../services/users')

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

  hbs.registerHelper('JSON', (o) => {
    var json = JSON.stringify(o)
    if (json) json = json.replace(/'/g,"’")
    return new hbs.handlebars.SafeString(json)
  })

  hbs.registerHelper('JSONID', (o) =>
    new hbs.handlebars.SafeString(JSON.stringify(_.pick(o,'_id')))
  )

}

module.exports = function(app) {

  var hbsEngine = hbs.express3({ partialsDir: `${config.appdir}/server/views/partials` })

  registerHelpers(hbs);

  app.set('views', `${config.appdir}/server/views`)
  app.engine('hbs', hbsEngine);

  var combineBaseData = (req, data) => {
    if (!data) data = {}
    data.build = config.build
    data.authenticated = !!(req.user && req.user._id)
    data.config = { analytics: config.analytics, bundle: config.bundle, hangout: config.hangout }
    data.campPeriod = moment().format('MMMYY').toLowerCase()
    return data;
  }

  app.renderErrorPage = (error) =>
    (req,res) => {
      // $callSvc(getSession,req)((e,session) => {
      res.status(error.status||400).render(`./error.hbs`, {error,build:config.build,config:{bundle: config.bundle}})
      // })
    }

  app.renderHbsAdmin = (fileName, data) =>
    (req,res) => {
      res.status(200).render(`./${fileName}.hbs`, combineBaseData(req,{session:req.user}))
    }

  app.renderHbs = (fileName, data) =>
    (req,res) => {
      $callSvc(getSession,req)((e,session) => {
        if (e) { req.logout(); return res.redirect('/login') }
        res.status(200).render(`./${fileName}.hbs`, combineBaseData(req,{viewData:data,session}))
      })
    }

  var landingPartials = ['sowelcome','postscomp']

  app.renderHbsViewData = (partialName, pageMeta, viewDataFn) =>
    (req, res) => {
      $callSvc(getSession,req)((e,session)=> {
        if (e) { req.logout(); return res.redirect('/login') }
        viewDataFn(req, (e,data) => {
          data.authenticated = session._id!=null
          if (data.tmpl && data.tmpl != 'default')
            data[`${partialName}${data.tmpl}Render`] = true
          else
            data[`${partialName}Render`] = true

          if (!data.meta) data.meta = pageMeta
          var canonical = (data.meta) ? data.meta.canonical : ""
          var viewName = './baseServer.hbs'
          if (_.contains(landingPartials,partialName)) viewName = './baseLanding.hbs' // hacky yuk
          res.status(200).render(viewName,
            combineBaseData(req, { viewData: data, partialName, canonical, session } ) )
        })
      })
	}
}
