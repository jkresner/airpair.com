module.exports = function(app, mw, {ads}) {


  $logIt('cfg.route', `ads:${ads.dir}/heroku`)
  app.use('/ad/heroku', mw.$.noBot, mw.$.session, mw.$.cachedAds,
    (req, res, next) => {
      req.ad = cache.ads[`heroku${req.url}`]
      return req.ad ? next() : res.status(404).send(`heroku${req.url}: Not found`)
    },
    mw.$.trackImpression,
    app.Static(`${ads.dir}/heroku`)) //no max age, we want no cacheing


  app.get('/visit/:short', mw.$.noBot, mw.$.session, mw.$.cachedAds,
    (req, res, next) => {
      var {ads} = cache
      for (var img in ads)
        ads[img].shortUrl == req.params.short ? req.ad = ads[img] : 0

      // $log('req.ad', req.ad, req.ctx, req.sessionID, req.session)
      req.ad ? next() : res.status(404).send('Not found')
    },
    mw.$.trackClick,
    (req, res, next) => {
      // $log('trackedClick'.yellow, req.ad.url, req.header('Referer'))
      res.redirect(req.ad.url)
    })

}
