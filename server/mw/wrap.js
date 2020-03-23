module.exports = (app, mw, cfg) => {

  return mw.req.wrap({

    onSlow({ctx,originalUrl,method,body}) {
      let {duration} = ctx
      let data = assign({ duration, url: originalUrl, method }, body ? {body} : {})
      analytics.issue(ctx, 'req:slow', 'performance', data)
    },

    onStart(req, res, next) {
      let {verbose} = honey.cfg('log')
      let {ip,ud} = req.ctx
      let info = false, status = 200


      if (cache['abuse'].banned(req)) {
        info = `[500] ignore blacklisted ip ${ip}`
        status = 500
      }
      else if (ud.indexOf('ban') > -1 || ud.indexOf('lib') > -1) {
        info = `[200] empty:ignore ud ${ud}`
      }

      if (info) {
        if (verbose) $log(info.magenta)
        cache.abuse.increment(status, req)
        res.type('text').send()
        return info
      }
    }

    // onFirst(req, res) {
      // if (!req.session.anonData) req.session.anonData = {}
      // res.once('finish', () => {
        // req.session.firstRequest.status = res.statusCode
        // analytics.event(req, 'firstReq', req.session.firstRequest)
      // })
    // }
    // if (req.isAuthenticated()) {
    //     if (req.session.anonData) delete req.session.anonData
    //     return true
    //   }

  })

}
