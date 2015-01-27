import {initAPI} from './_api'


export default initAPI(
  require('../services/users')
, {
  getSession: (req) => [],
  toggleUserInRole: (req) => [req.params.id,req.params.role],
  toggleTag: (req) => [req.tag],
  updateTags: (req) => [req.body],
  toggleBookmark: (req) => [req.params.type,req.params.id],
  updateBookmarks: (req) => [req.body],
  search: (req) => [req.params.id],
  getUsersInRole: (req) => [req.params.role],
  changeName: (req) => [req.body.name],
  changeEmail: (req) => [req.body.email],
  changeBio: (req) => [req.body.bio],
  changeInitials: (req) => [req.body.initials],
  changeUsername: (req) => [req.body.username],
  verifyEmail: (req) => [req.body.hash],
  requestPasswordChange: (req) => [req.body.email],
  changePassword: (req) => [req.body.hash, req.body.password],
  changeLocationTimezone: (req) => [req.body],
}, {

},
  require('../../shared/validation/users.js')
)
