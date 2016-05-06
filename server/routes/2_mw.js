module.exports = function(app, mw, {redirects}) {

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
    mw.cache('rewrites', mw.req.forward({map,name:'rewrites'}))

    $logIt('cfg.route', 'rewrites', `added ${map.size} rules`)

    var map2 = new Map()

    $logIt('cfg.route', 'redirects', `added ${cache['redirects'].length} exact + ${map2.size} pattern match forwards`)

    cache['redirects'].filter(r => r.type == "301" || r.type == "302")
      .forEach(r => map2.set(new RegExp(`^${r.previous}$`,'i'), r.current))

    //-- TODO : patterns
    map2.set(/^\/logout$/,'/auth/logout')
    map2.set("/c\\+\\+","/c++","/posts/tag/c++")
    map2.set('/author/*', '/software-experts')
    map2.set("^/*/workshops",'/workshops')

    map2.forEach((value,key)=>app.get(key,(req,res,next)=>{
      res.redirect(301, value)
    }))

  }

  if (config.middleware.slow)
    app.use(mw.req.slow(config.middleware.slow, {
      onSlow({ctx,originalUrl,method,body}, duration) {
        analytics.issue(ctx, 'req:slow', 'performance',
          assign({ duration, url: originalUrl, method }, body ? {body} : {}) )
      }}
    ))

  if (config.middleware.ctx.dirty)
    app.use(mw.$.reqDirty)

}



