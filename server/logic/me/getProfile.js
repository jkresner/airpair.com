module.exports = (DAL, {Project,Query,Opts}, DRY) => ({


  validate() {},


  exec(cb) {
    cb(null, this.user)
  },


  project: Project.profile


})



