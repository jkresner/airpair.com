module.exports = (app, mw) =>

  key => (req, res, next) =>
    cache.get('landing', honey.logic.routes.landing.exec, (e, r) =>
      next(null, assign(req.locals, {
        r: _.omit(r[key],'htmlHead'), htmlHead: r[key].htmlHead })
      ))

