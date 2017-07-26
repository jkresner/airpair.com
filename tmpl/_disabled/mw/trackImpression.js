module.exports = (app, mw) => 

  mw.analytics.impression(analytics.impression, 
    { type:'ad', project: d => ({type:'ad',oId:d._id,img:d.img}) })