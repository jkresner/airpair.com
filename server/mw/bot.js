function allowCrawl(groups='friendly', opts) {
  let redirectUrl = opts.hasOwnProperty('redirectUrl') ? opts.redirectUrl : false
  let allow = new RegExp(groups)
  let status = opts.status || 200
  this.mwName = opts.name || `ua:${groups}:allow`

  return function(req, res, done) {
    let {ip,ua,ud,ref} = req.ctx
    let UDs = (ud||'null').split('|')
    let allowed = UDs.filter(group => allow.test(group))

    if (allowed.length > 0) return done()

    if (opts.onDisallow) opts.onDisallow(req, res, next)

    if (redirectUrl) res.redirect(302, redirectUrl)
    else res.status(status).type(type).send(opts.content)

    let info = ua ? `${UDs}.missing(${allow})` : 'user-agent:null'
    done(null, `${ip} ${info} ${ref?' <<< '+ref:''}`, true)
  }
}

/**                                                                  noCrawl(
* Similar to res.empty but instead of waiting for a url to not match any
* routes, gate a known route or router. Requires session.ua to execute
* earlier in the middleware chain to know if the userAgent is a bot.
*
*  Object    @opts[optional]
*   String    .content to 200 respond to all requests by bots
*   String    .group
*   Function  .onDisallow custom hook to log bot activity                    */
function noCrawl(groups, opts={}) {
  let block = groups.split('|')
  if (block.indexOf('null') < 0) block.push('null')
  let deny = new RegExp(block.join('|'))
  let status = opts.status || 200
  let type = opts.type || 'html'

  this.mwName = opts.name || `ua:${deny}:block`
  return function(req, res, done) {
    let {ip,ua,ud,ref} = req.ctx
    let UDs = (ud||'null').split('|')
    let denied = UDs.filter(group => deny.test(group))
    if (denied.length == 0) return done()

    if (opts.onDisallow)
      opts.onDisallow(req, res, next)

    res.status(status).type(type).send(opts.content)

    let info = ua ? `${deny}.matched(${denied})` : 'user-agent:null'
    done(null, `${ip} ${info} ${ref?' <<< '+ref:''}`, true)
  }
}


module.exports = (app, mw, {forbid}) => {
  mw.req.extend('uaAllow', allowCrawl)
  mw.req.extend('uaBlock', noCrawl)

  mw.cache('nobot', mw.req.uaBlock('search|ban|lib|proxy|reader', {
    name:'nobot', content:'' }))

  mw.cache('noscrape', mw.req.uaBlock('ban|lib',
    { name:'noscrape', content:'' }))

  mw.cache('seobot', mw.req.uaAllow('search',
    { name:'seobot', content: 'User-agent: *\nDisallow: /\nDisallow: /admin' }))

  return (groups, opts={}) =>
    mw.req[`ua${opts.allow?'Allow':'Block'}`](groups, opts)

}
