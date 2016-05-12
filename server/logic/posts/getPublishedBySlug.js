module.exports = ({Post,User}, {Project,Opts,Query}, Shared, Lib) => ({


  validate(user, postslug, tagslug) {
    //-- post is published
    // if (!post.published) return 'Post not yet published'
  },


  //-- TODO, consider caching similar posts ?>
  exec(postslug, tagslug, cb) {
    var adtag = cache.tagBySlug(tagslug) || {}
    var opts = assign(Opts.published,{})  //,{join:'subscribed.userId'}
    // $log('log.'.yellow, tagslug.cyan, postslug.white, opts)

    Post.getByQuery(Query.published({slug:postslug}), opts, (e, r) => {
      if (e || !r) return cb(e, r)
      var simQ = Query.published({_id:{$ne:r._id},'tags._id':adtag._id || r.tags[0]._id})
      // $log('simQ'.yellow, simQ, Opts.publishedNewest(3))
      Post.getManyByQuery(simQ, Opts.publishedNewest(3), (ee, similar) => {
        if (ee) return cb(ee)
        // $log('similar'.yellow, ee, similar, r.subscribed, !r.subscribed)
        assign(r,{similar},adtag._id?{adtag}:{})
        // $log('similar'.yellow, r)
        if (!r.subscribed || r.subscribed.length == 0) return cb(null, r)
        // $log('similar'.yellow, r.subscribed)
        var uIds = r.subscribed.map(s=>s.userId)
        var select = '_id name email avatar username auth.gh.login photos'
        User.getManyByQuery({_id:{$in:uIds}}, {select}, (eee, users) => {
          // $log('users', eee, users)
          if (eee) return cb(eee)
          var hash = {}
          for (var u of users) hash[u._id] = _.omit(u, '_id')
          r.subscribed = r.subscribed.map(s=>assign(s,hash[s.userId]))
          cb(null, r)
        })
      })
    })
  },


  project: Project.displayPublished


})
