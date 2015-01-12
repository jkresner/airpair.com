import Svc from '../services/_service'
import Workshop from '../models/workshop'

var logging = false
var svc = new Svc(Workshop, logging)

var fields = {
  listSelect: { title:1,slug:1,time:1,tags:1,'speakers.name':1,'speakers.gravatar':1 },
  rssSelect: { title:1,description:1,slug:1,time:1,tags:1,'speakers.name':1 }
}


export function getAll(cb) {
  var options = {sort: {'time' : -1 } }
  svc.searchMany({},{ fields: fields.listSelect, options }, (e, r) => {
    for (var w of r)
    {
      w.url = `${w.tags[0]}/workshops/${w.slug}`
      w.speaker = w.speakers[0]
    }
    cb(e, r)
  })
}

export function getAllForCache(cb) {
  getAll(cb)
}

export function getAllForRss(cb) {
  var options = {sort: {'time': -1}}
  svc.searchMany({},{ fields: fields.rssSelect, options }, (e, r) => {
    for (var w of r) {
      w.url = `https://www.airpair.com/${w.tags[0]}/workshops/${w.slug}`
      var betterTags = []
      for (var t of w.tags) betterTags.push({name:t})
      w.tags = betterTags
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
