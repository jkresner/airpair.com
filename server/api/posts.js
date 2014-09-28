import {initAPI} from './_api'
import * as Svc from '../services/posts'


export default initAPI(Svc, {
  getUsersPosts: (req) => [req.user._id],
  getTableOfContents: (req) => [req.body.md],
  publish: (req) => [req.params.id,req.body],
  getRecentPublished: (req) => [],
  getUsersPublished: (req) => [req.params.id]
})