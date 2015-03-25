var logging = false

var resolver = {
  fnLookup: {},
  resolve(paramName) {
    var {svcName,svcFnName} = resolver.fnLookup[paramName]
    var svc = require(`../services/${svcName}`)
    return svc[svcFnName]
  },
  param(paramName, svcName, svcFnName) {
    resolver.fnLookup[paramName] = { svcName, svcFnName }
    return resolver
  }
}

resolver
  .param('expert', 'experts', 'getById')
  .param('paymethod', 'paymethods', 'getById')
  .param('orders', 'orders', 'getMultipleOrdersById')

var ErrorApi404 = (msg) => {
  var e = new Error(msg)
  e.status = 404
  e.fromApi = true
  return e
}


var middleware = {

  json2mb: require('body-parser').json({limit: '2mb'}),

  cacheReady(key) {
    return (req, res, next) => cache.ready([key], next)
  },

  bodyParam(paramName) {
    return (req, res, next) => {
      var param = req.body[paramName]
      if (!param) return next(ErrorApi404(`${paramName} not specified.`))
      if (logging) $log('bodyParamFn', paramName, req.body[paramName])

      var svcFn = resolver.resolve(paramName)
      $callSvc(svcFn,req)(param, function(e, r) {
        if (!e && !r)
          e = ErrorApi404(`${paramName} not found.`)
        else if (!e && typeof param == 'array' && param.length != r.length)
          e = (`Not all ${paramName} found.`)

        if (e) return next(e)
        else {
          req[paramName] = r
          // $log(`req.${paramName}`, req[paramName])
          next()
        }
      })
    }
  },

  populateUser(req, res, next) {
    var UserSvc = require("../services/users")
    // if (logging) $log('bodyParamFn', paramName, req.body[paramName])

    $callSvc(UserSvc.getById,req)(null, function(e, r) {
      // if (!e && !r)
      //   e = ErrorApi404(`${paramName} not found.`)
      // else if (!e && typeof param == 'array' && param.length != r.length)
      //   e = (`Not all ${paramName} found.`)
      if (e) return next(e)
      else {
        req.user = r
        // $log(`req.${paramName}`, req[paramName])
        next()
      }
    })
  },

  populateExpert(req, res, next) {
    var ExpertsSvc = require("../services/experts")
    if (logging) $log('populateExpert', req.user._id)
    $callSvc(ExpertsSvc.getMe,req)(function(e, r) {
      if (e) return next(e)
      else {
        req.expert = r
        next()
      }
    })
  }
}

module.exports = middleware
