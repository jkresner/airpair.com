var roles = {


  author(user, post) {
    return _.idsEqual(user._id, post.by._id)
  },


  editor(user) {
    return _.contains(user.roles, 'editor')
  },


  forker(user) {
    return _.contains(user.roles, 'editor')
  },


  authorOrEditor(user, post) {
    return roles.author(user,post) || roles.editor(user)
  },


  authorOrForker(user, post) {
    return roles.author(user,post) || roles.forker(user)
  }

}



module.exports = roles
