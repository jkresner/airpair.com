var logging = false
var API = require('../api/_all')


var resolver = {
  fnLookup: {},
  param(paramName, api, svcFnName) {
    resolver.fnLookup[paramName] = api.svc[svcFnName]
    return resolver
  }
}

resolver
  .param('expert', API.Experts, 'getById')
  .param('paymethod', API.Paymethods, 'getById')
  .param('orders', API.Orders, 'getMultipleOrdersById')

var ErrorApi404 = (msg) => {
  var e = new Error(msg)
  e.status = 404
  e.fromApi = true
  return e
}


var middleware = {

  bodyParam(paramName) {
    return (req, res, next) => {
      var param = req.body[paramName]
      if (!param) return next(ErrorApi404(`${paramName} not specified.`))
      if (logging) $log('bodyParamFn', paramName, req.body[paramName])
      var svcFn = resolver.fnLookup[paramName]
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
  }

}

module.exports = middleware
