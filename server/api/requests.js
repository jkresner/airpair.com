import {initAPI} from './_api'
import * as Svc from '../services/requests'

export default initAPI(Svc, {
  getByUserId: (req) => [req.params.id],
  getMyRequests: (req) => [],
})
