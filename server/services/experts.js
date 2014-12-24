import Svc                from '../services/_service'
import * as Validate      from '../../shared/validation/experts.js'
import Expert             from '../models/expert'
import * as md5           from '../util/md5'
var Data =                require('./experts.data')
var logging = false
var svc = new Svc(Expert, logging)


var get = {
  getById(id, cb) {
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      r.avatar = md5.gravatarUrl(r.email)
      cb(null,r)
    })
  },
  getMe(cb) {
    svc.searchOne({userId:this.user._id}, null, (e,r) => {
      if (e || !r) return cb(e,r)
      r.avatar = md5.gravatarUrl(r.email)
      cb(null,r)
    })
  },
  getMatchesForRequest(request, cb) {
    // todo protect with owner of request?
    var tagIds = _.map(request.tags,(t) => t._id.toString())
    var query = {
      'tags._id': { $in: tagIds }
      // rate: { $lt: request.budget }
    }
    // $log('query', query, tagIds)
    var opts = {fields:Data.select.matches, options: { limit: 200 } }

    svc.searchMany(query, opts, (e,r) => {
      if (e || !r || r.length == 0) return cb(e,r)

      var existingExpertIds = []
      for (var s of request.suggested) existingExpertIds.push(s.expert._id)
      // $log('r.lenght', r.length)
      var existing = []
      for (var exp of r) {
        exp.avatar = md5.gravatarUrl(exp.email)
        if (_.find(existingExpertIds,(id)=>_.idsEqual(id,exp._id)))
          existing.push(exp)
      }
      var unique = _.difference(r, existing)
      cb(null,unique)
    })
  },
  getForExpertsPage(cb) {
    var d = Data.data.getForExpertsPage
    d.experts.forEach(function(exp) { exp.rate = exp.rate + 40 })
    cb(null, d)
  },
  search(term, cb) {
    var searchFields = ['name','email','username','gh.username','tw.username']
    var and = { rate: { '$gt': 0 } }
    svc.search(term, searchFields, 5, Data.select.search, and, (e,r) => {
      if (r) {
        for (var exp of r) {
          exp.avatar = md5.gravatarUrl(exp.email)
          // if (exp.bookMe && exp.bookMe.urlSlug && !exp.username)
          //   exp.username = exp.bookMe.urlSlug
        }
      }
      cb(e,r)
    })
  }
}

var save = {
  deleteById(id, cb) {
    svc.getById(id, (e, r) => {
      var inValid = Validate.deleteById(this.user, r)
      if (inValid) return cb(svc.Forbidden(inValid))
      svc.deleteById(id, cb)
    })
  }
}

module.exports = _.extend(get, save)
