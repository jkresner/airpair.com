module.exports = {

  toggleTag(user, tag) {
    if (!tag) return "tag required"
    if (!tag._id) return "tag id required"
    if (!tag.name) return "tag name required"
  },

  updateTags(user, tags) {
    if (!tags || tags.constructor !== Array) return "tags array required to sort"
  },

  toggleBookmark(user, type, id) {
    if (!id) return "bookmark id required"
    if (!type) return "bookmark type required"
  },

  updateBookmarks(user, bookmarks) {
    if (!bookmarks || bookmarks.constructor !== Array) return "bookmarks array required to sort"
  },

  verifyEmail(user, hash) {
    if (!hash) return "email verify hash required"
  },

  // toggleMaillist(user, body) {
  //   var name = body.name
  //   if (!name) return "mail list name required"
  //   if (name != 'AirPair Newsletter' &&
  //     name != 'AirPair Developer Digest' &&
  //     name != 'AirPair Authors' &&
  //     name != 'AirPair Experts'
  //     ) return `${name} unknown mail list`

  //   if (!user) {
  //     var email = body.email
  //     return validateEmail(email)
  //   }
  // },

}
