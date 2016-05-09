module.exports = ({Post}, {Project,Opts,Query}, Shared, Lib) => ({


  validate(user, postslug, tagslug) {
    //-- post is published
    // if (!post.published) return 'Post not yet published'
  },


  exec(postslug, tagslug, cb) {
    // $log('log.'.yellow, tagslug, postslug)
    var adtag = cache.tagBySlug(tagslug) || {}

    Post.getByQuery(Query.published({slug:postslug}), Opts.published, (e, r) =>
      //-- TODO, consider caching similar posts ?>
      e || !r ? cb(e) : Post.getManyByQuery(
        Query.published({_id:{$ne:r._id},'tags._id':adtag._id || r.tags[0]._id}),
        Opts.publishedNewest(3),
        (ee, similar) => cb(ee, ee ? null : assign(r,{similar},adtag._id?{adtag}:{}))
      )
    )
  },


  project: Project.displayPublished


})
