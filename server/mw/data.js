module.exports = ({meanair}, mw) => {

  var {logic} = meanair


  mw.cache('cachedAds',         mw.data.cached('ads',logic.ads.getForCache.exec))
  mw.cache('cachedTags',        mw.data.cached('tags',logic.tags.getForCache.exec))
  mw.cache('cachedTemplates',   mw.data.cached('templates',logic.templates.getForCache.exec))
  mw.cache('cachedSlackUsers',  (req, res, next) => Wrappers.Slack.getUsers(next))
  mw.cache('cachedPublished', (req, res, next) =>
    cache.get('published', API.Posts.svc.getAllPublished, next))


  mw.cache('logic', (path, opts) => function(req, res, next) {
    opts = opts || {}

    var [group,fn] = path.split('.')
    var args = [(e,r) => {
      if (r && r.htmlHead) req.locals.htmlHead = r.htmlHead
      if (!r && opts.required !== false)
        e = assign(Error(`Not Found ${req.originalUrl}`),{status:404})

      next(e, req.locals.r = logic[group][fn].project(r))
    }]
    for (var arg in req.params) args.unshift(req.params[arg])
    // $log('logic.'.white, args)
    var inValid = logic[group][fn].validate.apply(this, _.union([req.user],args))
    if (inValid) return next(inValid)
    // $log('logic.'.white, fn, logic[group][fn], args)
    logic[group][fn].exec.apply(this, args)
  })



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
