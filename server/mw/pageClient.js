module.exports = (app, mw) => 
  
  (req,res,next) => {
    req.locals.noindex = true
    if (req.user) 
      req.user = _.pick(req.user,'_id','name','location','avatar')
    mw.res.page('client', {layout:false})(req, res, next)
  }