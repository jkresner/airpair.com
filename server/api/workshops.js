
module.exports = require('./_api').initAPI(
  require('../services/workshops')
, {
  getBySlug: (req) => [req.params.id]
}, {
  'workshop':'getBySlug'
})
