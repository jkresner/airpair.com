import {initAPI} from './_api'
import * as Svc from '../services/orders'

export default initAPI(Svc, {
	createMembership: (req) => [req.body.length,req.body.coupon,req.paymethod],
})
