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

  var logFilter = /Pingdom|Sogou|CloudFlare-Always/

  var short = { GET:'GET'.dim, PUT:'PUT'.dim, DELETE:'DEL'.dim, POST:'POS'.dim }
  global.$logMW = (req, mwName) => {
    if (logFilter.test(req.ctx.ua)) return
    var {ctx,originalUrl} = req

    var mth = `${short[req.method] || req.method.toUpperCase()}`
    var ref = ctx.ref ? ` <<< ${ctx.ref.dim}` : ''

    var sId = (!ctx.sId || ctx.sId == 'unset' ? '_          _' : ctx.sId).substr(0,12)
    var ip = ctx.ip + '                '.substr(0, 16-ctx.ip.length)
    var UD = `[${mwName}] ${ctx.ud.magenta}` + '                            '.substr(0,18-(mwName+ctx.ud).length)
    var u = ((ctx.user||{}).name||'')

    console.log(`${sId} ${ip} ${UD}`.dim.cyan+`${mth.cyan} ${originalUrl.magenta}${ref} ${u.white} `+`${ctx.ua||'ua:null'}`.gray)
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


  function flareBan(req, data) {
    var {ip,ua,ud} = req.ctx
    if (whitelist.test(ip) || /proxy|search|reader/.test(ud))
      return console.log('!ban(whitelist)'.yellow, ip, ud, ua)

    var ipAbuse = JSON.stringify(cache.abuse[ip]||[]).gray
    cache['abuse'].ban.push(ip)
    global.analytics.issue(req.ctx, 'ban', 'security_high', data, (e, i) =>
      e || /test/.test(config.env) ? 0 : Wrappers.Cloudflare.blockIssue(i,
        (er,r) => console.log(`CF.BAN > ${ip}`.red, `${ua}`.gray, ipAbuse, er ? er : r.id) )
      )
  }

  var mwBan = (name) => function(req, res, next) {
    var data = { mw:'ban', headers: req.headers, name, url: req.originalUrl, user: req.ctx.user||'anon' }
    if (req.body) data.body = req.body

    res.send(cache.abuse.increment(500, req))
    $logMW(req, name)
    flareBan(req, data)
  }

  mw.
    cache('banPOST', mwBan('banPOST'))
  mw.
    cache('banGET', mwBan('banGET'))
  mw.
    cache('throttle', function(req, res, next) {       // ? enhance forbid to give other responses like 500
      var {ip,user} = req
      var key = moment().format('DDHHmm')
      var throttle = 0
      cache['iplog'][key] = cache['iplog'][key] || []
      cache['iplog'][key].push(ip)
      for (var hit of cache['iplog'][key]) if (hit == ip) throttle++

      if (throttle < forbid.throttle.limit)
        return next()

      // $log('throttle.user'.red, user, ip, throttle, throttle % forbid.throttle.limit)
      res.send(cache.abuse.increment(500, req))

      $logMW(req, 'throttle')
      var data = { mw:'apcom_throttle', name:'throttle', rule:`${key}[${ip}] > throttle.limit`, hits:cache['iplog'][key], headers: req.headers }

      if (throttle == 25)
        flareBan(req, data)
      else if ((throttle % forbid.throttle.limit) == 0)
        global.analytics.issue(req.ctx, 'scrape', 'security_high', data)
    })


  mw.
    cache('abuser', function(req, res, next) {
      var under = (cache.abuse[req.ctx.ip]||[]).length < forbid.abuse.limit
      var ok = cache['abuse'].ban.indexOf(req.ctx.ip) == -1
      // $log('check abuse'.yellow, `[${req.ctx.ip}]`, (cache.abuse[req.ctx.ip]||[]).length, cache['abuse'].ban.indexOf(req.ctx.ip))
      if (under && ok)
        return next()

      res.send(cache.abuse.increment(500, req))
      $logMW(req, ok ? 'abuser' : 'banned')
    })


  mw.
    cache('noBot', mw.req.noCrawl({ group: 'search|ban|lib|proxy|reader',
      content:'',
      onDisallow: req => $logMW(req, 'bot(*)') }
    ))


  mw.
    cache('badBot', mw.req.noCrawl({ group: 'ban|lib',
      content:'',
      onDisallow: req => $logMW(req, 'bot(ban|lib)') }
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
