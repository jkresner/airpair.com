module.exports = function(app, mw) {

  app.use('/ad', app.Router()
                    .use(mw.$$('noBot session cachedAds'))

    .get('/unit', mw.$.trackImpression, app.Static(config.ads.dir)) //no max age, we want no cacheing
    .get('/visit/:short', (req, res, next) => {
        req.ad = cache.ads[req.params.short]
        return req.ad ? next() : res.status(404).send('Not found')
      }, mw.$.trackClick,
      (req, res, next) => {
        $log('trackedClick'.yellow, req.ad.url, req.header('Referer'))
        res.redirect(req.ad.url)
      })
  )
}
