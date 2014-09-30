import Svc from '../services/_service'
import View from '../models/view'

var logging = false
var svc = new Svc(View, logging)

var fields = {
} 


export function getByUsersId(id, cb) {
  var opts = {}
  svc.searchMany({ userId: id}, opts, cb)
}


export function getByAnonymousId(id, cb) {
  var opts = {}
  svc.searchMany({ anonymousId: id}, opts, cb)
}


// Called when aliasing
export function alias(anonymousId, userId, cb) {
  View.update({ anonymousId}, {userId}, { multi: true }, cb) 
}


export function create(o, cb) {
  o.utc = new Date()
  // if (this.user) o.userId = this.user._id
  // if (sessionId) o.sessionId = sessionId 
  svc.create(o, cb)
}