import {initAPI} from './_api'
import * as Svc from '../services/users'


export default initAPI(Svc, {
  getSessionByUserId: (req) => [],
  getSessionLite: (req) => [],
  toggleUserInRole: (req) => [req.params.id,req.params.role]
})
