import Svc from '../services/_service'
import Tag from '../models/tag'
import * as WorkshopsSvc from './workshops'
import * as PostsSvc from './posts'

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
  PostsSvc.getByTag(tag, (ee,posts)=> {
    WorkshopsSvc.getByTag(tag.slug, (e,workshops)=> {
      var d = {
          tag,
          featured: {
            workshop: {
              url: '/angularjs/workshops/top-10-mistakes-angularjs-developers-make',
              title: 'The Top 10 Mistakes AngularJS Developers Make',
              speaker: { name: 'Mark Meyer', gravatar: '6c2f0695e0ca4445a223ce325c7fb970' }, //todo change to avatar
              time: new Date(),
            },
            post: {
              by: { name: 'Todd Motto', avatar: '//0.gravatar.com/avatar/b56bb22b3a4b83c6b534b4c114671380', username: 'toddmotto' },
              url: '/angularjs/posts/angularjs-tutorial',
              title: 'AngularJS Tutorial: A Comprehensive 10,000 Word Guide',
              meta: {
                ogImage: '//i.imgur.com/GA8g15e.jpg',
                description: 'Written by Google Developer Expert (GDE) Todd Motto, this Angular tutorial serves as an ultimate resource for learning AngularJS.'
              },
              published: new Date(),
              tags: []
            },
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
          workshops,
          posts: posts.posts
        }

      d.workshops = _.sortBy(_.first(_.filter(d.workshops, (w) => w.time > new Date() ), 5), (w) => w.time)
      d.posts = _.first(d.posts, 5)

      cb(null, d)
    })
  })

  // svc.searchOne({slug:slug},null, (e,r) => {
  //   $log(r)
  //   cb(e,r)
  // })
}
