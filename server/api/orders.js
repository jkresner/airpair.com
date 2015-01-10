import {initAPI} from './_api'

export default initAPI(
  require('../services/orders')
, {
  // buyMembership: (req) => [req.body.length,req.body.coupon,req.paymethod],
  getByIdForAdmin: (req) => [req.params.id],
  buyCredit: (req) => [req.body.total,req.body.coupon,req.body.payMethodId],
  giveCredit: (req) => [req.body.toUser,req.body.total,req.body.source],
  getMyOrders: (req) => [],
  getMyOrdersWithCredit: (req) => [req.params.id],
  getOrdersToPayout: (req) => [req.expert],
  getByQueryForAdmin: (req) => [req.params.start,req.params.end,req.params.userId],
  releasePayout: (req) => [req.order],
}, {
  order:'getByIdForAdmin',
},
  require('../../shared/validation/billing.js')
)
