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


export function getTagPage(tag, cb) {
  WorkshopsSvc.getByTag(tag.slug, (e,workshops)=>{
    cb(null,
      {
        tag,
        featured: {
          pairing: {
            name: 'Ari Lerner',
            username: 'auser',
            avatar: 'https://avatars1.githubusercontent.com/u/529'
          }
        },
        about: {
          tagline: "AngularJS is an amazing framework for creating rich client-side applications.",
          quote: "Angular can be used to create sleek and crisp web applications with minimal amounts of code. Seeing as Angular.JS is a comparatively new framework, it is important to learn the basics, understand testing and get acquainted with best practices.",
          by: "Matias Niemelä, AirPair Experts and AngularJS Core Team Member",
          byPic: "//secure.gravatar.com/avatar/3c0ca2c60c5cc418c6b3dbed47b23b69"
        },
        experts: [
          {
            name: 'Ari Lerner',
            username: 'auser',
            avatar: 'https://avatars1.githubusercontent.com/u/529',
            tags: []
          },
          {
            name: 'Matias Niemelä',
            username: 'matsko',
            avatar: '//secure.gravatar.com/avatar/3c0ca2c60c5cc418c6b3dbed47b23b69',
            tags: []
          },
          {
            name: 'Basarat Ali',
            username: 'basarat',
            avatar: '//secure.gravatar.com/avatar/1400be56ff17549b926dd3260da4a494',
            tags: []
          },
          {
            name: 'Todd Motto',
            username: 'toddmotto',
            avatar: '//secure.gravatar.com/avatar/b56bb22b3a4b83c6b534b4c114671380',
            tags: []
          },
          {
            name: 'Abe Haskins',
            username: 'abeisgreat',
            avatar: '//secure.gravatar.com/avatar/fbb79df0f24e736c8e37f9f195a738cc',
            tags: []
          },
          {
            name: 'Uri Shaked',
            username: 'urish',
            avatar: '//secure.gravatar.com/avatar/fbf41c66afb1e3807b7b330c2d8fcc28',
            tags: []
          }
        ],
        workshops
      }
    )
  })

  // svc.searchOne({slug:slug},null, (e,r) => {
  //   $log(r)
  //   cb(e,r)
  // })
}
