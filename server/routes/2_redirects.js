module.exports = function(app, mw, {redirects,tags}) {

  if (!redirects || !redirects.on) return


  var rewritesOpts = { name: 'rewrites', map: new Map()
    .set(/%E2%80%A6/,'')
    .set(/%20%e2%80%a6/,'')
    .set(/%20%E2%80%A6/,'')
    .set(/%20\.\.\./,'%20...')
    .set(/\.\.\./,'')
    .set(/^\/static\/img\/pages\/postscomp\/prize-/, '/img/software/')
    .set(/^\/static\/img\/pages\/postscom\/logo-/, '/img/software/') }
  mw.cache('rewrites', mw.req.forward(rewritesOpts))

  $logIt('cfg.route', 'rewrites', `added ${rewritesOpts.size} rules`)


  var forwards = new Map()
    .set(/^\/logout$/,'/auth/logout')
    .set("/c\\+\\+","/c++","/posts/tag/c++")
    .set('/author/*', '/software-experts')
    .set("^/*/workshops",'/workshops')
    .set("airconf-promo",'/workshops')
    .set("^/images/landing/airconf",'/workshops')

  tags.top.split(',')
    .forEach(slug => forwards.set(`^/${slug}/posts`,`/posts/tag/${slug}`))

  cache['redirects']
    .filter( r => r.type.match(/(301|302)/) )
    .forEach( r => forwards.set(new RegExp(`^${r.previous}$`,'i'), r.current))

  forwards.forEach((val, key) =>
    app.get(key, (req,res,next) => {
      var q = req.originalUrl.split('?')[1]
      res.redirect(301, `${val}${q?'?'+q:''}`) }) )

  if (config.log.app.verbose)
    $log('WARN'.magenta, 'Treating 302 redirects as 301 Permanent'.white)

  $logIt('cfg.route', 'forwards', `added ${forwards.size} exact + match forwards`)


  var notImp = ['/rules.abe', '/.well-known/dnt-policy.txt']
  app.get(notImp, mw.$.session, (req, res, next) => {
    $log('[501]notImp'.magenta, req.originalUrl, req.ctx.ip, req.ctx.ua)
    res.status(501).send('') })


  cache['abuse'] = {}

  app.use((req, res, next) => {
    var {ip,ref,ua,sId} = req.ctx
    if (!cache.abuse[ip] || cache.abuse[ip].length < 6)
      return next()
    var sip = { t:moment().format(), u: req.originalUrl }
    if (ref) sip.r = ref
    cache.abuse[ip].push(sip)
    $log('[500]abuse', cache.abuse[ip].length, ip, sId, ua, sip)
    res.status(500).send('')
  })

  var dirtUrls = [ //cache['redirects'].filter( r => r.type == '418' )
    'phpMyAdmin',
    'htaccess.txt',
    'readme.txt',
    'readme.html',
    'license.txt'
  ].map( r => new RegExp(`${r}`,'i') )

  app.get(dirtUrls, mw.$.session,
    (req, res, next) => {
      var {ip,ref,ua} = req.ctx
      var sip = { t:moment().format(), u: req.originalUrl }
      if (ref) sip.r = ref

      if (!cache.abuse[ip]) cache.abuse[ip] = []
      cache.abuse[ip].push(sip)

      $log('tea.send(418)', cache.abuse[ip].length, ua, sip)
      res.status(418).send('Relax. Close your eyes...')
    })

}

