module.exports = (app, mw) => {

  mw.cache('cachedTags',        mw.data.cached('tags'))
  mw.cache('cachedTemplates',   mw.data.cached('templates'))
  mw.cache('cachedSlackUsers',  (req, res, next) => Wrappers.Slack.getUsers(next))

  mw.cache('inflateMeExpert',
        mw.data.recast('expert','user._id',{queryKey:'userId'}))


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
        var ctx = assign(req.ctx,{sessionID:req.sessionID})
        analytics.event.call(ctx, 'firstReq', req.session.firstRequest)
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

  var {bundles} = config.http.static
  var about = _.pick(config.about, ['name','version','author','bugs','repository'])

  mw.cache('adminPage', mw.res.page('admin', {about,bundles,layout:false}))
  mw.cache('landingPage', page => mw.res.page(page, {about,bundles,layout:'landing'}))
  mw.cache('serverPage', page => mw.res.page(page, {about,bundles,layout:'server'}))
  mw.cache('clientPage', mw.res.page('client', {about,bundles,layout:'client'}))
  mw.cache('hybridPage', page => mw.res.page(page, {about,bundles,layout:'hybrid'}))

}
