module.exports = ({meanair}, mw) => {
  var {logic} = meanair

  mw.cache('cachedAds',         mw.data.cached('ads',logic.ads.getForCache.exec))
  mw.cache('cachedSlackUsers',  mw.data.cached('slack_users', Wrappers.Slack.getUsers))
  mw.cache('cachedPublished',   mw.data.cached('published', logic.posts.recommended.exec))


  mw.cache('inflateMe', mw.data.recast('user','user._id',{required:false,merge:true}))
  mw.cache('inflateMeExpert', mw.data.recast('expert','user._id',{queryKey:'userId'}))


  //-- start:kinda hard ... --//
  mw.data.extend('inflateAds', x => function(req, res, next) {
    // $log('ud', req.ctx.ud, /lib|ban|search|reader/.test(req.ctx.ud))
    if (/lib|ban|search|reader/.test(req.ctx.ud)) return next()  // don't want ads indexed
    // var rnd = parseInt(Math.random()*100)
    // if ((rnd%17)!=0) return next()

    cache.get('ads', logic.ads.getForCache.exec, (e, r) =>
      next(e, cache.ads.tagged[req.locals.r.adtag || 'ruby']
        .map(img => cache.ads[img])
        .forEach(ad => ad.positions
          .forEach(p => req.locals.ads
            ? req.locals.ads[p] = assign({position:p},ad)  // only handles one, not elegent atm
            : req.locals.ads = { [p] : assign({position:p},ad) }
        ))
    ))
  })
  mw.cache('inflateAds', mw.data.inflateAds())
  //-- end:hard ... --//

  mw.cache('inflateOrderBooking', function(req, res, next) {
    if (!req.order) return next()
    var line = _.find(req.order.lines, l => l.info && l.info.paidout != null)
    if (!line && !line.bookingId) return next()
    API.Bookings.svc.getByIdForParticipant.call(req, line.bookingId,
      (e, r) => next(e, r ? req.booking = r : null) )
  })


}
