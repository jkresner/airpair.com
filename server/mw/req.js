module.exports = (app, mw) => {


  var staleUrls = config.middleware.ctx.dirty.urlstale.split(' ')
  mw.cache('reqDirty', (req, res, next) => {
    for (var url in staleUrls)
      if (req.originalUrl.indexOf(url) == 1) req.ctx.dirty = 'urlstale'
    next()
  })

  var restrict = req => req.ctx.bot||req.ctx.dirty
  mw.cache('session', mw.session.touch(app.meanair.model.sessionStore,
    assign({ restrict }, config.middleware.session)) )


  mw.cache('reqFirst', mw.session.orient({
    skipIf(req) {
      if (req.isAuthenticated()) {
        if (req.session.anonData) delete req.session.anonData
        return true
      }
    },
    onFirst(req, res) {
      if (!req.session.anonData) req.session.anonData = {}
      // res.once('finish', () => {
        // req.session.firstRequest.status = res.statusCode
        // analytics.event(req, 'firstReq', req.session.firstRequest)
      // })
    }
  }))


  mw.cache('adm', mw.res.forbid('nonAdmin', usr =>
    !usr||!usr.roles||!_.contains(usr.roles,'admin')))


  mw.cache('noBot', mw.req.noCrawl({content:'',
    onDisallow(req) {
      // $log('TODO... write crawl issue to analytics db or similar')
    }}))

  mw.cache('badBot', mw.req.noCrawl({group:'bad|ua:none',content:'',
    onDisallow(req) {
      // $log('TODO... write crawl issue to analytics db or similar')
    }}))

}
