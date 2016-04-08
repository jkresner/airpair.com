module.exports = function(app, mw, {redirects}) {


  app.get('/posts/thumb/:id', (req,res,next) => {
    var post = cache.post[req.params.id]
    if (!post) res.status(404)
    else res.redirect(301, post.htmlHead.ogImage)
    res.end()
  })


  if (redirects && redirects.on) {

    if (config.log.app.verbose)
      $log('WARN'.magenta, 'Treating all 302 redirects as Permanent 301'.white)

    //-- Express routes don't handle spaces, so always put in %20
    //-- More so for some reason it's important to test the fully encoded
    //-- Version of the url first
    var map = new Map()
    map.set(/%E2%80%A6/,'')
    map.set(/%20%e2%80%a6/,'')
    map.set(/%20%E2%80%A6/,'')
    map.set(/%20\.\.\./,'%20...')
    map.set(/\.\.\./,'')
    map.set(/^\/logout$/,'/auth/logout')
    // map.set("/c\\+\\+","/c++","/posts/tag/c++", "302")

    cache['redirects'].filter(r => r.type == "301" || r.type == "302")
      .forEach(r => map.set(new RegExp(`^${r.previous}$`,'i'), r.current))


    $logIt('cfg.route', 'redirects.on', `${cache['redirects'].length} cached, ${map.size} forwards`)

    app.use(mw.req.forward({map}))

    //-- TODO : pattern
    // router.get('/author/*', (req,res) => { res.redirect(301, '/posts')})
  }

  if (config.middleware.slow)
    app.use(mw.req.slow(config.middleware.slow))

  if (config.middleware.ctx.dirty)
    app.use(mw.$.reqDirty)

}



