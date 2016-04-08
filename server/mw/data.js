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
            ads[ad.img] = ad
            ads.tagged[ad.tag] = (ads.tagged[ad.tag] || []).concat([ad.img])
          }
        // $log('ads', ads)
        cb(e, ads)
      }),
      (e, ads) => next()
    ))

  mw.cache('inflateMeExpert', mw.data.recast('expert','user._id',{queryKey:'userId'}))


  mw.cache('inflateAds', (req, res, next) => {
    var {ads} = cache
    var tag = req.locals.r.adtag || 'ruby'
    req.locals.ads = {
      'top': ads[ads.tagged[tag].filter(img => ads[img].positions.indexOf('post:top')!=1)],
      'bottom': ads[ads.tagged[tag].filter(img => ads[img].positions.indexOf('post:top')!=1)]
    }
    next()
  })


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
