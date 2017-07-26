module.exports = (app, mw) => 

  mw.analytics.view('ad', analytics.view, {
    project:  d => ({_id:d._id,img:d.img,tag:d.tag,url:d.url})
  })