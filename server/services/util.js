import Svc from '../services/_service'
import Redirect from '../models/redirect'
var logging = false

var svc = new Svc(Redirect, logging)


export function getAllRedirects(cb) {
  var opts = { fields: { _id:1,previous:1,current:1,type:1 }, options: { sort: 'previous' } }
  svc.searchMany({}, opts, cb)
}

export function createRedirect(o, cb) {
  o.created = new Date()
  svc.create(o, cb)
}

export function deleteRedirectById(id, cb) {
  svc.deleteById(id, cb)
}
