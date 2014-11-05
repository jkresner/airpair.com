import Svc from '../services/_service'
import Tag from '../models/tag'
import * as WorkshopsSvc from './workshops'

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
  WorkshopsSvc.getByTag(slug, (e,workshops)=>{
    cb(null,
      {
        tag: { _id: "5149dccb5fc6390200000013",
              desc: 'AngularJS is an open-source JavaScript framework. Its goal is to augment browser-based applications with Model–View–Whatever(MV*) capability and reduce the amount of JavaScript needed to make web applications functional. These types of apps are also frequently known as Single-Page Applications.',
              name: 'AngularJS',
              short: 'Angular',
              slug: 'angularjs',
              soId: 'angularjs' },
        about: {
          tagline: "AngularJS is an amazing framework for creating rich client-side applications.",
          quote: "It can be used to create sleek and crisp web applications with minimal amounts of code. Seeing as AngularJS is a comparatively new framework, it is important to learn the basics, understand testing and get acquainted with best practices.",
          by: "Matias Niemela, AirPair Experts and AngularJS Core Team Member",
          byPic: "//secure.gravatar.com/avatar/3c0ca2c60c5cc418c6b3dbed47b23b69"
        },
        workshops
      }
    )
  })

  // svc.searchOne({slug:slug},null, (e,r) => {
  //   $log(r)
  //   cb(e,r)
  // })
}
