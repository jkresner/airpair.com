module.exports = require('./_api').initAPI(
  require('../services/chats')
,{
  inviteToTeam: (req) => [req.params.userId],
  syncIMs: (req) => []
}, {
},
  require('../../shared/validation/chats.js')
)
