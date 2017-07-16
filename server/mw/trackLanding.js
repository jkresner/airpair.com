module.exports = (app, mw) => 

  mw.analytics.view('landing', analytics.view, {
    onBot: ()=>{},
    project: d => ({_id:d._id,key:d.key,url:d.url}),
  })