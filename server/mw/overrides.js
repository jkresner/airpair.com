module.exports = (app, mw) => {

  // var log = global.config.env != 'test' ? console.log : (() => {})


  // mw.cache('wrap', mw.req.wrap({
    // context: config.middleware.ctx,
    // onStart: (r) => log(`[req ${r.ctx.ip}]`[r.ctx.bot==false?'white':'magenta'].dim),
    // onEnd: (r, res) => log(`[res ${r.ctx.ip}] ${r.user?r.user.name:r.sessionID}`.gray.dim)
  // }))



  mw.cache('notFound', mw.res.notFound({
    onBot: (req, res) => {
      $log('notFound'.white, req.ctx.bot)
      if (req.ctx.bot && req.ctx.bot.match('disallow')) {
        analytics.issue.call(req.ctx, 'security', { crawl: 404, url: req.originalUrl })
        return res.status(200).send('')
      }
      return res.status(404).send('Page not found')
    }
  }))


  mw.cache('error', mw.res.error({
    render: { layout:false, about: config.about },
    quiet: _.get(config, 'log.app.quiet'),
    formatter: (req, e) => `${e.message}`,
    onError: (req, e) => config.log.comm.err || config.log.app.verbose ?
      COMM('ses').error(e, { subject:`{AP} ${e.message}`,
       text: $request(req, e, {body:true}) + '\n\n' + e.stack.toString()
      }) : 0
  }))


}
