module.exports = (DAL, Data, {role,getSetStats}) => ({


  validate(user, post) {
    // $log('valid.getCollaboartaions', user._id, post.by, author)
    if (!role.author(user, post)) return `Post[${post._id}] belongs to another author`
  },


  // analytics.track(this.user, this.sessionID, 'getPullRequests', {slug:post.slug},null,()=>{})
  exec(post, done) {
    // var {reviews} = post
    var {user} = this
    var repo = post.slug

    cache.get(`postprs_${post.slug}`,
      (cb) => Wrappers.GitPublisher.getPullRequests(user, repo, {}, cb),
      (e, PRs) => done(e,
        e ? null : assign(post, {PRs, stats:getSetStats(post, PRs)})
      ))

  },


  project: Data.Project.collab


})

