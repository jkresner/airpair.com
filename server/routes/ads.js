module.exports = function(app, mw) {


  mw.cache('cachedAds', (req,res,next) =>
    cache.get('ads', cb =>
      DAL.Campaign.getManyByQuery({code:{$in:config.ads.campaigns.split(',')}}, (e, campaigns) => {
        var ads = {}
        for (var c of campaigns || [])
          for (var ad of c.ads)
            ads[ad.shortUrl.replace('https://www.airpair.com/visit/','')] = ad
        cb(e, ads)
      }),
      (e, ads) => next()
    ))


  var express  = require('express')


  //no max age, we want no cacheing
  app.use('/ad', mw.$.noBot, mw.$.cachedAds,
    mw.$.trackAdImpression, express.static(config.ads.dir))


  app.use('/visit/:short', mw.$.noBot, mw.$.cachedAds, (req, res, next) => {
      req.ad = cache.ads[req.params.short]
      return req.ad ? next() : res.status(404).send('Not found')
    },
    mw.$.trackAdClick,
    (req, res, next) => {
      $log('trackedAdClick'.yellow, req.ad.url, req.header('Referer'))
      res.redirect(req.ad.url)
    }
  )

}
