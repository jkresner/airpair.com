var logging = true


var cbSend = (res, next) => {
  return (e , r) => {
    if (logging) { $log('cbSend', e, r) }
    if (e && e.status) { return res.status(400).send(e) }
    if (!r) { return res.status(404).send('Not found') }
    
    res.json(r)
  }
}


export function serve(svcFn) {  
  return (req, res, next) => {
    var thisSvc = { user: req.user }
    svcFn.call(thisSvc, req, cbSend(res,next))        
  }
}


export var initAPI = (Svc) => {
  return {
    list: serve( (req, cb) => Svc.getAll.call(this, cb) ),
    detail: serve( (req, cb) => Svc.getById.call(this, req.params.id, cb) )
  }
}