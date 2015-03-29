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
  deleteById: (req) => [req.expert],
}, {
  'expert':'getById'
},
  require('../../shared/validation/experts.js')
)
