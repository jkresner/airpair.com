import Svc from '../services/_service'
import * as UserSvc from '../services/users'
import Post from '../models/post'
import generateToc from './postsToc'
var marked = require('marked')

var logging = false
var svc = new Svc(Post, logging)

var fields = {
  listSelect: { 'by.name': 1, 'by.avatar': 1, 'meta.description': 1, title:1, slug: 1, created: 1, published: 1, tags: 1 }
} 

var queries = {
  published: { 'published' : { '$exists': true }},
  updated: { 'updated' : { '$exists': true }}  
}

var addUrl = (cb) =>
  (e,r) => { 
    for (var p of r) { 
      if (p.slug) { 
        if (p.tags.length > 0) p.url = `/${p.tags[0].slug}/posts/${p.slug}` 
        else p.url = `/v1/posts/${p.slug}` 
      } 
    }
    cb(e,r)
  }

export var inflateHtml = (cb) =>
  (e,r) => { 
    if (r)
    {
      r.html = marked(r.md)
      r.toc = marked(generateToc(r.md))
    }
    cb(e,r)
  }


export function getById(id, cb) {
  svc.getById(id, cb) 
}

export function getBySlug(slug, cb) {
  svc.searchOne({ slug: slug }, null, inflateHtml(cb)) 
}

export function getAllAdmin(cb) {
  var opts = { fields: fields.listSelect, options: { sort: { 'updated': -1 } } };
  svc.searchMany(queries.updated, opts, (e,r) => { 
    for (var p of r) { p.url = `/posts/publish/${p._id}` }
    cb(e, r)
  })
}

export function getPublished(cb) {
  svc.searchMany(queries.published, { field: fields.listSelect }, cb) 
}

export function getRecentPublished(cb) {
  var opts = { fields: fields.listSelect, options: { sort: { 'published': -1 }, limit: 9 } };
  svc.searchMany(queries.published, opts, addUrl(cb))
}

//-- Placeholder for showing similar posts to a currently displayed post
export function getSimilarPublished(cb) {
  cb(null,[])
}

export function getUsersPublished(username, cb) {
  var opts = { fields: fields.listSelect, options: { sort: 'published' } };
  var query = _.extend({ 'by.username': username }, queries.published)
  svc.searchMany(query, opts, addUrl(cb))
}

export function getUsersPosts(id, cb) {
  var opts = { fields: fields.listSelect, options: { sort: { 'created':-1, 'published':1  } } };  
  svc.searchMany({'by.userId':id},opts, cb) 
}

export function create(o, cb) {
  o.created = new Date()
  o.by.userId = this.user._id
  svc.create(o, cb)
  UserSvc.update(o.by.userId, {bio: o.by.bio},() => {})
}

export function getTableOfContents(markdown, cb) {
  var toc = generateToc(markdown)
  return cb(null, {toc:toc})
}

export function update(id, o, cb) {
  if (o.published && !_.contains(this.user.roles, 'editor')) 
    return cb(new Error('Cannot update a published post'), null)

  o.updated = new Date()
  
  //-- todo, authorize for owner or editor (maybe using params?)

  svc.update(id, o, cb) 
}

export function publish(id, o, cb) {
  if (!o.slug) { cb(new Error('Slug required for a published post'), null) }
  else
  {
    if (o.slug.indexOf('/') != 0) { o.slug.replace('/',''); }
  }

  o.updated = new Date()

  if (o.publishedOverride) { 
    o.published = o.publishedOverride 
  } else if (!o.published) {
    o.published = new Date()
  }

  o.publishedBy = this.user._id
  //-- todo, authorize for editor role
  
  svc.update(id, o, cb) 
}

export function deleteById(id, cb) {
  svc.getById(id, (e, r) => {
    if (r.by.userId.toString() != this.user._id.toString()) { 
      cb(new Error('Cannot delete post not created by you'), null) 
    } 
    else if (r.published) { 
      cb(new Error('Cannot delete published post'), null) 
    } 
    else {
      svc.deleteById(id, cb)          
    }
  })
}

