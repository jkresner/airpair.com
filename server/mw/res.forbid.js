module.exports = (app, mw, {forbid}) => {


  cache['abuse'] = {}
  cache.abuse.increment = function(status, req) {
    var {ip,ref,ua} = req.ctx

    var action = { t:moment().format(), u: req.originalUrl, status }
    if (ref) action.r = ref

    if (!cache.abuse[ip]) cache.abuse[ip] = []
    cache.abuse[ip].push(action)

    req.res.status(status)
    console.log(`[${status}]abuse\t${ip}`.cyan, `[${cache.abuse[ip].length}/${forbid.abuse.limit}]`.white, action.u.white+(ref?` << ${ref}`.red:''), ua.gray)
    return status == 418 ? 'Relax. Close your eyes.' : ''
  }


  mw.
    // ? enhance forbid to give other responses like 500
    cache('abuser', function(req, res, next) {
      // $log('check abuse', `[${req.ctx.ip}]`, (cache.abuse[req.ctx.ip]||[]).length)

      // global.analytics.issue(ctx, 'forbidabuser', 'security_medium',
        // { mw:'forbid', name:'adm', rule:'!req.user', user: user||'anon' })

      if ((cache.abuse[req.ctx.ip]||[]).length >= forbid.abuse.limit)
        return res.send(cache.abuse.increment(500, req))
      else
        next()
    })

  mw.
    cache('adm', mw.res.forbid('!adm', function({ctx,user}) {
      if (forbid.nonAdm.allow.match((user||{_id:'anon'})._id)) return

      global.analytics.issue(ctx, 'forbid!adm', 'security_medium',
        { mw:'forbid', name:'adm', rule:'!req.user', user: user||'anon' })

      if (!user) return 'not authd'
      return 'non admin'
    }))

  mw.
    cache('authd', mw.res.forbid('anon', function({ctx,user}) {
      if (user) return
      return 'anon'
    }, {
      redirect: ({session}) => `/login${(session||{}).returnTo ? `?returnTo=${session.returnTo}` : ''}`
    }))


}
