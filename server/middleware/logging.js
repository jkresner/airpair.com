var domain = require('domain')


var middleware = {

  badBot(req, res, next) {
    var logging = true
    var userAgent = req.get('user-agent')

    if (util.isBot(userAgent, config.bots.all)) {
      var referer = req.header('Referer')
      var ref = (referer ? ` <<< `.cyan+referer.blue : '').replace('https://','')
      if (util.isBot(userAgent, config.bots.bad)) {
        $log(`__BADBOT${req.ip}\t ${userAgent||'UA:null'} ${req.originalUrl}`.cyan, ref)
        return res.status(200).send('')
      }
      else if (logging)
        $log(`_____BOT${req.ip}\t ${userAgent||'UA:null'} ${req.originalUrl}`.cyan, ref)
    }

    next()
  },

  pageNotFound(req, res, next) {
    var e = new Error(`Page not found`)
    e.status = 404
    // $log('4040404 ??'.red)
    next(e)
  },

  slowrequests(req, res, next) {
    var start = new Date
    res.on('finish', function() {
      var duration = new Date - start
      if (duration > 1000)
      $log(`req::end ${duration}`.red, req.originalUrl.white)
    })
    next()
  },

  domainWrap(req, res, next) {
    var reqd = domain.create()
    domain.active = reqd
    reqd.add(req)
    reqd.add(res)
    reqd.on('error', function(err) {
      var url = req.originalUrl // originalUrl because .url does not pick up the base
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

      if (true || config.env != 'test' || global.verboseErrHandler) {

        var ref = (req.header('Referer')) ? ` <<< ${req.header('Referer')}` : ''
        var ip = req.ip ? req.ip.replace('::ffff:','') : ''
        if (!req.nonSessionUrl)
          $log('errHandle'.red, `${ip.cyan} ${uid} ${req.method} ${req.url.magenta}${ref}`, JSON.stringify(req.body), (e.message || e).magenta)
        $error(e, req.user, req)

      } else {
        $log(`${req.method}:${req.url} `.magenta.dim + (e.message || e).gray.dim)
        // $log('Test Debug Error ', e)
      }

      if (e.message == "Page not found" && req.nonSessionUrl)
        res.status(404).send("") // serve nothing for spam requests
      else if (e.fromApi)
        res.status(e.status || 400).json({message:e.message || e})
      else
        app.renderErrorPage(e)(req,res)
    }
  }

}

module.exports = middleware
