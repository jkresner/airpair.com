import {serve,initAPI} from './_api'
import * as Svc from '../services/tags'
import {authd} from '../identity/auth/middleware'
var auth = authd({isApiRequest:true})

var actions = {
  search: (req) => [req.params.id],
  getBySlug: (req) => [req.params.slug]
}

var API = initAPI(Svc, actions)

export default class {

  constructor(app) {
    app.get('/tags/search/:id', API.search)    
    app.get('/tags/:slug', API.getBySlug)
  }

}
