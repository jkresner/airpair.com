import * as md5     from '../util/md5'
var util =    require('../../shared/util')

var select = {
  session: {
    '_id': 1,
    'name': 1,
    'email': 1,
    'emailVerified': 1,
    'roles': 1,
  },
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
  }
}

module.exports = {

  select: {
    session: select.session,
    sessionFull: select.sessionFull,
    usersInRole: select.usersInRole,
    search: select.search,

    sessionFromUser(user) {
      return util.selectFromObject(user, select.session)
    },

    setAvatar(user) {
      if (user && user.email) user.avatar = md5.gravatarUrl(user.email)
      else user.avatar = undefined
    },

    //-- TODO, watch out for cache changing via adds and deletes of records
    inflateTagsAndBookmarks(user, cb) {
      if (!user || (!user.tags && !user.bookmarks) ) return cb(null, user)

      cache.ready(['tags','posts','workshops'], () => {
        // if (logging) $log('inflateTagsAndBookmarks.start')

        var tags = []
        for (var t of (user.tags || []))
        {
          var tt = cache['tags'][t.tagId]
          if (tt) {
            var {name,slug} = tt
            tags.push( _.extend({name,slug},t) )
          }
          else
            $log(`tag with Id ${t.tagId} not in cache`)
            // return cb(Error(`tag with Id ${t.tagId} not in cache`))
        }

        var bookmarks = []
        for (var b of (user.bookmarks || []))
        {
          var bb = cache[b.type+'s'][b.objectId]
          if (bb) {
            var {title,url} = bb
            bookmarks.push( _.extend({title,url},b) )
          }
          else
            $log(`${b.type} with Id ${b.objectId} not in cache`)
            // return cb(Error(`${b.type} with Id ${b.objectId} not in cache`))
        }

        // if (logging) $log('inflateTagsAndBookmarks.done', {tags, bookmarks})
        cb(null, _.extend(user, {tags, bookmarks}))
      })
    }


  },

  query: {
  }

}
