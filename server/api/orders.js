module.exports = require('./_api').initAPI(
  require('../services/orders')
, {
  getByIdForAdmin: (req) => [req.params.id],
  buyCredit: (req) => [req.body.total,req.body.coupon,req.body.payMethodId],
  buyDeal: (req) => [req.expertshaped,req.body.dealId,req.body.payMethodId],
  giveCredit: (req) => [req.body.toUser,req.body.total,req.body.source],
  getMyOrders: (req) => [],
  getMyOrdersWithCredit: (req) => [req.params.id],
  getByQueryForAdmin: (req) => [req.params.start,req.params.end,req.params.userId],
  // getMyDealOrdersForExpert: (req) => [req.params.id],
  releasePayout: (req) => [req.order,req.booking],
}, {
  order:'getByIdForAdmin',
  orders: 'getMultipleOrdersById'
},
  require('../../shared/validation/billing.js')
)
