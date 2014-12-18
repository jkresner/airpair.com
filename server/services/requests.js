import Svc from '../services/_service'
import * as md5     from '../util/md5'
import * as Validate from '../../shared/validation/requests.js'
import Request from '../models/request'
var logging = false
var svc = new Svc(Request, logging)


export function getById(id, cb) {
  svc.getById(id, cb)
}

export function getByUserId(userId, cb) {
  var opts = { options: { sort: { '_id': -1 } } }
  svc.searchMany({userId}, opts, cb)
}

export function getMyRequests(cb) {
  getByUserId(this.user._id, cb)
}


export function create(o, cb) {
  var inValid = Validate.create(this.user, o)
  if (inValid) return cb(svc.Forbidden(inValid))

  var {_id,name,email} = this.user
  o.by = { name, email, avatar: md5.gravatarUrl(email) }

  o._id = svc.newId()
  o.userId = _id
  o.status = 'received'

  if (o.tags.length == 1) o.tags[0].sort = 0

  mailman.sendPipelinerNotifyRequestEmail(this.user.name, o._id, ()=>{})

  svc.create(o, cb)
}


export function update(id, o, cb) {
  svc.getById(id, (e, r) => {
    var inValid = Validate.update(this.user, r, o)
    if (inValid) return cb(svc.Forbidden(inValid))

    o.by = r.by  //  not sure why this gets lost...
    // o.updated = new Date()

    svc.update(id, o, cb)
  })
}
