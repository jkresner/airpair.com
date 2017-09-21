module.exports = function(app, mw, {slow}) {

  if (slow)
    app.use(mw.req.slow(slow, {
      onSlow({ctx,originalUrl,method,body}, duration) {
        analytics.issue(ctx, 'req:slow', 'performance',
          assign({ duration, url: originalUrl, method }, body ? {body} : {}) )
      }}
    ))

}



