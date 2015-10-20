module.exports = require('./_api').initAPI(
  require('../services/experts')
,{

  getMe: (req) => [],
  search: (req) => [req.params.id],
  getByIdForAdmin: (req) => [req.params.id],
  getNewForAdmin: (req) => [],
  getActiveForAdmin: (req) => [],
  getHistory: (req) => [req.expertshaped],
  create: (req) => [req.body],
  updateMe: (req) => [req.expertshaped,req.body],
  updateAvailability: (req) => [req.expertshaped,req.body.availability],
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
