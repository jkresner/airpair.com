/**                                                                  noCrawl(
* Similar to res.empty but instead of waiting for a url to not match any
* routes, gate a known route or router. Requires session.ua to execute
* earlier in the middleware chain to know if the userAgent is a bot.
*
*  Object    @opts[optional]
*   String    .content to 200 respond to all requests by bots
*   String    .group
*   String    .redirectUrl to http 301 respond (ignored if .content set)
*   Function  .onDisallow custom hook to log bot activity                    */
function noCrawl(opts={}) {
  let redirectUrl = opts.redirectUrl || false
  let content = opts.hasOwnProperty('content') ? opts.content : false
  let onDisallow = opts.onDisallow || null
  let disallow = opts.group ? `${opts.group}|null` : 'null'
  let check = new RegExp(disallow)
  this.mwName = `nobot:${disallow}`

  return function(req, res, done) {
    // if (req.ctx.ud) return done()
    let groups = (req.ctx.ud||'null').split('|')
    let deny = false
    for (let group of groups) if (check.test(group)) deny = true
    // console.log('noCrawl'.yellow, 'disallow'.magenta, disallow)
    if (!deny) return done()

    if (onDisallow) onDisallow(req)
    if (content!==false) res.send(content)
    else if (redirectUrl) res.redirect(301, redirectUrl)

    let {ip,ua,ref} = req.ctx
    done(null, `${ip} ${req.ctx.ud} ${deny?deny:''} ${ua?ua:'noUA'}${ref?' <<< '+ref:''}`, true)
  }
}



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

  var $logMW = (req, mwName) => honey.log.mw.data(req, mwName)


  var whitelist = new RegExp(`^${forbid.ban.whitelist}`)

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
      honey.log.mw.data(req, 'abuse')
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

  var mwBan = function(name) {
    this.mwName = name
    return function(req, res, next) {
      var data = { mw:'ban', headers: req.headers, name, url: req.originalUrl, user: req.ctx.user||'anon' }
      if (req.body) data.body = req.body
      res.send(cache.abuse.increment(500, req))
      $logMW(req, name)
      flareBan(req, data)
    }
  }

  mw.
    cache('banPOST', mwBan('banPOST'))
  mw.
    cache('banGET', mwBan('banGET'))

  if (forbid.throttle)
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

        $logMW(req, `throttle ${forbid.throttle.limit}th`)
        var data = { mw:'apcom_throttle', name:'throttle', rule:`${key}[${ip}] > throttle.limit`, hits:cache['iplog'][key], headers: req.headers }

        if (throttle == 25)
          flareBan(req, data)
        else if ((throttle % forbid.throttle.limit) == 0)
          global.analytics.issue(req.ctx, 'scrape', 'security_high', data)
      })


  mw.req.extend('noCrawl', noCrawl)

  mw.
    cache('noBot', mw.req.noCrawl({ group: 'search|ban|lib|proxy|reader',
      content:'',
      onDisallow: req => $logMW(req, 'bot(*)') }
    ))


  return mw.req.noCrawl({ group: 'ban|lib',
      content:'',
      onDisallow: req => $logMW(req, 'bot(ban|lib)') })

}
