module.exports = (app, mw) =>

  /**
  *  Render page:
  *  - Url(s) to be tracked as ga event
  *  - Client js include /js/app.js
  *  - window.pageData.session available
  *  - Default logged in html layout
  *                                                                            */
  (req,res,next) => {
    req.locals.noindex = true
    if (req.user)
      req.user = _.pick(req.user,'_id','name','location','avatar')
    mw.res.page('client', {layout:false})(req, res, next)
  }
