module.exports = ({Post}, {Project,Query,Opts}, DRY) => ({


  // validate() {},


  exec(cb) {
    var {_id} = this.user
    Post.getManyByQuery(Query.published(_id), Opts.published,
      (e, posts) => cb(e, e?null:{posts})
    )
  },


  project: Project.published


})



