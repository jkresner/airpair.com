var {isBot,momentSessionCreated} = require('../../shared/util')
var logging   = false
var BOTS = config.middleware.ctx.bot
var ads = require('./analytics.ads')


// CF-Connecting-IP === X-Forwarded-For (if no spoofing)
// First exception: CF-Connecting-IP
// To provide the client (visitor) IP address for every request to the origin, CloudFlare adds the CF-Connecting-IP header.
// "CF-Connecting-IP: A.B.C.D"
// where A.B.C.D is the client's IP address, also known as the original visitor IP address.
// Second exception: X-Forwarded-For
// X-Forwarded-For is a well-established HTTP header used by proxies, including CloudFlare, to pass along other IP addresses in the request. This is often the same as CF-Connecting-IP, but there may be multiple layers of proxies in a request path.


var middleware = {

  trackFirstRequest(req, res, next) {
    if (logging) $log(`mw.trackFirstRequest ${req.url} ${!req.isAuthenticated()} ${req.sessionID}`.cyan)
    if (!isBot(req.get('user-agent'), BOTS.all) && !req.isAuthenticated())
    {
      if (!req.session.firstRequest && !req.nonSessionUrl)
      {
        req.session.firstRequest = { url: req.url }
        if (req.header('Referer')) { req.session.firstRequest.ref = req.header('Referer') }
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        // analytics.echo(null, req.sessionID, 'First', req.session.firstRequest, { ip }, () => {})
        analytics.event.call(assign(req.ctx,{sessionID:req.sessionID,user:req.user}), 'firstReq', req.session.firstRequest)
      }
    }
    next()
  },

  trackAdImpression(req, res, next) {
    if (logging) $log('trackAdImpression'.cyan, req.originalUrl)
    var img = req.originalUrl.replace('/ad/','')
    // var context = getContext(req)
    // analytics.impression(req.user, req.sessionID, img, context)
    analytics.impression.call(req, {img}, () => $log('tracked impression', img))
    next()
  },

  trackAdClick(adUrl) {
    return (req, res, next) => {
      if (isBot(req.header('user-agent'), BOTS.all)) return res.status(301).send('/')
      if (true || logging) $log('trackAdClick'.yellow, req.header('Referer'))

      $log('trackAdClick', adUrl)
      req.ad = ads[adUrl]
      // {
      //   _id: "",
      //   title: 'Keen.io jul custom analytics', url: adUrl, tags: [{slug:'keen-io'}]
      // }
      middleware.trackView('ad')(req,res,next)
    }
  },

  trackView(type) {
    return (req, res, next) => {
      if (logging) $log(`mw.trackView ${req.url}`.cyan, req.sessionID)
      if (isBot(req.header('user-agent'), BOTS.all)) return next()

      // var userId = null
      // var anonymousId = null
      // var context = getContext(req)

      // if (!req.isAuthenticated || !req.isAuthenticated())
        // anonymousId = req.sessionID

      var obj = req[type]


      // var tags = _.pluck(obj.tags,'slug')
      // if (type == 'workshop') var tags = obj.tags // temp hack until we fix workshops
      // var url = req.protocol + '://' + req.get('host') + req.originalUrl


      // var properties = {
        // title: obj.title,
        // tags,
        // url,
        // path: req.path,
        // objectId: obj._id,
        // referrer: context.referer
      // }
      // $log('properties'.white, properties)
      // $log('obj'.cyan, type)
      // $log('obj'.cyan, obj)
      if (type == 'post')
        obj.url = req.path

      // else if (momentSessionCreated(req.session).isAfter(moment().add(-3,'seconds')))
        // properties.firstRequest = true

      analytics.view.call(Object.assign(req.ctx, {sessionID:req.sessionID,user:req.user}), type, obj)

      next()
    }
  },


}


module.exports = middleware
