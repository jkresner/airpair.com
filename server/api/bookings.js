import {initAPI} from './_api'

export default initAPI(
  require('../services/bookings')
, {
  getByUserId: (req) => [req.params.id],
  getByQueryForAdmin: (req) => [req.params.start,req.params.end,req.params.userId],
  createBooking: (req) => [req.expert,req.body.time,req.body.minutes,req.body.type,req.body.credit,req.body.payMethodId,req.body.request],
  updateByAdmin: (req) => [req.booking,req.body]
}, {
  booking:'getById'
},
  require('../../shared/validation/bookings.js')
)
