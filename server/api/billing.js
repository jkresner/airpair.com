import {initAPI} from './_api'
import * as Svc from '../services/billing'

export default initAPI(Svc, {
  addPaymethod: (req) => [req.body],
  deletePaymethod: (req) => [req.params.id],
  getMyPaymethods: (req) => []
})
