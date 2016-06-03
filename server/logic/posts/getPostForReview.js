module.exports = ({Post}, {Project,Opts,Query}, Shared, Lib) => ({


  validate(user, post) {},


  exec(_id, cb) {
    Post.getByQuery({_id,'history.submitted':{$exists:1}}, Opts.inreview, cb)
  },


  project: Project.displayReview


})
