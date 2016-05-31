module.exports = function(app, mw, {httpRules,landing}) {
  if (!httpRules) return;

  var rules = cache.httpRules

  var agg = { '301':[],'302':[],'410':[],'501':[],'bait':[],'rewrite':[] }
  rules['301'].forEach(r =>
    agg['301'][r.to] = _.union(agg['301'][r.to]||[],[r.url]) )

  rules['302'].forEach(r =>
    agg['302'][r.to] = _.union(agg['302'][r.to]||[],[r.url]) )

  var gone       = rules['410'].length > 0 ? rules['410'].map(r => r.url) : false
  var not_imp    = rules['501'].length > 0 ? rules['501'].map(r => r.url) : false
  var bait       = rules['bait'].length > 0 ? rules['bait'].map(r => r.url) : false
  var rewrites   = rules['rewrite'].map(r => [new RegExp(r.url,'i'),r.to])


  var redir = (to, status) => {
    $logIt('cfg.route', `${status}                >`, to.green)
    return (req, res, next) => {
      if (req.url.match('^/v1/api/')) return next()
      res.redirect( status, req.url.replace(req.url.split('?')[0], to) )
    }
  }
  var write = ({pattern,sub}) => {
    $logIt('cfg.route', `301   >>>`, `${pattern} <> "${sub}"`)
    return (req, res, next) => {
      res.redirect( 301, req.originalUrl.replace(pattern, sub) )
    }
  }

  var router = app.honey.Router('httpRules', { type:'rule' })
    .use(mw.$.session)

  for (var [pattern,sub] of rewrites) router
    .get(pattern, write({pattern,sub}))

  for (var to in agg['301']) router
    .get(agg['301'][to], redir(to, 301))

  for (var to in agg['302']) router
    .get(agg['302'][to], redir(to, 302))

  if (not_imp.length) $logIt('cfg.route', `501   >>>\t\t       [${not_imp.length}]`) + router
    .get(not_imp, (req, res) => console.log(`[501] ${req.url} ${req.ctx.ip} ${req.ctx.ua}`.cyan) +
      res.set('Content-Type','text/plain').status(501).send(''))

  if (gone) $logIt('cfg.route', `410   >>>\t\t       [${gone.length}]`) + router
    .get(gone, (req, res) => res.send(cache.abuse.increment(410, req)))

  if (bait) $logIt('cfg.route', `418   >>>\t\t       [${bait.length}]`) + router
    .get(bait, (req, res) => res.send(cache.abuse.increment(418, req)))


  //-- write tests and add these
  router.post(['/',
               '/aws/posts/building-a-scalable-web-app-on-amazon-web-services-p1'
      ], mw.$.banEm)
  // app.put('/*', mw.$.noBot)
  // app.delete('/*', mw.$.noBot)

}
