module.exports = ({Post}, {Project,Opts,Query}, Shared, Lib) => ({


  validate(user, postslug, tagslug) {
    //-- post is published
    // if (!post.published) return 'Post not yet published'
  },


  exec(postslug, tagslug, cb) {
    // $log('SVC.'.yellow, tagslug, postslug, Query.published({slug:postslug}))
    Post.getByQuery(Query.published({slug:postslug}), {}, cb) // Opts.published
      // select.cb.displayView(this.user == null, get.getSimilar, cb)
  },


  project: Project.displayPublished


})
