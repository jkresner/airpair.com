import {initAPI} from './_api'


export default initAPI(
  require('../services/workshops')
, {
  getBySlug: (req) => [req.params.id]
}, {
  'workshop':'getBySlug'
})
