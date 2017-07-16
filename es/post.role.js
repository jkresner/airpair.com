function author(user, post) {
  if (!(user||{})._id) return undefined
  if (!(post.by||{})._id) return undefined

  return user._id.toString() == post.by._id.toString()
}


function editor(user) {
  if (!(user||{}).roles) return undefined
  if (!user.roles.length) return undefined
  return user.roles.indexOf('editor') != -1
}


function forker(user, post) {
  if (!(post||{}).forkers) return undefined
  if (!user.forkers.length) return undefined

  return post.forkers.map(f=>f.userId.toString)
                     .indexOf(user._id.toString()) != -1
}


function authorOrEditor(user, post) {
  if (editor(user)) return true
  if (author(user,post)) return true
  return false
}



function authorOrForker(user, post) {
  if (author(user,post)) return true
  if (forker(user,post)) return true
  return false
}



module.exports = {
  author: author,
  editor: editor,
  forker: forker,
  authorOrEditor: authorOrEditor,
  authorOrForker: authorOrForker
}
