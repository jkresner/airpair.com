module.exports = require('./_api').initAPI(
  require('../services/mojo')
,{
  getMe: (req) => [],
  getForExpertsPage: (req) => [],
  getRanked: (req) => [req.expert,req.query],
  getMatchesForDashboard: (req) => [],
  updateMatchingStats: (req) => [req.expertshaped,req.request],
}, {
},
  require('../../shared/validation/mojo.js')
)
