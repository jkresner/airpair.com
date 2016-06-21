module.exports = function(app, mw, {ads}) {
  if (!ads) return;


  var router = app.honey.Router('ads',{type:'ad'})

    .use([mw.$.noBot, mw.$.session, mw.$.cachedAds])

    .get('/visit/:short', (req, res, next) => {
        var {ads} = cache
        for (var img in ads)
          ads[img].shortUrl == req.params.short ? req.locals.r = ads[img] : 0

        req.locals.r ? next() : res.status(404).send('Not found')
      },
      mw.$.trackClick,
      (req, res, next) => res.redirect(req.locals.r.url)
    )

  for (var [code,brand,dir] of ads.campaigns.split(',').map(c => c.split(':'))) router

    .static(`/ad/${brand}`, (req, res, next) => {
        // console.log('ad/heroku', cache.ads)
        req.locals.r = cache.ads[`${brand}${req.url}`]

        return req.locals.r ? next() : res.status(404).send(`${brand}${req.url}: Not found`)
      }, mw.$.trackImpression, {dir:`${ads.dir}/${dir}`})




}



