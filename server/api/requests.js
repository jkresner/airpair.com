import {initAPI} from './_api'

export default initAPI(
  require('../services/requests')
,{
  getByIdForUser: (req) => [req.params.id],
  getByIdForAdmin: (req) => [req.params.id],
  getByUserId: (req) => [req.params.id],
  getByIdForReview: (req) => [req.params.id],
  getMy: (req) => [],
  getRequestForBookingExpert: (req) => [req.params.id,req.params.expertId],
  updateByCustomer: (req) => [req.request,req.body],
  replyByExpert: (req) => [req.request,req.expert,req.body]
}, {
  request:'getByIdForAdmin'
},
  require('../../shared/validation/requests.js')
)
