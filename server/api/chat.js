import {initAPI} from './_api'

export default initAPI(
  require('../services/chats')
,{
  inviteToTeam: (req) => [req.params.userId],
}, {
},
  require('../../shared/validation/chats.js')
)
