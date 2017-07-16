module.exports = ({Post}, {Project,Opts,Query}, DRY) => ({


  validate(user, post) {
    if (!(post.history||{}).submitted) return `Post not yet submitted for review`
  },


  exec(post, cb) {
    DRY.postSubscribedUsers(post, cb)
  },

  
  project: Project.displayReview


})
