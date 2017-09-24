module.exports = (app, mw, {forbid}) => {

  cache['iplog'] = {}
  cache['abuse'] = { ban: [] }
  cache.abuse.increment = function(status, req) {
    let {ip,ref,ua} = req.ctx
    let action = { t:moment().format(), u: req.originalUrl, status }
    if (ref) action.r = ref

    if (!cache.abuse[ip]) cache.abuse[ip] = []
    if (status != 501)
      cache.abuse[ip].push(action)
    req.res.status(status)
    if (status != 500)
      honey.log.mw.data(req, 'abuse')
      // console.log(`[${status}${action.u}${ref?` << ${ref}`.dim:''}]abuse`.cyan, `\t${ip}[${cache.abuse[ip].length}/${forbid.abuse.limit}]`.white, (ua||'').gray)
    return status == 418 ? 'Relax. Close your eyes.' : ''
  }
  cache.abuse.banned = function(req) {
    let under = (cache.abuse[req.ctx.ip]||[]).length < forbid.abuse.limit
    let ok = cache['abuse'].ban.indexOf(req.ctx.ip) == -1
    // $log('check abuse'.yellow, `[${req.ctx.ip}]`, (cache.abuse[req.ctx.ip]||[]).length, cache['abuse'].ban.indexOf(req.ctx.ip))
    return !(under && ok)
  }

  mw.req.extend('abuser', function(opts={}) {
    this.mwName = 'ip:blacklist'
    return function(req, res, done) {
      let banned = cache.abuse.banned(req)
      if (banned) res.send(cache.abuse.increment(500, req))
      done(null, '', banned)
    }
  })

  return mw.req.abuser()
}
