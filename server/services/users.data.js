import * as md5     from '../util/md5'
var bcrypt          = require('bcrypt')
var logging         = config.log.auth || false

var select = {
  session: {
    '_id': 1,
    'name': 1,
    'email': 1,
    'emailVerified': 1,
    'roles': 1,
  },
  sessionFull: {
    // '__v': 1,
    '_id': 1,
    'roles': 1,
    'bitbucket.username': 1,
    'bitbucket.displayName': 1,
    'github.username': 1,
    'github.displayName': 1,
    'google.id':1,
    'google._json.link':1,
    'google._json.email':1,
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
    'cohort.expert._id': 1,
    'membership': 1,
    'localization.location': 1,
    'localization.timezone': 1,
    'social.gh.username': 1,
    'social.so.link': 1,
    'social.bb.username': 1,
    'social.in.id': 1,
    'social.tw.username': 1,
    'social.al.username': 1,
    'social.gp': 1,
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
  siteNotifications: {
    '_id': 0,
    'siteNotifications': 1
  }
}

var data = {

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
      var noInflate = !user || (!user.tags && !user.bookmarks)
      if (noInflate) return cb(null, user)

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
    },

    cb: {
      session(ctx, cb) {
        return (e, r) => {
          if (e || r == null) {
            if (!e && r == null) { e = Error('Session user does not exist') }
            if (logging) { $log('cbSession'.red, e, r) }
            return cb(e, r)
          }

          if (r.google) {
            r.social = r.social || {}
            r.social.gp = { link: r.google._json.link, email: r.google._json.email }
          }

          var obj = util.selectFromObject(r, data.select.sessionFull)
          if (obj.roles && obj.roles.length == 0) delete obj.roles
          data.select.setAvatar(obj)
          data.select.inflateTagsAndBookmarks(obj, cb)
          // if (ctx.user)
            // ctx.session.passport.user = data.select.sessionFromUser(obj)
        }
      },
      searchResults(cb) {
        return (e, r) => {
          for (var u of r)
          {
            if (u.google) {
              if (!u.email && u.google._json.email) u.email = u.google._json.email
              if (!u.name && u.google.displayName) u.name = u.google.displayName
            }
            u = data.select.setAvatar(u);
          }
          cb(e,r)
        }
      },
      siteNotifications(cb) {
        return (e,r) => {
          if (e) return cb(e)
          r = util.selectFromObject(r, select.siteNotifications)
          cb(null, r.siteNotifications || [])
        }
      },
    }
  },

  query: {
    existing: function(email) {
      email = email.toLowerCase()
      return { '$or': [{email:email},{'google._json.email':email}] }
    }
  },

  data: {

    anonAvatars: [
      "/static/img/css/sidenav/default-cat.png",
      "/static/img/css/sidenav/default-mario.png",
      "/static/img/css/sidenav/default-stormtrooper.png"
    ],

    generateHash(seedString) {
      var hash = bcrypt.hashSync(seedString, bcrypt.genSaltSync(8))
      while (util.endsWith(hash,'.'))
      {
        hash = bcrypt.hashSync(seedString, bcrypt.genSaltSync(8))
      }
      return hash
    },

    maillists: [
      { id: '903d16f497',
       web_id: 117353,
       name: 'AirPair Newsletter',
       description: 'General annoucements from the AirPair team. We don\'t plan to use this very often moving forward',
       subscribe_url_short: 'http://eepurl.com/Q_gVj' },
      { id: '89214a2507',
       web_id: 209265,
       name: 'AirPair Developer Digest',
       description: 'New content published on AirPair daily, every other day or weekly depending on your preferences',
       subscribe_url_short: 'http://eepurl.com/bhlYr5' },
      { id: '69de3eea5d',
       web_id: 224469,
       name: 'AirPair Authors',
       description: 'Stay in touch with the AirPair authoring community and news about AirPair\'s Social Authoring platform',
       subscribe_url_short: 'http://eepurl.com/bhlYrH' },
      { id: 'f905e62324',
       web_id: 224465,
       name: 'AirPair Experts',
       description: 'Tips for getting more AirPairs, news about Expert features and more',
       subscribe_url_short: 'http://eepurl.com/bhlYrP' },
    ]

  },



}


module.exports = data
