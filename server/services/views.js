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


export function getBySessionId(id, cb) {
  var opts = {}
  svc.searchMany({ sessionId: id}, opts, cb)
}


// Called when aliasing
export function updateSessionIdWithUserId(sessionId, userId, cb) {
  View.update({ sessionId: id}, {userId}, { multi: true }, cb) 
}


export function create(o, cb) {
  o.utc = new Date()
  // if (this.user) o.userId = this.user._id
  // if (sessionId) o.sessionId = sessionId 
  svc.create(o, cb)
}