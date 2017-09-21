module.exports = (app, mw) =>

  /**
  *  Render page:
  *  - Url to be tracked as full http pageview
  *  - No client js includes (optionally add at {page}.hbs level)
  *  - No html/layout wraps inside of body
  *                                                                            */
  function(req,res,next) {
    if (!req.locals.htmlHead && !req.locals.r.htmlHead)
      throw Error("Set landingPage req.locals.htmlHead")

    if (!req.locals.htmlHead)
      req.locals.htmlHead = req.locals.r.htmlHead

    if (req.locals.r.htmlHead)
      delete req.locals.r.htmlHead

    mw.res.page(req.locals.view, {layout:'landing'})(req,res,next)
  }
