import {initAPI} from './_api'
import * as Svc from '../services/bookings'

export default initAPI(Svc, {
  createBooking: (req) => [req.expert,req.body.time,req.body.minutes,req.body.type,req.body.credit,req.body.paymethodId]
})
