module.exports = (app, mw) => {


  var {bundles} = config.http.static
  var about = _.pick(config.about, ['name','version','author'])


  mw.cache('adminPage', mw.res.page('admin', {about,bundles,layout:false}))

  mw.cache('clientPage', mw.res.page('client', {about,bundles,layout:false}))

  mw.cache('hybridPage', page => mw.res.page(page, {about,bundles,layout:'hybrid'}))

  mw.cache('postPage', mw.res.page('post', {about,bundles,layout:'hybrid'}))

  mw.cache('serverPage', page => mw.res.page(page, {about,bundles,layout:'server'}))

  mw.cache('landingPage', (req,res,next) =>
    mw.res.page(req.landing.key, {about,bundles,layout:'landing'})(req,res,next))


  mw.cache('notFound', mw.res.notFound({
    onBot: (req, res, next) => {
      // $log('notFound'.white, req.ctx.bot)
      if (req.ctx.bot && req.ctx.bot.match('disallow')) {
        analytics.issue(req.ctx, 'security', { crawl: 404, url: req.originalUrl })
        return res.status(200).send('')
      }
      return res.status(404).send('Page not found')
    }
  }))


  mw.cache('error', mw.res.error({
    render: { layout:false, about },
    quiet: _.get(config, 'log.app.quiet'),
    // formatter: (req, e) => `${e.message}`,
    onError: (req, e) => {
      // $log('onError'.cyan, config.comm.dispatch.groups.errors)
      if (config.env != 'test' && config.comm.dispatch.groups.errors)
        COMM('ses').error(e, {
          subject:`{AP} ${e.message}`,
          text: $request(req, e, {body:true}) + '\n\n' + e.stack.toString() })
    }
  }))


}
