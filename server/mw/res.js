module.exports = (app, mw, {abuse}) => {

  var {bundles,host} = config.http.static
  var hosted = ['css/v1fonts.css','css/v1libs.css']
  if (/prod/.test(config.env)) hosted = Object.keys(bundles)
  for (var b of hosted)
    bundles[b] = `${host}${bundles[b]}`


  var {about} = config
  var cfg = { static: { host }, analytics: config.analytics }
  var pageOpts = layout => ({about,bundles,layout,cfg})


  mw.cache('adminPage', mw.res.page('admin', pageOpts('admin')))

  mw.cache('clientPage', function(req,res,next) {
    req.locals.noindex = true
    if (req.user) req.user = _.pick(req.user,'_id','name','location','avatar')
    mw.res.page('client', pageOpts(false))(req, res, next)
  })

  mw.cache('hybridPage', page => function(req,res,next) {
    if (req.user) req.user = _.pick(req.user,'_id','name','location', 'avatar')
    mw.res.page(page, pageOpts('hybrid'))(req, res, next)
  })

  mw.cache('postPage', function(req,res,next) {
    if (req.locals.r.tmpl == 'faq') req.locals.noindex = true
    mw.res.page(req.locals.r.tmpl, pageOpts('hybrid'))(req,res,next)
  })

  mw.cache('landingPage', function(req,res,next) {
    if (!req.locals.htmlHead && !req.locals.r.htmlHead) throw Error("Set landingPage req.locals.htmlHead")
    if (!req.locals.htmlHead) req.locals.htmlHead = req.locals.r.htmlHead
    if (req.locals.r.htmlHead) delete req.locals.r.htmlHead
    mw.res.page(req.locals.r.key, pageOpts('landing'))(req,res,next)
  })

  mw.cache('serverPage', page => mw.res.page(page, pageOpts('server')))

  var notFound = mw.res.notFound({
    onBot(req, res, next) {
      if (/ban|lib|null/.test(req.ctx.ud))
        return res.status(200).send('')

      var context = _.selectFromObj(req.ctx, 'ip sId user ua ud')
      analytics.issue(context, 'crawl', 'security', { crawl: 404, url: req.originalUrl, headers:req.headers })
      res.status(404).send('Page not found')
    }
  })

  mw.cache('notFound', (req, res, next) =>
    mw.$.session(req, res, () => {
      if (req.ctx.ud == 'null') req.ctx.ud = 'bot|null'
      notFound(req, res, next)
    }))

  mw.cache('error', mw.res.error({
    render: { layout:false, about, quiet: /prod/i.test(config.env) },
    terse: _.get(config, 'log.app.terse'),
    onError: (req, e) => {
      if (!e.message) e = Error(e)

      try {
        var msg = e.message.replace(/ /g,'')
        var name = e.status || (msg.length > 24 ? msg.substring(0,24) : msg)
        var context = _.selectFromObj(req.ctx, 'ip sId user ua ud')
        if (/prod/i.test(config.env))
          analytics.issue(context, name, 'error', {stack:e.stack,msg:e.message,url:req.originalUrl,headers:req.headers})
      }
      catch (ERR) {
        console.log('SHEEEET'.red, ERR.stack, e.stack)
      }

      if (/not found/i.test(e.message) && e.status !== 403) {
        if (!req.user) cache.abuse.increment(404, req)
        if (req.ctx.ref && !e.message.match(/<</i))
          e.message = `${e.message} < ${req.ctx.ref}`
      }

      COMM('ses').error(e, { req, subject:`{AP} ${e.message}` })
    }
  }))


}
