module.exports = function(app, mw) {

  app.use(/^\/(job)/,
      mw.$.badBot, mw.$.session)

  honey.Router('dynamic', {type:'html',sitemap:false})
    .use(mw.$.livereload)

    .param('job', API.Requests.paramFns.getByIdForReview)
    .get(['/job/:job','/review/:job'],
          mw.$.trackJob, mw.$.hybridPage('job'))

    .use([mw.$.badBot, mw.$.session, mw.$.reqFirst])


}
