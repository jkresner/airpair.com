var logging = false


var cbSend = (res, next) => {
  return (e , r) => {
    if (logging) { $log('cbSend', e, r) }
    if (e && e.status) { return res.status(400).send(e) }
    if (e) { return next(e) }

    res.json(r)
  }
}


export function serve(svcFn) {
  return (req, res, next) => {
    var thisSvc = { user: req.user }
    svcFn.call(thisSvc, req, cbSend(res,next))        
  }
}
