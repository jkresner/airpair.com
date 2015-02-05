import {initAPI} from './_api'

export default initAPI(
  require('../services/posts')
, {

  getUsersPosts: (req) => [],
  getPostsInReview: (req) => [],
  getUserForks: (req) => [],
  getTableOfContents: (req) => [req.body.md],
  getRecentPublished: (req) => [],
  getAllPublished: (req) => [],  //-- For indexable page
  getAllAdmin: (req) => [],
  getByTag: (req) => [req.tag],
  getUsersPublished: (req) => [req.params.id],

  update: (req) => [req.postobj,req.body],
  publish: (req) => [req.postobj,req.body.publishedOverride],
  submitForReview: (req) => [req.postobj],
  propagateMDfromGithub: (req) => [req.postobj],
  updateGithubHead: (req) => [req.postobj, req.body.md, req.body.commitMessage],
  addReview: (req) => [req.postobj, req.body],
  addForker: (req) => [req.postobj],
  deleteById: (req) => [req.postobj]

}, {
  'post':'getBySlugWithSimilar',
  'postobj':'getById'
},
  require('../../shared/validation/posts.js')
)
