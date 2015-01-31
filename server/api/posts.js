import {initAPI} from './_api'
import * as Svc from '../services/posts'

export default initAPI(Svc, {
  getUsersPosts: (req) => [],
  getTableOfContents: (req) => [req.body.md],
  publish: (req) => [req.params.id,req.body],
  getRecentPublished: (req) => [],
  getAllPublished: (req) => [],  //-- For indexable page
  getAllAdmin: (req) => [],
  getUsersPublished: (req) => [req.params.id],
  getByTag: (req) => [req.tag],
  submitForReview: (req) => [req.params.id, req.body],
  submitForPublication: (req) => [req.params.id, req.body],

  suggestEdit: (req) => [req.params.id, req.body],
  acceptEdit: (req) => [req.params.id, req.body],

  addReview: (req) => [req.params.id, req.body]
}, {
  'post':'getBySlugWithSimilar'
})
