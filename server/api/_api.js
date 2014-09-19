var logging = false


var cbSend = (httpMethod, res, next) => {
  return (e , r) => {
    if (logging) { $log('cbSend', e, r) }
    if (e) { return res.status(400).send(e.message) }
    if (httpMethod != 'DELETE')
    {
      if (!r) { return res.status(404).send('Not found') }
      res.json(r)
    }
    else
    {
      res.status(200).send('')
    }
  }
}



export function serve(svcFn) {  
  return (req, res, next) => {
    var thisSvc = { user: req.user }
    // $log('thisSvc', thisSvc, svcFn)
    svcFn.call(thisSvc, req, cbSend(req.method,res,next))        
  }
}


// var th = (req) => user: req.user;

export var initAPI = (Svc, customActions) => {
  var base = {
    list: function(req, cb) { Svc.getAll.call(this, cb) },
    detail: function(req, cb) { Svc.getById.call(this, req.params.id, cb) },
    create: function(req, cb) { Svc.create.call(this, req.body, cb) },
    update: function(req, cb) { Svc.update.call(this, req.params.id, req.body, cb) },
    delete: function(req, cb) { Svc.deleteById.call(this, req.params.id, cb) }
  }

  var actions = _.extend(base, (customActions || {}))

  for (var name of Object.keys(actions))
  {
    // console.log(name);
    actions[name] = serve(actions[name])
  }

  return actions;
}