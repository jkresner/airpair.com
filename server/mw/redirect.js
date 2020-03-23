module.exports = (app, mw) => {

  // TODO Look into middleware.req.forward
  mw.res.extend('redirect', function(status, opts={}) {
    let {to,rewrite} = opts
    if (!to && !rewrite)
      throw Error("redirect requires to or rewrite")

    return function(req, res, done) {
      let url = req.originalUrl

      // LOG('cfg.route', `301   >>>`, `${pattern} <> "${sub}"`)
      // console.log(`${status}`.green, url, pattern, sub)
      // console.log('write =>'.green, req.originalUrl.replace(pattern, sub))

      res.redirect(status, to
        ? url.replace(url.split('?')[0], to)
        : url.replace(rewrite.pattern, rewrite.substitute))

      done(null, '', true)
    }
  })

  return (status, opts) => mw.res.redirect(status, opts)

}
