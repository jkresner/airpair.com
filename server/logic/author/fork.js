module.exports = ({Post}, Data, {getAndUpdateStats}) => ({


  validate(user, original){
    if (_.idsEqual(user._id, original.by._id))
      return `Cannot fork your own post`

    var scope = _.find(user.auth.gh.scopes, s => s.match('repo'))
    if (!scope)
      return `Missing or invalid repo scope for [${user.auth.gh.login}]`

    if (!original.history.submitted)
      return `Cannot fork post[${original.title}] not yet submitted`
  },


  exec(original, cb) {
    var forkers = original.forkers || []
    var {user} = this
    var meta = Shared.touchMeta(original.meta, 'fork', user)

    Wrappers.GitPublisher.addContributor(this.user, null, original.slug, (e, fork) => {
      if (e) return cb(e)

      var { name, email, auth } = user
      var forkerInfo = { userId: user._id, name, email, gh: auth.gh.login, avatar: auth.gh.avatar_url }
      var existing = _.find(forkers, f => _.idsEqual(f.userId, user._id))

      if (!existing)
        forkers.push(forkerInfo)
      else
        assign(existing, forkerInfo)

      var stats = getAndUpdateStats(assign(original,{forkers}))
      Post.updateSet(original._id, {meta,stats,forkers}, cb)
    })
  },


  project: Data.Project.forking


})




  // addForker(post, cb) {
    // cb(V2DeprecatedError('Posts.addForker'))
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
  // }
