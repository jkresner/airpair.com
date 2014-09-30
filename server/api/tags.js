import {initAPI} from './_api'
import * as Svc from '../services/tags'


export default initAPI(Svc, {
  search: (req) => [req.params.id],
  getBySlug: (req) => [req.params.slug]
}, {
  'tag':'getBySlug'
})
