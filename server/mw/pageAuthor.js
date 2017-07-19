module.exports = (app, mw) =>

  page => function(req,res,next) {
    req.locals.noindex = true

    if (req.user) req.user = _.pick(req.user,'_id','name','location', 'avatar')
    mw.res.page(page, {layout:'author'})(req, res, next)
  }
