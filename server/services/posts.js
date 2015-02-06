import Svc                from '../services/_service'
var logging               = false
var Post                  = require('../models/post')
var svc                   = new Svc(Post, logging)
var UserSvc               = require('../services/users')
var github                = require("../services/wrappers/github")
var Data                  = require('./posts.data')
var {inflateHtml, addUrl} = Data.select.cb
var {displayView}         = Data.select.cb

var get = {

  getById(id, cb) {
    svc.getById(id, cb)
  },

  getBySlug(slug, cb) {
    var query = _.extend(Data.query.published(),{slug})
    svc.searchOne(query, null, inflateHtml(cb))
  },

  getBySlugWithSimilar(slug, cb) {
    var query = _.extend(Data.query.published(),{slug})
    svc.searchOne(query, null, displayView(cb,get.getSimilarPublished))
  },

  getByIdForReview(id, cb) {
    var query = Data.query.inReview(id)
    svc.searchOne(query, null, displayView(cb,(tagSlug, callback)=>callback(null,[])))
  },

  getByIdForPreview(id, cb) {
    var query = Data.query.inDraft(id, this.user._id)
    svc.searchOne(query, null, displayView(cb,(tagSlug, callback)=>callback(null,[])))
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
      var opts = { fields: Data.select.list, options: { sort: '-submitted -published'} }
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

  getUsersPublished(userId, cb) {
    var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
    var query = _.extend({ 'by.userId': userId }, Data.query.published())
    svc.searchMany(query, opts, addUrl(cb))
  },

  // This now combines users interest posts and self authors
  getUsersPosts(cb) {
    $callSvc(get.getRecentPublished,this)((e,r) => {
      if (!this.user) cb(e,r)
      else {
        r = _.first(r, 3)
        var opts = { options: { sort: { 'created':-1, 'published':1  } } };
        svc.searchMany({'by.userId':this.user._id},opts, addUrl((ee,rr) => {
          if (e || ee) return cb(e||ee)
          var posts = rr.slice()
          for (var p of r) {
            if (!_.idsEqual(p.by.userId,this.user._id)) posts.push(p)
          }
          cb(null, posts)
        }))
      }
    })
  },

  getPostsInReview(cb) {
    var opts = { fields: Data.select.list, options: { sort: { 'submitted': -1 } } }
    svc.searchMany(Data.query.inReview(), opts, Data.select.cb.addUrl(cb))
  },

  getTableOfContents(markdown, cb) {
    return cb(null, {toc:Data.generateToc(markdown)})
  },

  getUserForks(cb){
    //all the posts where the user is a forker
    svc.searchMany(Data.query.forker(this.user._id), { field: Data.select.list }, cb)
  },

  getGitHEAD(post, cb){
    github.getFile(post.slug, "/post.md", cb)
  },

  checkSlugAvailable(slug, cb){
    svc.searchOne({slug}, null, (e,r) => {
      if (r) return cb(null, { unavailable: `The slug ${slug} alredy belongs to another post.` })
      github.getRepo(slug, (e,repo) => {
        if (repo) return cb(null, { unavailable: `The repo ${slug} already exist on the airpair org, try another name.` })
        cb(null, { available: `The repo name ${slug} is available.` })
      })
    })
  }

}


function updateWithEditTouch(post, action, cb) {
  post.updated = new Date() //-- think about removing this
  var previousAction = (post.lastTouch) ? post.lastTouch.action : null
  post.lastTouch = svc.newTouch.call(this, action)
  post.editHistory = post.editHistory || []
  if (action == 'updateByAuthor' &&
      previousAction == 'updateByAuthor' &&
      !post.submitted) {
    $log(`${post.title}:updateByAuthor) not storing author draft edits, but could debounce for some history...`)
  }
  else
    post.editHistory.push(post.lastTouch)
  svc.update(post._id, post, cb)
}


var save = {

  create(o, cb) {
    o.created = new Date()
    o.by.userId = this.user._id
    o.lastTouch = svc.newTouch.call(this, 'createByAuthor')
    o.editHistory = [o.lastTouch]
    svc.create(o, cb)
    UserSvc.changeBio.call(this, o.by.bio,() => {})
  },

  update(original, o, cb) {
    original = _.extend(original, o)
    updateWithEditTouch.call(this, original, 'updateByAuthor', cb)
  },

  publish(post, publishedOverride, cb) {
    // publishedCommit = already comes from updateFromGithub
    post.publishHistory.push({
      commit: post.publishedCommit,
      touch: svc.newTouch.call(this, 'publish')})
    post.publishedBy = this.user
    post.publishedUpdated = new Date()
    if (publishedOverride)
      post.published = publishedOverride
    else
      post.published = new Date()

    updateWithEditTouch.call(this, post, 'publish', cb)
    if (cache) cache.flush('posts')
  },

  submitForReview(post, slug, cb){
    var repoName = slug
    var githubOwner = this.user.social.gh.username
    $log('creating post repo for'.yellow, post._id, post.by.name)
    $log('*** TODO, set readme contents'.yellow)
    var readmeMD = `This repo is for ${post.title} by ${post.by.name}. And it's one of the first ever git backed AirPair posts :{}`
    github.setupPostRepo(repoName, githubOwner, post.md, readmeMD, this.user, (e, result) => {
      if (e) return cb(e)
      post.submitted = new Date()
      post.github = { repoInfo: result }
      post.slug = slug
      updateWithEditTouch.call(this, post, 'submittedForReview', cb)
    })
  },

  propagateMDfromGithub(post, cb){
    github.getFile(post.slug, "/post.md", (err, result) => {
      var commit = result.sha
      post.md = result.string
      post.publishedCommit = commit
      if (post.published) {
        post.publishHistory.push({
          commit, touch: svc.newTouch.call(this, 'publish')})
        post.publishedBy = this.user
        post.publishedCommit = commit
        post.publishedUpdated = new Date()
      }
      updateWithEditTouch.call(this, post, 'updateFromGithub', cb)
    })
  },

  updateGithubHead(original, postMD, commitMessage, cb){
    github.updateFile(original.slug, "post.md", postMD, commitMessage, this.user, (ee, result) => {
      if (ee) return cb(ee)
      if (!original.published) {
        original.md = postMD
        original.publishedCommit = result.commit
      }
      updateWithEditTouch.call(this, original, 'updateGitHEAD', (e,r) => {
        if (e || !r) return cb(e,r)
        r.md = postMD // hack for front-end
        cb(null, r)
      })
    })
  },

  addReview(post, review, cb){
    review.userId = this.user._id
    if (!post.reviews)
      post.reviews = []
    post.reviews.push(review)
    svc.update(post._id, post, cb)
  },

  addForker(post, cb){
    var githubUser = this.user.social.gh.username
    github.addContributor(this.user, post.slug, post.github.repoInfo.reviewTeamId, (e, res) => {
      if (e) return cb(e)
      var { name, email, social } = this.user
      post.forkers = post.forkers || []
      post.forkers.push({ userId: this.user._id, name, email, social })
      svc.update(post._id, post, cb)
    })
  },

  deleteById(post, cb) {
    svc.deleteById(post._id, cb)
  }
}


module.exports = _.extend(get, save)
