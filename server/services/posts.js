import Svc                from '../services/_service'
var logging               = false
var Post                  = require('../models/post')
var svc                   = new Svc(Post, logging)
var UserSvc               = require('../services/users')
var ExpertSvc             = require('../services/experts')
var TemplateSvc           = require('../services/templates')
var github                = require("../services/wrappers/github")
var Data                  = require('./posts.data')
var {query, select, opts} = Data
var selectCB              = select.cb
var {selectFromObject}    = require('../../shared/util')
var Roles                 = require('../../shared/roles')

var org = config.auth.github.org

var get = {

  getById(id, cb) {
    svc.getById(id, cb)
  },

  //-- used for api param fn
  getBySlug(slug, cb) {
    svc.searchOne(query.published({slug}), null, selectCB.inflateHtml(cb))
  },

  getByIdForEditing(post, cb) {
    post = selectFromObject(post, select.edit)
    cb(null, post)
  },

  getByIdForForking(post, cb) {
    post = selectFromObject(post, select.edit)
    cb(null, post)
  },

  getByIdForPublishing(post, cb) {
    ExpertSvc.getMe.call({user:{_id:post.by.userId}}, (e, expert) => {
      if (expert) {
        post.by.expertId = expert._id
        post.by.username = expert.username
      }
      if (!post.tmpl)
        post.tmpl = 'default'

      if (!post.meta || !post.meta.canonical)
      {
        var primarytag = _.find(post.tags,(t) => t.sort==0 || post.tags[0])
        post.meta = post.meta || {}
        post.meta.canonical = `/${primarytag.slug}/posts/${post.slug}`
      }

      if (!post.github) return cb(null, post)

      $callSvc(get.getGitHEAD, this)(post, (ee, head) => {
        if (!ee && head.string)
          post.mdHEAD = head.string
        cb(ee, post)
      })

    })
  },

  getByIdForPreview(_id, cb) {
    svc.searchOne({_id}, null, (e,r) => {
      if (e || !r) return cb(e,r)
      if (!r.submitted || !r.github) return selectCB.displayView(cb)(null, r)
      $callSvc(get.getGitHEAD, this)(r, (ee, head) => {
        if (head.string)
          r.md = head.string
        selectCB.displayView(cb)(null, r)
      })
    })
  },

  getBySlugForPublishedView(slug, cb) {
    svc.searchOne(query.published({slug}), null, selectCB.displayView(cb, get.getSimilar))
  },

  getByIdForReview(_id, cb) {
    svc.searchOne(query.inReview({_id}), null, selectCB.displayView(cb))
  },

  getAllForCache(cb) {
    svc.searchMany(query.published(), { fields: select.listCache }, selectCB.addUrl(cb))
  },

  getAllPublished(cb) {
    var q = query.published()
    q['$and'].push({'tmpl' : { '$ne': 'blank' }})
    q['$and'].push({'tmpl' : { '$ne': 'faq' }})
    var options = { fields: Data.select.list, options: { sort: { 'published': -1 } } };
    svc.searchMany(q, options, selectCB.addUrl(cb))
  },

  getRecentPublished(cb) {
    var q = query.published()
    q['$and'].push({'tmpl' : { '$ne': 'blank' }})
    q['$and'].push({'tmpl' : { '$ne': 'faq' }})
    svc.searchMany(q, { field: select.list, options: opts.publishedNewest(9) }, selectCB.addUrl(cb))
  },

  //-- Placeholder for showing similar posts to a currently displayed post
  getSimilar(original, cb) {
    var tagId = original.primarytag._id
    var options = { fields: select.list, options: opts.publishedNewest(3) }
    svc.searchMany(query.published({'tags._id':tagId}), options, selectCB.addUrl(cb))
  },

  getByTag(tag, cb) {
    var options = { fields: select.list, options: opts.publishedNewest() }
    var q = query.published({'tags._id': tag._id})
    svc.searchMany(q, options, selectCB.addUrl((e,r) => cb(null, {tag,posts:r}) ))
  },

  //-- used for todd-motto
  // getPublishedById(_id, cb) {
  //   var query = _.extend(,)
  //   svc.searchOne(Data.query.published({_id}), null, inflateHtml(cb))
  // },

  // getPublished(cb) {
  //   svc.searchMany(query.published(), { field: select.list, options: opts.publishedByNewest() }, cb)
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
    var options = { fields: select.list, options: opts.publishedNewest() }
    svc.searchMany(query.published({ 'by.userId': userId }), options, selectCB.addUrl(cb))
  },

  // getUsersPosts combines users interest posts and self authors
  getUsersPosts(cb) {
    $callSvc(get.getRecentPublished,this)((e,r) => {
      if (!this.user) cb(e,r)
      else {
        r = _.first(r, 3)
        var opts = { options: { sort: { 'created':-1, 'published':1  } } };
        svc.searchMany({'by.userId':this.user._id},opts, selectCB.addUrl((ee,rr) => {
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
    svc.searchMany(query.inReview(), options, selectCB.addUrl(cb))
  },

  getUserForks(cb){
    // all posts where the user is a forker
    svc.searchMany(query.forker(this.user._id), { field: Data.select.list }, selectCB.addUrl(cb))
  },

  getGitHEAD(post, cb){
    var owner = org

    if ( Roles.post.isForker(this.user, post) )
      owner = this.user.social.gh.username
    else if ( !Roles.post.isOwnerOrEditor(this.user, post) )
      return cb(`Cannot get git HEAD. You have not forked ${post.slug}`)

    github.getFile(owner, post.slug, "/post.md", this.user, (e,resp) => {
      //for forker check the case where they have deleted the fork
      if (e && e.code === 404 && owner != org)
      {
        github.getRepo(owner, post.slug, (err,response) => {
          if (err && err.code === 404)
            return cb(Error(`No fork present. <a href='/posts/fork/${post._id}'>Create new fork?</a>`))
          else if (!err)
            return cb(Error(`post.md of fork ${owner}/${post.slug} missing or corrupted`))
          else
            return cb(err)
        })
      }
      else
        cb(e,resp)
    })
  },

  checkSlugAvailable(post, slug, cb){
    svc.searchOne({slug}, null, (e,r) => {
      if (r)
        if (!_.idsEqual(post._id,r._id))  //-- for posts that were published before the git authoring stuff
          return cb(null, { unavailable: `The slug ${slug} alredy belongs to another post.` })

      github.getRepo(org, slug, (e,repo) => {
        if (repo) return cb(null, { unavailable: `The repo ${slug} already exist on the airpair org, try another name.` })
        if (e.code == 404)
          cb(null, { available: `The repo name ${slug} is available.` })
        else
          cb(Error(e),repo)
      })
    })
  },

  getReview(post, reviewId, cb) {
    return cb(null, _.find(post.reviews,(r)=>_.idsEqual(r._id,reviewId)))
  },


  // getTableOfContents(markdown, cb) {
  //   return cb(null, {toc:Data.generateToc(markdown)})
  // },
}


var getAdmin = {

  getAllForAdmin(cb) {
    var options = { fields: select.listAdmin, options: { sort: { 'updated': -1 } } }
    svc.searchMany(query.updated, options, selectCB.addUrl(cb))
  },

  getNewFoAdmin(cb) {
    var options = { fields: select.listAdmin, options: { sort: { 'updated': -1 }, limit: 20 } }
    var q = { 'assetUrl': {'$exists': true }, updated : { '$exists': true } }
    svc.searchMany(q, options, selectCB.addUrl(cb))
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

  publish(post, publishData, cb) {
    // publishedCommit = already comes from updateFromGithub

    post.publishHistory = post.publishHistory || []
    post.publishHistory.push({
      commit: post.publishedCommit || 'Not yet propagated',
      touch: svc.newTouch.call(this, 'publish')})

    post.publishedBy = svc.userByte.call(this)
    post.publishedUpdated = new Date()

    if (publishData.publishedOverride)
      post.published = publishData.publishedOverride
    else if (!post.published)
      post.published = new Date()

    post.by = publishData.by
    post.tmpl = publishData.tmpl
    post.meta = publishData.meta
    post.meta.ogType = 'article'

    if (post.meta.canonical.indexOf('/') == 0)
      post.meta.canonical = post.meta.canonical.replace('/', 'https://www.airpair.com/')

    post.meta.ogUrl = post.meta.canonical

    // if (post.by.expertId)
    // To link expert we are required to publish twice, which a bit awkward,
    // but a very infrequent case

    updateWithEditTouch.call(this, post, 'publish', cb)
    if (cache) cache.flush('posts')
  },

  submitForReview(post, slug, cb){
    var repoName = slug
    var githubOwner = this.user.social.gh.username
    TemplateSvc.mdFile('post-repo-readme', post, (readmeMD) => {
      var trackData = { type: 'post-submit', name: post.title, postId: post._id, author: post.by.name }
      analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})

      github.setupPostRepo(repoName, githubOwner, post, readmeMD, this.user, (e, result) => {
        if (e) return cb(e)
        post.submitted = new Date()
        post.github = { repoInfo: result }
        post.slug = slug
        updateWithEditTouch.call(this, post, 'submittedForReview', cb)
      })
    })

  },

  propagateMDfromGithub(post, cb){
    github.getFile(org, post.slug, "/post.md", null, (err, result) => {
      var commit = result.sha
      post.md = result.string
      post.publishedCommit = commit
      if (post.published) {
        post.publishHistory.push({
          commit, touch: svc.newTouch.call(this, 'publish')})
        post.publishedBy = svc.userByte.call(this)
        post.publishedCommit = commit
        post.publishedUpdated = new Date()
      }
      updateWithEditTouch.call(this, post, 'propagateMDfromGithub', cb)
    })
  },

  updateGithubHead(original, postMD, commitMessage, cb){
    var fork = !(_.idsEqual(original.by.userId, this.user._id))
    if (fork)
      var owner = this.user.social.gh.username
    else
      owner = org
    github.updateFile(owner, original.slug, "post.md", postMD, commitMessage, this.user, (ee, result) => {
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

  addForker(post, cb) {
    var githubUser = this.user.social.gh.username
    github.addContributor(this.user, post.slug, post.github.repoInfo.reviewTeamId, (e, res) => {
      if (e) return cb(e)
      var { name, email, social } = this.user
      post.forkers = post.forkers || []
      var existing = _.find(post.forkers, (f)=>_.idsEqual(f.userId,this.user._id))
      if (!existing)
        post.forkers.push({ userId: this.user._id, name, email, social })
      svc.update(post._id, post, cb)
    })
  },

  deleteById(post, cb) {
    svc.deleteById(post._id, cb)
  }

}


var saveReviews = {

  review(post, review, cb) {
    review.by = svc.userByte.call(this)
    review.type = `post-survey-inreview`
    if (post.published) review.type.replace('inreview','published')

    post.reviews = post.reviews || []
    post.reviews.push(review)

    svc.update(post._id, post, selectCB.statsView(cb))

    var rating = _.find(review.questions,(q)=>q.key=='rating').answer
    var comment = _.find(review.questions,(q)=>q.key=='feedback').answer
    mailman.sendPostReviewNotification(this.user, post._id, post.title, review.by.name, rating, comment)
  },

  reviewUpdate(post, original, reviewUpdated, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    review = _.extend(review,reviewUpdated)
    svc.update(post._id, post, selectCB.statsView(cb))
  },

  reviewReply(post, original, reply, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    reply.by = svc.userByte.call(this)
    review.replies.push(reply)
    svc.update(post._id, post, selectCB.statsView(cb))
  },

  reviewUpvote(post, original, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    var vote = { val: 1, by: svc.userByte.call(this) }
    review.votes.push(vote)
    svc.update(post._id, post, selectCB.statsView(cb))
  },

  reviewDelete(post, original, cb) {

  },

}

module.exports = _.extend(_.extend(get, getAdmin), _.extend(save,saveReviews))
