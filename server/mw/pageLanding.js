module.exports = (app, mw) =>

  /**
  *  Render page:
  *  - Url to be tracked as full http pageview
  *  - No client js includes (optionally add at {page}.hbs level)
  *  - No html/layout wraps inside of body
  *                                                                            */
  function(req,res,next) {
    let {view,htmlHead} = req.locals
    if (!htmlHead) throw Error("landing page req.locals.htmlHead required")

    let platform = {}
    if (/apple/i.test(req.ctx.ud)) platform.apple = true
    if (/android/.test(req.ctx.ud)) platform.android = true
    if (/ms/.test(req.ctx.ud)) platform.ms = true

    assign(req.locals.htmlHead, platform)
    mw.res.page(view, {layout:'landing'})(req,res,next)
  }
