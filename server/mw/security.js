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

  var logFilter = /Pingdom|Sogou|CloudFlare-Always/

  var short = { GET:'GET', PUT:'PUT', DELETE:'DEL', POST:'POS' }
  global.$logMW = (req, mwName) => {
    var pad = '                '
    var {ctx,originalUrl} = req
    var ua = ctx.ua || ''
    var UD = `${mwName} < ${ctx.ud}` + '                            '.substr(0,18-(mwName+ctx.ud).length)
    var mth = short[req.method] || req.method.toUpperCase()
    var ref = ctx.ref ? ` <<< ${ctx.ref}`.blue : ''
    var ip = ctx.ip + pad.substr(0, 16-ctx.ip.length)
    var u = (ctx.user||{}).name ? ctx.user.name.white : false
    var sId = (ctx.sId == 'unset' ? '_          _' : u || ctx.sId).substr(0,12)

    if (!logFilter.test(ua))
      console.log(`${mth} ${ip} ${sId} ${UD} ${originalUrl} ${ref}`.dim.cyan, ua.gray)
  }


  cache['iplog'] = {}
  cache['abuse'] = { ban: [] }
  cache.abuse.increment = function(status, req) {
    var {ip,ref,ua} = req.ctx
    var action = { t:moment().format(), u: req.originalUrl, status }
    if (ref) action.r = ref

    if (!cache.abuse[ip]) cache.abuse[ip] = []
    if (status != 501)
      cache.abuse[ip].push(action)

    req.res.status(status)
    if (status != 500)
      $logMW(req, 'abuse')
      // console.log(`[${status}${action.u}${ref?` << ${ref}`.dim:''}]abuse`.cyan, `\t${ip}[${cache.abuse[ip].length}/${forbid.abuse.limit}]`.white, (ua||'').gray)
    return status == 418 ? 'Relax. Close your eyes.' : ''
  }

  var mwBan = (name) => function(req, res, next) {
    var logBan = (er,r) => console.log(`CF.ban ${req.ctx.ip}`.red, `${req.ctx.ua}`.gray, er ? er : r.id)
    if (config.env == 'test') {
      if (cache['abuse'].ban.indexOf(req.ctx.ip) != -1) return res.status(500).send('')
      logBan = () => {}
    }

    var data = { mw:'ban', headers: req.headers, name, url: req.originalUrl, user: req.user||'anon' }
    if (req.body) data.body = req.body

    analytics.issue(req.ctx, 'ban', 'security_high', data,
      (e, i) => e ? 0 : Wrappers.Cloudflare.blockIssue(i, logBan))

    $logMW(req, name)
    cache['abuse'].ban.push(req.ctx.ip)
    return res.send(cache.abuse.increment(500, req))
  }

  mw.
    cache('banPOST', mwBan('banPOST'))
  mw.
    cache('banGET', mwBan('banGET'))

  mw.
    // ? enhance forbid to give other responses like 500
    cache('throttle', function(req, res, next) {
      var {ctx} = req
      var key = moment().format('DDHHmm')
      var throttle = 0
      cache['iplog'][key] = cache['iplog'][key] || []
      cache['iplog'][key].push(ctx.ip)
      for (var ip of cache['iplog'][key]) if (ip == ctx.ip) throttle++

      if (throttle < forbid.throttle.limit)
        return next()

      cache['abuse'].ban.push(ctx.ip)

      $log('throttle.user'.red, ctx.user, ctx.ip, throttle, throttle % forbid.throttle.limit)
      res.send(cache.abuse.increment(500, req))
      $logMW(req, 'throttle'.red)
      if (throttle % forbid.throttle.limit == 0)
        global.analytics.issue(ctx, 'scrape', 'security_high',
          { mw:'throttle', name:'throttle', rule:`${key}[${ctx.ip}] > throttle.limit`, hits:cache['iplog'][key], headers: req.headers })
    })


  mw.
    cache('abuser', function(req, res, next) {
      var under = (cache.abuse[req.ctx.ip]||[]).length < forbid.abuse.limit
      var ok = cache['abuse'].ban.indexOf(req.ctx.ip) == -1
      // $log('check abuse'.yellow, `[${req.ctx.ip}]`, (cache.abuse[req.ctx.ip]||[]).length, cache['abuse'].ban.indexOf(req.ctx.ip))
      if (under && ok)
        return next()

      res.send(cache.abuse.increment(500, req))
      $logMW(req, ok ? 'abuser' : 'banned'.red)
    })


  mw.
    cache('noBot', mw.req.noCrawl({ group: 'null|search|ban|lib|proxy|reader',
      content:'',
      onDisallow: req => global.$logMW(req, '!bot') }
    ))


  mw.
    cache('badBot', mw.req.noCrawl({ group: 'null|ban|lib',
      content:'',
      onDisallow: req => global.$logMW(req, '!ban|!lib') }
    ))


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
