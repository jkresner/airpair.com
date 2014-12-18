module.exports = {
  order: {
    isCustomer(user, o) {
      return user ? _.idsEqual(o.userId, user._id) : false
    }
  },
  request: {
    isCustomer(user, o) {
      return user ? _.idsEqual(o.userId, user._id) : false
    },
    isExpert(user, request) {
      if (!user) return false
      for (var s of request.suggested) {
        if (_.idsEqual(s.expert.userId, user._id))
          return true
      }
      return false
    }
  }
}
