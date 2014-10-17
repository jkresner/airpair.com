import {initAPI} from './_api'
import * as Svc from '../services/billing'

export default initAPI(Svc, {
  createPaymethod: (req) => [],
  deletePaymethod: (req) => [req.params.id],
  getMyPaymethods: (req) => []
})
