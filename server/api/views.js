import {initAPI} from './_api'
import * as Svc from '../services/views'

export default initAPI(Svc, {
  getByUserId: (req) => [req.params.id]
})
