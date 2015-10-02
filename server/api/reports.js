module.exports = require('./_api').initAPI(
  require('../services/reports')
, {
  getOrderReports: (req) => [],
  getRequestReports: (req) => [],
}, {
}
)
