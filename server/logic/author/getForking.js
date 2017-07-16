module.exports = (DAL, Data) => ({


  validate(user, post) {
    if (_.idsEqual(user._id, post.by._id))
      return `Cannot fork your own post`

    var scope = _.find(user.auth.gh.scopes, s => s.match('repo'))
    if (!scope)
      return `Missing or invalid repo scope for [${user.auth.gh.login}]`

    // if (!post.github)
      // return `Can not fork post as it has no git repo`

    if (!post.history.submitted)
      return `Cannot fork post[${post.title}] not yet submitted`
  },


  exec(post, cb) {
    post.forking = {
      forkers: post.forkers.length,
      existing: _.find(post.forkers, f => _.idsEqual(f.userId, this.user._id)),
      owner: this.user.auth.gh.login
    }

    cb(null, post)
  },



  project: Data.Project.forking

})



