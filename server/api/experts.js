import {initAPI} from './_api'

export default initAPI(
  require('../services/experts')
,{

  getMe: (req) => [],
  search: (req) => [req.params.id],
  getByIdForAdmin: (req) => [req.params.id],
  getNewForAdmin: (req) => [],
  getActiveForAdmin: (req) => [],
  getHistory: (req) => [req.expert],
  create: (req) => [req.body],
  updateMe: (req) => [req.expert,req.body],
  updateAvailability: (req) => [req.expert,req.body.availability],
  deleteById: (req) => [req.expert],

  getByDeal: (req) => [req.params.id],
  createDeal: (req) => [req.expert, req.body],
  expireDeal: (req) => [req.expert, req.params.dealId, req.body.expiry],
  addNote: (req) => [req.expert, req.body.body],

}, {
  'expertshaped':'getById',
  'expert':'getByIdForAdmin',
  'deal':'getByDeal',
},
  require('../../shared/validation/experts.js')
)
