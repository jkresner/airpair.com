module.exports = {
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
