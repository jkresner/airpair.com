import {initAPI} from './_api'
import * as Svc from '../services/users'


export default initAPI(Svc, {
  getSession: (req) => [],
  getSessionFull: (req) => [],
  toggleUserInRole: (req) => [req.params.id,req.params.role],
  toggleTag: (req) => [req.tag],
  getUsersInRole: (req) => [req.params.role]
})
