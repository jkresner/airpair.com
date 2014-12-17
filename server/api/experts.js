import {initAPI} from './_api'
import * as Svc from '../services/experts'

export default initAPI(Svc, {
  getMe: (req) => [],
  getForExpertsPage: (req) => []
}, {
  'expert':'getById'
})
