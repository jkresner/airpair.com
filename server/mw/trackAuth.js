module.exports = (app, mw) => 

  mw.analytics.event('auth',
    // onTracked is null, unless we set it
    function(req, event, data, onTracked) {
      if (event == 'auth')
        event = `auth:${req.url.split('/')[1]}`

      if (event == 'auth:github' && Object.keys(data) == 0)
        event += ':try'

        // if (!data || Object.keys(data).length == 0) event += `:fail`
      // }

      // $log('in hook', req.url, event, Object.keys(data), data)
      if (data._id && data.name)
        data = {usr:data}

      req.ctx.ref =`${req.ctx.ref?req.ctx.ref+' << ':''}` + req.originalUrl

      event = event.replace('github','gh')
                   .replace('google','gp')

      global.analytics.event(req, event, data, onTracked)
  })