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

  mw.req.extend('noCrawl', noCrawl)

  mw.cache('noBot', mw.req.noCrawl({ group: 'search|ban|lib|proxy|reader',
    content:'',
    onDisallow: req => honey.log.mw.data(req, 'bot(*)') }
  ))

  return mw.req.noCrawl({ group: 'ban|lib',
    content:'',
    onDisallow: req => honey.log.mw.data(req, 'bot(ban|lib)')
  })

}
