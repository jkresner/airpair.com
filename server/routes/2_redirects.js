module.exports = function(app, mw, {redirects,tags}) {

  if ((redirects||{}).on !== true) return


  var rules = cache.httpRules

  cache.httpRules['301'] = rules['301'].concat(tags.top.split(',').map(slug => (
      { match:`^/${slug}/posts`, to:`/posts/tag/${slug}` }) ))

  cache.httpRules['rewrite'] = rules['rewrite'].concat([
    // { match: '%E2%80%A6', to: '' },
    // { match: '%20%e2%80%a6', to: '' },
    // { match: /%20\.\.\./i, to: '%20...' }  //?
    // { match: '\\.\\.\\.', to: '' },
    { match: '^/static/img/pages/postscomp/(prize|logo)-', to: '/img/software/' } ])

  var moved_perm = rules['301'].map(r => ({ match: new RegExp(r.match,'i'), to: r.to }))
  var moved_temp = rules['302'].map(r => ({ match: new RegExp(r.match,'i'), to: r.to }))
  var gone       = rules['410'].map(r => new RegExp(r.match,'i'))
  var not_imp    = rules['501'].map(r => new RegExp(r.match,'i'))
  var bait       = rules['bait'].map(r => new RegExp(r.match,'i'))
  var rewrite    = rules['rewrite'].map(r => [new RegExp(r.match,'i'), r.to])

  if (moved_perm.length>0) $logIt('cfg.route', 'moved_perm', moved_perm)
  if (moved_temp.length>0) $logIt('cfg.route', 'moved_temp', moved_temp)
  if (gone.length>0)       $logIt('cfg.route', 'gone', gone)
  if (not_imp.length>0)    $logIt('cfg.route', 'not_imp', not_imp)
  if (bait.length>0) $logIt('cfg.route', 'bait', bait)
  if (rewrite.length>0) $logIt('cfg.route', 'rewrite', rewrite)

  app
    .use(mw.req.forward({name:'rewrite', map: new Map(rewrite)}))

  var redir = (rule, status) => (req, res, next) => {
    var url = req.originalUrl
    if (url.match('^/v1/api/')) return next()
    $log(`${url} >> ${status} =>`, url.replace(url.split('?')[0], rule.to), rule.match)
    res.redirect(status, req.url.replace(req.url.split('?')[0], rule.to))
  }


  for (var rule of moved_perm) app
    .get(rule.match, redir(rule, 301))

  for (var rule of moved_temp) app
    .get(rule.match, redir(rule, 302))


  app.honey.Router('routerules')
    .use(mw.$.session)
    .get(not_imp, (req, res) => res.status(501).send(''))
    .get(bait, (req, res) => res.send(cache.abuse.increment(418, req)))
    .get(gone, (req, res) => res.send(cache.abuse.increment(410, req)))


  // $logIt('cfg.route', 'rewrites', `added ${rewritesOpts.size} rules`)
  // $logIt('cfg.route', 'forwards', `added ${forwards.size} exact + match forwards`)

  //-- write tests and add these
  // app.post('/*', mw.$.noBot)
  // app.put('/*', mw.$.noBot)
  // app.delete('/*', mw.$.noBot)

}
