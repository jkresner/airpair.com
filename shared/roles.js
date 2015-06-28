var {idsEqual} = require('./util')

var isAdmin = (user) =>
  user ? _.contains(user.roles, 'admin') : false


var roles = {
  isAdmin,
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
        ? idsEqual(o.userId, user._id) || isAdmin(user)
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
  booking: {
    isParticipant(user, o) {
      return _.find(o.participants,(p)=>_.idsEqual(p.info._id,user._id)) != null
    },
    isParticipantOrAdmin(user, o) {
      return isAdmin(user) || roles.booking.isParticipant(user,o)
    }
  },
  post: {
    isOwner(user, post) {
      return idsEqual(user._id, post.by.userId)
    },
    isOwnerOrEditor(user, post) {
      var isEditor = _.contains(user.roles, 'editor')
      var isOwner = idsEqual(user._id, post.by.userId)

      return isAdmin(user) || isEditor || isOwner
    },
    isForker(user, post) {
      return _.find(post.forkers, (f)=>idsEqual(user._id, f.userId))
    }
  }
}


module.exports = roles
