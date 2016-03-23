
module.exports = {

  getAllRedirects(cb) {
    var opts = { select: '_id previous current type', sort: 'previous' }
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
