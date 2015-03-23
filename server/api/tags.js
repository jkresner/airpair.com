import {initAPI} from './_api'

export default initAPI(
  require('../services/tags')
,{
  search: (req) => [req.params.id],
  getAllForCache: (req) => [],
  getBySlug: (req) => [req.params.slug]
}, {
  'tag':'getBySlug'
})
