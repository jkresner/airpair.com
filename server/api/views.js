import {initAPI} from './_api'
import {SvcViews} from '../services/analytics'

export default initAPI(SvcViews, {
  getByUserId: (req) => [req.params.id]
})
