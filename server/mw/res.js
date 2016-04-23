module.exports = (app, mw) => {


  var {bundles} = config.http.static
  var about = _.pick(config.about, ['name','version','author'])

  // assign(app.locals,{host:{static:'https://static.airpair.com'}})

  mw.cache('adminPage', mw.res.page('admin', {about,bundles,layout:false}))

  mw.cache('clientPage', function(req,res,next) {
    if (req.user) req.user = _.pick(req.user,'_id','name','location','avatar')
    mw.res.page('client', {about,bundles,layout:false})(req, res, next)
  })

  mw.cache('hybridPage', page => function(req,res,next) {
    if (req.user) req.user = _.pick(req.user,'_id','name','location', 'avatar'))
    mw.res.page(page, {about,bundles,layout:'hybrid'})(req, res, next)
  })

  mw.cache('postPage', function(req,res,next) {
    mw.res.page(req.locals.r.tmpl, {about,bundles,layout:'hybrid'})(req,res,next) })

  mw.cache('landingPage', function(req,res,next) {
    if (!req.locals.htmlHead) throw Error("Set landingPage req.locals.htmlHead")
    mw.res.page(req.locals.r.key, {about,bundles,layout:'landing'})(req,res,next)
  })

  mw.cache('serverPage', page => mw.res.page(page, {about,bundles,layout:'server'}))


  mw.cache('notFound', mw.res.notFound({
    onBot(req, res, next) {
      analytics.issue(req.ctx, 'crawl', 'security', { crawl: 404, url: req.originalUrl })
      if (req.ctx.bot.match('bad'))
        return res.status(200).send('')
      else
        return res.status(404).send('Page not found')
    }
  }))


  mw.cache('error', mw.res.error({
    render: { layout:false, about },
    quiet: _.get(config, 'log.app.quiet'),
    // formatter: (req, e) => `${e.message}`,
    onError: (req, e) => {
      try {
        var msg = e.message.replace(/ /g,'')
        var name = e.status || (msg.length > 24 ? msg.substring(0,24) : msg)
        if (config.env.match(/prod/i))
          analytics.issue(req.ctx, name, 'error', {stack:e.stack,msg:e.message})
      }
      catch (ERR) {
        console.log('SHEEEET'.red, ERR.stack, e.stack)
      }

      if (config.env.match(/prod/i) && config.comm.dispatch.groups.errors)
        COMM('ses').error(e, {
          subject:`{AP} ${e.message}`,
          text: $request(req, e, {body:true}) + '\n\n' + e.stack.toString() })
      // else if (global.config.log.app.verbose)
        // $log('mw.onError[VERBOSE]'.cyan, e.stack)
    }
  }))


}
