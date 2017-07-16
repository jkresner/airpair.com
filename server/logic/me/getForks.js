module.exports = ({Post}, {Project,Query,Opts}, DRY) => ({


  validate(user) { },


  exec(arg, cb) {
    if (!cb) cb = arg
    var {_id} = this.user
    // all posts where the user is a forker
    Post.getManyByQuery(Query.forked(_id), Opts.forks, (e, my) => {
      cb(e, e ? null : assign({my, userId:_id}) )
      // var opts = assign({limit:Opts.suggests.limit}, Opts.forks)
      // Post.getManyByQuery(Query.inReview({exclude:my}), opts, (ee, suggests) =>
        // cb(e||ee, e||ee ? null : Object.assign({my, suggests,userId:this.user._id}) )
      // )
    })
  },


  project: Project.forks


})



