import Svc from '../services/_service'
import Workshop from '../models/workshop'

var logging = false
var svc = new Svc(Workshop, logging)

var fields = {
  listSelect: { title:1,slug:1,time:1,tags:1,'speakers.name':1,'speakers.gravatar':1 }
}


export function getAll(cb) {
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
  svc.searchOne({slug:slug},null, (e, r) => {
    if (r) { r.url = `${r.tags[0]}/workshops/${r.slug}`; }
    cb(e, r)
  })
}



export function getByTag(tagSlug, cb) {
  svc.searchMany({'tags': new RegExp(tagSlug, "i") },{fields:fields.listSelect}, (e, r) => {
    for (var w of r)
    {
      w.url = `${w.tags[0]}/workshops/${w.slug}`
      w.speaker = w.speakers[0]
    }
    cb(e, r)
  })
}
