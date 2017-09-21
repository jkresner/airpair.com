module.exports = ({Post}, Data, DRY) => ({


  validate(user, original) {
    if (_.idsEqual(user._id, original.by._id))
      return `Cannot fork your own post`

    var scope = _.find(user.auth.gh.scopes, s => s.match('repo'))
    if (!scope)
      return `Missing or invalid repo scope for [${user.auth.gh.login}]`

    if (!original.history.submitted)
      return `Cannot fork post[${original.title}] not yet submitted`
  },


  exec(original, cb) {
    let forkers = original.forkers || []
    let {user} = this
    let log = DRY.logAct(original, 'fork', user)

    Wrappers.GitPublisher.addContributor(user, null, original.slug, (e, fork) => {
      if (e) return cb(e)

      let { name, email, auth } = user
      let forkerInfo = { userId: user._id, name, email, gh: auth.gh.login, avatar: auth.gh.avatar_url }
      let existing = _.find(forkers, f => _.idsEqual(f.userId, user._id))

      if (!existing)
        forkers.push(forkerInfo)
      else
        assign(existing, forkerInfo)

      let stats = DRY.getAndUpdateStats(assign(original,{forkers}))
      Post.updateSet(original._id, {log,stats,forkers}, cb)
    })
  },


  project: Data.Project.forking


})
