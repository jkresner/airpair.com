import Svc from '../services/_service'
import Tag from '../models/tag'


var logging = false
var svc = new Svc(Tag, logging)

var fields = {
  search: { '_id': 1, 'name': 1, 'slug': 1, 'desc': 1 },
} 


export function search(searchTerm, cb) {
  var opts = { options: { limit: 10 }, fields: fields.search }
  var query = searchTerm ? { name : new RegExp(searchTerm, "i") } : null;
  svc.searchMany(query, opts, cb)
}


export function create(o, cb) {
  svc.create(o,null, cb)
}


export function getBySlug(slug, cb) {
  svc.searchOne({slug:slug},null, cb)
}
