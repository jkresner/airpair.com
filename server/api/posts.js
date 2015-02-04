import {initAPI} from './_api'

export default initAPI(
  require('../services/posts')
, {

  getUsersPosts: (req) => [],
  getUserContributions: (req) => [],
  getTableOfContents: (req) => [req.body.md],
  getRecentPublished: (req) => [],
  getAllPublished: (req) => [],  //-- For indexable page
  getAllAdmin: (req) => [],
  getByTag: (req) => [req.tag],
  getUsersPublished: (req) => [req.params.id],

  update: (req) => [req.postobj,req.body],
  publish: (req) => [req.postobj,req.body],
  submitForReview: (req) => [req.postobj, req.body],
  updateFromGithub: (req) => [req.postobj, req.body],
  updateGithubFromDb: (req) => [req.postobj, req.body],
  submitForPublication: (req) => [req.postobj, req.body],
  addReview: (req) => [req.postobj, req.body],
  addContributor: (req) => [req.postobj, req.body],
  deleteById: (req) => [req.postobj]

}, {
  'post':'getBySlugWithSimilar',
  'postobj':'getById'
},
  require('../../shared/validation/posts.js')
)
