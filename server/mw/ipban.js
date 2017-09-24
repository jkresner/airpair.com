module.exports = (app, mw, {forbid}) => {


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


  if (forbid.throttle) mw.cache('throttle',
    function(req, res, next) {       // ? enhance forbid to give other responses like 500
      let {ip,user} = req
      let key = moment().format('DDHHmm')
      let throttle = 0
      cache['iplog'][key] = cache['iplog'][key] || []
      cache['iplog'][key].push(ip)
      for (let hit of cache['iplog'][key]) if (hit == ip) throttle++

      if (throttle < forbid.throttle.limit)
        return next()

      // $log('throttle.user'.red, user, ip, throttle, throttle % forbid.throttle.limit)
      res.send(cache.abuse.increment(500, req))

      honey.log.mw.data(req, `throttle ${forbid.throttle.limit}th`)
      let data = { mw:'apcom_throttle', name:'throttle', rule:`${key}[${ip}] > throttle.limit`, hits:cache['iplog'][key], headers: req.headers }

      if (throttle == 25)
        flareBan(req, data)
      else if ((throttle % forbid.throttle.limit) == 0)
        global.analytics.issue(req.ctx, 'scrape', 'security_high', data)
    })


  return rule => mw.req.banip({name:rule})

}
