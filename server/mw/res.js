module.exports = (app, mw) => {


  var admId = config.env == 'test' ? "54551be15f221efa174238d1" :
                                     "5175efbfa3802cc4d5a5e6ed"

  mw.cache('adm', mw.res.forbid('!adm', function(req) {
    if (!req.user) return 'not authd'
    if (req.user._id != admId) return 'non admin'
  }))


  var {bundles,host} = config.http.static
  var about = _.pick(config.about, ['name','version','author'])
  var cfg = { static: { host }, analytics: config.analytics }
  var pageOpts = layout => ({about,bundles,layout,cfg})


  mw.cache('adminPage', mw.res.page('admin', pageOpts('admin')))

  mw.cache('clientPage', function(req,res,next) {
    if (req.user) req.user = _.pick(req.user,'_id','name','location','avatar')
    mw.res.page('client', pageOpts(false))(req, res, next)
  })

  mw.cache('hybridPage', page => function(req,res,next) {
    if (req.user) req.user = _.pick(req.user,'_id','name','location', 'avatar')
    mw.res.page(page, pageOpts('hybrid'))(req, res, next)
  })

  mw.cache('postPage', function(req,res,next) {
    mw.res.page(req.locals.r.tmpl, pageOpts('hybrid'))(req,res,next)
  })

  mw.cache('landingPage', function(req,res,next) {
    if (!req.locals.htmlHead) throw Error("Set landingPage req.locals.htmlHead")
    mw.res.page(req.locals.r.key, pageOpts('landing'))(req,res,next)
  })

  mw.cache('serverPage', page => mw.res.page(page, pageOpts('server')))


  mw.cache('authd', mw.res.forbid('anon',
    function(req) {
      if (!req.user) {
        global.analytics.issue(req.ctx, 'forbidanon', 'security_low',
          { mw:'authd',rule:'!req.user', 'req.user': req.user })
        return 'not authed'
      }
    }
  ))

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
      if (!e.message) e = Error(e)

      try {
        var msg = e.message.replace(/ /g,'')
        var name = e.status || (msg.length > 24 ? msg.substring(0,24) : msg)
        if (config.env.match(/prod/i))
          analytics.issue(req.ctx, name, 'error', {stack:e.stack,msg:e.message})
      }
      catch (ERR) {
        console.log('SHEEEET'.red, ERR.stack, e.stack)
      }

      if ( e.message.match(/not found/i)
        && !e.message.match(/<</i)
        && req.ctx.ref)
        e.message = `${e.message} << ${req.ctx.ref}`


    // sendError(text, subject) {
    //   if (config.log.error.email) {
    //     if (!mm.transports) mm.transports = initTransports()

    //     mm.transports.ses.sendMail({
    //       text,
    //       to: config.log.error.email.to,
    //       from: config.log.error.email.from,
    //       subject: subject || config.log.error.email.subject
    //     },()=>{})
    //   }
    // }

      if (config.env.match(/prod/i)
          && config.comm.dispatch.groups.errors)

        COMM('ses').error(e, {
          subject:`{AP} ${e.message}`,
          text: require('../util/log/request')(req, e) })
    }
  }))


}
