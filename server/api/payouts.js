module.exports = require('./_api').initAPI(
  require('../services/payouts')
, {
  getPayouts: (req) => [req.params.userId],
  payoutOrders: (req) => [req.paymethod,req.orders]
}, {}
,
  require('../../shared/validation/billing.js')
)
