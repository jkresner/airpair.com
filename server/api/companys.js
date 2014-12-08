import {initAPI} from './_api'
import * as Svc from '../services/companys'

export default initAPI(Svc, {
  search: (req) => [req.params.id],
  migrate: (req) => [req.params.id,req.body.type],
  addMember: (req) => [req.params.id,req.body.user],
}, {
  'company':'getById'
})
