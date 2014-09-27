var analytics = require('../../../shared/analytics')

var logging = false;

var getContext = (req) => {
  return {
    app: config.build,
    // device: 
    // campaign:
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
}


export var trackView = (type) => {
  return (req, res, next) => {
    var userId = null
    var anonymousId = null
    // var email = ??
    var context = getContext(req)

    // $log('trackingView', type, req.params)
    if (!req.isAuthenticated || !req.isAuthenticated())
    {
      $log('trackView', req.sessionID, type, context)
      anonymousId = req.sessionID;
      // analytics.identify(null, req.sessionID, { hair: 'blue'}, context)
    } 
    else
    {
      userId = req.user._id;
      $log('trackView.identify', req.user._id, type, null, context)
      // analytics.identify(req.user._id, null, null, context)
    }
    analytics.view(userId, anonymousId, type, 'test name', { later: 'yo'}, context)      
    next() 
  }
}