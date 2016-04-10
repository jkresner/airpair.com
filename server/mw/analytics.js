
module.exports = (app, mw) => {

  //-- because the db is not yet connected
  var track = type =>
    function() { global.analytics[type].apply(this, arguments) }


  mw.cache('trackImpression', mw.analytics.impression(track('impression'), {
      type:'ad',
      project: d => ({type:'ad',oId:d._id,img:`${d.brand}/${d.img}`})
    }
  ))


  mw.cache('trackAuth', mw.analytics.event('auth', track('event')))



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
      project: d => ({_id:d._id,url:d.url.replace('https://www.airpair.com', '')}),
    }
  ))

  mw.cache('trackLanding', mw.analytics.view('landing', track('view'), {
      onBot: ()=>{},
      project: d => ({_id:d._id,key:d.key,url:d.url}),
    }
  ))

  mw.cache('trackTag', mw.analytics.view('tag', track('view'), {
      onBot:()=>{}
    }
  ))

  mw.cache('trackJob', mw.analytics.view('job', track('view'), {
      onBot:()=>{},
      project:r=>({_id:r._id})
    }
  ))

}
