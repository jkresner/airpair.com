import {initAPI} from './_api'
import * as Svc from '../services/experts'

export default initAPI(
  require('../services/experts')
,{
  getMe: (req) => [],
  getForExpertsPage: (req) => [],
  search: (req) => [req.params.id],
  getMatchesForRequest: (req) => [req.request]
}, {
  'expert':'getById'
})
