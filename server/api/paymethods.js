import {initAPI} from './_api'

export default initAPI(
  require('../services/paymethods')
, {
  addPaymethod: (req) => [req.body],
  deletePaymethod: (req) => [req.paymethod],
  getMyPaymethods: (req) => [],
  getMyPayoutmethods: (req) => [],
  getUserPaymethodsByAdmin: (req) => [req.params.id],
}, {
  'paymethod':'getById'
},
  require('../../shared/validation/billing.js')
)
