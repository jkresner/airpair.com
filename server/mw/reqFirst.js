module.exports = (app, mw, cfg) => 

  mw.session.orient({
    skipIf(req) {
      if (req.isAuthenticated()) {
        if (req.session.anonData) delete req.session.anonData
        return true
      }
    },
    onFirst(req, res) {
      if (!req.session.anonData) req.session.anonData = {}
      // res.once('finish', () => {
        // req.session.firstRequest.status = res.statusCode
        // analytics.event(req, 'firstReq', req.session.firstRequest)
      // })
    }
  })

