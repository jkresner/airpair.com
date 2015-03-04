import {initAPI} from './_api'

export default initAPI(
  require('../services/experts')
,{
  getMe: (req) => [],
  getForExpertsPage: (req) => [],
  search: (req) => [req.params.id],
  getMatchesForRequest: (req) => [req.request],
  getMatchesForDashboard: (req) => [],
  create: (req) => [req.body],
  updateMe: (req) => [req.expert,req.body],
  updateMatchingStats: (req) => [req.params.id,req.request],
}, {
  'expert':'getById'
},
  require('../../shared/validation/experts.js')
)
