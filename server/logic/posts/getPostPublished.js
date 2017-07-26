module.exports = ({Post,User}, {Project,Opts,Query}, DRY) => ({


  validate(user, url) {
    //-- post is published
    // if (!post.published) return 'Post not yet published'
  },


  exec(url, cb) {
    var q = Query.published(Query.byUrl(url))
    Post.getByQuery(q, Opts.published, (e, post) => {
      if (e || !post) return cb(e, post)
      DRY.postSubscribedUsers(post, (ee, subscribed) => {
        // $log('DRY.postSubscribedUsers'.cyan, subscribed)
        if (ee) return cb(ee)
        DRY.similarPosts({post,limit:3}, (eee, similar) =>
          eee ? cb(eee) : cb(null, assign({post,similar,subscribed}))
        )
      })
    })
  },

  //-- Placeholder for showing similar posts to a currently displayed post
  // getSimilar(original, cb) {
  //   var tagId = original.primarytag._id
  //   var options = Object.assign({ select: select.list }, opts.publishedNewest(3))
  //   Post.getManyByQuery(query.published({'tags._id':tagId}), options, select.cb.addUrl(cb))
  // },

  //-- TODO, consider caching similar posts ?>
  // exec(url, cb) {
  //   var opts = assign(Opts.published,{})  //,{join:'subscribed.userId'}
  //   // console.log('url'.yellow, url)
  //   var match = new RegExp(`${url.replace(/\+\+/g,'\\+\\+').split('?')[0]}$`, 'i')

  //   Post.getByQuery(Query.published({'htmlHead.canonical':match}), opts, (e, r) => {
  //     if (e || !r) return cb(e, r)
  //     var adtag = cache['tags'][r.tags[0]._id]
  //     var simQ = Query.published({_id:{$ne:r._id},'tags._id':adtag._id})
  //     // $log('simQ'.yellow, simQ, Opts.publishedNewest(3))
  //     Post.getManyByQuery(simQ, Opts.publishedNewest(3), (ee, similar) => {
  //       if (ee) return cb(ee)
  //       // $log('similar'.yellow, ee, similar, r.subscribed, !r.subscribed)
  //       assign(r,{similar,adtag})
  //       // $log('similar'.yellow, r)
  //       if (!r.subscribed || r.subscribed.length == 0) return cb(null, r)
  //       // $log('similar'.yellow, r.subscribed)
  //       var uIds = r.subscribed.map(s=>s.userId)
  //       var select = '_id name email avatar username auth.gh.login photos'
  //       User.getManyByQuery({_id:{$in:uIds}}, {select}, (eee, users) => {
  //         // $log('users', eee, users)
  //         if (eee) return cb(eee)
  //         var hash = {}
  //         for (var u of users) hash[u._id] = _.omit(u, '_id')
  //         r.subscribed = r.subscribed.map(s=>assign(s,hash[s.userId]))
  //         cb(null, r)
  //       })
  //     })
  //   })
  // },


  project: Project.displayPublished


})
