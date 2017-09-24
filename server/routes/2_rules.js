module.exports = function(app, mw, {rules,canonical}) {

  if (!rules || !canonical) return;

  honey.projector['routes'].Project.tagged(cache.canonical)

  var cached = cache['rules']

// https://coderwall.com/p/dbndpq/help-review-this-article-the-easy-way-to-integrate-stripe-payments
// https://www.bing.com/webmaster/help/bing-content-removal-tool-cb6c294d
// hackhands.com/building-instagram-clone-angularjs-satellizer-nodejs-mongodb/

  var agg = { '301':{},
              '302':{},
              '410':cached['410'],
              '501':cached['501'],
              'ban':cached['ban'],
              'bait':cached['bait'],
              'rewrite':[] }

  cached['301'].forEach(r =>
    agg['301'][r.to] = _.union(agg['301'][r.to]||[],[r.url]) )

  cached['302'].forEach(r =>
    agg['302'][r.to] = _.union(agg['302'][r.to]||[],[r.url]) )

  var rewrites   = cached['rewrite'].map(r => [new RegExp(r.url,'i'),r.to])

  var redir = (to, status) => {
    return (req, res, next) => {
      if (req.url.match('^/v1/api/')) return next()
      res.redirect( status, req.url.replace(req.url.split('?')[0], to) )
    }
  }
  var write = ({pattern,sub}) => {
    LOG('cfg.route', `301   >>>`, `${pattern} <> "${sub}"`)
    return (req, res, next) => {
      res.redirect( 301, req.originalUrl.replace(pattern, sub) )
    }
  }


  var router = honey.Router('httpRules', { type:'rule' })
    .use(mw.$.abuser)
    .head('*', (req, res, next) => res.end())
    .propfind('*', (req, res, next) => res.end())
    .post('/', mw.$.ipban("homepage"))
    .get('*&sa=*', (req, res, next) => req.url.indexOf('?') !=-1 ? next() : res.redirect(301, req.url.replace('&sa=','?sa=')))

    .get('/posts/thumb/:id', mw.$.badBot, mw.$.session, (req,res,next) => {
      let {ogImg} = (cache.posts[req.params.id]||{})
      ogImg ? res.redirect(301, ogImg) : res.status(404)
    })

  if (agg['501'].length > 0) LOG('cfg.route', `501   >>>\t\t       [${agg['501'].length}]`) + router
    .get(agg['501'], (req, res) => res.send(cache.abuse.increment(501, req)))

  if (agg['bait'].length > 0) LOG('cfg.route', `418   >>>\t\t       [${agg['bait'].length}]`) + router
    .get(agg['bait'], (req, res) => res.send(cache.abuse.increment(418, req)))

  if (agg['ban'].length > 0) LOG('cfg.route', `500   >>>\t\t       [${agg['ban'].length}]`) + router
    .get(agg['ban'], mw.$.ipban('banurl'))


  for (var [pattern,sub] of rewrites) router
    .get(pattern, mw.$.session, write({pattern,sub}))

  for (var to in agg['301']) router
    .get(agg['301'][to], mw.$.session, redir(to, 301)) + LOG('cfg.route', `    301     `, `> ${to}`.green)

  for (var to in agg['302']) router
    .get(agg['302'][to], mw.$.session, redir(to, 302)) + LOG('cfg.route', `    302     `, `> ${to}`.green)

  if (agg['410'].length > 0) LOG('cfg.route', `410   >>>\t\t       [${agg['410'].length}]`) + router
    .get(agg['410'], mw.$.session, (req, res) => res.send(cache.abuse.increment(410, req)))


  // app.put('/*', mw.$.noBot)
  // app.delete('/*', mw.$.noBot)

}
