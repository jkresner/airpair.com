import Svc from '../services/_service'
import Tag from '../models/tag'


var logging = false
var svc = new Svc(Tag, logging)


var fields = {
	listCache: { '_id':1, name: 1, slug: 1 },
	search: { '_id': 1, 'name': 1, 'slug': 1, 'desc': 1 }
}


export function search(searchTerm, cb) {
	var opts = { options: { limit: 3 }, fields: fields.search }
	var query = searchTerm ? { name : new RegExp(searchTerm, "i") } : null;
	svc.searchMany(query, opts, cb)
}


export function create(o, cb) {
	svc.create(o,null, cb)
}


export function getAllForCache(cb) {
	svc.searchMany({}, { fields: fields.listCache }, cb)
}


export function getBySlug(slug, cb) {
	svc.searchOne({slug:slug},null, cb)
}


export function getTagPage(slug, cb) {
  // svc.searchOne({slug:slug},null, (e,r) => {
  //   $log(r)
  //   cb(e,r)
  // })
  cb(null, {tag: { _id: "5149dccb5fc6390200000013",
  desc: 'AngularJS is an open-source JavaScript framework. Its goal is to augment browser-based applications with Model–View–Whatever(MV*) capability and reduce the amount of JavaScript needed to make web applications functional. These types of apps are also frequently known as Single-Page Applications.',
  name: 'AngularJS',
  short: 'Angular',
  slug: 'angularjs',
  soId: 'angularjs' }})
}
