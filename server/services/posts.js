import Svc from '../services/_service'
import * as Validate from '../../shared/validation/post.js'
var UserSvc         = require('../services/users')
import Post from '../models/post'
import generateToc from './postsToc'
var marked = require('marked')
var Data = require('./posts.data')

var logging = false
var svc = new Svc(Post, logging)

var addUrl = (cb) =>
  (e,r) => {
    for (var p of r) {
      if (p.meta) p.url = p.meta.canonical
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

export function getBySlugWithSimilar(slug, cb) {
  var topTapPages = ['angularjs']

  var query = _.extend(Data.query.published(),{slug})
  svc.searchOne(query, null, inflateHtml((e,r) => {
    if (e || !r) return cb(e,r)
    if (!r.tags || r.tags.length == 0) {
      $log(`post [{r._id}] has no tags`.red)
      cb(null,r)
    }

    r.primarytag = _.find(r.tags,(t) => t.sort==0) || r.tags[0]
    var topTagPage = _.find(topTapPages,(s) => r.primarytag.slug==s)
    r.primarytag.postsUrl = (topTagPage) ? `/${r.primarytag.slug}` : `/posts/tag/${r.primarytag.slug}`

    getSimilarPublished(r.primarytag.slug, (ee,similar) => {
      r.similar = similar
      cb(null,r)
    })
  }))
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


export function getByTag(tag, cb) {
  var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
  var query = Data.query.published({'tags._id': tag._id})
  svc.searchMany(query, opts, addUrl((e,r) => cb(null, {tag,posts:r}) ))
}


//-- Placeholder for showing similar posts to a currently displayed post
export function getSimilarPublished(tagSlug, cb) {
  var opts = { fields: Data.select.list, options: { sort: { 'published': -1 }, limit: 3 } };
  var query = { '$and': [{'tags.slug':tagSlug}, Data.query.published()] }
  svc.searchMany(query, opts, addUrl(cb))
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
  UserSvc.changeBio.call(this, {bio: o.by.bio},() => {})
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

export function submitForReview(id, o, cb){
  var inValid = Validate.submitForReview(this.user, null, o)
  if (inValid) return cb(svc.Forbidden(inValid))
  $log(`submitted for review ${id}, ${JSON.stringify(o)}`)
  o.reviewReady = new Date()
  svc.update(id, o, cb)
}

export function submitForPublication(id, o, cb){
  var inValid = Validate.submitForPublication(this.user, null, o)
  if (inValid) return cb(svc.Forbidden(inValid))
  if (o.reviews < 5)
    return cb(svc.Forbidden("Must have at least 5 reviews"))
  o.publishReady = new Date()
  svc.update(id, o, cb)
}

export function addReview(id, review, cb){
  review.userId = this.user._id
  getById(id, function(err, post){
    if (!post.reviews)
      post.reviews = []
    post.reviews.push(review)
    svc.update(id, post, cb)
  })
}

export function deleteById(id, cb) {
  svc.getById(id, (e, r) => {
    var inValid = Validate.deleteById(this.user, r)
    if (inValid) return cb(svc.Forbidden(inValid))
    svc.deleteById(id, cb)
  })
}
