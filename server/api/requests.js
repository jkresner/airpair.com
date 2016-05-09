module.exports = require('./_api').initAPI(
  require('../services/requests')
,{
  getAllowed: (req) => [],
  getByIdForUser: (req) => [req.params.id],
  getByIdForAdmin: (req) => [req.params.id],
  getActiveForAdmin: (req) => [],
  get2015ForAdmin: (req) => [],
  getByIdForMatchmaker: (req) => [req.params.id],
  // getWaitingForMatchmaker: (req) => [],
  getIncompleteForAdmin: (req) => [],
  getByUserIdForAdmin: (req) => [req.params.id],
  getByIdForReview: (req) => [req.params.id],
  getMy: (req) => [],
  getRequestForBookingExpert: (req) => [req.params.id,req.expertshaped],
  sendVerifyEmailByCustomer: (req) => [req.request,req.body.email],
  updateByCustomer: (req) => [req.request,req.body],
  updateByAdmin: (req) => [req.request,req.body],
  farmByAdmin: (req) => [req.request,req.body.tweet],
  sendMessageByAdmin: (req) => [req.request,req.body],
  addSuggestion: (req) => [req.request,req.expertshaped,req.body.msg],
  // groupSuggest: (req) => [req.request,req.tag],
  removeSuggestion: (req) => [req.request,req.expert],
  deleteById: (req) => [req.request],
}, {
  request:'getByIdForAdmin',
  job:'getByIdForReview'
},
  require('../../shared/validation/requests.js')
)
