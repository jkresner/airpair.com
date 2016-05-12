module.exports = function(app, mw) {

  app.use(/^\/(job|review)/,
      mw.$.badBot, mw.$.session, mw.$.cachedTags)

  app.honey.Router('dynamic')
    .use(mw.$.livereload)

    .param('job', API.Requests.paramFns.getByIdForReview)
    .get(['/job/:job','/review/:job'],
          mw.$.trackJob, mw.$.hybridPage('job'))

    .use([mw.$.badBot, mw.$.session, mw.$.reqFirst])

    // .get('/bookings/:id/spin*',
    //   function(req, res, next) {
    //     API.Bookings.svc.getByIdForSpinning.call(req, req.params.id, req.query.email, (e,r) => {
    //       if (!r) return res.status(200).send('')
    //       req.locals.r = r
    //       next()
    //     })
    //   }, mw.$.serverPage('spin'))


    .get('/posts/review/:id', mw.$.noBot,
      function(req, res, next) {
        API.Posts.svc.getByIdForReview.call(req, req.params.id, (e,r) => {
          if (!r) return res.redirect('https://author.airpair.com/')
          else if (r.history.published) return res.redirect(301, r.htmlHead.canonical)
          req.locals.r = r
          req.locals.htmlHead = r.htmlHead
          next()
        })
      }, mw.$.postPage)

    .get('/:tagshort/workshops/:slug',
      (req, res, next) => {
        var r = _.find(cache.workshops, w => w.url == req.originalUrl)
        r ? next(null, assign(req.locals,{r,htmlHead:r.htmlHead}))
          : res.redirect(302,'/workshops')
      },
      mw.$.inflateAds,
      mw.$.trackWorkshop,
      mw.$.serverPage('workshop'))

    .get('/book/:username', function(req, res, next) {
      API.Experts.svc.getByUsername.call(req, req.params.username, (e,r) => {
        if (!r) return res.redirect('/')
        r.meta = { canonical: `https://www.airpair.com/book/${r.username}`, title: r.name }
        req.expert = r
        req.locals.r = r
        req.locals.htmlHead = r.meta
        next()
      })}, mw.$.hybridPage('book'))

}
