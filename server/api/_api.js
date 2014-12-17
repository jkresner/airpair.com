var logging = false


var cbSend = (httpMethod, res, next) => {
  return (e, r) => {
    if (logging) { $log('cbSend', e, r) }
    if (e)
    {
      return res.status(e.status || 400).json({message:e.message})
    }
    if (httpMethod != 'DELETE')
    {
      if (!r) { return res.status(404).json({}) }
      res.json(r)
    }
    else
    {
      res.status(200).json({})
    }
  }
}


function resolveParamFn(Svc, svcFnName, paramaName) {
  return (req, res, next, id) => {
    var thisSvc = { user: req.user, sessionID: req.sessionID, session: req.session }
    if (logging) $log('paramFn', paramaName, id)
    if (id) id = id.trim()
    Svc[svcFnName].call(thisSvc, id, function(e, r) {
      if (!r && !e) e = new Error(`${paramaName} not found. Back to <a href="/${paramaName}s">${paramaName}s</a>`)
      req[paramaName] = r
      next(e, r)
    })
  }
}


export function serve(Svc, svcFnName, argsFn, Validation) {
  return (req, res, next) => {
    var thisSvc = { user: req.user, sessionID: req.sessionID, session: req.session }
    if (logging) $log('thisSvc', svcFnName, argsFn, Svc, thisSvc)
    var callback = cbSend(req.method,res,next)
    var args = argsFn(req)
    if (Validation && req.method != 'GET') {
      var inValid = Validation[svcFnName].apply(thisSvc, args)
      if (inValid) {
        var e = new Error(inValid)
        e.status = 403
        return callback(e)
      }
    }
    args.push(callback)
    Svc[svcFnName].apply(thisSvc, args)
  }
}


export var initAPI = (Svc, custom, paramFns, Validation) => {
  var base = {
    getAll: (req) => [],
    getById: (req) => [req.params.id],
    create: (req) => [req.body],
    update: (req) => [req.params.id,req.body],
    deleteById: (req) => [req.params.id]
  }
  var argsFns = _.extend(base, (custom || {}))
  var api = { paramFns: {} }

  for (var name of Object.keys(argsFns))
    api[name] = serve(Svc, name, argsFns[name], Validation)

  if (paramFns)
    for (var paramName of Object.keys(paramFns))
    {
      var svcFn = paramFns[paramName]
      api.paramFns[svcFn] = resolveParamFn(Svc,svcFn,paramName)
    }

  api.svc = Svc

  return api;
}



// export var initAPI2 = (Svc, argsFns, paramFns) => {
//   for (var fnName of Object.keys(apiDefs)) {
//     var params = argsFns[fnName];
//     argsFns[fnName] = function(req) {
//       var reqParams = []
//       for (var path of params) {
//         var p = null
//         var props = path.split('.')
//         for (var prop of props) {
//           p = req[prop]
//         }
//         reqParams.push(p)
//       }
//       return reqParams;
//     }
//   }

//   var api = { paramFns: {} }

//   for (var name of Object.keys(argsFns))
//     api[name] = serve(Svc, name, argsFns[name], Validation)

//   if (paramFns)
//     for (var paramName of Object.keys(paramFns))
//     {
//       var svcFn = paramFns[paramName]
//       api.paramFns[svcFn] = resolveParamFn(Svc,svcFn,paramName)
//     }

//   api.svc = Svc

//   return api;
// }

