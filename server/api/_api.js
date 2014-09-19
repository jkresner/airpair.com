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
    svcFn.call(thisSvc, req, cbSend(req.method, res,next))        
  }
}


export var initAPI = (Svc) => {
  return {
    list: serve( (req, cb) => Svc.getAll.call(this, cb) ),
    detail: serve( (req, cb) => Svc.getById.call(this, req.params.id, cb) )
  }
}