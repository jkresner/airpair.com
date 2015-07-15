import {initAPI} from './_api'

export default initAPI(
  require('../services/chats')
,{
  inviteToTeam: (req) => [req.params.userId],
  syncIMs: (req) => []
}, {
},
  require('../../shared/validation/chats.js')
)
