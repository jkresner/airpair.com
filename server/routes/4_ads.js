module.exports = function(app, mw, {ads}) {
  if (!ads || !ads.on) return

  var router = honey.Router('ads',{type:'ad'})

    .use([mw.$.noBot, mw.$.session])

    .get('/visit/:short', (req, res, next) => {
        var {ads} = cache
        for (var img in ads)
          ads[img].shortUrl == req.params.short ? req.locals.r = ads[img] : 0
        req.locals.r ? next() : res.status(404).send('Not found')
      },
      mw.$.trackClick,
      (req, res, next) => res.redirect(req.locals.r.url)
    )


  for (var [code,brand,dir] of ads.campaigns.split(',').map(c => c.split(':')))

    router.static(`/ad/${brand}`, (req, res, next) => {
        // console.log(`static.ad/heroku${brand}`, cache.ads)
        ads = cache.ads[`${brand}${req.url}`]
        req.locals.r = ads
        // for (var img in ads) if (img != 'tagged')
          // req.locals.r[img] = assign(
            // _.select(ads[img], '_id shortUrl tag'), {img:ads[img].replace('2016-q3-','')})

        // console.log(`static.ad/${brand}`, req.locals.r)
        return req.locals.r ? next() : res.status(404).send(`${brand}${req.url}: Not found`)
      },
      mw.$.trackImpression,
      { dir:`${ads.dir}/${dir}` })

}
