var {initAPI} = require('./_api')
var svc = require('../services/posts')

// function reviewParamFn(req, res, next, id) {
//svc.getReview,req)(req.post, id, function(e, r) {
//     if (!r && !e) {
//       e = new Error(`post not found.`)
//       e.status = 404
//     }
//     req.postreview = r
//     next(e, r)
//   })
// }


module.exports = initAPI(
  svc
, {

  // getByIdForEditingInfo: (req) => [req.post],
  // getByIdForEditing: (req) => [req.post],
  // getByIdForSubmitting: (req) => [req.post],
  getByIdForForking: (req) => [req.post],
  getByIdForPublishing: (req) => [req.post],
  getByIdForContributors: (req) => [req.post],
  // getMyPosts: (req) => [],
  // getPostsInReview: (req) => [],
  // getUserForks: (req) => [],
  // getTableOfContents: (req) => [req.body.md],
  getRecentPublished: (req) => [],
  getAllPublished: (req) => [],  //-- For indexable page
  getByTag: (req) => [req.tag],
  // getUsersPublished: (req) => [req.params.id],

  // getAllForAdmin: (req) => [],
  // getNewFoAdmin: (req) => [],

  // checkSlugAvailable: (req) => [req.post, req.params.slug],
  // update: (req) => [req.post,req.body],
  // updateMarkdown: (req) => [req.post,req.body],
  publish: (req) => [req.post,req.body],
  // submitForReview: (req) => [req.post, req.body.slug],
  // propagateMDfromGithub: (req) => [req.post],
  // updateGithubHead: (req) => [req.post, req.body.md, req.body.commitMessage],
  addForker: (req) => [req.post],
  // clobberFork: (req) => [req.post],
  // deleteById: (req) => [req.post],

  review: (req) => [req.post, req.body],
  reviewUpdate: (req) => [req.post, req.postreview, req.body],
  reviewReply: (req) => [req.post, req.postreview, req.body],
  // reviewUpvote: (req) => [req.post, req.postreview],
  reviewDelete: (req) => [req.post, req.postreview]


}, {
  'post':'getById',
  'postpublished':'getBySlugForPublishedView',
  // 'postreview': 'getReview'
},
  require('../../shared/validation/posts.js')
,
  'post'
)

