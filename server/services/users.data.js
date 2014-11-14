module.exports = {

  select: {
    sessionFull: {
      '__v': 1,
      '_id': 1,
      'roles': 1,
      'bitbucket.username': 1,
      'bitbucket.displayName': 1,
      'github.username': 1,
      'github.displayName': 1,
      'google.id':1,
      'linkedin.id': 1,
      'stack.user_id': 1,
      'stack.link': 1,
      'twitter.username': 1,
      'email': 1,
      'emailVerified': 1,
      'primaryPayMethodId': 1,
      'name': 1,
      'initials': 1,
      'username': 1,
      'bio': 1,
      'tags': 1,
      'bookmarks': 1,
      'cohort.engagement': 1,
      'membership': 1
    },
    usersInRole: {
      '_id': 1,
      'roles': 1,
      'email': 1,
      'name': 1,
      'initials': 1
    },
    search: {
      '_id': 1,
      'email': 1,
      'name': 1,
      'initials': 1,
      'username': 1,
      'bio': 1,
      'google': 1,
      'cohort': 1,
      'membership': 1
    },
  },

  query: {
  }

}
