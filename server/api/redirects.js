import {initAPI} from './_api'
import * as Svc from '../services/util'

export default initAPI(Svc, {
  getAllRedirects: (req) => [],
  createRedirect: (req) => [req.body],
  deleteRedirectById: (req) => [req.params.id],
})
