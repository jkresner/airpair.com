module.exports = (app, mw) => 
  
  function(req,res,next) {
    if (!req.locals.htmlHead && !req.locals.r.htmlHead) throw Error("Set landingPage req.locals.htmlHead")
    if (!req.locals.htmlHead) req.locals.htmlHead = req.locals.r.htmlHead
    if (req.locals.r.htmlHead) delete req.locals.r.htmlHead
    mw.res.page(req.locals.r.key, pageOpts('landing'))(req,res,next)
  }