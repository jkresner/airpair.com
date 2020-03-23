module.exports = function(app, mw, {rules}) {

  if (!rules)
    return;

  let routes = { '301':{}, '302':{}, 'rewrite':[] }

  cache['rules']['301'].forEach(r =>
    routes['301'][r.to] = _.union(routes['301'][r.to]||[],[r.url]) )

  cache['rules']['302'].forEach(r =>
    routes['302'][r.to] = _.union(routes['302'][r.to]||[],[r.url]) )

  cache['rules']['rewrite'].map(r =>
    routes['rewrite'].push([new RegExp(r.url,'i'),r.to]) )


  let router = honey.Router('redirects', { type:'rule' })
    .use(mw.$.session)

    .get('*&sa=*', (req, res, next) =>
      req.url.indexOf('?') > -1
        ? next()
        : res.redirect(301, req.url.replace('&sa=','?sa=')))

    .get('/posts/thumb/:id', (req, res, next) => {
      let {ogImg} = (cache.posts[req.params.id]||{})
      ogImg ? res.redirect(301, ogImg) : res.status(404)
    })

  for (let [pattern,substitute] of routes['rewrite']) router
    .get(pattern, mw.$.redirect(301, {rewrite:{pattern,substitute}}))

  for (let to in routes['301']) router
    .get(routes['301'][to], mw.$.redirect(301, {to}))

  for (let to in routes['302']) router
    .get(routes['302'][to], mw.$.redirect(302, {to}))

}
