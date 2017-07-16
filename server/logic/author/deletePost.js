module.exports = (DAL, Data, {role}) => ({


  validate(user, original)
  {
    if (!role.authorOrEditor(user,original))
      return `Post[${original._id}] must be deleted by owner`

    if (role.author(user,original) && original.history.published)
      return `Must be editor to delete a published post`

    if (role.author(user,original) && original.history.submitted)
      return `Submitted Post[${original._id}] must be deleted by an editor`

  },


  exec(original, cb) {
    DAL.Post.delete(original, cb)
  }


})



