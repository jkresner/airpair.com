import {initAPI} from './_api'

export default initAPI(
  require('../services/orders')
, {
  // buyMembership: (req) => [req.body.length,req.body.coupon,req.paymethod],
  getByIdForAdmin: (req) => [req.params.id],
  buyCredit: (req) => [req.body.total,req.body.coupon,req.body.payMethodId],
  buyDeal: (req) => [req.expertshaped,req.body.dealId,req.body.payMethodId],
  giveCredit: (req) => [req.body.toUser,req.body.total,req.body.source],
  getMyOrders: (req) => [],
  getMyOrdersWithCredit: (req) => [req.params.id],
  getOrdersForPayouts: (req) => [],
  getByQueryForAdmin: (req) => [req.params.start,req.params.end,req.params.userId],
  releasePayout: (req) => [req.order],
}, {
  order:'getByIdForAdmin',
  orders: 'getMultipleOrdersById'
},
  require('../../shared/validation/billing.js')
)
