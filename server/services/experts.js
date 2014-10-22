import Svc from '../services/_service'
import * as Validate from '../../shared/validation/experts.js'
import Expert from '../models/expert'
// var Data = require('./experts.data')

var logging = false
var svc = new Svc(Expert, logging)


export function getById(id, cb) {
  svc.getById(id, cb)
}


export function deleteById(id, cb) {
  svc.getById(id, (e, r) => {
    var inValid = Validate.deleteById(this.user, r)
    if (inValid) return cb(svc.Forbidden(inValid))
    svc.deleteById(id, cb)
  })
}

