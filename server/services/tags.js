var logging               = false
var Data                  = require('./tags.data')
var Tag                   = require('../models/tag')
import BaseSvc            from '../services/_service'
var svc                   = new BaseSvc(Tag, logging)
import * as WorkshopsSvc  from './workshops'
var PostsSvc              = require('./posts')

var exactMatchBonus = (term, tag) =>
  term.toLowerCase() == tag.name.toLowerCase() ? 1000 : 0

var get = {

  search(term, cb) {
    var encodedTerm = '\"'+term+'\"'

    var query = { $text: { $search: encodedTerm } }
    var opts = { fields: Data.select.search }

    svc.searchMany(query, opts, function(e, result) {
      if (e) return cb(e)

      cb(null,
        _.first(
          _.sortBy(result, (r) =>
            -1 * (
              r.score + exactMatchBonus(term,r)
              )
            )
        ,4)
        )
    })
  },

  getAllForCache(cb) {
    svc.searchMany({}, { fields: Data.select.listCache }, cb)
  },

  getBySlug(slug, cb) {
    if (slug.indexOf('#') != -1) slug = encodeURIComponent(slug)
    svc.searchOne({slug:slug},null, cb)
  },

  getTagPage(tag, cb) {
    PostsSvc.getByTag(tag, (ee,posts)=> {
      WorkshopsSvc.getByTag(tag.slug, (e,workshops)=> {
        var d = Data.data.angularPage(tag,posts,workshops)
        cb(null, d)
      })
    })
  }

}

var save = {
  create(o, cb) {
    svc.create(o,null, cb)
  }
}


module.exports = _.extend(get,save)
