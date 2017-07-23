module.exports = ({Post}, {Project,Opts,Query}, DRY) => ({


  validate(user, post) {
    var {history} = post
    if (!(history||{}).published && !(history||{}).submitted)
      return `Post not yet submitted for review`
  },


  exec(post, cb) {
    DRY.postSubscribedUsers(post, (e, subscribed) => cb(e, assign({post}, {subscribed})))
  },


  project: Project.displayReview


})
