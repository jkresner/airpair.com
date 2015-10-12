var {Redirect}              = DAL



var get = {
  getAllRedirects(cb) {
    var opts = { select: '_id previous current type', sort: 'previous' }
    Redirect.getManyByQuery({}, opts, cb)
  }
}


var save = {

  createRedirect(o, cb) {
    o.created = new Date()
    Redirect.create(o, cb)
  },

  deleteRedirectById(_id, cb) {
    Redirect.delete({_id}, cb)
  }

}


module.exports = _.extend(get, save)
