import {initAPI} from './_api'

export default initAPI(
  require('../services/experts')
,{
  getMe: (req) => [],
  getForExpertsPage: (req) => [],
  search: (req) => [req.params.id],
  getMatchesForRequest: (req) => [req.request],
  getMatchesForDashboard: (req) => [],
  updateMatchingStats: (req) => [req.params.id,req.request],
}, {
  'expert':'getById'
})
