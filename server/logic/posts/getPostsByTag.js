module.exports = ({Post}, {Project,Opts,Query}, Shared, Lib) => ({


  // validate(user, tag) {},


  exec(tag, cb) {
    var q = Query.published({'tags._id': tag._id})
    Post.getManyByQuery(q, Opts.publishedNewest(), cb)
  },


  project: Project.tileList


})
