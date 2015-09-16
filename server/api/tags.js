module.exports = require('./_api').initAPI(
  require('../services/tags')
,{
  search: (req) => [req.params.id],
  createFrom3rdParty: (req) => [req.body.tagfrom3rdparty,req.tagfrom3rdparty],
  createByAdmin: (req) => [req.body],
  updateByAdmin: (req) => [req.tagforadm,req.body],
  getAllForCache: (req) => []
}, {
  'tag':'getBySlug',
  'tagforadm': 'getById',
},
  require('../../shared/validation/tags.js')
)
