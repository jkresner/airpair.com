module.exports = (app, mw) => {


  mw.cache('cachedTags',        mw.data.cached('tags'))
  mw.cache('cachedTemplates',   mw.data.cached('templates'))
  mw.cache('cachedSlackUsers',  (req, res, next) => Wrappers.Slack.getUsers(next))

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

  mw.cache('inflateMeExpert',   mw.data.recast('expert','user._id',{queryKey:'userId'}))

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
