
module.exports = function(app, mw) {

  // if (mw.$.livereload)
  //   router.use(mw.$.livereload)

  var router = app.Router()
    .use(mw.$.cachedTags)
    .param('tag', API.Tags.paramFns.getBySlug)
    .param('job', API.Requests.paramFns.getByIdForReview)
    .param('post', API.Posts.paramFns.getBySlugForPublishedView)


    .get(['/job/:job','/review/:job'],
      mw.$.badBot, mw.$.session, mw.$.onFirstReq,
      mw.$.trackJob, mw.$.hybridPage('review'))


    .get('/software-experts',
      mw.$.badBot, mw.$.session, mw.$.onFirstReq,
      function(req, res, next) {
        cache.get('postAllPub', API.Posts.svc.getAllPublished, (e, r) => {
          req.locals.r = r
          req.locals.htmlHead = { title: "Software Posts, Tutorials & Articles" }
          req.landing = { key: 'posts' }
          next()
        })
      }, mw.$.hybridPage('posts'))


    .get('/:tag/posts/:post',
      mw.$.badBot, mw.$.session, mw.$.onFirstReq,
      (req, res, next) => next(null, req.locals.htmlHead = req.locals.r.htmlHead),
      mw.$.trackPost, mw.$.postPage)


    .get('/posts/review/:id',
      mw.$.noBot,
      function(req, res, next) {
        $callSvc(API.Posts.svc.getByIdForReview, req)(req.params.id, (e,r) => {
          if (!r) return res.redirect('https://author.airpair.com/')
          else if (r.published) return res.redirect(301, r.url)
          // res.redirect(301, req.originalUrl.replace('/post','https://author.airpair.com'))
          // console.log('html', r.html)
          // req.locals.post = r
          req.locals.r = r
          req.locals.htmlHead = r.htmlHead
          next()
        })
      }, mw.$.postPage)


    // .get('/book/:username', function(req, res, next) {
    //   var ExpertsSvc = require('../services/experts')
    //   ExpertsSvc.getByUsername(req.params.username, (e,r) => {
    //     if (!r) return res.redirect('/')
    //     r.meta = { canonical: `https://www.airpair.com/book/${r.username}`, title: r.name }
    //     req.expert = r
    //     req.locals.r = r
    //     req.locals.htmlHead = r.meta
    //     next()
    //   })}, mw.$.hybridPage('book'))


    .get('/bookings/:id/spin*',
      function(req, res, next) {
        $callSvc(API.Bookings.svc.getByIdForSpinning, req)(req.params.id, req.query.email, (e,r) => {
          if (!r) return res.status(200).send('')
          req.locals.r = r
          next()
      })
      }, mw.$.serverPage('spin'))


  // // for (var slug of ['angularjs']) //,'firebase'
  // //   app.get(`/${slug}`, populate.tagPage(slug), trackView('tag'),
  // //     app.renderHbsViewData('tag', null, (req, cb) => cb(null, req.tagpage) ))


  // // for (var slug of ['reactjs','python','node.js','ember.js','keen-io','rethinkdb','ionic','swift','android','ruby'])
  // //   router.get(`^/${slug}`, mw.$.trackTag, mw.$.hybridPage('tag'))

    .get('/workshops',
      mw.$.badBot, mw.$.session, mw.$.onFirstReq,
      (req, res, next) => {
        req.locals.r = _.values(cache.workshops)
        req.locals.htmlHead = { title: "Software Workshops, Webinars & Screencasts" }
        next()
      }, mw.$.serverPage('workshops'))

    .get('/:tag/workshops/:slug',
      mw.$.badBot, mw.$.session, mw.$.onFirstReq,
      (req, res, next) => {
        req.workshop = cache.workshops[req.params.slug]
        if (req.workshop) next(null, req.locals.r = req.workshop)
        else next("Workshop not found")
      },
      mw.$.trackWorkshop,
      mw.$.serverPage('workshop'))

    app.use(router)

}
