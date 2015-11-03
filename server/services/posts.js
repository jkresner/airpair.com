var {Post, Expert, User}  = DAL
var TemplateSvc           = require('../services/templates')
var github2               = Wrappers.GitHub
var Data                  = require('./posts.data')
var {query, select, opts} = Data
var selectTmpl            = select.tmpl
var {selectFromObject}    = require('../../shared/util')
var PostsUtil             = require('../../shared/posts')
var Roles                 = require('../../shared/roles').post
var {org}                 = config.auth.github


var get = {

  getById(id, cb) {
    Post.getById(id, cb)
  },

  //-- used for api param fn
  getBySlug(slug, cb) {
    Post.getByQuery(query.published({slug}), select.cb.inflateHtml(this.user==null,cb))
  },

  //-- used for api param fn
  getByIdFromCache(_id, cb) {
    cache.ready(['posts'], () => {
      var post = cache.posts[_id]
      cb(null, post)
    })
  },

  getByIdForEditingInfo(post, cb) {
    select.cb.editInfoView(cb)(null, post)
  },

  getByIdForEditing(post, cb) {
    if (!post.submitted) return select.cb.editView(cb)(null, post)

    var owner = org
    if ( Roles.isForker(this.user, post) )
      owner = this.user.social.gh.username
    else if ( !Roles.isOwnerOrEditor(this.user, post) )
      return cb(`Cannot edit this post. You need to fork ${post.slug}`)

    github2.getFile(this.user, owner, post.slug, "/post.md", 'edit', (e, postMDfile) => {
      var mdOverride = (postMDfile) ? postMDfile.string : null
      select.cb.editView(cb, mdOverride, owner)(e, post)
    })
  },

  getByIdForContributors(post, cb) {
    cb(V2DeprecatedError('Posts.getByIdForContributors'))
    // analytics.track(this.user, this.sessionID, 'getPullRequests', {slug:post.slug},null,()=>{})

    // var done = (e, pullRequests) => {
    //   post.pullRequests = selectFromObject({pullRequests}, select.pr).pullRequests
    //   var {openPRs,closedPRs,acceptedPRs} = PostsUtil.calcStats(post)
    //   if (!post.stats
    //     || post.stats.acceptedPRs != acceptedPRs
    //     || post.stats.closedPRs != closedPRs
    //     || post.stats.openPRs != openPRs
    //     )
    //   {
    //     // Unfortunately this is not right, we need to query the github api again to see if they were merged
    //     post.stats = _.extend(post.stats||{},{acceptedPRs,openPRs,closedPRs})
    //     svc.update(post._id, post, select.cb.statsView(cb))
    //   } else
    //     select.cb.statsView(cb)(null, post)
    // }

    // cache.pullRequests(post.slug, (cb) => {
    //   github2.getPullRequests.call(this, 'admin', org, post.slug, cb)
    // }, done)
  },

  getByIdForSubmitting(post, cb) {
    cb(V2DeprecatedError('Posts.getByIdForContributors'))
    // post = selectFromObject(post, select.editInfo)
    // post.submit = { repoAuthorized: false }
    // post.slug = post.title.toLowerCase()
    //                 .replace(/ /g, '_').replace(/\W+/g, '').replace(/_/g, '-')

    // if (!this.user.social || !this.user.social.gh) return cb(null, post)

    // $callSvc(UserSvc.getProviderScopes, this)((e, providers) => {
    //   if (e && e.message == "GitHub token auth failed")
    //     post.submit.repoAuthorized = false
    //   else if (e)
    //     return cb(Error(`getByIdForSubmitting. Failed to get user providers scopes for [${this.user._id}][${this.user.social.gh.username}]`))
    //   else {
    //     var scope = _.find(providers.github, (s) => s.indexOf("repo") != -1)
    //     if (!scope) return cb(null, post)
    //     post.submit.repoAuthorized = true
    //   }
    //   $callSvc(get.checkSlugAvailable, this)(post, post.slug, (e, r) => {
    //     post.submit.slugStatus = r
    //     cb(e, post)
    //   })
    // })
  },

  getByIdForForking(post, cb) {
    cb(V2DeprecatedError('Posts.getByIdForForking'))
    // var {slug} = post
    // post = selectFromObject(post, select.editInfo)
    // post.submit = { repoAuthorized: false, slug }
    // if (!this.user.social || !this.user.social.gh) return cb(null, post)
    // post.submit.owner = this.user.social.gh.username
    // $callSvc(UserSvc.getProviderScopes, this)((e, providers) => {
    //   if (e && e.message == "GitHub token auth failed")
    //     post.submit.repoAuthorized = false
    //   else if (e)
    //     return cb(Error(`getByIdForForking. Failed to get user providers scopes for [${this.user._id}][${this.user.social.gh.username}]`))
    //   else {
    //     var scope = _.find(providers.github, (s) => s.indexOf("repo") != -1)
    //     post.submit.repoAuthorized = scope != null
    //   }
    //   cb(null, post)
    // })
  },

  getByIdForPublishing(post, cb) {
    ExpertSvc.getByQuery({userId:post.by.userId}, (e, expert) => {
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
    cb(V2DeprecatedError('Posts.getByIdForPreview'))
    // svc.searchOne({_id}, { fields: select.display }, (e,r) => {
    //   if (e || !r) return cb(e,r)
    //   if (!r.submitted || !r.github) return select.cb.displayView(false, null, cb)(null, r)

    //   //-- Allow admins to preview a post without a fork
    //   if (!Roles.isForker(this.user, r) &&
    //     !_.idsEqual(this.user._id, r.by.userId)
    //     )
    //     return select.cb.displayView(false, null, cb)(null, r)

    //   $callSvc(get.getGitHEAD, this)(r, (ee, head) => {
    //     if (head && head.string)
    //       r.md = head.string
    //     select.cb.displayView(false, null, cb)(ee, r)
    //   })
    // })
  },

  getBySlugForPublishedView(slug, cb) {
    Post.getByQuery(query.published({slug}), { select: select.display },
      select.cb.displayView(this.user == null, get.getSimilar, cb)
    )
  },

  getByIdForReview(_id, cb) {
    Post.getById(_id, { select: select.display }, (e,r) => {
      if (e||!r) return cb(e,r)
      if (r.published) return cb(null, {published:true, url: r.meta.canonical})
      if (!r.submitted) return cb(null, null)
      select.cb.displayView(this.user==null, null, cb)(e,r)
    })
  },

  getAllForCache(cb) {
    Post.getManyByQuery(query.cached(), { select: select.listCache }, select.cb.addUrl(cb))
  },

  getAllPublished(cb) {
    var q = query.published()
    q['$and'].push({'tmpl' : { '$ne': 'blank' }})
    q['$and'].push({'tmpl' : { '$ne': 'faq' }})
    q['$and'].push({'by.userId' : { '$ne': '52ad320166a6f999a465fdc5' }})
    var options = Object.assign({ select: select.list}, opts.allPublished)

    Post.getManyByQuery(q, options, select.cb.addUrl((e,r) => {
      var featured = _.filter(r, p => _.contains(Data.data.featured,p.slug))
      r = _.difference(r, featured)
      var latest = r.splice(0,6)
      var top = _.take(_.sortBy(r, (p) => (!p.stats) ? 0
        :  -1*(p.stats.rating-2)*(p.stats.reviews+2) ), 6)
      r = _.difference(r, top)
      var popular = _.filter(r, (p) => _.contains(Data.data.popular,p.slug))
      var comp = _.filter(r, (p) => _.contains(Data.data.comp,p.slug))
      var archive = _.difference(r, _.union(popular,comp))

      cb(null, { latest, featured, top, popular, comp, archive })
    }))
  },

  getAll2015CompWinners(cb) {
    var getWinners = function(callback) {
      var q = query.comp2015winners()
      var options = Object.assign({ select: Data.select.listComp}, opts.highestRating)
      Post.getManyByQuery(q, options, select.cb.addUrl((e,r)=>{
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
    var options = Object.assign({select:select.list}, opts.publishedNewest(12))
    Post.getManyByQuery(q, options, select.cb.addUrl(cb))
  },

  //-- Placeholder for showing similar posts to a currently displayed post
  getSimilar(original, cb) {
    var tagId = original.primarytag._id
    var options = Object.assign({ select: select.list }, opts.publishedNewest(3))
    Post.getManyByQuery(query.published({'tags._id':tagId}), options, select.cb.addUrl(cb))
  },

  getByTag(tag, cb) {
    var options = Object.assign({ select: select.list}, opts.publishedNewest())
    var q = query.published({'tags._id': tag._id})
    Post.getManyByQuery(q, options, select.cb.addUrl((e,r) => cb(null, {tag,posts:r}) ))
  },


  getUsersPublished(userId, cb) {
    cb(V2DeprecatedError('Posts.getUsersPublished'))
    // var options = { fields: select.list, options: opts.publishedNewest() }
    // svc.searchMany(query.published({ 'by.userId': userId }), options, select.cb.addUrl((e,r)=>{
    //   if (e) return cb(e)
    //   cb(null, {featured: r,archive: []})
    // }))
  },

  // Everything needed for airpair.com/posts/me
  getMyPosts(cb) {
    cb(V2DeprecatedError('Posts.getMyPosts'))
    // if (!this.user) return $callSvc(get.getRecentPublished,this)(cb)

    // var fields = _.extend({md:1},select.stats) // meed md for wordcount

    // var inReviewOpts = { fields, options: { sort: { 'submitted': -1 }, limit: 6 } }
    // Post.getManyByQuery(query.inReview(), inReviewOpts, (e,r) => {

    //   var opts = {  fields, options: { sort: { 'created':-1, 'published':1  } } };
    //   Post.getManyByQuery(query.myPosts(this.user._id), opts, select.cb.addUrl((ee,rr) => {
    //     if (e || ee) return cb(e||ee)
    //     var posts = rr.slice()
    //     for (var p of r) {
    //       if (!_.find(posts,(post)=>_.idsEqual(p._id,post._id))) posts.push(p)
    //     }
    //     select.cb.statsViewList(cb)(null, posts)
    //   }))
    // })
  },

  getPostsInReview(cb) {
    cb(V2DeprecatedError('Posts.getPostsInReview'))
    // var options = { fields: select.list, options: { sort: { 'submitted': -1 } } }
    // svc.searchMany(query.inReview(), options, select.cb.addUrl((e,r)=>{
    //   if (e || r.length != 0) return cb(e, r)
    //   options.options = opts.stale
    //   svc.searchMany(query.stale(), options, select.cb.addUrl(cb))
    // }))
  },

  // getUserForks(cb){
  //   // all posts where the user is a forker
  //   svc.searchMany(query.forker(this.user._id), { field: Data.select.list }, select.cb.addUrl(cb))
  // },

  getGitHEAD(post, cb) {
    cb(V2DeprecatedError('Posts.getGitHEAD'))
    // var owner = org

    // if ( Roles.isForker(this.user, post) )
    //   owner = this.user.social.gh.username
    // else if ( !Roles.isOwnerOrEditor(this.user, post) )
    //   return cb(`Cannot get git HEAD. You have not forked ${post.slug}`)

    // github2.getFile(this.user, owner, post.slug, "/post.md", 'edit', cb)
  },

  checkSlugAvailable(post, slug, cb) {
    cb(V2DeprecatedError('Posts.checkSlugAvailable'))
    // svc.searchOne({slug}, null, (e,r) => {
    //   if (r)
    //     if (!_.idsEqual(post._id,r._id))  //-- for posts that were published before the git authoring stuff
    //       return cb(null, { unavailable: `The slug ${slug} alredy belongs to another post.` })

    //   github2.checkRepo('admin', org, slug, (e,repoStatus) => {
    //     if (e) return cb(e)
    //     cb(null, repoStatus)
    //   })
    // })
  },

  getReview(post, reviewId, cb) {
    return cb(null, _.find(post.reviews,(r)=>_.idsEqual(r._id,reviewId)))
  },

}


var getAdmin = {

  getAllForAdmin(cb) {
    var options = { select: select.listAdmin, sort: { 'updated': -1 } }
    Post.getAll(options, select.cb.addUrl(cb))
  },

  getNewFoAdmin(cb) {
    var options = { select: select.listAdmin, sort: { 'updated': -1 }, limit: 20 }
    var q = { 'assetUrl': {'$exists': true }, updated : { '$exists': true } }
    Post.getManyByQuery(q, options, select.cb.addUrl(cb))
  },

}




// function updateWithEditTouch(original, updates, action, cb) {
//   var updated = new Date() //-- think about removing this
//   var previousAction = (original.lastTouch) ? original.lastTouch.action : null

//   var lastTouch = svc.newTouch.call(this, action)
//   var editHistory = original.editHistory || []
//   if (action == 'updateMarkdownByAuthor' &&
//       previousAction == 'updateMarkdownByAuthor' &&
//       !post.submitted) {
//     $log(`${post.title}:updateMarkdownByAuthor) not storing author draft edits, but could debounce for some history...`)
//   }
//   else
//     editHistory.push(lastTouch)

//   // Only set the thumb is the ogImage is still the movie, we want to let it
//   // be customized even though the main assetUrl is a youtube movie
//   if (updates.meta && updates.assetUrl.indexOf('http://youtu.be/') != -1
//     && updates.meta.ogImage == updates.assetUrl)
//     updates.meta.ogImage = util.getYouTubeThumb(post.assetUrl)

//   var update = _.extend(updates,{updated,lastTouch,editHistory})

//   Post.updateSet(original._id, update, cb)
// }


var save = {

  create(o, cb) {
    cb(V2DeprecatedError('Posts.create'))
    // o.created = new Date()
    // o.by = PostsUtil.authorFromUser(o.by)
    // o.lastTouch = svc.newTouch.call(this, 'createByAuthor')
    // o.editHistory = [o.lastTouch]
    // o.md = "new"
    // if (o.assetUrl) delete o.assetUrl
    // Post.create(o, select.cb.editInfoView(cb))
    // UserSvc.changeBio.call(this, o.by.bio,() => {})
  },

  update(original, ups, cb) {
    cb(V2DeprecatedError('Posts.update'))
    // $log('Post.update.ups', ups)
    // var act = (Roles.isOwner(this.user, original)) ? 'updateByAuthor' : 'updateByEditor'
    // var {userId} = original.by
    // // UserSvc.getById.call({_id:userId}, (ee, user) =>
    // // {
    //   // var social = PostsUtil.authorFromUser(user).social
    //   // if (social) ups.by.social = social

    // if (original.assetUrl != ups.assetUrl && (original.submitted || original.published))
    //   ups.meta = _.extend(original.meta, _.extend(ups.meta||{},{ogImage:ups.assetUrl}))

    // updateWithEditTouch.call(this, original, ups, act, select.cb.editInfoView(cb))
    // })
  },

  publish(post, publishData, cb) {
    cb(V2DeprecatedError('Posts.publish'))
    // publishedCommit = already comes from updateFromGithub

    // post.publishHistory = post.publishHistory || []
    // post.publishHistory.push({
    //   commit: post.publishedCommit || 'Not yet propagated',
    //   touch: svc.newTouch.call(this, 'publish')})

    // post.publishedBy = svc.userByte.call(this)
    // post.publishedUpdated = new Date()

    // if (publishData.publishedOverride)
    //   post.published = publishData.publishedOverride
    // else if (!post.published)
    //   post.published = new Date()

    // post.by = publishData.by
    // post.tmpl = publishData.tmpl
    // post.meta = publishData.meta
    // post.meta.ogType = 'article'

    // if (post.meta.canonical.indexOf('/') == 0)
    //   post.meta.canonical = post.meta.canonical.replace('/', 'https://www.airpair.com/')

    // post.meta.ogUrl = post.meta.canonical

    // // if (post.by.expertId)
    // // To link expert we are required to publish twice, which a bit awkward,
    // // but a very infrequent case

    // updateWithEditTouch.call(this, post, 'publish', cb)
    // if (cache) cache.flush('posts')

    // if (publishData.publishedOverride)
    //   pairbot.sendPostSynced(post)
    // else
    //   pairbot.sendPostPublished(post)
  },

  submitForReview(post, slug, cb) {
    cb(V2DeprecatedError('Posts.submitForReview'))
    // TemplateSvc.mdFile('post-repo-readme', post, (readmeMD) => {
    //   var trackData = { type: 'post-submit', name: post.title, postId: post._id, author: post.by.name, repo: slug }
    //   analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})

    //   github2.setupPostRepo(this.user, slug, org, post._id, post.md, readmeMD, (e, repoInfo) => {
    //     if (e) return cb(e)
    //     post.submitted = new Date()
    //     post.github = { repoInfo }
    //     post.slug = slug
    //     post.meta = post.meta || {}
    //     post.meta.ogImage = post.assetUrl
    //     updateWithEditTouch.call(this, post, 'submittedForReview', cb)

    //     if (cache) cache.flush('posts')
    //     pairbot.sendPostSubmitted(post)
    //   })
    // })
  },

  propagateMDfromGithub(post, cb) {
    cb(V2DeprecatedError('Posts.propagateMDfromGithub'))
    // github.getStats(org, post.slug, this.user, null, (err,resp)=>{
      // post.github.stats = resp
      // setEventData(post, (err, resp) =>{
        // if(err) return cb(err)
    // github2.getFile(this.user, org, post.slug, "/post.md", 'edit', (e, head) => {
    //   if (e) return cb(e)
    //   var commit = head.sha
    //   post.md = head.string
    //   post.publishedCommit = commit
    //   if (post.published) {
    //     post.publishHistory = post.publishHistory || []
    //     post.publishHistory.push({
    //       commit, touch: svc.newTouch.call(this, 'publish')})
    //     post.publishedBy = _.pick(this.user, '_id', 'name', 'email')
    //     post.publishedUpdated = new Date()
    //   }
    //   updateWithEditTouch.call(this, post, 'propagateMDfromGithub', cb)
    // })
      // })
    // })
  },

  updateMarkdown(original, ups, cb) {
    cb(V2DeprecatedError('Posts.updateMarkdown'))
    // $log('Post.updateMarkdown.ups', ups)

    // var editCB = select.cb.editView(cb)

    // if (!original.submitted)
    //   return updateWithEditTouch.call(this, original, {md:ups.md}, 'updateMarkdownByAuthor', editCB)

    // if (Roles.isForker(this.user, original)) {
    //   cb(V2DeprecatedError('Posts.updateMarkdown.byForker'))
    //   // var owner = this.user.social.gh.username
    //   // github2.updateFile(this.user, owner, original.slug, "post.md", 'edit', ups.md, ups.commitMessage, (ee, result) => {
    //   //   updateWithEditTouch.call(this, original, 'updateHEADonFork', select.cb.editView(cb, ups.md, owner))
    //   // })
    // }
    // else if (Roles.isOwner(this.user, original)) {
    //   cb(V2DeprecatedError('Posts.updateMarkdown.forSubmitted'))
    //   // var owner = org
    //   // github2.updateFile(this.user, owner, original.slug, "post.md", 'edit', ups.md, ups.commitMessage, (ee, result) => {
    //   //   if (ee) return cb(ee)
    //   //   // if (!original.published) {
    //   //     // original.md = postMD
    //   //     // original.publishedCommit = result.commit
    //   //   // }
    //   //   // setEventData(original, (err,resp) => {
    //   //     // if (err) return cb(err)
    //   //     // $log('setEventData.resp', resp)
    //   //   updateWithEditTouch.call(this, original, 'updateHEAD', select.cb.editView(cb, ups.md, owner))
    //   //   // })
    //   // })
    // } else {
    //   cb(Error("Must be a forker to update post HEAD"))
    // }
  },

  addForker(post, cb) {
    cb(V2DeprecatedError('Posts.addForker'))
    // github2.addContributor(this.user, org, post.slug, (e, fork) => {
    //   if (e) return cb(e)
    //   var { name, email, social } = this.user
    //   post.forkers = post.forkers || []
    //   var existing = _.find(post.forkers, (f) => _.idsEqual(f.userId,this.user._id))
    //   if (!existing)
    //     post.forkers.push({ userId: this.user._id, name, email, social })
    //   post.stats = PostsUtil.calcStats(post)
    //   svc.update(post._id, post, select.cb.statsView(cb))
    // })
  },

  clobberFork(post, cb) {
    cb(V2DeprecatedError('Posts.clobberFork'))
    // console.log("clobber fork")
    // cb(null, "clobbered")
  },

  deleteById(post, cb) {
    Post.delete(post, cb)
  }

}


var saveReviews = {

  review(post, review, cb) {
    review.by = _.pick(this.user,'_id','name','email')
    review.type = `post-survey-inreview`
    if (post.published) review.type.replace('inreview','published')

    var reviews = post.reviews || []
    reviews.push(review)

    var stats = PostsUtil.calcStats(Object.assign(post,{reviews}))
    Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))

    //-- Probably better doing the db hit as we ensure the right email if the user
    //-- changed it at any point
    User.getById(post.by.userId, (ee, user) => {
      mailman.sendTemplate('post-review-notification',
        selectTmpl.reviewNotify(post,review), user)
    })
  },

  reviewUpdate(post, original, reviewUpdated, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    reviewUpdated.updated = new Date
    review = _.extend(review,reviewUpdated)
    var stats = PostsUtil.calcStats(post)
    var {reviews} = post.reviews
    Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  },

  reviewReply(post, original, reply, cb) {
    // Damn this is annoying... alternative is to stuff the email into the author object
    // But we'd have to look at mongo consistency updates :/
    User.getById(post.by.userId, (ee, author) => {
      var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
      reply._id = Post.newId()
      reply.by = _.pick(this.user,'_id','name','email')
      review.replies.push(reply)

      var threadParticipants =
        _.uniq( _.union([author,review.by],_.pluck(review.replies,'by')), (p)=>p.email)

      var thisParticipant = _.find(threadParticipants, (p)=>p.email == this.user.email)
      if (thisParticipant) threadParticipants = _.without(threadParticipants, thisParticipant)

      mailman.sendTemplateMails('post-review-reply-notification',
        selectTmpl.reviewReplyNotify(post,reply), threadParticipants)

      var stats = PostsUtil.calcStats(post)
      var {reviews} = post
      Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
    })
  },

  reviewUpvote(post, original, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    var vote = { _id: Post.newId(), val: 1, by: _.pick(this.user,'_id','name','email') }
    review.votes.push(vote)
    stats = PostsUtil.calcStats(post)
    var {reviews} = post
    Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  },

  reviewDelete(post, original, cb) {
    var review = _.find(post.reviews,(r)=>_.idsEqual(r._id,original._id))
    var reviews = _.without(post.reviews,review)
    var stats = PostsUtil.calcStats(_.extend(post,{reviews}))
    Post.updateSet(post._id, {reviews,stats}, select.cb.statsView(cb))
  },

}

module.exports = _.extend(_.extend(get, getAdmin), _.extend(save,saveReviews))
