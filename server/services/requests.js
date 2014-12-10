import Svc from '../services/_service'
import * as Validate from '../../shared/validation/requests.js'
import Request from '../models/request'
var logging = false
var svc = new Svc(Request, logging)


export function getByUserId(userId, cb) {
  svc.searchMany({userId}, {}, cb)
}


export function create(o, cb) {
  var inValid = Validate.create(this.user, o)
  if (inValid) return cb(svc.Forbidden(inValid))

  o._id = svc.newId()
  o.userId = this.user._id
  o.status = 'received'

  mailman.sendPipelinerNotifyRequestEmail(this.user.name, o._id, ()=>{})

  svc.create(o, cb)
}
