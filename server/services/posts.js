var logging             = false
var UserSvc              = require('../services/users')
import Svc              from '../services/_service'
var Post                = require('../models/post')
var Data                = require('./posts.data')
var svc                 = new Svc(Post, logging)
var github              = require("../services/wrappers/github")
var {inflateHtml, addUrl} = Data.select.cb

var get = {

  getById(id, cb) {
    svc.getById(id, cb)
  },

  getBySlug(slug, cb) {
    var query = _.extend(Data.query.published(),{slug})
    svc.searchOne(query, null, inflateHtml(cb))
  },

  getBySlugWithSimilar(slug, cb) {
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

      get.getSimilarPublished(r.primarytag.slug, (ee,similar) => {
        r.similar = similar
        cb(null,r)
      })
    }))
  },

  //-- used for todd-motto
  getPublishedById(_id, cb) {
    var query = _.extend(Data.query.published(),{_id})
    svc.searchOne(query, null, inflateHtml(cb))
  },

  getAllAdmin(cb) {
    var opts = { fields: Data.select.listAdmin, options: { sort: { 'updated': -1 } } };
    svc.searchMany(Data.query.updated, opts, addUrl(cb))
  },

  getAllForCache(cb) {
    svc.searchMany(Data.query.published(), { fields: Data.select.listCache }, addUrl(cb))
  },

  getPublished(cb) {
    svc.searchMany(Data.query.published(), { field: Data.select.list }, cb)
  },

  getRecentPublished(cb) {
    var opts = { fields: Data.select.list, options: { sort: { 'published': -1 }, limit: 9 } };
    svc.searchMany(Data.query.published(), opts, addUrl(cb))
  },

  getAllPublished(cb) {
    var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
    svc.searchMany(Data.query.published(), opts, addUrl(cb))
  },

  getAllVisible(user, cb) {
    if (user && _.contains(user.roles, "reviewer")){
      var opts = { fields: Data.select.list, options: { sort: '-reviewReady -published'} }
      svc.searchMany(Data.query.publishedReviewReady(), opts, addUrl(cb));//, function(e,r) {
    }
    else {
      var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
      svc.searchMany(Data.query.published(), opts, addUrl(cb))
    }
  },

  getByTag(tag, cb) {
    var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
    var query = Data.query.published({'tags._id': tag._id})
    svc.searchMany(query, opts, addUrl((e,r) => cb(null, {tag,posts:r}) ))
  },


  //-- Placeholder for showing similar posts to a currently displayed post
  getSimilarPublished(tagSlug, cb) {
    var opts = { fields: Data.select.list, options: { sort: { 'published': -1 }, limit: 3 } };
    var query = { '$and': [{'tags.slug':tagSlug}, Data.query.published()] }
    svc.searchMany(query, opts, addUrl(cb))
  },

  getUsersPublished(username, cb) {
    var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
    var query = _.extend({ 'by.username': username }, Data.query.published())
    svc.searchMany(query, opts, addUrl(cb))
  },

  // This now combines users interest posts and self authors
  getUsersPosts(cb) {
    $callSvc(get.getRecentPublished,this)((e,r) => {
      if (!this.user) cb(e,r)
      else {
        r = _.first(r, 3)
        var opts = { fields: Data.select.list, options: { sort: { 'created':-1, 'published':1  } } };
        svc.searchMany({'by.userId':this.user._id},opts, (ee,rr) => {
          if (e || ee) return cb(e||ee)
          cb(null, _.union(rr,_.where(r,(p)=>!_.idsEqual(p.by.userId,this.user._id))))
        })
      }
    })
  },

  getTableOfContents(markdown, cb) {
    return cb(null, {toc:Data.generateToc(markdown)})
  }
}

var save = {

  create(o, cb) {
    o.created = new Date()
    o.by.userId = this.user._id
    svc.create(o, cb)
    UserSvc.changeBio.call(this, o.by.bio,() => {})
  },

  update(original, o, cb) {
    original = _.extend(original, o)
    original.updated = new Date()
    svc.update(original._id, original, cb)
  },

  publish(original, o, cb) {
    if (o.slug.indexOf('/') != 0) { o.slug.replace('/',''); }
    o.updated = new Date()

    if (o.publishedOverride)
      o.published = o.publishedOverride
    else if (!o.published)
      o.published = new Date()

    o.publishedBy = this.user._id

    svc.update(original._id, o, cb)
    if (cache) cache.flush('posts')
  },

  submitForReview(original, o, cb){
    if (!github.isAuthed(this.user)){
      return cb(Error("User must authorize GitHub for repo access"))
    }
    else {
      //TODO compute this from post title (slug?)
      var repoName = original.slug
      var githubOwner = this.user.social.gh.username
      github.setupRepo(repoName, githubOwner, original.md, this.user, function(err, result){
        if (err) return cb(err)
        o.reviewReady = new Date()
        o.meta = o.meta || {};
        o.meta.reviewTeamId = result.reviewTeamId
        svc.update(original._id, o, cb)
      })
    }
  },

  updateFromGithub(user, original, cb){
    github.getFile(original.slug, "/post.md", function(err, result){
      original.md = result.string
      svc.update(original._id, original, cb)
    })
  },

  updateGithubFromDb(user, original, cb){
    //TODO mabye allow a message from the user?
    github.updateFile(original.slug, "post.md", original.md, "Update post from AirPair.com", function(err, result){
      if (err) return cb(err)
      svc.update(original._id, original, cb)
    })
  },

  submitForPublication(original, o, cb){
    if (o.reviews < 5)
      return cb(svc.Forbidden("Must have at least 5 reviews"))
    o.publishReady = new Date()
    svc.update(original._id, o, cb)
  },

  addReview(post, review, cb){
    review.userId = this.user._id
    if (!post.reviews)
      post.reviews = []
    post.reviews.push(review)
    svc.update(post._id, post, cb)
  },

  addContributor(post, o, cb){
    if (!github.isAuthed(this.user)){
      return cb(Error("User must authorize GitHub to become an editor"))
    } else {
      post.contributors = post.contributors || []
      var githubUser = this.user.social.gh.username
      post.contributors.push({id: this.user._id, github: githubUser})
      github.addContributor(this.user, post.slug, post.meta.reviewTeamId, function(err, res){
        if (err){
          cb(err)
        } else {
          svc.update(post._id, post, cb)
        }
      })
    }
  },

  deleteById(post, cb) {
    svc.deleteById(post._id, cb)
  },

  getUserContributions(cb){
    github.getReviewRepos(this.user, function(err,resp){
      if (err) return cb(err, null)
      cb(null, resp)
    })
  }
}


module.exports = _.extend(get, save)
