module.exports = {
  isAdmin(ctx) {
    return ctx.user ? _.contains(ctx.user.roles, 'admin') : false
  },
  order: {
    isCustomer(user, o) {
      return user ? _.idsEqual(o.userId, user._id) : false
    }
  },
  request: {
    isCustomer(user, o) {
      if (!o.userId) return false
      return user ? _.idsEqual(o.userId, user._id) : false
    },
    isCustomerOrAdmin(user, o) {
      if (!o.userId) return false
      return user
        ? _.idsEqual(o.userId, user._id) || _.contains(user.roles, 'admin')
        : false
    },
    isExpert(user, request) {
      if (!user) return false
      for (var i=0;i<request.suggested.length;i++)
      {
        if (_.idsEqual(request.suggested[i].expert.userId, user._id))
          return true
      }
      return false
    }
  }
}
