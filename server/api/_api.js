var logging = false


var Error404 = (msg, fromApi) => {
  var e = Error(msg)
  e.status = 404
  e.fromApi = fromApi
  return e
}


var cbSend = (req, res, next) =>
//   var httpMethod = req.method
  (e, r) =>
//     if (logging) { $log('cbSend'.cyan, e, r) }
    next(e, e ? null : assign(req.locals,{r}))
//     {
//       e.fromApi = true
      // return next(e)
//     }
//     else if (httpMethod != 'DELETE')
//     {
//       if (!r) { return res.status(404).json({}) }
//       return res.json(r)
//     }
//     else
//     {
//       return res.status(200).json({})
//     }
//   }
  // next()



function resolveParamFn(Svc, svcFnName, paramName, objectName, Validation) {
  return (req, res, next, id) => {
    if (logging) $log('paramFn'.cyan, paramName, objectName, svcFnName, id)
    if (id) id = id.trim()
    Svc[svcFnName].call({user:req.user,sessionID:req.sessionID,session:req.session}, id, function(e, r) {
      if (!r && !e) {
        e = Error404(`${paramName} not found.`,
          !_.contains(['post','postpublished','workshop'], paramName))
      }
      if (r && Validation && Validation[svcFnName]) {
        var inValid = Validation[svcFnName](req.user,r)
        if (inValid) {
          var e = Error(inValid)
          e.status = 403
        }
      }
      req[objectName||paramName] = r
      req.locals.r = r
      if (logging) $log('paramFn'.yellow, objectName||paramName, r!=null, req[objectName||paramName])
      next(e, r)
    })
  }
}



function serve(Svc, svcFnName, argsFn, Validation) {
  return (req, res, next) => {
    if (logging) $log('serve.Svc'.cyan, svcFnName, argsFn)
    var args = argsFn(req)
    if (Validation) {
      if (req.method != 'GET' || Validation[svcFnName])
      {
        if (!Validation[svcFnName]) throw Error(`Validation function ${svcFnName} not define`)
        var inValid = Validation[svcFnName].apply({}, _.union([req.user],args))
        if (inValid)
          return next(assign(Error(inValid),{status:403}))
      }
    }
    args.push(cbSend(req,res,next))
    if (!Svc[svcFnName]) throw Error(`Service function ${svcFnName} not defined`)
    Svc[svcFnName].apply({user:req.user,sessionID:req.sessionID,session:req.session}, args)
  }
}


var initAPI = (Svc, custom, paramFns, Validation, reqObjectName) => {
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
      api.paramFns[svcFn] =
        resolveParamFn(Svc,svcFn,paramName,reqObjectName,Validation)
    }

  api.svc = Svc
  api.validation = Validation

  return api;
}

module.exports = { serve, initAPI }

