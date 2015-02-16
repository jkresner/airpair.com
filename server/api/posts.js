import {initAPI} from './_api'

export default initAPI(
  require('../services/posts')
, {

  getByIdForEditing: (req) => [req.post],
  getByIdForForking: (req) => [req.post],
  getByIdForPublishing: (req) => [req.post],
  getUsersPosts: (req) => [],
  getPostsInReview: (req) => [],
  getUserForks: (req) => [],
  getTableOfContents: (req) => [req.body.md],
  getRecentPublished: (req) => [],
  getAllPublished: (req) => [],  //-- For indexable page
  getByTag: (req) => [req.tag],
  getUsersPublished: (req) => [req.params.id],
  getGitHEAD: (req) => [req.post],
  getGithubScopes: (req) => [],

  getAllForAdmin: (req) => [],
  getNewFoAdmin: (req) => [],

  checkSlugAvailable: (req) => [req.post, req.params.slug],
  update: (req) => [req.post,req.body],
  publish: (req) => [req.post,req.body],
  submitForReview: (req) => [req.post, req.body.slug],
  propagateMDfromGithub: (req) => [req.post],
  updateGithubHead: (req) => [req.post, req.body.md, req.body.commitMessage],
  addReview: (req) => [req.post, req.body],
  addForker: (req) => [req.post],
  deleteById: (req) => [req.post]

}, {
  'post':'getById',
  'postpublished':'getBySlugForPublishedView'
},
  require('../../shared/validation/posts.js')
,
  'post'
)
