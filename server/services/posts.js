import Svc                from '../services/_service'
var logging               = false
var Post                  = require('../models/post')
var svc                   = new Svc(Post, logging)
var UserSvc               = require('../services/users')
var github                = require("../services/wrappers/github")
var Data                  = require('./posts.data')
var {query, select, opts} = Data
var {inflateHtml, addUrl} = Data.select.cb
var {displayView}         = Data.select.cb


var get = {

  getById(id, cb) {
    svc.getById(id, cb)
  },

  //-- used for api param fn
  getBySlug(slug, cb) {
    svc.searchOne(query.published({slug}), null, inflateHtml(cb))
  },

  getBySlugForPublishedView(slug, cb) {
    svc.searchOne(query.published({slug}), null, displayView(cb, get.getSimilar))
  },

  getByIdForPreview(_id, cb) {
    svc.searchOne({_id}, null, displayView(cb))
  },

  getByIdForReview(_id, cb) {
    svc.searchOne(query.inReview({_id}), null, displayView(cb))
  },

  getAllForCache(cb) {
    svc.searchMany(query.published(), { fields: select.listCache }, addUrl(cb))
  },

  getRecentPublished(cb) {
    svc.searchMany(query.published(), { field: select.list, options: opts.publishedNewest(9) }, cb)
  },

  //-- Placeholder for showing similar posts to a currently displayed post
  getSimilar(original, cb) {
    var tagId = original.primarytag._id
    var options = { fields: select.list, options: opts.publishedNewest(3) }
    svc.searchMany(query.published({'tags._id':tagId}), options, addUrl(cb))
  },

  getByTag(tag, cb) {
    var options = { fields: select.list, options: opts.publishedNewest() }
    var query = query.published({'tags._id': tag._id})
    svc.searchMany(query, options, addUrl((e,r) => cb(null, {tag,posts:r}) ))
  },

  //-- used for todd-motto
  // getPublishedById(_id, cb) {
  //   var query = _.extend(,)
  //   svc.searchOne(Data.query.published({_id}), null, inflateHtml(cb))
  // },


  // getPublished(cb) {
  //   svc.searchMany(query.published(), { field: select.list, options: opts.publishedByNewest() }, cb)
  // },

  // getAllPublished(cb) {
  //   var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
  //   svc.searchMany(Data.query.published(), opts, addUrl(cb))
  // },

  // getAllVisible(user, cb) {
  //   if (user && _.contains(user.roles, "reviewer")){
  //     var opts = { fields: Data.select.list, options: { sort: '-submitted -published'} }
  //     svc.searchMany(Data.query.publishedReviewReady(), opts, addUrl(cb));//, function(e,r) {
  //   }
  //   else {
  //     var opts = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
  //     svc.searchMany(Data.query.published(), opts, addUrl(cb))
  //   }
  // },


  getUsersPublished(userId, cb) {
    var opts = { fields: select.list, options: opts.publishedNewest() }
    svc.searchMany(query.published({ 'by.userId': userId }), opts, addUrl(cb))
  },

  // getUsersPosts combines users interest posts and self authors
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
    var options = { fields: select.list, options: { sort: { 'submitted': -1 } } }
    svc.searchMany(query.inReview(), options, addUrl(cb))
  },

  getUserForks(cb){
    // all posts where the user is a forker
    svc.searchMany(query.forker(this.user._id), { field: Data.select.list }, addUrl(cb))
  },

  getGitHEAD(post, cb){
    github.getFile(post.slug, "/post.md", cb)
  },

  checkSlugAvailable(post, slug, cb){
    svc.searchOne({slug}, null, (e,r) => {
      if (r)
        if (!_.idsEqual(post._id,r._id))  //-- for posts that were published before the git authoring stuff
          return cb(null, { unavailable: `The slug ${slug} alredy belongs to another post.` })

      github.getRepo(slug, (e,repo) => {
        if (repo) return cb(null, { unavailable: `The repo ${slug} already exist on the airpair org, try another name.` })
        cb(null, { available: `The repo name ${slug} is available.` })
      })
    })
  },

  // getTableOfContents(markdown, cb) {
  //   return cb(null, {toc:Data.generateToc(markdown)})
  // },
}


var getAdmin = {

  getAllForAdmin(cb) {
    var options = { fields: select.listAdmin, options: { sort: { 'updated': -1 } } }
    svc.searchMany(query.updated, options, addUrl(cb))
  },

  getNewFoAdmin(cb) {
    var options = { fields: select.listAdmin, options: { sort: { 'updated': -1 }, limit: 20 } }
    svc.searchMany(query.updated, options, addUrl(cb))
  },

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


module.exports = _.extend(_.extend(get, getAdmin), save)
