function allowCrawl(opts) {
  let content = opts.hasOwnProperty('content') ? opts.content : false
  let redirectUrl = opts.hasOwnProperty('redirectUrl') ? opts.redirectUrl : false
  let onDisallow = opts.onDisallow || null
  let allow = new RegExp(opts.group || 'search')
  this.mwName = `seobot`

  return function(req, res, done) {
    var groups = (req.ctx.ud||'null').split('|')
    var deny = true
    for (var group of groups) if (allow.test(group)) deny = false

    if (!deny) return done()

    if (onDisallow) onDisallow(req)
    if (content!==false) res.send(content)
    else if (redirectUrl) res.redirect(301, redirectUrl)

    var {ip,ua,ud,ref} = req.ctx
    done(null, `${ip} ${ud} ${deny?deny:''} ${ua?ua:'noUA'}${ref?' <<< '+ref:''}`, true)
  }
}


module.exports = (app, mw, {abuse}) => {
  mw.req.extend('allowCrawl', allowCrawl)

  return opts => mw.req.allowCrawl(opts)
}
