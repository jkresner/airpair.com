module.exports = (app, mw) =>

  mw.analytics.event('auth',
    // onTracked is null, unless we set it
    function(req, event, data, onTracked) {
      // if (!data || Object.keys(data).length == 0) event += `:fail`
      // }
      req.ctx.ref = `${req.ctx.ref?req.ctx.ref+' << ':''}` + req.originalUrl

      global.analytics.event(req, event, data, onTracked)
  })
