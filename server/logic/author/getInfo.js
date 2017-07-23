module.exports = (DAL, Data, {role}) => ({


  validate(user, post) {
    if (!role.authorOrEditor(user,post))
      return 'Update by owner only'
  },


  exec(post, cb) {
    cb(null, post)
  },


  project: Data.Project.info


})



