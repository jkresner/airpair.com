import {initAPI} from './_api'
import * as Svc from '../services/orders'

export default initAPI(Svc, {
	buyMembership: (req) => [req.body.length,req.body.coupon,req.paymethod],
	buyCredit: (req) => [req.body.total,req.body.coupon,req.paymethod],
})
