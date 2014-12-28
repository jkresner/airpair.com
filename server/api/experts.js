import {initAPI} from './_api'

export default initAPI(
  require('../services/experts')
,{
  getMe: (req) => [],
  getForExpertsPage: (req) => [],
  search: (req) => [req.params.id],
  getMatchesForRequest: (req) => [req.request],
  updateMatchingStats: (req) => [req.params.id],
}, {
  'expert':'getById'
})
