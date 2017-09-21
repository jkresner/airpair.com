module.exports = (app, mw) =>

  (req, res, next) => {
    var _id = honey.model.DAL.Post.toId(req.params.id)
    var select = '_id by._id reviews stats subscribed log'
    var q = {'reviews._id':_id}
    honey.model.DAL.Post.getByQuery(q, {select}, (e,r) => {
      if (e||!r) return next(e||Error(`Review param not found by ${req.params.id}`))
      req.postreviews = r
      next()
    })
  }
