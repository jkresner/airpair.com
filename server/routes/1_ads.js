module.exports = function(app, mw, {ads}) {
  if (!ads) return;

  app.honey.Router('ads',{type:'ad'})

    .use([mw.$.noBot, mw.$.session, mw.$.cachedAds])

    .static('/ad/heroku', (req, res, next) => {
        req.locals.r = cache.ads[`heroku${req.url}`]
        return req.locals.r ? next() : res.status(404).send(`heroku${req.url}: Not found`)
      }, mw.$.trackImpression, {dir:`${ads.dir}/heroku`})

    .get('/visit/:short', (req, res, next) => {
        var {ads} = cache
        for (var img in ads)
          ads[img].shortUrl == req.params.short ? req.locals.r = ads[img] : 0

        req.locals.r ? next() : res.status(404).send('Not found')
      },
      mw.$.trackClick,
      (req, res, next) => res.redirect(req.locals.r.url)
    )

}



