module.exports = (DAL, Data, {role,getSetPostStats,getHeadMD}) => ({


  validate(user, post) {
    // $log('val'.yellow, post, user.auth.gh)
    if (!role.authorOrForker(user, post))
      return `Edit your own fork[${user.auth.gh.login}/${post.repo}]. Did you fork the post already?`
  },


  exec(post, cb) {
    post.stats = getSetPostStats(post)

    if (!post.history.submitted)
      return cb(null, {post,headMD:post.md})

    // $log('exec'.yellow, post.history)
    var {user} = this
    var isForker = _.find(post.forkers, f => _.idsEqual(user._id, f.userId)) != null
    var owner = isForker ? user.auth.gh.login : config.wrappers.gitPublisher.org
    post.repo = {
      owner,
      fork: isForker,
      name: post.slug,
      head: `https://www.github.com/${owner}/${post.slug}/blob/edit/post.md`
    }

    // $log('repo', post.repo, user.auth.gh)
    getHeadMD(user, post, (e, headMD) => cb(e, e ? null : {post,headMD}))
  },


  project: Data.Project.edit


})
