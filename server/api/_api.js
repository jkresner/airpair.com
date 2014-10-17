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
      if (r.status && r.status == 302) { return res.redirect(r.redirectTo) }
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
    if (logging) $log('paramFn', paramaName, id)
    Svc[svcFnName](id, function(e, r) {
      if (!r && !e) e = new Error(`${paramaName} not found. Back to <a href="/${paramaName}s">${paramaName}s</a>`)
      req[paramaName] = r
      next(e, r)
    })
  }
}


export function serve(Svc, svcFnName, argsFn) {
  return (req, res, next) => {
    var thisSvc = { user: req.user, sessionID: req.sessionID, session: req.session }
    if (logging) $log('thisSvc', svcFnName, argsFn, Svc, thisSvc)
    var args = argsFn(req)
    args.push(cbSend(req.method,res,next))
    Svc[svcFnName].apply(thisSvc, args)
  }
}


export var initAPI = (Svc, custom, paramFns) => {
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
    api[name] = serve(Svc, name, argsFns[name])

  if (paramFns)
    for (var paramName of Object.keys(paramFns))
    {
      var svcFn = paramFns[paramName]
      api.paramFns[svcFn] = resolveParamFn(Svc,svcFn,paramName)
    }

  api.svc = Svc

  return api;
}
