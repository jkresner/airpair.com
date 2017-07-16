module.exports = ({Post}, {Project,Opts,Query}, DRY) => ({

  
  exec(cb) {
    Post.getManyByQuery(Query.submitted(), Opts.submitted(12), cb)
  },


  project: Project.submitted


})
