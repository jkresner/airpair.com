import Svc                from '../services/_service'
var logging               = false
var Post                  = require('../models/post')
var svc                   = new Svc(Post, logging)
var UserSvc               = require('../services/users')
var ExpertSvc             = require('../services/experts')
var TemplateSvc           = require('../services/templates')
var github2               = Wrappers.GitHub
var Data                  = require('./posts.data')
var {query, select, opts} = Data
var selectCB              = select.cb
var {selectFromObject,getYouTubeThumb} = require('../../shared/util')
var PostsUtil             = require('../../shared/posts')
var Roles                 = require('../../shared/roles').post


var org = config.auth.github.org

var get = {

  getById(id, cb) {
    svc.getById(id, cb)
  },

  //-- used for api param fn
  getBySlug(slug, cb) {
    svc.searchOne(query.published({slug}), null, selectCB.inflateHtml(cb))
  },

  //-- used for api param fn
  getByIdFromCache(_id, cb) {
    cache.ready(['posts'], () => {
      var post = cache.posts[_id]
      cb(null, post)
    })
  },

  getByIdForEditingInfo(post, cb) {
    selectCB.editInfoView(cb)(null, post)
  },

  getByIdForEditing(post, cb) {
    if (!post.submitted) return selectCB.editView(cb)(null, post)

    var owner = org
    if ( Roles.isForker(this.user, post) )
      owner = this.user.social.gh.username
    else if ( !Roles.isOwnerOrEditor(this.user, post) )
      return cb(`Cannot edit this post. You need to fork ${post.slug}`)

    github2.getFile(this.user, owner, post.slug, "/post.md", 'edit', (e, postMDfile) => {
      var mdOverride = (postMDfile) ? postMDfile.string : null
      selectCB.editView(cb, mdOverride, owner)(e, post)
    })
  },

  getByIdForContributors(post, cb) {
    analytics.track(this.user, this.sessionID, 'getPullRequests', {slug:post.slug},null,()=>{})

    var done = (e, pullRequests) => {
      post.pullRequests = selectFromObject({pullRequests}, select.pr).pullRequests
      var {openPRs,closedPRs,acceptedPRs} = PostsUtil.calcStats(post)
      if (!post.stats
        || post.stats.acceptedPRs != acceptedPRs
        || post.stats.closedPRs != closedPRs
        || post.stats.openPRs != openPRs
        )
      {
        // Unfortunately this is not right, we need to query the github api again to see if they were merged
        post.stats = _.extend(post.stats||{},{acceptedPRs,openPRs,closedPRs})
        svc.update(post._id, post, selectCB.statsView(cb))
      } else
        selectCB.statsView(cb)(null, post)
    }

    cache.pullRequests(post.slug, (cb) => {
      github2.getPullRequests.call(this, 'admin', org, post.slug, cb)
    }, done)
  },

  getByIdForSubmitting(post, cb) {
    post = selectFromObject(post, select.editInfo)
    post.submit = { repoAuthorized: false }
    post.slug = post.title.toLowerCase()
                    .replace(/ /g, '_').replace(/\W+/g, '').replace(/_/g, '-')

    if (!this.user.social || !this.user.social.gh) return cb(null, post)

    $callSvc(UserSvc.getProviderScopes, this)((e, providers) => {
      if (e && e.message == "GitHub token auth failed")
        post.submit.repoAuthorized = false
      else if (e)
        return cb(Error(`getByIdForSubmitting. Failed to get user providers scopes for [${this.user._id}][${this.user.social.gh.username}]`))
      else {
        var scope = _.find(providers.github, (s) => s.indexOf("repo") != -1)
        if (!scope) return cb(null, post)
        post.submit.repoAuthorized = true
      }
      $callSvc(get.checkSlugAvailable, this)(post, post.slug, (e, r) => {
        post.submit.slugStatus = r
        cb(e, post)
      })
    })
  },

  getByIdForForking(post, cb) {
    var {slug} = post
    post = selectFromObject(post, select.editInfo)
    post.submit = { repoAuthorized: false, slug }
    if (!this.user.social || !this.user.social.gh) return cb(null, post)
    post.submit.owner = this.user.social.gh.username
    $callSvc(UserSvc.getProviderScopes, this)((e, providers) => {
      if (e && e.message == "GitHub token auth failed")
        post.submit.repoAuthorized = false
      else if (e)
        return cb(Error(`getByIdForForking. Failed to get user providers scopes for [${this.user._id}][${this.user.social.gh.username}]`))
      else {
        var scope = _.find(providers.github, (s) => s.indexOf("repo") != -1)
        post.submit.repoAuthorized = scope != null
      }
      cb(null, post)
    })
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

      github2.getFile('admin', org, post.slug, "/post.md", 'edit', (ee, head) => {
        if (!ee && head.string)
          post.mdHEAD = head.string
        cb(ee, post)
      })
    })
  },

  getByIdForPreview(_id, cb) {
    svc.searchOne({_id}, { fields: select.display }, (e,r) => {
      if (e || !r) return cb(e,r)
      if (!r.submitted || !r.github) return selectCB.displayView(cb)(null, r)

      //-- Allow admins to preview a post without a fork
      if (!Roles.isForker(this.user, r) &&
        !_.idsEqual(this.user._id, r.by.userId)
        )
        return selectCB.displayView(cb)(null, r)

      $callSvc(get.getGitHEAD, this)(r, (ee, head) => {
        if (head && head.string)
          r.md = head.string
        selectCB.displayView(cb)(ee, r)
      })
    })
  },

  getBySlugForPublishedView(slug, cb) {
    svc.searchOne(query.published({slug}), { fields: select.display }, selectCB.displayView(cb, get.getSimilar))
  },

  getByIdForReview(_id, cb) {
    svc.searchOne({_id}, { fields: select.display }, (e,r) => {
      if (e||!r) return cb(e,r)
      if (r.published) return cb(null, {published:true, url: r.meta.canonical})
      if (!r.submitted) return cb(null, null)
      selectCB.displayView(cb)(e,r)
    })
  },

  getAllForCache(cb) {
    svc.searchMany(query.cached(), { fields: select.listCache }, selectCB.addUrl(cb))
  },

  getAllPublished(cb) {
    var q = query.published()
    q['$and'].push({'tmpl' : { '$ne': 'blank' }})
    q['$and'].push({'tmpl' : { '$ne': 'faq' }})
    q['$and'].push({'by.userId' : { '$ne': '52ad320166a6f999a465fdc5' }})
    var options = { fields: select.list, options: opts.allPublished }

    svc.searchMany(q, options, selectCB.addUrl((e,r) => {
      var latest = r.splice(0,6)
      var featured = _.take(_.sortBy(r, (p) => (!p.stats) ? 0
        :  -1*(p.stats.rating-2)*(p.stats.reviews+2) ), 6)
      r = _.difference(r, featured)
      var popular = _.filter(r, (p) => _.contains(Data.data.popular,p.slug))
      var comp = _.filter(r, (p) => _.contains(Data.data.comp,p.slug))
      var archive = _.difference(r, _.union(popular,comp))

      cb(null, { latest, featured, popular, comp, archive })
    }))
  },

  getAll2015CompWinners(cb) {
    var getWinners = function(callback) {
      var q = query.comp2015winners()
      var options = { fields: Data.select.listComp, options: opts.highestRating }
      svc.searchMany(q, options, selectCB.addUrl((e,r)=>{
        for (var p of r||[]) p.prize.pic = (p.prize.sponsor == 'airpair') ? `prize-${p.prize.tag}` : `logo-${p.prize.tag}`
        callback(e,r)
      }))
    }
    cache.getOrSetCB('2015postcomp', getWinners, cb)
  },

  getRecentPublished(cb) {
    var q = query.published()
    q['$and'].push({'tmpl' : { '$ne': 'blank' }})
    q['$and'].push({'tmpl' : { '$ne': 'faq' }})
    svc.searchMany(q, { fields: select.list, options: opts.publishedNewest(9) }, selectCB.addUrl(cb))
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


  getUsersPublished(userId, cb) {
    var options = { fields: select.list, options: opts.publishedNewest() }
    svc.searchMany(query.published({ 'by.userId': userId }), options, selectCB.addUrl((e,r)=>{
      if (e) return cb(e)
      cb(null, {featured: r,archive: []})
    }))
  },

  // Everything needed for airpair.com/posts/me
  getMyPosts(cb) {
    if (!this.user) return $callSvc(get.getRecentPublished,this)(cb)

    var fields = _.extend({md:1},select.stats) // meed md for wordcount

    var inReviewOpts = { fields, options: { sort: { 'submitted': -1 }, limit: 6 } }
    svc.searchMany(query.inReview(), inReviewOpts, (e,r) => {

      var opts = {  fields, options: { sort: { 'created':-1, 'published':1  } } };
      svc.searchMany(query.myPosts(this.user._id), opts, selectCB.addUrl((ee,rr) => {
        if (e || ee) return cb(e||ee)
        var posts = rr.slice()
        for (var p of r) {
          if (!_.find(posts,(post)=>_.idsEqual(p._id,post._id))) posts.push(p)
        }
        selectCB.statsViewList(cb)(null, posts)
      }))
    })
  },

  getPostsInReview(cb) {
    var options = { fields: select.list, options: { sort: { 'submitted': -1 } } }
    svc.searchMany(query.inReview(), options, selectCB.addUrl(cb))
  },

  // getUserForks(cb){
  //   // all posts where the user is a forker
  //   svc.searchMany(query.forker(this.user._id), { field: Data.select.list }, selectCB.addUrl(cb))
  // },

  getGitHEAD(post, cb){
    var owner = org

    if ( Roles.isForker(this.user, post) )
      owner = this.user.social.gh.username
    else if ( !Roles.isOwnerOrEditor(this.user, post) )
      return cb(`Cannot get git HEAD. You have not forked ${post.slug}`)

    github2.getFile(this.user, owner, post.slug, "/post.md", 'edit', cb)
  },

  checkSlugAvailable(post, slug, cb){
    svc.searchOne({slug}, null, (e,r) => {
      if (r)
        if (!_.idsEqual(post._id,r._id))  //-- for posts that were published before the git authoring stuff
          return cb(null, { unavailable: `The slug ${slug} alredy belongs to another post.` })

      github2.checkRepo('admin', org, slug, (e,repoStatus) => {
        if (e) return cb(e)
        cb(null, repoStatus)
      })
    })
  },

  getReview(post, reviewId, cb) {
    return cb(null, _.find(post.reviews,(r)=>_.idsEqual(r._id,reviewId)))
  },

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
  if (action == 'updateMarkdownByAuthor' &&
      previousAction == 'updateMarkdownByAuthor' &&
      !post.submitted) {
    $log(`${post.title}:updateMarkdownByAuthor) not storing author draft edits, but could debounce for some history...`)
  }
  else
    post.editHistory.push(post.lastTouch)

  // Only set the thumb is the ogImage is still the movie, we want to let it
  // be customized even though the main assetUrl is a youtube movie
  if (post.meta && post.assetUrl.indexOf('http://youtu.be/') != -1
    && post.meta.ogImage == post.assetUrl)
    post.meta.ogImage = getYouTubeThumb(post.assetUrl)

  svc.update(post._id, post, cb)
}


