module.exports = require('./_api').initAPI(
  require('../services/paymethods')
, {
  addPaymethod: (req) => [req.body],
  deletePaymethod: (req) => [req.paymethod],
  getMyPaymethods: (req) => [],
  getUserPaymethodsByAdmin: (req) => [req.params.id]
}, {
  'paymethod':'getById'
},
  require('../../shared/validation/billing.js')
)
