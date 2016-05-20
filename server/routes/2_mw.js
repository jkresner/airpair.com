module.exports = function(app, mw, {redirects,tags}) {

  if (config.middleware.slow)
    app.use(mw.req.slow(config.middleware.slow, {
      onSlow({ctx,originalUrl,method,body}, duration) {
        analytics.issue(ctx, 'req:slow', 'performance',
          assign({ duration, url: originalUrl, method }, body ? {body} : {}) )
      }}
    ))

  if (config.middleware.ctx.dirty)
    app.use(mw.$.reqDirty)

}



