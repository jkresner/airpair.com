module.exports = require('./_api').initAPI(
  require('../services/users')
, {
  search: (req) => [req.params.id],
  getSession: (req) => [],
  updateTags: (req) => [req.body],
  changeName: (req) => [req.body.name],
  changeEmail: (req) => [req.body.email],
  changeBio: (req) => [req.body.bio],
  changeInitials: (req) => [req.body.initials],
  changeUsername: (req) => [req.body.username],
  verifyEmail: (req) => [req.body.hash],
  requestPasswordChange: (req) => [req.body.email],
  changePassword: (req) => [req.body.hash, req.body.password],
  changeLocationTimezone: (req) => [req.body],

  toggleBookmark: (req) => [req.params.type,req.params.id],
  updateBookmarks: (req) => [req.body],
  toggleTag: (req) => [req.tag],
  getUsersInRole: (req) => [req.params.role],
  getSiteNotifications: (req) => [],
  toggleSiteNotification: (req) => [req.body.name],
  getProviderScopes: (req) => [],
}, {

},
  require('../../shared/validation/users.js')
)
