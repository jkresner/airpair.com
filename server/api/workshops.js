import {serve,initAPI} from './_api'
import * as Svc from '../services/workshops'
import {authd} from '../identity/auth/middleware'


var actions = {
  getBySlug: (req) => [req.params.id]
}

var API = initAPI(Svc, actions)

export default class {

  constructor(app) {
    app.get('/workshops/', API.getAll)
    app.get('/workshops/:id', API.getBySlug)
  }

}
