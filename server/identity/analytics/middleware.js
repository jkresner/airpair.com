var logging = false


var getContext = (req) => {
  var ctx = {
    app: config.build,
    // device:
    ip: req.ip,
    // ip: req.host var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // library:
    // locale:
    // location:
    // network:
    // os:
    referer: req.header('Referer')
    // screen:
    // traits: ,
    // userAgent:
  }

  var c = null
  var {utm_campaign,utm_source,utm_medium,utm_term,utm_content} = req.query
  if (utm_campaign) (c) ? (c.name = utm_campaign) : (c = {name:utm_campaign})
  if (utm_source) (c) ? (c.source = utm_source) : (c = {source:utm_source})
  if (utm_medium) (c) ? (c.medium = utm_medium) : (c = {medium:utm_medium})
  if (utm_term) (c) ? (c.term = utm_term) : (c = {term:utm_term})
  if (utm_content) (c) ? (c.content = utm_content) : (c = {content:utm_content})

  if (c) ctx.campaign = c

//   Recommended by segment for server-side GA tracking (which doesn't work.)
//   if (req.cookies._ga) {
//     ctx['Google Analytics'] = { clientId: req.cookies._ga.replace('GA1.1.','').replace('GA1.2.',''),
//       userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17',
// ip: '11.1.11.11' }
//   }

  return ctx
}


export var trackView = (type) => {
  return (req, res, next) => {
    var userId = null
    var anonymousId = null
    var context = getContext(req)

    if (!req.isAuthenticated || !req.isAuthenticated())
    {
      anonymousId = req.sessionID
    }

    var obj = req[type]
    var tags = _.pluck(obj.tags,'slug')
    if (type == 'workshop') var tags = obj.tags // temp hack until we fix workshops
    var url = req.protocol + '://' + req.get('host') + req.originalUrl

    var properties = { title: obj.title, tags, url, path: req.path, objectId: obj._id, referrer: context.referer }
    analytics.view(req.user, anonymousId, type, obj.title, properties, context)
    next()
  }
}
