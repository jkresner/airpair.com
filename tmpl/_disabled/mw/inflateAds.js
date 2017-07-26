module.exports = (app, mw) =>

  function(req, res, next) {
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
  }
