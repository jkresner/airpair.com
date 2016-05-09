
module.exports = {

  getAllRedirects(cb) {
    var opts = { select: '_id previous current type', sort: { 'current': -1 } }
    DAL.Redirect.getAll(opts, cb)
  },

  createRedirect(o, cb) {
    o.created = new Date()
    DAL.Redirect.create(o, cb)
  },

  deleteRedirectById(_id, cb) {
    DAL.Redirect.delete({_id}, cb)
  }

}
