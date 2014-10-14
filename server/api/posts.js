import {initAPI} from './_api'
import * as Svc from '../services/posts'

export default initAPI(Svc, {
  getUsersPosts: (req) => [req.user._id],
  getTableOfContents: (req) => [req.body.md],
  publish: (req) => [req.params.id,req.body],
  getRecentPublished: (req) => [],
  getAllPublished: (req) => [],  //-- For indexable page
  getAllAdmin: (req) => [],
  getUsersPublished: (req) => [req.params.id]
}, {
  'post':'getBySlug'
})
