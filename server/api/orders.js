import {initAPI} from './_api'
import * as Svc from '../services/orders'

export default initAPI(Svc, {
  // buyMembership: (req) => [req.body.length,req.body.coupon,req.paymethod],
  buyCredit: (req) => [req.body.total,req.body.coupon,req.body.payMethodId],
  giveCredit: (req) => [req.body.toUser,req.body.total,req.body.source],
  getMyOrders: (req) => [],
  getMyOrdersWithCredit: (req) => [req.params.id],
  getByQueryForAdmin: (req) => [req.params.start,req.params.end,req.params.userId]
},
 {}
,
  require('../../shared/validation/billing.js')
)
