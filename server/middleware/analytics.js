var {isBot,momentSessionCreated}  = require('../../shared/util')
var logging   = false


var getContext = (req) => {
  var ctx = {
    app: config.build,
    // device:
    ip: req.ip,
    // ip: req.host var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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

//   Recommended by segment for server-side GA tracking (which doesn't work.)
//   if (req.cookies._ga) {
//     ctx['Google Analytics'] = { clientId: req.cookies._ga.replace('GA1.1.','').replace('GA1.2.',''),
//       userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17',
// ip: '11.1.11.11' }
//   }

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
      if (!req.session.firstRequest)
      {
        req.session.firstRequest = { url: req.url }
        if (req.header('Referer')) { req.session.firstRequest.ref = req.header('Referer') }
        analytics.track(null, req.sessionID, 'First', req.session.firstRequest, {}, () => {})
      }
    }
    next()
  },


  trackView(type) {
    return (req, res, next) => {
      if (logging) $log(`mw.trackView ${req.url}`.cyan)
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

      var properties = { title: obj.title, tags, url, path: req.path, objectId: obj._id, referrer: context.referer }

      if (momentSessionCreated(req.session).isAfter(moment().add(-3,'seconds')))
        properties.firstRequest = true

      analytics.view(req.user, anonymousId, type, obj.title, properties, context)

      // if (logging) $log('trackView', type, properties)
      next()
    }
  },


}


module.exports = middleware
