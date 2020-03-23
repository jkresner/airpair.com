module.exports = (app, mw) =>

  /**
  *  Render page:
  *  - #url(s) to be tracked as ga event
  *  - window.pageData.session
  *  - Client js include /js/app.js
  *  - Default logged in html layout
  *                                                                          */
  (req,res,next) => {
    req.locals.noindex = true
    if (req.user)
      req.user = _.pick(req.user,'_id','name','location','avatar')
    mw.res.page('client', {layout:false})(req, res, next)
  }
