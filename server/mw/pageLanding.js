module.exports = (app, mw) =>

  /**
  *  Render page:
  *  - Url to be tracked as full http pageview
  *  - No client js includes (optionally add at {page}.hbs level)
  *  - No html/layout wraps inside of body
  *                                                                            */
  function(req,res,next) {
    let htmlHead = (req.locals.r||{}).htmlHead || req.locals.htmlHead
    if (!htmlHead) throw Error("landing page req.locals.htmlHead required")

    if (/apple/i.test(req.ctx.ud)) htmlHead.apple = true
    if (/android/.test(req.ctx.ud)) htmlHead.android = true
    if (/ms/.test(req.ctx.ud)) htmlHead.ms = true

    assign(req.locals,{htmlHead})
    if ((req.locals.r||{}).htmlHead) delete req.locals.r.htmlHead

    mw.res.page(req.locals.view, {layout:'landing'})(req,res,next)
  }
