module.exports = ({Post}, Data, {logAct,role,getSetPostStats}) => ({


  validate(user, original, update) {
    if (!role.authorOrForker(user, original))
      return `Post[${original._id}] markdown edit fail. Did you <a href="forks/${original._id}">fork</a> ${original.title} already?`

    if (!original.history.submitted && !role.author(user,original))
      return `Update markdown of draft fail. Post [${original.title}] not authored by you`

     // if (!user.social || !user.social.gh)
        // return `User must authorize GitHub to update post markdown in git repo`


    if (!update.md || update.md == '')
      return `Post markdown edit fail. Markdown empty...`

    if (original.history.submitted &&
         (!update.commitMessage || update.commitMessage == ''))
      return `Commit Message required`
  },


  exec(original, update, cb) {
    let {commitMessage} = update
    let {_id} = original
    let {user} = this
    let repo = null

    let done = (e, post) => e ? cb(e) : cb(null, {post,repo,headMD:update.md})

    if (!original.history.submitted) {
      let stats = assign(original.stats||{}, getSetPostStats(update))
      let log = logAct(original, 'editDraft', user)
      return Post.updateSet(_id, {md:update.md,log,stats}, done)
    }

    var isAuthor = role.author(user, original)
    var owner = isAuthor ? global.config.wrappers.gitPublisher.org
                             : user.auth.gh.login

    repo = { owner, fork:!isAuthor, name:original.slug,
      head:`https://github.com/${owner}/${original.slug}/blob/edit/post.md` }

    Wrappers.GitPublisher.updateFile(user, owner, original.slug, 'post.md', 'edit', update.md, commitMessage, (ee, r) => {
      if (ee) return cb(ee)

      var ups = {}
      if (isAuthor)
      {
        if (!original.history.published) {
          ups.md = update.md
          ups.stats = assign(original.stats, getSetStats(update))
          // ups.publishedCommit = result.commit
          ups.log = logAct(original, 'edit:inReview', user)
        } else
          ups.log = logAct(original, 'edit:HEAD', user)

      }
      else
        ups.log = logAct(original, 'edit:fork', user)

      Post.updateSet(_id, ups, done)
    })
  },


  project: Data.Project.edit

})

