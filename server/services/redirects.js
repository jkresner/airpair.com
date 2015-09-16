var logging               = false
var Svc                = require('./_service')
var Redirect              = require('../models/redirect')
var svc                   = new Svc(Redirect, logging)


var get = {
  getAllRedirects(cb) {
    var opts = { fields: { _id:1,previous:1,current:1,type:1 }, options: { sort: 'previous' } }
    svc.searchMany({}, opts, cb)
  }
}


var save = {

  createRedirect(o, cb) {
    o.created = new Date()
    svc.create(o, cb)
  },

  deleteRedirectById(id, cb) {
    svc.deleteById(id, cb)
  }

}


module.exports = _.extend(get, save)
