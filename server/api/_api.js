var logging = false;

class Api {
  
  constructor(app) {
    this.routes(app)
  }

  routes(app) {
    $log('override in child class')
  }

  cbSend(e, r) {
    return (req, res, next) => {
      if (logging) { $log('cbSend', e, r) }
      if (e && e.status) { return res.send(400, e) }
      if (e) { return next(e) }
      res.send(r)
    }
  }

}

export var API = Api;