import {serve,initAPI} from './_api2'
import * as Svc from '../services/users'
import {authd} from '../identity/auth/middleware'

   

function getFull(req, cb) {
  Svc.getSessionByUserId.call(this, cb)
}

function getSession(req, cb) {
  Svc.setAvatar(req.user)
  cb(null, req.user)
}

export default class {

  constructor(app) {
    app.get('/session', serve(getSession))
    app.get('/session/full', serve(getFull))
  }

}
