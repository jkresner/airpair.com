module.exports = (app, mw, {abuse}) =>

  mw.res.error({
    render: { layout:false, about: app.locals.about },
    quiet: !!process.env.LOG_QUIET,
    verbose: !!process.env.LOG_VERBOSE,
    onError: (req, e) => {
      if (!e.message) e = Error(e)

      try {
        var msg = e.message.replace(/ /g,'')
        var name = e.status || (msg.length > 24 ? msg.substring(0,24) : msg)
        var context = honey.projector._.select(req.ctx, 'ip sId user ua ud')
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

      COMM.error(e, { req, subject:`{AP} ${e.message}` })
    }
  })

