var md5             = require('../util/md5')
var logging         = config.log.auth || false
var bcrypt          = require('bcrypt')


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
    'location': 1,
    'auth.gh.login': 1,
    'auth.so.link': 1,
    'auth.bb.username': 1,
    'auth.in.id': 1,
    'auth.tw.screen_name': 1,
    'auth.al.angellist_url': 1,
    'auth.gp.id': 1,
    'auth.gp.link': 1,
    'auth.gp.url': 1,
    'auth.gp.email': 1,
    'auth.sl.username': 1
  },
  usersInRole: {
    '_id': 1,
    'roles': 1,
    'email': 1,
    'name': 1,
    'initials': 1
  },
  search: '_id email name initials username bio auth.gp'
}

var data = {

  bcrypt,

  select: {
    session: select.session,
    sessionFull: select.sessionFull,
    usersInRole: select.usersInRole,
    search: select.search,

    analyticsSignup(user, sessionID, session) {
      return {_id:user._id,name:user.name,sessionID}
    },

    analyticsLogin(user, sessionID, session) {
      return {name:user.name,sessionID}
    },

    analyticsLink(user, provider, profile) {
      return {name:user.name,provider,username:profile.username||profile.login||profile.id}
    },

    sessionFromUser(user) {
      return util.selectFromObject(user, select.session)
    },

    getAvatar(user) {
      return (user && user.email) ? md5.gravatarUrl(user.email) : undefined
    },

    setAvatar(user) {
      if (user && user.email) user.avatar = md5.gravatarUrl(user.email)
      else user.avatar = undefined
    },

    passwordHash(pwd) {
      var hash = null
      while (!hash || hash[hash.length-1] == '.') {
        var hash = bcrypt.hashSync(pwd, bcrypt.genSaltSync(8))
        $logIt('auth.pw.set', 'while', hash)
      }

      return hash
    },

    resetHash(email) {
      var seedStr = email.replace('@', moment().add(3,'day').format('DDYYYYMM'))
      $logIt('auth.reset', 'before.while', seedStr, hash)
      var hash = bcrypt.hashSync(seedStr, config.auth.password.resetSalt)
      if (hash[hash.length-1] == '.')
        hash[hash.length-1] = 'a'
      return hash
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

    // providerProfile: {
    //   email: {
    //     gh(profile) { return profile.email },
    //     gp(profile) { return profile.emails[0] },
    //   }
    // },

    cb: {
      session(ctx, cb) {
        return (e, r) => {
          if (e || r == null) {
            if (!e && r == null) { e = Error('Session user does not exist') }
            if (logging) { $log('cbSession'.red, e, r) }
            return cb(e, r)
          }

          // if (r.emails)
            // r.email = _.find(r.emails, em => em.primary).value

          // if (r.google && r.google._json) {
          //   r.social = r.social || {}
          //   r.social.gp = { link: r.google._json.link || r.google._json.url
          //     , email: r.google._json.email }
          // }

          var obj = util.selectFromObject(r, data.select.sessionFull)
          if (obj.roles && obj.roles.length == 0) delete obj.roles

          // $log('session', obj.location)
          if (obj.location)
            obj.timeZoneId = obj.location.timeZoneId

          data.select.setAvatar(obj)
          data.select.inflateTagsAndBookmarks(obj, cb)

          if (obj.auth && obj.auth.al) {
            obj.auth.al.username = obj.auth.al.angellist_url.replace('https://angel.co/','')
            delete obj.auth.al.angellist_url
          }

          // $log('session.obj', obj)

          // if (ctx.user)
            // ctx.session.passport.user = data.select.sessionFromUser(obj)
        }
      },
      searchResults(cb) {
        return (e, r) => {
          for (var u of r)
          // {
            // if (u.google) {
            //   if (!u.email && u.google._json.email) u.email = u.google._json.email
            //   if (!u.name && u.google.displayName) u.name = u.google.displayName
            // }
            u = data.select.setAvatar(u);
          // }
          cb(e,r)
        }
      },
      // siteNotifications(cb) {
      //   return (e,r) => {
      //     if (e) return cb(e)
      //     r = util.selectFromObject(r, select.siteNotifications)
      //     cb(null, r.siteNotifications || [])
      //   }
      // },
    }
  },

  query: {
    existing: {
      byEmails(emails) {
        emails = emails.map(em => em.toLowerCase())
        return { '$or': [
          { 'email' : { $in: emails } },
          { 'emails.value' : { $in: emails } },
          { 'auth.gp.emails.value' : { $in: emails } },
          { 'auth.gp.email' : { $in: emails } },
          { 'auth.gh.email' : { $in: emails } },
          { 'auth.gh.emails.email' : { $in: emails } },
        ]}
      },
      gp(profile) {
        var emails = _.pluck(profile.emails||[], 'value')
        if (emails.length == 0) {
          if (!profile.email) throw Error("Google profile has no email")
          else emails = [profile.email.toLowerCase()]
        }
        var q = data.query.existing.byEmails(emails)
        q['$or'].push({'auth.gp.id':profile.id})
        return q
      },
      gh(profile) {
        var emails = _.pluck(profile.emails, 'email')
        var q = data.query.existing.byEmails(emails)
        q['$or'].push({'auth.gh.id':profile.id})
        return q
      }
    }
  },

  opts: {
    search: { limit:4, select: select.search }
  },

  data: {

    anonAvatars: [
      "/static/img/css/sidenav/default-cat.png",
      "/static/img/css/sidenav/default-mario.png",
      "/static/img/css/sidenav/default-stormtrooper.png"
    ],

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
