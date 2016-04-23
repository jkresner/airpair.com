module.exports = (app, mw, cfg) => {


  // CF-Connecting-IP === X-Forwarded-For (if no spoofing)
  // First exception: CF-Connecting-IP
  // To provide the client (visitor) IP address for every request to the origin, CloudFlare adds the CF-Connecting-IP header.
  // "CF-Connecting-IP: A.B.C.D"
  // where A.B.C.D is the client's IP address, also known as the original visitor IP address.
  // Second exception: X-Forwarded-For
  // X-Forwarded-For is a well-established HTTP header used by proxies, including CloudFlare, to pass along other IP addresses in the request. This is often the same as CF-Connecting-IP, but there may be multiple layers of proxies in a request path.
  var staleUrls = config.middleware.ctx.dirty.urlstale.split(' ')
  mw.cache('reqDirty', (req, res, next) => {
    for (var url in staleUrls)
      if (req.originalUrl.indexOf(url) == 1) req.ctx.dirty = 'urlstale'
    next()
  })


  mw.cache('reqFirst', mw.session.orient({
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
  }))


  var admId = config.env == 'test' ? "54551be15f221efa174238d1" :
                                     "5175efbfa3802cc4d5a5e6ed"

  mw.cache('adm', mw.res.forbid('nonAdm', usr => !usr||usr._id!=admId ))


  mw.cache('noBot', mw.req.noCrawl({content:'',
    onDisallow(req) {
      // $log('TODO... write crawl issue to analytics db or similar')
    }}))

  mw.cache('badBot', mw.req.noCrawl({group:'bad|ua:none',content:'',
    onDisallow(req) {
      // $log('TODO... write crawl issue to analytics db or similar')
    }}))

}
