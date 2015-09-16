module.exports = require('./_api').initAPI(
  require('../services/companys')
, {
  search: (req) => [req.params.id],
  migrate: (req) => [req.params.id,req.body.type],
  addMember: (req) => [req.params.id,req.body.user],
  getUsersCompany: (req) => [],
}, {
  'company':'getById'
})
