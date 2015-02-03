var logging               = false
var Data                  = require('./tags.data')
var Tag                   = require('../models/tag')
import BaseSvc            from '../services/_service'
var svc                   = new BaseSvc(Tag, logging)
import * as WorkshopsSvc  from './workshops'
var PostsSvc              = require('./posts')


// function encode(term) {
//   if (!term) return term;
//   return term.replace(/[-\/\\^$*+?.()|[\]{}+]/g, '\\$&');
// }


// function tokenize(term, wildcardStart, wildcardEnd) {
//   if (!term) return '.*';

//   var regex = '';
//   if (wildcardStart) regex += '.*';

//   var tokens = term.split(' ');
//   if (tokens) regex += tokens.join('.*');
//   else regex += term;

//   if (wildcardEnd) regex += '.*';

//   return regex;
// }


// function isMatchOnWeightedFields(tag, regex) {
//   if (tag.name && tag.name.match(regex)) return true;
//   if (tag.short && tag.short.match(regex)) return true;
//   if (tag.slug && tag.slug.match(regex)) return true;
//   return false;
// }

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
