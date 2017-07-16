module.exports = (DAL, {Project,Opts,Query}, {role}) => ({


  validate(user, post) {
    if (!(post.history||{}).submitted) return `Post not yet submitted for review`
    if (!role.author(user, post)) return `Post not yet submitted for review`
  },


  exec(post, cb) {
    delete post.history.published
    var uIds = post.subscribed.map(s=>s.userId)
    var opts = { select: '_id name email avatar username auth.gh.login photos' }
    DAL.User.getManyByQuery({_id:{$in:uIds}}, opts, (e, users) => {
      cb(null, {post,users})
    })
  },


  project: Project.displayReview


})
