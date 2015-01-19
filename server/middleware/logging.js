var domain = require('domain')

var middleware = {

  slowrequests(req, res, next) {
    var start = new Date
    res.on('finish', function() {
      var duration = new Date - start
      if (duration > 1000)
      $log(`req::end ${duration} ${req.url}`.red)
    })
    next()
  },

  domainWrap(req, res, next) {
    var reqd = domain.create()
    domain.active = reqd
    reqd.add(req)
    reqd.add(res)
    reqd.on('error', function(err) {
      var url = req.url
      var method = req.method
      if (url.indexOf('/api/') != -1) err.fromApi = true
      else if (method == 'POST' || method == 'PUT') err.fromApi = true
      // $log('on error handled by domain', url, method, err)
      return req.next(err)
    })
    res.on('end', function() {
      // console.log('disposing domain for url ' + req.url);
      return reqd.dispose()
    })
    reqd.run(next)
  },

  errorHandler(app) {
    return function(e, req, res, next) {

      var uid = (req.user) ? req.user.email : req.sessionID

      if (config.env != 'test') {
        $log(`errorHandle ${uid} ${req.method} ${req.url}`.red, JSON.stringify(req.body).white, (e.message || e).magenta)
        $error(e, req.user, req)
      }

      if (e.fromApi)
        res.status(e.status || 400).json({message:e.message || e})
      else
        app.renderErrorPage(e)(req,res)
    }
  }

}

module.exports = middleware
