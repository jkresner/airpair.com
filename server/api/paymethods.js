import {initAPI} from './_api'
import * as Svc from '../services/paymethods'

export default initAPI(Svc, {
  addPaymethod: (req) => [req.body],
  deletePaymethod: (req) => [req.paymethod],
  getMyPaymethods: (req) => [],
  getUserPaymethodsByAdmin: (req) => [req.params.id],
}, {
  'paymethod':'getById'
},
  require('../../shared/validation/billing.js')
)
