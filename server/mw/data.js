module.exports = (app, mw) => {

  mw.cache('cachedTags',        mw.data.cached('tags'))
  mw.cache('cachedTemplates',   mw.data.cached('templates'))
  mw.cache('cachedSlackUsers',  (req, res, next) => Wrappers.Slack.getUsers(next))


  mw.cache('cachedAds', (req,res,next) =>
    cache.get('ads', cb =>
      DAL.Campaign.getManyByQuery({code:{$in:config.routes.ads.campaigns.split(',')}},
        { select: '_id name code brand ads._id ads.img ads.url ads.shortUrl ads.positions ads.tag' }, (e, campaigns) => {
        var ads = { tagged: {} }
        for (var c of campaigns || [])
          for (var ad of c.ads) {
            ad.campaign = c.code
            ad.brand = c.brand.toLowerCase()
            ad.shortUrl = ad.shortUrl.replace('https://www.airpair.com/visit/','')
            ad.img = ad.img.replace('https://www.airpair.com/ad/','')
            ad.positions = ad.positions.map(p=>p.replace('post:',''))
            ads[ad.img] = ad
            ads.tagged[ad.tag] = (ads.tagged[ad.tag] || []).concat([ad.img])
          }
        // $log('ads', ads)
        cb(e, ads)
      }),
      (e, ads) => next()
    ))


  mw.cache('cachedPublished', (req, res, next) => cache.get('published', API.Posts.svc.getAllPublished, next))



  mw.cache('inflateMeExpert', mw.data.recast('expert','user._id',{queryKey:'userId'}))


  mw.cache('inflateAds', (req, res, next) =>
    next(null, req.ctx.bot ? 0 :     // don't want ads indexed
      cache.ads.tagged[req.locals.r.adtag || 'ruby']
        .map(img => cache.ads[img])
        .forEach(ad => ad.positions
          .forEach(p => req.locals.ads
            ? req.locals.ads[p] = assign({position:p},ad)  // only handles one, not elegent atm
            : req.locals.ads = { [p] : assign({position:p},ad) } )) ) )


  mw.cache('inflateLanding', key => function(req, res, next) { next(null,
    assign(req.locals, { r:cache['landing'][key], htmlHead: cache['landing'][key].htmlHead } ) ) })


  mw.cache('inflateOrderBooking', (req, res, next) => {
    if (!req.order) return next()
    var BookingsSvc = require("../services/bookings")
    var line = _.find(req.order.lines,(l) =>l.info && l.info.paidout != null)
    if (!line && !line.bookingId) return next()
    $callSvc(BookingsSvc.getByIdForParticipant,req)(line.bookingId, (e, r) => {
      if (e) return next(e)
      req.booking = r
      next()
    })
  })


}
