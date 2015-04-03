import {initAPI} from './_api'

export default initAPI(
  require('../services/bookings')
, {
  getByUserId: (req) => [req.user._id],
  getByIdForAdmin: (req) => [req.params.id],
  getByQueryForAdmin: (req) => [req.params.start,req.params.end,req.params.userId],
  createBooking: (req) => [req.expert,req.body.time,req.body.minutes,req.body.type,req.body.credit,req.body.payMethodId,req.body.request],
  updateByAdmin: (req) => [req.booking,req.body],
  addYouTubeData: (req) => [req.booking, req.body.youTubeId],
  addHangout: (req) => [req.booking, req.body.youTubeId, req.body.youTubeAccount, req.body.hangoutUrl],
  cheatExpertSwap: (req) => [req.booking, req.order, req.request, req.params.id],
}, {
  booking:'getById'
},
  require('../../shared/validation/bookings.js')
)
