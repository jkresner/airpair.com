module.exports = (app, mw, {forbid}) => {


  cache['abuse'] = {}
  cache.abuse.increment = function(status, req) {
    var {ip,ref,ua} = req.ctx

    var action = { t:moment().format(), u: req.originalUrl, status }
    if (ref) action.r = ref

    if (!cache.abuse[ip]) cache.abuse[ip] = []
    cache.abuse[ip].push(action)

    req.res.status(status)
    $log(`[${status}]abuse ${ip}`.magenta, `[${cache.abuse[ip].length}]`.white, action.u.white, ua.gray)

    return status >= 500 ? '' : 'Relax. Close your eyes.'
  }



  mw.
    // need to enhance forbid to give other responses like 500
    cache('abuser', mw.res.forbid('abuse', function(req) {
      if ((cache.abuse[req.ctx.ip]||[]).length > forbid.abuse.limit)
        return cache.abuse.increment(500, req) + `++${abused.length} abusive requests`
    }))

  mw.
    cache('adm', mw.res.forbid('!adm', function({user}) {
      if (!user) return 'not authd'
      if (!forbid.nonAdm.allow.match(user._id)) return 'non admin'
    }))

  mw.
    cache('authd', mw.res.forbid('anon', function({ctx,user}) {
      if (user) return

      global.analytics.issue(ctx, 'forbidanon', 'security_low',
        { mw:'forbid', name:'authd', rule:'!req.user', user: user||'anon' })

      return 'anon'
    }))


}
