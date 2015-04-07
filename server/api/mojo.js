import {initAPI} from './_api'

export default initAPI(
  require('../services/mojo')
,{
  getMe: (req) => [],
  getForExpertsPage: (req) => [],
  getRanked: (req) => [req.expert,req.query],
  // getMatchesForRequest: (req) => [req.request],
  getMatchesForDashboard: (req) => [],
  updateMatchingStats: (req) => [req.expertshaped,req.request],
}, {
},
  require('../../shared/validation/mojo.js')
)
