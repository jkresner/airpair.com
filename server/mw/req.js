module.exports = (app, mw) => {

  // var log = global.config.env != 'test' ? console.log : (() => {})

  // mw.cache('wrap', mw.req.wrap({
    // context: config.middleware.ctx,
    // onStart: (r) => log(`[req ${r.ctx.ip}]`[r.ctx.bot==false?'white':'magenta'].dim),
    // onEnd: (r, res) => log(`[res ${r.ctx.ip}] ${r.user?r.user.name:r.sessionID}`.gray.dim)
  // }))


  mw.cache('onFirstReq', mw.session.orient({
    skipIf(req) {
      if (req.isAuthenticated()) {
        if (req.session && req.session.anonData)
          delete req.session.anonData
        return true
      }
    },
    onFirst(req, res) {
      if (!req.session.anonData) req.session.anonData = {}
      res.once('finish', () => {
        req.session.firstRequest.status = res.statusCode
        analytics.event(req, 'firstReq', req.session.firstRequest)
      })
    }
  }))


  mw.cache('adm', mw.res.forbid('nonAdmin', usr =>
    !usr||!usr.roles||!_.contains(usr.roles,'admin')))


  mw.cache('noBot', mw.req.noCrawl({content:'',
    onDisallow(req) {
      // $log('TODO... write crawl errors to analytics db')
    }}))

  mw.cache('badBot', mw.req.noCrawl({group:'bad',content:'',
    onDisallow(req) {
      // $log('TODO... write crawl errors to analytics db')
    }}))

}
