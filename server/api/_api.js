var logging = false


var Error404 = (msg, fromApi) => {
  var e = new Error(msg)
  e.status = 404
  e.fromApi = fromApi
  return e
}


var cbSend = (req, res, next) => {
  var httpMethod = req.method
  return (e, r) => {
    if (logging) { $log('cbSend'.cyan, e, r) }
    if (e)
    {
      e.fromApi = true
      return next(e)
    }
    else if (httpMethod != 'DELETE')
    {
      if (!r) { return res.status(404).json({}) }
      return res.json(r)
    }
    else
    {
      return res.status(200).json({})
    }
  }
}


function resolveParamFn(Svc, svcFnName, paramName, objectName) {
  return (req, res, next, id) => {
    if (logging) $log('paramFn'.cyan, paramName, id)
    if (id) id = id.trim()
    $callSvc(Svc[svcFnName],req)(id, function(e, r) {
      if (!r && !e) {
        e = new Error404(`${paramName} not found.`,
          !_.contains(['post','postpublished','workshop'], paramName))
      }
      req[objectName||paramName] = r
      next(e, r)
    })
  }
}



export function serve(Svc, svcFnName, argsFn, Validation) {
  return (req, res, next) => {
    if (logging) $log('serve.Svc'.cyan, svcFnName, argsFn, Svc)
    var callback = cbSend(req,res,next)
    var args = argsFn(req)
    if (Validation) {
      if (req.method != 'GET' || Validation[svcFnName])
      {
        if (!Validation[svcFnName]) throw new Error(`Validation function ${svcFnName} not define`)
        var inValid = Validation[svcFnName].apply({}, _.union([req.user],args))
        if (inValid) {
          var e = new Error(inValid)
          e.status = 403
          return callback(e)
        }
      }
    }
    args.push(callback)
    if (!Svc[svcFnName]) throw new Error(`Service function ${svcFnName} not defined`)
    $callSvc(Svc[svcFnName],req).apply(this, args)
  }
}


export var initAPI = (Svc, custom, paramFns, Validation, reqObjectName) => {
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
      api.paramFns[svcFn] = resolveParamFn(Svc,svcFn,paramName,reqObjectName)
    }

  api.svc = Svc
  api.validation = Validation

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