var save = {

  create(o, cb) {
    o.created = new Date()
    o.by = PostsUtil.authorFromUser(o.by)
    o.lastTouch = svc.newTouch.call(this, 'createByAuthor')
    o.editHistory = [o.lastTouch]
    o.md = "new"
    if (o.assetUrl) delete o.assetUrl
    svc.create(o, selectCB.editInfoView(cb))
    UserSvc.changeBio.call(this, o.by.bio,() => {})
  },

  update(original, ups, cb) {
    var act = (Roles.isOwner(this.user, original)) ? 'updateByAuthor' : 'updateByEditor'
    var {userId} = original.by
    UserSvc.getById.call({user:{_id:userId}}, userId,(ee, user) =>
    {
      var social = PostsUtil.authorFromUser(user).social
      if (social) ups.by.social = social

      if (original.assetUrl != ups.assetUrl && (original.submitted || original.published))
        ups.meta = _.extend(original.meta, _.extend(ups.meta||{},{ogImage:ups.assetUrl}))

      updateWithEditTouch.call(this, _.extend(original, ups), act, selectCB.editInfoView(cb))
    })
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

    if (publishData.publishedOverride)
      pairbot.sendPostSynced(post)
    else
      pairbot.sendPostPublished(post)
  },

  submitForReview(post, slug, cb){
    TemplateSvc.mdFile('post-repo-readme', post, (readmeMD) => {
      var trackData = { type: 'post-submit', name: post.title, postId: post._id, author: post.by.name, repo: slug }
      analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})

      github2.setupPostRepo(this.user, slug, org, post._id, post.md, readmeMD, (e, repoInfo) => {
        if (e) return cb(e)
        post.submitted = new Date()
        post.github = { repoInfo }
        post.slug = slug
        post.meta = post.meta || {}
        post.meta.ogImage = post.assetUrl
        updateWithEditTouch.call(this, post, 'submittedForReview', cb)

        if (cache) cache.flush('posts')
        pairbot.sendPostSubmitted(post)
      })
    })

  },

  propagateMDfromGithub(post, cb){
    // github.getStats(org, post.slug, this.user, null, (err,resp)=>{
      // post.github.stats = resp
      // setEventData(post, (err, resp) =>{
        // if(err) return cb(err)
    github2.getFile(this.user, org, post.slug, "/post.md", 'edit', (e, head) => {
      if (e) return cb(e)
      var commit = head.sha
      post.md = head.string
      post.publishedCommit = commit
      if (post.published) {
        post.publishHistory = post.publishHistory || []
        post.publishHistory.push({
          commit, touch: svc.newTouch.call(this, 'publish')})
        post.publishedBy = _.pick(this.user, '_id', 'name', 'email')
        post.publishedUpdated = new Date()
      }
      updateWithEditTouch.call(this, post, 'propagateMDfromGithub', cb)
    })
      // })
    // })
  },

  updateMarkdown(original, ups, cb) {
    var editCB = selectCB.editView(cb)

    if (!original.submitted)
      return updateWithEditTouch.call(this, _.extend(original,{md:ups.md}), 'updateMarkdownByAuthor', editCB)

    if (Roles.isForker(this.user, original)) {
      var owner = this.user.social.gh.username
      github2.updateFile(this.user, owner, original.slug, "post.md", 'edit', ups.md, ups.commitMessage, (ee, result) => {
        updateWithEditTouch.call(this, original, 'updateHEADonFork', selectCB.editView(cb, ups.md, owner))
      })
    }
    else if (Roles.isOwner(this.user, original)) {
      var owner = org
      github2.updateFile(this.user, owner, original.slug, "post.md", 'edit', ups.md, ups.commitMessage, (ee, result) => {
        if (ee) return cb(ee)
        // if (!original.published) {
          // original.md = postMD
          // original.publishedCommit = result.commit
        // }
        // setEventData(original, (err,resp) => {
          // if (err) return cb(err)
          // $log('setEventData.resp', resp)
        updateWithEditTouch.call(this, original, 'updateHEAD', selectCB.editView(cb, ups.md, owner))
        // })
      })
    } else {
      cb(Error("Must be a forker to update post HEAD"))
    }
  },

  addForker(post, cb) {
    github2.addContributor(this.user, org, post.slug, (e, fork) => {
      if (e) return cb(e)
      var { name, email, social } = this.user
      post.forkers = post.forkers || []
      var existing = _.find(post.forkers, (f) => _.idsEqual(f.userId,this.user._id))
      if (!existing)
        post.forkers.push({ userId: this.user._id, name, email, social })
      post.stats = PostsUtil.calcStats(post)
      svc.update(post._id, post, selectCB.statsView(cb))
    })
  },

  clobberFork(post, cb){
    console.log("clobber fork")
    cb(null, "clobbered")
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

    post.stats = PostsUtil.calcStats(post)
    svc.update(post._id, post, selectCB.statsView(cb))

    //-- Probably better doing the db hit as we ensure the right email if the user
    //-- changed it at any point
    $callSvc(UserSvc.getById, {user:{_id:post.by.userId}})(post.by.userId, (ee, user) => {
      var rating = _.find(review.questions,(q)=>q.key=='rating').answer
      var comment = _.find(review.questions,(q)=>q.key=='feedback').answer
      mailman.sendPostReviewNotification(user, post._id, post.title, review.by.name, rating, comment)
    })
  },

  reviewUpdate(post, original, reviewUpdated, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    reviewUpdated.updated = new Date
    review = _.extend(review,reviewUpdated)
    post.stats = PostsUtil.calcStats(post)
    svc.update(post._id, post, selectCB.statsView(cb))
  },

  reviewReply(post, original, reply, cb) {
    // Damn this is annoying... alternative is to stuff the email into the author object
    // But we'd have to look at mongo consistency updates :/
    $callSvc(UserSvc.getById, {user:{_id:post.by.userId}})(post.by.userId, (ee, author) => {
      var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
      reply._id = svc.newId()
      reply.by = svc.userByte.call(this)
      review.replies.push(reply)

      var threadParticipants =
        _.uniq( _.union([author,review.by],_.pluck(review.replies,'by')), (p)=>p.email)

      var thisParticipant = _.find(threadParticipants, (p)=>p.email == this.user.email)
      if (thisParticipant) threadParticipants = _.without(threadParticipants, thisParticipant)
      // $log('still'.cyan, threadParticipants, thisParticipant)

      mailman.sendPostReviewReplyNotification(threadParticipants, post._id, post.title, reply.by.name, reply.comment)

      post.stats = PostsUtil.calcStats(post)
      svc.update(post._id, post, selectCB.statsView(cb))
    })
  },

  reviewUpvote(post, original, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    var vote = { _id: svc.newId(), val: 1, by: svc.userByte.call(this) }
    review.votes.push(vote)
    post.stats = PostsUtil.calcStats(post)
    svc.update(post._id, post, selectCB.statsView(cb))
  },

  reviewDelete(post, original, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    var reviews = _.without(post.reviews,review)
    var stats = PostsUtil.calcStats(_.extend(post,{reviews}))
    svc.updateWithSet(post._id, {reviews,stats}, selectCB.statsView(cb))
  },

}

module.exports = _.extend(_.extend(get, getAdmin), _.extend(save,saveReviews))
