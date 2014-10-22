import {initAPI} from './_api'
import * as Svc from '../services/bookings'

export default initAPI(Svc, {
	createWithCredit: (req) => [req.expert,req.body.time,req.body.minutes,req.body.type],
	createWithPAYG: (req) => [req.expert,req.body.time,req.body.minutes,req.body.type,req.paymethod]
})
