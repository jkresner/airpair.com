module.exports = (app, mw) =>

  function(req,res,next) {
    if (!req.locals.htmlHead && !req.locals.r.htmlHead)
      throw Error("Set landingPage req.locals.htmlHead")

    if (!req.locals.htmlHead)
      req.locals.htmlHead = req.locals.r.htmlHead

    if (req.locals.r.htmlHead)
      delete req.locals.r.htmlHead

    // $log('pageLanding', req.locals.r.tags)
    mw.res.page(req.locals.r.key, {layout:'landing'})(req,res,next)
  }
