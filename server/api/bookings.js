module.exports = require('./_api').initAPI(
  require('../services/bookings')
, {
  getByUserId: (req) => [req.user._id],
  getByExpertId: (req) => [req.user],
  getForParticipant: (req) => [req.booking],
  getByIdForAdmin: (req) => [req.params.id],
  getByQueryForAdmin: (req) => [req.params.start,req.params.end,req.params.userId],
  createBooking: (req) => [req.expertshaped,req.body.datetime,req.body.minutes,req.body.type,req.body.credit,req.body.payMethodId,req.body.request,req.body.dealId],

  suggestTime: (req) => [req.booking,req.body.time],
  removeSuggestedTime: (req) => [req.booking,req.body.timeId],
  confirmTime: (req) => [req.booking,req.body.timeId],

  customerFeedback: (req) => [req.booking,req.body.review,req.expert,req.body.expertReview],

  updateByAdmin: (req) => [req.booking,req.body],
  addYouTubeData: (req) => [req.booking, req.body.youTubeId],
  deleteRecording: (req) => [req.booking, req.params.recordingId],
  addHangout: (req) => [req.booking, req.body.youTubeId, req.body.youTubeAccount, req.body.hangoutUrl],
  cheatExpertSwap: (req) => [req.booking, req.order, req.request, req.params.id],
  createChat: (req) => [req.booking, req.body.type, req.body.groupchat],
  associateChat: (req) => [req.booking, req.body.type, req.body.providerId],
  postChatMessage: (req) => [req.booking, req.body],
  addNote: (req) => [req.booking, req.body.body],

}, {
  booking:'getById',
  bookingforparticipant: 'getByIdForParticipant'
},
  require('../../shared/validation/bookings.js')
  ,
  'booking'
)
