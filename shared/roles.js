var {idsEqual} = require('./util')

module.exports = {
  isAdmin(user) {
    return user ? _.contains(user.roles, 'admin') : false
  },
  order: {
    isCustomer(user, o) {
      return user ? idsEqual(o.userId, user._id) : false
    }
  },
  request: {
    isCustomer(user, o) {
      if (!o.userId) return false
      return user ? idsEqual(o.userId, user._id) : false
    },
    isCustomerOrAdmin(user, o) {
      if (!o.userId) return false
      return user
        ? idsEqual(o.userId, user._id) || _.contains(user.roles, 'admin')
        : false
    },
    isExpert(user, request) {
      if (!user) return false
      for (var i=0;i<request.suggested.length;i++)
      {
        if (idsEqual(request.suggested[i].expert.userId, user._id))
          return true
      }
      return false
    }
  },
  post: {
    isOwnerOrEditor(user, post) {
      var isAdmin = _.contains(user.roles, 'admin')
      var isEditor = _.contains(user.roles, 'editor')
      var isOwner = idsEqual(user._id, post.by.userId)

      return isAdmin || isEditor || isOwner
    },
    isForker(user, post) {
      return _.find(post.forkers, (f)=>idsEqual(user._id, f.userId))
    }
  }
}
