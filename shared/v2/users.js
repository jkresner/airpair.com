// var validRoles = [
//     'admin',       // Get access to all admin backend app
//     'dev',         // Get application error notification
//     'spinner',     // Get bookings emails
//     'pipeliner',   // Get pipeline emails
//     'editor',      // Can publish posts
//     'reviewer',    // Can see unpublished posts
//     'matchmaker']  // Can make suggestions + schedule times


var validateEmail = (email) =>
{
  if (!email || !email.match(/.+@.+\.+.+/))
    return "Invalid email address"
}

module.exports = {

  changeName(user, name) {
    if (!name) return "Name required"
    if (name.indexOf(' ')==-1) return "Full name (e.g. 'John Smith') required"
  },

  changeEmail(user, email) {
    return validateEmail(email)
  },

  // localLogin: (user) =>
  // {
  //   if (user && user._id)
  //     return `Cannot login. Already signed in as ${user.name}. Logout first?`
  // },
  // localSignup: (user, email, name, password) =>
  // {
  //   if (user && user._id)
  //     return `Cannot signup. Already signed in as ${user.name}. Logout first?`
  //   if (!email || !email.match(/.+@.+\.+.+/))
  //     return `Email address required`
  //   if (!name)
  //     return `Name required`
  //   if (!password)
  //     return `Password required`
  // },
  //,
  // googleLogin: (user, email, name) =>
  // {
  //   if (user && user._id)
  //     return `Cannot login. Already signed in as ${user.name}. Logout first?`
  //   if (!email || !email.match(/.+@.+\.+.+/))
  //     return `Invalid email address`
  // },
  // fullUpdatedCohort(user) {
  // },

  changeUsername(user, username) {
    //-- Can set the username to nothing
  },

  changeInitials(user, initials) {
    //-- Can set the username to nothing
  },

  changeBio(user, bio) {
    //-- Can set the username to nothing
  },

  changeLocationTimezone(user, locationData) {
    if (!locationData) return "locationData required"
    if (!locationData.geometry || !locationData.geometry.location)
      return "locationData geometry required"
    if (!locationData.formatted_address) return "locationData address required"
  },

  requestPasswordChange(user, email) {
    return validateEmail(email)
  },

  changePassword(user, hash, password) {
    if (!password || !password.match(/.{5,40}/))
      return "Invalid password (need min 5, max 40 chars)"
    if (!hash || hash.match(/\s/))
      return "Invalid hash"
  },

  // toggleUserInRole(user, userId, role) {
  //   if (!userId) return "userId required"

  //   if (!_.contains(validRoles, role))
  //     return `${role} is not a valid role`

  //   var isAdmin = _.contains(user.roles, 'admin')
  //   if (!isAdmin && !isExpert) return "Can only toggle role if admin"
  // },

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

  // toggleSiteNotification(user, name) {
  //   if (!name) return "site notification name required"
  //   if (name != 'hello') return `${name} unknown site notification`
  // },

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
