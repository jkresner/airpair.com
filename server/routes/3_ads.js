module.exports = function(app, mw, {ads}) {


  $logIt('cfg.route', `ads:${ads.dir}/heroku`)
  app.use('/ad/heroku', mw.$.noBot, mw.$.session, mw.$.cachedAds,
    (req, res, next) => {
      $log('req.url', req.url)
      req.ad = cache.ads[`heroku${req.url}`]
      return req.ad ? next() : res.status(404).send(`${req.url}: Not found`)
    },
    mw.$.trackImpression,
    app.Static(`${ads.dir}/heroku`)) //no max age, we want no cacheing


  app.get('/visit/:short', mw.$.noBot, mw.$.session, mw.$.cachedAds,
    (req, res, next) => {
      req.ad = _.find(cache.ads, ad => ad.shortUrl == req.params.short)
      return req.ad ? next() : res.status(404).send('Not found')
    },
    mw.$.trackClick,
    (req, res, next) => {
      $log('trackedClick'.yellow, req.ad.url, req.header('Referer'))
      res.redirect(req.ad.url)
    })

}
