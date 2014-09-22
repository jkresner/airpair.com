import {serve,initAPI} from './_api'
import * as Svc from '../services/users'
import {authd,adm} from '../identity/auth/middleware'

var actions = {
  getSessionByUserId: (req) => [],
  getSessionLite: (req) => [],
  toggleUserInRole: (req) => [req.params.id,req.params.role]
}


export default function(app) {
  var API = initAPI(Svc, actions)

  app.get('/session', authd, API.getSessionLite)
  app.get('/session/full', authd, API.getSessionByUserId)   
  app.put('/adm/users/role/:id/:role', adm, API.toggleUserInRole)   
}
