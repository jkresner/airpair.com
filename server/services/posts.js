import Svc from '../services/_service'
import * as Validate from '../../shared/validation/post.js'
import * as UserSvc from '../services/users'
import Post from '../models/post'
import generateToc from './postsToc'
var marked = require('marked')
var Data = require('./posts.data')

var logging = false
var svc = new Svc(Post, logging)

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
  var query = _.extend(Data.query.published(),{slug})
  svc.searchOne(query, null, inflateHtml(cb))
}


export function getPublishedById(_id, cb) { //-- used for todd-motto
  var query = _.extend(Data.query.published(),{_id})
  svc.searchOne(query, null, inflateHtml(cb))
}


export function getAllAdmin(cb) {
  var opts = { fields: Data.select.listAdmin, options: { sort: { 'updated': -1 } } };
  svc.searchMany(Data.query.updated, opts, addUrl(cb))
}

export function getAllForCache(cb) {
  svc.searchMany(Data.query.published(), { fields: Data.select.listCache }, addUrl(cb))
}

export function getPublished(cb) {
  svc.searchMany(Data.query.published(), { field: Data.select.list }, cb)
}


export function getRecentPublished(cb) {
  var opts = { fields: Data.select.list, options: { sort: { 'published': -1 }, limit: 9 } };
  svc.searchMany(Data.query.published(), opts, addUrl(cb))
}


export function getAllPublished(cb) {
  var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
  svc.searchMany(Data.query.published(), opts, addUrl(cb))
}


//-- Placeholder for showing similar posts to a currently displayed post
export function getSimilarPublished(cb) {
  cb(null,[])
}

export function getUsersPublished(username, cb) {
  var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
  var query = _.extend({ 'by.username': username }, Data.query.published())
  svc.searchMany(query, opts, addUrl(cb))
}

export function getUsersPosts(id, cb) {
  var opts = { fields: Data.select.list, options: { sort: { 'created':-1, 'published':1  } } };
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
  svc.getById(id, (e, r) => {
    var inValid = Validate.update(this.user, r, o)
    if (inValid) return cb(svc.Forbidden(inValid))

    o.updated = new Date()

    svc.update(id, o, cb)
  })
}


export function publish(id, o, cb) {
  var inValid = Validate.publish(this.user, null, o)
  if (inValid) return cb(svc.Forbidden(inValid))

  if (o.slug.indexOf('/') != 0) { o.slug.replace('/',''); }
  o.updated = new Date()

  if (o.publishedOverride)
    o.published = o.publishedOverride
  else if (!o.published)
    o.published = new Date()


  o.publishedBy = this.user._id

  svc.update(id, o, cb)
  if (cache) cache.flush('posts')
}


export function deleteById(id, cb) {
  svc.getById(id, (e, r) => {
    var inValid = Validate.deleteById(this.user, r)
    if (inValid) return cb(svc.Forbidden(inValid))
    svc.deleteById(id, cb)
  })
}

