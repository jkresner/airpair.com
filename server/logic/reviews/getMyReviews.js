module.exports = ({Post}, {Project,Query,Opts}, DRY) => ({


  validate(user) { },


  exec(cb) {
    // Post.getManyByQuery(Query.reviewedBy(this.user._id), Opts.reviewed, (e,my) =>{
    //   Post.getManyByQuery(Query.inReview({exclude:my}), Opts.inreview, (ee, suggests) => {
    //     cb(e||ee, e||ee ? null : Object.assign({my, suggests,userId:this.user._id}) )
    //   })
    // })
  },


  project: Project.reviewed


})



