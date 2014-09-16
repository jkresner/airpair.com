import {serve,initAPI} from './_api2'
import * as Svc from '../services/workshops'

var API = initAPI(Svc)

function getBySlug(req, cb) {
  Svc.getBySlug.call(this, req.params.slug, cb)
}

export default class {

  constructor(app) {
    app.get('/workshops/', API.list)
    app.get('/workshops/:slug', serve(getBySlug))
  }

}
