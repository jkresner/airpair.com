import Svc from '../services/_service'
import User from '../models/user'
import Post from '../models/post'
import generateToc from './postsToc'

var logging = false

var userSvc = new Svc(User, logging)
var svc = new Svc(Post, logging)

// var posts = [	
//   { id: '09.04', tag: 'javscript', title: 'Migrating CoffeeScript to ES6 JavaScript', by: 'hackerpreneur' },
//   { id: '09.03', tag: 'angularjs', title: 'AngularJS CDN Architecture', by: 'hackerpreneur' },
//   { id: '09.02', tag: 'angularjs', title: 'Getting started with AngularJS 1.3', by: 'hackerpreneur' },
//   { id: '09.01', tag: 'javascript', title: 'Using ES6 Harmony with NodeJS', by: 'hackerpreneur' },
//   { id: '08.28', tag: 'angularjs', title: 'Setting up my First AngularJS App', by: 'hackerpreneur' },
//   { id: '08.27', tag: 'mean-stack', title: 'Starting a Mean Stack App', by: 'hackerpreneur' }
// ];

var fields = {
  listSelect: { 'by.name': 1, 'by.avatar': 1, title:1, slug: 1, created: 1, published: 1 }
} 

var queries = {
  published: { 'published' : { '$exists': true }}
}

export function getById(id, cb) {
  svc.getById(id, cb) 
}

export function getAll(cb) {
  svc.getAll(cb)
}

export function getPublished(cb) {
  svc.searchMany(queries.published, { field: fields.listSelect }, cb) 
}

export function getRecentPublished(cb) {
  var opts = { fields: fields.listSelect, options: { sort: 'published', limit: 10 } };
  svc.searchMany(queries.published, opts, cb) 
}

export function getUsersPosts(id, cb) {
  svc.searchMany({'by.userId':id},{ fields: fields.listSelect }, cb) 
}

export function create(o, cb) {
  o.created = new Date()
  o.by.userId = this.user._id
  svc.create(o, cb)
  userSvc.update(o.by.userId, {bio: o.by.bio},() => {})
}

export function getTableOfContents(markdown, cb) {
  var toc = generateToc(markdown)
  return cb(null, {toc:toc})
}

export function update(id, o, cb) {
  if (o.published) { cb(new Error('Cannot update a published post'), null) }

  o.updated = new Date()
  
  //-- todo, authorize for owner or editor (maybe using params?)

  svc.update(id, o, cb) 
}

export function publish(id, o, cb) {
  if (!o.slug) { cb(new Error('Slug required for a published post'), null) }
  else
  {
    if (o.slug.indexOf('/') != 0) { o.slug = '/'+o.slug; }
  }

  o.updated = new Date()
  o.published = new Date()  
  o.publishedBy = this.user._id
  //-- todo, authorize for editor role

  svc.update(id, o, cb) 
}
