import {initAPI} from './_api'

export default initAPI(
  require("../services/redirects")
,{
  getAllRedirects: (req) => [],
  createRedirect: (req) => [req.body],
  deleteRedirectById: (req) => [req.params.id],
})
