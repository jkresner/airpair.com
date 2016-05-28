module.exports = function(app, mw, {}) {

  if (mw.$.abuser)
    app.use(mw.$.abuser)


  if (config.middleware.slow)
    app.use(mw.req.slow(config.middlware.slow, {
      onSlow({ctx,originalUrl,method,body}, duration) {
        analytics.issue(ctx, 'req:slow', 'performance',
          assign({ duration, url: originalUrl, method }, body ? {body} : {}) )
      }}
    ))

}



