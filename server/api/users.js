import {initAPI} from './_api'
import * as Svc from '../services/users'

export default initAPI(Svc, {
  getSessionFull: (req) => [],
  toggleUserInRole: (req) => [req.params.id,req.params.role],
  toggleTag: (req) => [req.tag],
  toggleBookmark: (req) => [req.params.type,req.params.id],
  getUsersInRole: (req) => [req.params.role],
  changeEmail: (req) => [req.body.email],
  verifyEmail: (req) => [req.body.hash],
  requestPasswordChange: (req) => [req.body.email],
  changePassword: (req) => [req.body.hash, req.body.password],
  updateProfile: (req) => [req.body.name, req.body.initials, req.body.username],
  tags: (req) => [req.body],
  bookmarks: (req) => [req.body]
})
