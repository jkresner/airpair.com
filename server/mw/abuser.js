module.exports = (app, mw, {forbid}) =>

  function(req, res, next) {
    var under = (cache.abuse[req.ctx.ip]||[]).length < forbid.abuse.limit
    var ok = cache['abuse'].ban.indexOf(req.ctx.ip) == -1
    // $log('check abuse'.yellow, `[${req.ctx.ip}]`, (cache.abuse[req.ctx.ip]||[]).length, cache['abuse'].ban.indexOf(req.ctx.ip))
    if (under && ok)
      return next()
    // $log('check abuse'.yellow, `[${req.ctx.ip}]`, 'over'.red)
    res.send(cache.abuse.increment(500, req))
     honey.log.mw.data(req, ok ? 'abuser' : 'banned')
  }
