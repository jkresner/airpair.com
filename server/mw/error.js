 module.exports = (app, mw, {abuse}) =>

  mw.res.error({

    render: {
      about:       app.locals.about,
      layout:      false,
      custom(e, req, res, next) {
        if (mw.$.abuser && cache.abuse.banned(req))
          return res.send(cache.abuse.increment(500, req))
      }
    },
    quiet:         !!process.env.LOG_QUIET,
    verbose:       !!process.env.LOG_VERBOSE,

    onError: (req, e) => {
      if (mw.$.abuser && cache.abuse.banned(req)) return
      // console.log('mw.error.onError'.blue, e)

      let msg = e.message.replace(/ /g,'')
      let name = e.status || (msg.length > 24 ? msg.substring(0,24) : msg)
      let ctx = _.select(req.ctx, 'ip sId user ua ud')
      if (/prod/i.test(honey.cfg('env')))
        analytics.issue(ctx, name, 'error', {stack:e.stack,msg:e.message,url:req.originalUrl,headers:req.headers})

      if (/not found/i.test(e.message) && e.status !== 403) {
        if (!req.user) cache.abuse.increment(404, req)
        if (req.ctx.ref && !e.message.match(/<</i))
          e.message = `${e.message} < ${req.ctx.ref}`
      }

      COMM.error(e, { req, subject:`{AP} ${e.message}` })
    }

  })

