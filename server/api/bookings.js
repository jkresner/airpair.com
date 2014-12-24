import {initAPI} from './_api'
import * as Svc from '../services/bookings'

export default initAPI(Svc, {
  getByUserId: (req) => [req.params.id],
  getByDateRangeForAdmin: (req) => [req.params.start,req.params.end],
  createBooking: (req) => [req.expert,req.body.time,req.body.minutes,req.body.type,req.body.credit,req.body.payMethodId,req.body.request]
})
