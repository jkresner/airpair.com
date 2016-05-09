
module.exports = (app, mw) => {

  mw.cache('trackAuth', mw.analytics.event('auth',
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
    }
  ))


  //-- because the db is not yet connected
  var track = type => function() {
    global.analytics[type].apply(this, arguments) }


  mw.cache('trackImpression', mw.analytics.impression(track('impression'), {
      type:'ad',
      project: d => ({type:'ad',oId:d._id,img:d.img})
    }
  ))


  mw.cache('trackClick', mw.analytics.view('ad', track('view'), {
      project:  d => ({_id:d._id,img:d.img,tag:d.tag,url:d.url})
    }
  ))

  mw.cache('trackWorkshop', mw.analytics.view('workshop', track('view'), {
      onBot: () => {},
      project: d => ({_id:d._id,url:d.url})
    }
  ))

  mw.cache('trackPost', mw.analytics.view('post', track('view'), {
      onBot: () => {},
      project: d => ({_id:d._id,
        url: d.url.replace('https://www.airpair.com', '')
                  .replace('http://www.airpair.com', '')
      }),
    }
  ))

  mw.cache('trackLanding', mw.analytics.view('landing', track('view'), {
      onBot: ()=>{},
      project: d => ({_id:d._id,key:d.key,url:d.url}),
    }
  ))

  mw.cache('trackTag', mw.analytics.view('tag', track('view'), {
      onBot:()=>{},
      project:d=>({_id:d._id})
    }
  ))

  mw.cache('trackJob', mw.analytics.view('job', track('view'), {
      onBot:()=>{},
      project:d=>({_id:d._id})
    }
  ))

}
