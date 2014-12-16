import {initAPI} from './_api'
import * as Svc from '../services/requests'

export default initAPI(Svc, {
  getByIdForAdmin: (req) => [req.params.id],
  getByUserId: (req) => [req.params.id],
  getMyRequests: (req) => [],
})
