import Svc from '../services/_service'
import Tag from '../models/tag'


var logging = false
var svc = new Svc(Tag, logging)


export function search(cb) {
  var options = {sort:'time'}
  svc.searchMany({},{ fields: fields.listSelect, options: options }, (e, r) => {
    for (var w of r)
    {
      w.url = `${w.tags[0]}/workshops/${w.slug}`
    }
    cb(e, r)
  })     
}


export function getBySlug(slug, cb) {
  svc.searchOne({slug:slug},null, cb)
}
