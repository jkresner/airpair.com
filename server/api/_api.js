var logging = false

class Api {
  
  constructor(app) {
    this.routes(app)
  }

  routes(app) {
    $log('override in child class')
  }

  cbSend(fn) {
    return (req, res, next) => {
      fn( (e , r) => {
        if (logging) { $log('cbSend', e, r) }
        if (e && e.status) { return res.send(400, e) }
        if (e) { return next(e) }
        res.send(r)
      })
    }
  }

}

export default Api