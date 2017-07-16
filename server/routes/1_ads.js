module.exports = function(app, mw, {ads}) {
  if (!ads) return;


  //-- start:kinda hard ... --//
  mw.data.extend('inflateAds', x => function(req, res, next) {
    // $log('ud', req.ctx.ud, /lib|ban|search|reader/.test(req.ctx.ud))
    if (/lib|ban|search|reader/.test(req.ctx.ud)) return next()  // don't want ads indexed
    var rnd = parseInt(Math.random()*100)
    if ((rnd%19)!=0) return next()
    // cache.get('ads', app.meanair.logic.ads.adsCached.exec, (e, r) =>

    // $log('cache.ads.tagged', cache.ads.tagged)
    var keys = cache.ads.tagged[req.locals.r.adtag || 'ruby']
    var ads = keys.map(key => assign({},cache.ads[key],{img:key}))
                  .forEach(ad => ad.positions
                    .forEach(p => req.locals.ads
                      ? req.locals.ads[p] = assign({position:p},ad)  // only handles one, not atm
                      : req.locals.ads = { [p] : assign({position:p},ad) }
                  ))
    // for (var img of keys) {
      // var .forEach(ad => ad.positions
    // }
      // .map(img => cache.ads[img])
      // .map(ad => assign(ad,{img:ad.img.replace('2016-q3-','')}))
    // $log('req.locals.ads', req.locals.ads)
    next()
  })
  mw.cache('inflateAds', mw.data.inflateAds())
  //-- end:hard ... --//



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

  for (var [code,brand,dir] of ads.campaigns.split(',').map(c => c.split(':'))) router

    .static(`/ad/${brand}`, (req, res, next) => {
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
      {dir:`${ads.dir}/${dir}`})




}



