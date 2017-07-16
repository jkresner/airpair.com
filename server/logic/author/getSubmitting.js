module.exports = ({Post}, Data, {role,TypesUtil}) => ({


  validate(user, post, slug) {

    if (!role.author(user, post))
      return `Post[${post._id}] belongs to another`

    if (post.history.submitted)
      return `Post[${post._id}] previously submitted ${post.history.submitted}`

    if (user.auth.gh.scopes.indexOf("public_repo") == -1)
      return `Token for [${user._id}][${user.auth.gh.username}] Missing valid 'public_repo' scope`

    if (user.auth.gh.scopes.indexOf("user") == -1)
      return `Token for [${user._id}][${user.auth.gh.username}] Missing valid 'user' scope`

    if (slug && !TypesUtil.post.validSlug(slug))
      return `Slug[${slug}] not valid`

    if (slug && slug.length > 50)
      return `Slug[${slug}] too long to be used as a repo name`

    var minwcount = parseInt(config.authoring.wordcount)
    var wcount = honey.util.String.wordcount(post.md)
    if (!post.history.published && wcount < minwcount)
      return `Min ${minwcount} words to submit. [${wcount}] so far!`
  },


  exec(original, slug, cb) {
    if (!slug) slug = TypesUtil.post.defaultSlug(original)
    Post.getByQuery({slug}, { select: 'title slug' }, (ee, fromDb) => {
      assign(original,{slug})
      if (fromDb)
        return cb(null, assign(original, { submission: { valid: false, info:
          `Repo name "${slug}" already taken` } }))

      Wrappers.GitPublisher.checkOrgRepoAvailabiliy('admin', slug, (e, fromGH) => {
        if (e) return cb(e)
        original.submission = { valid: !fromGH.uavailable }
        if (fromGH.unavailable)
          original.submission.info = fromGH.unavailable
        cb(e, original)
      })
    })

  },


  project: Data.Project.submit


})
