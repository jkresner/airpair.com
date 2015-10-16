var {isBot,momentSessionCreated}  = require('../../shared/util')
var logging   = false


var getContext = (req) => {
  var ctx = {
    app: config.build,
    // device:
    // ip: req.ip.replace('::ffff:',''),
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    // library: // locale: // location: // network: // os:
    referer: req.header('Referer'),
    // screen: // traits: ,
    userAgent: req.header('user-agent')
  }

  var c = null
  var {utm_campaign,utm_source,utm_medium,utm_term,utm_content} = req.query
  if (utm_campaign) (c) ? (c.utm_campaign = utm_campaign) : (c = {utm_campaign:utm_campaign})
  if (utm_source) (c) ? (c.utm_source = utm_source) : (c = {utm_source:utm_source})
  if (utm_medium) (c) ? (c.utm_medium = utm_medium) : (c = {utm_medium:utm_medium})
  if (utm_term) (c) ? (c.utm_term = utm_term) : (c = {utm_term:utm_term})
  if (utm_content) (c) ? (c.utm_content = utm_content) : (c = {utm_content:utm_content})

  if (c) ctx.utms = c

  return ctx
}

// export var shouldSkip = (req) => {
//   if (util.isBot(req.header('user-agent'))) return true
//   // if (req.url == '/rss') return true
//   // if (roles(req.user.roles contains admin or editor)
// }


var middleware = {

  trackFirstRequest(req, res, next) {
    if (logging) $log(`mw.trackFirstRequest ${req.url} ${!req.isAuthenticated()} ${req.sessionID}`.cyan)
    if (!isBot(req.get('user-agent')) && !req.isAuthenticated())
    {
      if (!req.session.firstRequest && !req.nonSessionUrl)
      {
        req.session.firstRequest = { url: req.url }
        if (req.header('Referer')) { req.session.firstRequest.ref = req.header('Referer') }
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        analytics.echo(null, req.sessionID, 'First', req.session.firstRequest, { ip }, () => {})
      }
    }
    next()
  },

  trackAdImpression(req, res, next) {
    if (logging) $log('trackAdImpression'.cyan, req.originalUrl)
    var img = req.originalUrl.replace('/ad/','')
    var context = getContext(req)
    analytics.impression(req.user, req.sessionID, img, context)
    next()
  },

  trackAdClick(adUrl) {
    return (req, res, next) => {
      if (isBot(req.header('user-agent'))) return res.status(301).send('/')
      if (true || logging) $log('trackAdClick'.yellow, req.header('Referer'))
      req.ad = {
        _id: "55aa28f643f81ad565104e6f",
        title: 'Keen.io jul custom analytics', url: adUrl, tags: [{slug:'keen-io'}]
      }
      middleware.trackView('ad')(req,res,next)
    }
  },

  trackView(type) {
    return (req, res, next) => {
      if (logging) $log(`mw.trackView ${req.url}`.cyan, req.sessionID)
      if (isBot(req.header('user-agent'))) return next()

      var userId = null
      var anonymousId = null
      var context = getContext(req)

      if (!req.isAuthenticated || !req.isAuthenticated())
        anonymousId = req.sessionID

      var obj = req[type]

      var tags = _.pluck(obj.tags,'slug')
      if (type == 'workshop') var tags = obj.tags // temp hack until we fix workshops
      var url = req.protocol + '://' + req.get('host') + req.originalUrl


      var properties = {
        // title: obj.title,
        // tags,
        url,
        path: req.path,
        objectId: obj._id,
        referrer: context.referer
      }
      // $log('properties'.white, properties)

      if (type == 'ad')
        properties.path = obj.url
      else if (momentSessionCreated(req.session).isAfter(moment().add(-3,'seconds')))
        properties.firstRequest = true

      analytics.view(req.user, anonymousId, type, obj.title, properties, context)

      next()
    }
  },


}


module.exports = middleware
