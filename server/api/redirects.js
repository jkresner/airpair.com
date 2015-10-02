module.exports = require('./_api').initAPI(
  require("../services/redirects")
,{
  getAllRedirects: (req) => [],
  createRedirect: (req) => [req.body],
  deleteRedirectById: (req) => [req.params.id],
})
