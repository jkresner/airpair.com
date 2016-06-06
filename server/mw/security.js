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


  cache['abuse'] = {}
  cache['iplog'] = {}
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


  mw.
    // ? enhance forbid to give other responses like 500
    cache('throttle', function(req, res, next) {
      var {ctx} = req
      var key = moment().format('DDHHmm')
      var throttle = 0
      cache['iplog'][key] = cache['iplog'][key] || []
      cache['iplog'][key].push(ctx.ip)
      for (var ip of cache['iplog'][key])
        if (ip == ctx.ip) throttle++

      if (throttle < forbid.throttle.limit)
        return next()

      while (!cache.abuse[ip] || cache.abuse[ip].length < forbid.abuse.limit)
        cache.abuse.increment(500, req)

      $log('throttle.user'.red, ctx.user, ctx.ip, throttle, throttle % forbid.throttle.limit)
      res.send(cache.abuse.increment(500, req))
      $logMW(req, 'throttle'.red)
      if (throttle % forbid.throttle.limit == 0)
        global.analytics.issue(ctx, 'scrape', 'security_high',
          { mw:'throttle', name:'throttle', rule:`${key}[${ctx.ip}] > throttle.limit`, hits:cache['iplog'][key] })
    })


  mw.
    // ? enhance forbid to give other responses like 500
    cache('abuser', function(req, res, next) {

      // $log('check abuse', `[${req.ctx.ip}]`, (cache.abuse[req.ctx.ip]||[]).length)
      // global.analytics.issue(ctx, 'forbidabuser', 'security_medium',
        // { mw:'forbid', name:'adm', rule:'!req.user', user: user||'anon' })

      var block = ['109.49.166.123','47.59.122.29','94.61.126.56','185.101.177.67','88.22.74.114'].indexOf(req.ctx.ip) != -1 ||
        ["2de8RMuTC9ThmjfYRBzXtESFQUR9rJrC", "9768VHFOcS6k05A1teN5By0qA2Hu4Gv5", "XGBHWUFZ0w6mlFws_LOPMIfEZU2DpLhs"].indexOf(req.ctx.sId) != -1

      if (!block && (cache.abuse[req.ctx.ip]||[]).length < forbid.abuse.limit)
        return next()

      res.send(cache.abuse.increment(500, req))
      $logMW(req, block ? 'abuser'.red : 'abuser')
      // var {ip,ref,ua} = req.ctx
      // console.log(`[500${req.originalUrl}${ref?` << ${ref}`.dim:''}]abuse`.cyan, `\t${ip}[${cache.abuse[ip].length}/${forbid.abuse.limit}]`.white, (ua||'').gray)
    })


  mw.
    cache('banEm', function(req, res, next) {
      var {ip,ref,ua} = req.ctx

      // global.analytics.issue(ctx, 'forbidabuser', 'security_medium',
        // { mw:'forbid', name:'adm', rule:'!req.user', user: user||'anon' })

      cache.abuse[ip] = cache.abuse[ip] || []
      while (cache.abuse[ip].length < forbid.abuse.limit)
        cache.abuse.increment(500, req)

      $logMW(req, 'ban')
      return res.send(cache.abuse.increment(500, req))
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
