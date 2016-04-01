module.exports = function(app, mw) {


  //no max age, we want no cacheing
  app.use('/ad', mw.$.noBot, mw.$.cachedAds,
    mw.$.trackImpression, app.Static(config.ads.dir))


  app.use('/visit/:short', mw.$.noBot, mw.$.cachedAds, (req, res, next) => {
      req.ad = cache.ads[req.params.short]
      return req.ad ? next() : res.status(404).send('Not found')
    },
    mw.$.trackClick,
    (req, res, next) => {
      $log('trackedClick'.yellow, req.ad.url, req.header('Referer'))
      res.redirect(req.ad.url)
    }
  )

}
