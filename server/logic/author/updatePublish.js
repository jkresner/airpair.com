module.exports = (DAL, Data, DRY) => ({

  validate(user, post, publishData)
  {
    // var isEditor = _.contains(user.roles, 'editor')
    // var isAdmin =  _.contains(user.roles, 'admin')
    // var isOwner = _.idsEqual(post.by._id, user._id)

    // if (!isEditor && !isAdmin && !isOwner)
    //   return `Cannot publish post not belonging to you`
    // if (!isEditor && post.reviews < 3)
    //   return `Must have at least 3 reviews to be published`

    // if (!_.idsEqual(post.by.userId, publishData.by.userId) &&
    //   !isAdmin)
    //   return `Only admins can change post authors`

    // if (!post.submitted)
    //   return `Post must be submitted for review before being published`
    // // if (!post.publishedCommit)
    //   // return `Post must have propogated commit to be published`
    // // if (post.published && !publishedOverride)
    // //   return `Post already published...`
    // if (!post.slug)
    //   return `Post must have a slug to be published`
    // if (!validSlug(post.slug))
    //   return `${post.slug} not a valid post slug to publish`

    // if (!publishData.tmpl)
    //   return `Post template name must be provided`
    // if (!publishData.meta)
    //   return `Post meta data required`
    // if (!publishData.meta.title ||
    //     !publishData.meta.canonical ||
    //     !publishData.meta.description)
    //   return `Post meta title, canonical & description required`
    // if (!publishData.meta.ogTitle ||
    //     !publishData.meta.ogImage ||
    //     !publishData.meta.ogDescription)
    //   return `Post open graph title, image & description required`
    // if (publishData.meta.ogImage.indexOf('https://') != 0)
    //   return `Open graph image & asset url must be fully qualified https:// url`
  },


  exec(post, publishData, cb) {
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

    // updateWithEditTouch.call(this, post, 'publish', cb)
    // if (cache) cache.flush('posts')

    // if (publishData.publishedOverride)
    //   pairbot.sendPostSynced(post)
    // else
    //   pairbot.sendPostPublished(post)
    $log('Queue.postPublish'.magenta, post.title, 'nothing impl yet')
  },

  project: Data.Project.library

})



