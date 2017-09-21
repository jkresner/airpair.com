module.exports = ({Post}, Data, {logAct,role}) => ({


  validate(user, original) {
    var isEditor = role.editor(user)
    if (!role.author(user) && !isEditor)
      return `Not authorized`
    if (original.published && !isEditor)
      return `Only editors can update published posts`
  },


  exec(original, cb) {
    let {org} = config.wrappers.gitPublisher
    let log = logAct(original, 'syncHEAD', this.user)
    Wrappers.GitPublisher.getFile(this.user, org, original.slug, "/post.md", 'edit', (e, head) => {
      if (e) return cb(e)
      var commit = head.sha
      var md = head.string
      var publishedCommit = commit
      // if (original.published) {
      //   var publishHistory = post.publishHistory || []
      //   publishHistory.push({
      //     commit, touch: svc.newTouch.call(this, 'publish')})
      //   var publishedBy = _.pick(this.user, '_id', 'name', 'email')
      //   var publishedUpdated = new Date()
      // }
      Post.updateSet(original._id, {log,md,publishedCommit}, cb)
    })
  },


  project: Data.Project.edit


})

