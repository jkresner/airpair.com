var logging = false


var cbSend = (httpMethod, res, next) => {
  return (e , r) => {
    if (logging) { $log('cbSend', e, r) }
    if (e) { 
      return res.status(400).json({message:e.message})
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


export function serve(Svc, svcFnName, argsFn) {  
  return (req, res, next) => {
    var thisSvc = { user: req.user }
    if (logging) $log('thisSvc', svcFnName, argsFn, Svc, thisSvc)
    var args = argsFn(req)
    args.push(cbSend(req.method,res,next))
    Svc[svcFnName].apply(thisSvc, args)        
  }
}


export var initAPI = (Svc, custom) => {
  var base = {
    getAll: (req) => [],
    getById: (req) => [req.params.id],
    create: (req) => [req.body],
    update: (req) => [req.params.id,req.body],
    deleteById: (req) => [req.params.id]
  }

  var argsFns = _.extend(base, (custom || {}))
  var api = {};

  for (var name of Object.keys(argsFns))
  {
    api[name] = serve(Svc, name, argsFns[name])
  }

  return api;
}