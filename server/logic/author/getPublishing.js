module.exports = (DAL, Data, {role}) => ({

  validate(user, original) {
    if (!role.authorOrEditor(user, original))
      return `Post[${original._id}] publishing only available to owner`
  },


  exec(original, cb) {
    // ExpertSvc.getByQuery({userId:post.by.userId}, (e, expert) => {
    //   if (expert) {
    //     post.by.expertId = expert._id
    //     post.by.username = expert.username
    //   }
    //   if (!post.tmpl)
    //     post.tmpl = 'default'

    //   if (!post.meta || !post.meta.canonical)
    //   {
    //     var primarytag = _.find(post.tags,(t) => t.sort==0 || post.tags[0])
    //     post.meta = post.meta || {}
    //     post.meta.canonical = `/${primarytag.slug}/posts/${post.slug}`
    //   }

    //   if (!post.github) return cb(null, post)

    //   github2.getFile('admin', org, post.slug, "/post.md", 'edit', (ee, head) => {
    //     if (!ee && head.string)
    //       post.mdHEAD = head.string
    //     cb(ee, post)
    //   })
    // })
    cb(null, original)
  },

  project: Data.Project.publishing

})



// publish(user, post, publishData)
//   {
//     var isEditor = _.contains(user.roles, 'editor')
//     var isAdmin =  _.contains(user.roles, 'admin')
//     var isOwner = _.idsEqual(post.by.userId, user._id)

//     if (!isEditor && !isAdmin && !isOwner)
//       return `Cannot publish post not belonging to you`
//     if (!isEditor && post.reviews < 3)
//       return `Must have at least 3 reviews to be published`

//     if (!_.idsEqual(post.by.userId, publishData.by.userId) &&
//       !isAdmin)
//       return `Only admins can change post authors`

//     if (!post.submitted)
//       return `Post must be submitted for review before being published`
//     // if (!post.publishedCommit)
//       // return `Post must have propogated commit to be published`
//     // if (post.published && !publishedOverride)
//     //   return `Post already published...`
//     if (!post.slug)
//       return `Post must have a slug to be published`
//     if (!validSlug(post.slug))
//       return `${post.slug} not a valid post slug to publish`

//     if (!publishData.tmpl)
//       return `Post template name must be provided`
//     if (!publishData.htmlHead)
//       return `Post meta data required`
//     if (!publishData.htmlHead.title ||
//         !publishData.htmlHead.canonical ||
//         !publishData.htmlHead.description)
//       return `Post meta title, canonical & description required`
//     if (!publishData.htmlHead.ogTitle ||
//         !publishData.htmlHead.ogImage ||
//         !publishData.htmlHead.ogDescription)
//       return `Post open graph title, image & description required`
//     if (publishData.htmlHead.ogImage.indexOf('https://') != 0)
//       return `Open graph image & asset url must be fully qualified https:// url`
//   },
