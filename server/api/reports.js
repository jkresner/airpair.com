import {initAPI} from './_api'

export default initAPI(
  require('../services/reports')
, {
  getOrderReports: (req) => [],
  getRequestReports: (req) => [],
}, {
}
)
