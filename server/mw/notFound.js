module.exports = (app, mw, {abuse}) => {

  var notFound = mw.res.notFound({
    onBot(req, res, next) {
      if (/ban|lib|null/.test(req.ctx.ud))
        return res.status(200).send('')

      var context = honey.projector._.select(req.ctx, 'ip sId user ua ud')
      analytics.issue(context, 'crawl', 'security', { crawl: 404, url: req.originalUrl, headers:req.headers })
      res.status(404).send('Page not found')
    }
  })

  return (req, res, next) =>
    mw.$.session(req, res, () => {
      if (req.ctx.ud == 'null') req.ctx.ud = 'bot|null'
      notFound(req, res, e => {
        res.status(404)
        res.render('error', {error:e,user:req.user})
      })
    })


}
