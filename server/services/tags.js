var logging               = false
var Data                  = require('./tags.data')
var Tag                   = require('../models/tag')
import BaseSvc            from '../services/_service'
var svc                   = new BaseSvc(Tag, logging)
import * as WorkshopsSvc  from './workshops'
var PostsSvc              = require('./posts')

var get = {

  search(searchTerm, cb) {
    var encodedTerm = '\"'+searchTerm+'\"'

    var query = { $text: { $search: encodedTerm } }
    var opts = { fields: Data.select.search }

    svc.searchMany(query, opts, function(err, result) {
      if (err) {
        cb(err, result);
        return;
      }

      result = _.first(_.sortBy(result, (r) => -1*r.score),4)
      // $log('result',result)

      cb(err, result);
    });
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
