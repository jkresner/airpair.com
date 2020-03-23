// pd == "page data"
module.exports = (app, mw) => {


  mw.cache('pd_landing', view =>
    function(req, res, next) {
      honey.logic.routes.landing.chain(view,
        (e, r) => next(e, assign(req.locals, r?r:{})) )
    })


  return (path, opts) => mw.data.page(path, opts)

}
