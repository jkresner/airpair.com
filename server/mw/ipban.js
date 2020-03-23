module.exports = (app, mw, {forbid,throttle}) => {

  cache['iplog'] = {}
  cache['abuse'] = {}
  cache.abuse.ban = []
  cache.abuse.banned = function(req) {
    let {limit} = honey.cfg('middleware.forbid.abuse')
    let {ip} = req.ctx
    let fouls = (cache.abuse[ip]||[]).length
    let under = fouls < limit
    let ok = cache['abuse'].ban.indexOf(ip) == -1
    // $log('check abuse'.yellow, `[${ip}]`, fouls, cache['abuse'].ban.indexOf(ip) )
    // $log('banned'.yellow, cache['abuse'].ban)
    return !(under && ok)
  }
  cache.abuse.increment = function(status, req) {
    let {limit} = honey.cfg('middleware.forbid.abuse')
    let {ip,ref,ua} = req.ctx
    let action = { t:moment().format(), u: req.originalUrl, status }
    if (ref) action.r = ref

    if (!cache.abuse[ip])
      cache.abuse[ip] = []
    if (status != 501)
      cache.abuse[ip].push(action)

    let fouls = cache.abuse[ip].length
    if (fouls > limit && cache['abuse'].ban.indexOf(ip) < 0) {
      let data = { mw: `ipban:abuse+${limit}`, method: req.method, headers: req.headers, url: req.originalUrl, user: req.ctx.user||'anon' }
      // $log('cache.abuse.increment.ban'.red, data)
      flareBan(req, data)
      status = 500
    }

    req.res.status(status)
    if (status != 500)
      honey.log.mw.data(req, 'abuse')
      // console.log(`[${status}${action.u}${ref?` << ${ref}`.dim:''}]abuse`.cyan, `\t${ip}[${cache.abuse[ip].length}/${forbid.abuse.limit}]`.white, (ua||'').gray)
    return status == 418 ? 'Relax. Close your eyes.' : ''
  }


  mw.cache('foul', function(status) {
    return function(req, res, next) {
      res.send(cache.abuse.increment(status,req))
    }
  })

  // CF-Connecting-IP === X-Forwarded-For (if no spoofing)
  // First exception: CF-Connecting-IP
  // To provide the client (visitor) IP address for every request to the origin, CloudFlare adds the CF-Connecting-IP header.
  // "CF-Connecting-IP: A.B.C.D"
  // where A.B.C.D is the client's IP address, also known as the original visitor IP address.
  // Second exception: X-Forwarded-For
  // X-Forwarded-For is a well-established HTTP header used by proxies, including CloudFlare, to pass along other IP addresses in the request. This is often the same as CF-Connecting-IP, but there may be multiple layers of proxies in a request path.
  // var staleUrls = config.middleware.ctx.dirty.urlstale.split(' ')
  // mw.cache('reqDirty', (req, res, next) => {
  //   for (var url in staleUrls)
  //     if (req.originalUrl.indexOf(url) == 1) req.ctx.dirty = 'urlstale'
  //   next()
  // })

  var whitelist = new RegExp(`^${forbid.ban.whitelist}`)

  function flareBan(req, data) {
    let {ip,ua,ud} = req.ctx
    if (whitelist.test(ip) || /proxy|search|reader/.test(ud))
      return console.log('!ban(whitelist)'.yellow, ip, ud, ua)

    let ipAbuse = JSON.stringify(cache.abuse[ip]||[]).gray
    cache['abuse'].ban.push(ip)
    global.analytics.issue(req.ctx, 'ban', 'security_high', data, (e, i) =>
      e || /test/.test(config.env) ? 0 : Wrappers.Cloudflare.blockIssue(i,
        (er,r) => console.log(`CF.BAN > ${ip}`.red, `${ua}`.gray, ipAbuse, er ? er : r.id) )
      )
  }

  function ban(opts={}) {
    this.mwName = opts.name ? `ipban:${opts.name}` : 'ipban'
    return function(req, res, done) {
      let data = { mw: `ipban:${opts.name}`, method: req.method, headers: req.headers, url: req.originalUrl, user: req.ctx.user||'anon' }
      if (req.body) data.body = req.body
      res.send(cache.abuse.increment(500, req))
      flareBan(req, data)
      done(null, `${req.ctx.ip}`, true)
    }
  }

  mw.req.extend('banip', ban)

  mw.req.extend('throttlebanip', function(opts={}) {
    this.mwName = opts.name || 'throttle'
    let it = opts.log || { ban: true }
    return function(req, res, next) {
      let {limit} = honey.cfg('middleware.throttle')
      let {ip,user,ud,ua} = req.ctx
      let key = moment().format('DDHHmm')

      cache['iplog'][key] = [ip].concat(cache['iplog'][key]||[])

      let reqs = cache['iplog'][key].filter(hit=>hit==ip).length
      if (reqs < limit)
        return next()

      $log('throttle.user'.red, user, ip, throttle, throttle % limit)
      if (it.ban)
        $log(honey.log.mw.step(`ban ${ip} => ${reqs} reqs > ${limit}`.red))

      let data = { mw:'throttle', name:'throttle', rule:`${key}[${ip}](${reqs}) > limit[${limit}]` }
      flareBan(req, data)

      res.status(500).send()
    }
  })

  mw.cache('throttle', mw.req.throttlebanip({name:'ddos'}))

  return rule => mw.req.banip({name:rule})

}
