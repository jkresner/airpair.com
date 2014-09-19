import {serve,initAPI} from './_api'
import * as Svc from '../services/users'
import {authd} from '../identity/auth/middleware'

var actions = {
  getSessionByUserId: (req) => [],
  getSessionLite: (req) => []
}


var API = initAPI(Svc, actions)

export default class {

  constructor(app) {
    app.get('/session', authd, API.getSessionLite)
    app.get('/session/full', authd, API.getSessionByUserId)
  }

}
