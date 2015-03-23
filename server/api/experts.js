import {initAPI} from './_api'

export default initAPI(
  require('../services/experts')
,{
  getMe: (req) => [],
  search: (req) => [req.params.id],
  getNewForAdmin: (req) => [],
  create: (req) => [req.body],
  updateMe: (req) => [req.expert,req.body]
}, {
  'expert':'getById'
},
  require('../../shared/validation/experts.js')
)
