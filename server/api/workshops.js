import {initAPI} from './_api'
import * as Svc from '../services/workshops'


export default initAPI(Svc, {
  getBySlug: (req) => [req.params.id]
})
