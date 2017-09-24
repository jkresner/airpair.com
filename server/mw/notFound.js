module.exports = (app, mw, {abuse}) =>

  mw.res.notfound({
    onBot(req, res, next) {
      if (/ban|lib|null/.test(req.ctx.ud))
        return res.status(200).send('')

      let ctx = _.select(req.ctx, 'ip sId user ua ud')
      analytics.issue(ctx, 'crawl', 'security', { crawl: 404, url: req.originalUrl, headers:req.headers })
      res.status(404).send('Page not found')
    }
  })

