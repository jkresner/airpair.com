module.exports = (DAL, Data, {role,getHeadMD}) => ({


  validate(user, post) {
    if (!role.authorOrForker(user, post))
      return `<a href="/forks/${post._id}">Fork</a> ${original.title}`

    if (!post.tags || post.tags.length == 0)
      return `Post[${post._id}] must have tags`
  },


  exec(post, cb) {
    getHeadMD(this.user, post, (e, headMD) => {
      post.headMD = headMD
      cb(e, post)
    })
  },


  project: Data.Project.previewable


})



