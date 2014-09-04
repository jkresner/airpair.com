import API from './_api'
import WorkshopsService from '../services/workshops'

class ApiWorkshops extends API {

  constructor(app) {
    var user = null
    this.svc = new WorkshopsService(user)
    super(app)
  }

  routes(app) {
    app.get( '/workshops/', this.list(this) )
    app.get( '/workshops/:slug', this.detail(this) )
  }

  list(self) {
    return self.cbSend( self.svc.getAll )
  }

  detail(self) {
    return (req, res, next) => {
      var slug = req.params.slug
      self.svc.getBySlug(slug, (e , r) => {
        if (e && e.status) { return res.send(400, e) }
        if (e) { return next(e) }
        res.send(r)
      })
    }    
  }
}

export default ApiWorkshops