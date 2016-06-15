module.exports = ({Post}, {Project,Opts,Query}, Shared, Lib) => ({


  validate(user) {},


  exec(cb) {
    Post.getManyByQuery(Query.submitted(), Opts.submitted(12), cb)
  },


  project: Project.submitted


})
