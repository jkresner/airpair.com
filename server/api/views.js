import {initAPI} from './_api'
var Svc = require('../services/analytics')

export default initAPI(Svc.views, {
  getByUserId: (req) => [req.params.id]
})
