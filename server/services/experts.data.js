var md5           = require('../util/md5')
var {selectFromObject}    = require('../../shared/util')

var mojoUser = 'availability email name initials username location auth.gp.id auth.gp.link auth.gp.email auth.gh.login auth.gh.followers auth.so.link auth.so.reputation auth.bb.username auth.in.id auth.tw.screen_name auth.tw.followers_count'

var data = {

  select: {
    mojoUser,
    matches: {
      '_id': 1,
      'user': 1,
      'userId': 1,
      'name': 1,
      'email': 1,
      'tags._id': 1,
      'tags.sort': 1,
      'rate': 1,
      'minRate': 1,
      'gh': 1,
      'so': 1,
      'bb': 1,
      'in': 1,
      'tw': 1,
      'availability': 1,
      'matching': 1,
      'lastTouch._id': 1
    },
    search: {
      '_id': 1,
      'name': 1,
      'email': 1,
      'username': 1,
      'user': 1,
      'tags.short': 1,
      'bookMe.urlSlug': 1
    },
    me: {
      '_id': 1,
      'userId': 1,
      // 'user': 1,
      'name': 1,
      'email': 1,
      'username': 1,
      'initials': 1,
      'bio': 1,
      'location': 1,
      'timezone': 1,
      'tags': 1,
      'rate': 1,
      'brief': 1,
      'matching': 1,
      'lastTouch': 1,
      'hours': 1,
      'gh': 1,
      'gp': 1,
      'tw': 1,
      'in': 1,
      'al': 1,
      'so': 1,
      'bb': 1,
      'minRate': 1,
      'deals._id': 1,
      'deals.expiry': 1,
      'deals.price': 1,
      'deals.minutes': 1,
      'deals.type': 1,
      'deals.description': 1,
      'deals.rake': 1,
      'deals.tag': 1,
      'deals.target': 1,
      'deals.code': 1,
      'deals.redeemed': 1,
      'availability': 1,
    },
    // userCopy: {
    //   '_id': 1,
    //   'name': 1,
    //   'email': 1,
    //   'emailVerified': 1,
    //   'username': 1,
    //   'initials': 1,
    //   'bio': 1,
    //   'location': 1,
    //   'social.gp.id': 1,
    //   'social.gp.link': 1,
    //   'social.gh.followers': 1,
    //   'social.gh.login': 1,
    //   'social.so.link': 1,
    //   'social.so.reputation': 1,
    //   'social.bb.username': 1,
    //   'social.bb.followers': 1,
    //   'social.in.id': 1,
    //   'social.in.endorsements': 1,
    //   'social.tw.username': 1,
    //   'social.tw.followers_count': 1,
    // },
    // updateME: {
    //   '_id': 1,
    //   'userId': 1,
    //   'user': 1,
    //   'settings': 1,
    //   'rate': 1,
    //   'brief': 1,
    //   'tags': 1,
    //   'homepage': 1,
    //   'matching': 1,
    //   'activity': 1,
    //   'lastTouch': 1,
    //   'availability': 1,
    //   'gmail': 1,
    //   'pic': 1,
      // 'karma': 1,
      //v0 ?
      // bookMe: 1
    // },
    v0unset:'name email username location timezone homepage karma gh gp tw in al so bb',
    migrateInflate(r) {
      if (!r.user) return

      var {auth} = r.user
      delete r.user.auth

      if (auth && auth.tw) {
        auth.tw.followers = auth.tw.followers_count
        delete auth.tw.followers_count
      }

      // $log('social'.white, r.user)
      // how we handle staying v0 on front-end
      r.userId = r.user._id
      delete r.user._id
      r = _.extend(_.extend(r,r.user),{social:auth})

      if (!r.email && r.gp && r.gp.email) r.email = r.gp.email
      r.avatar = r.email ? md5.gravatarUrl(r.email) :
            "/static/img/css/sidenav/default-stormtrooper.png"


      delete r.user
      if (r.location) {
        r.timezone = r.location.timeZoneId
        r.location = r.location.name
        // delete r.location
      }

      r.minRate = r.minRate || r.rate
      r.tags = data.select.inflatedTags(r)

      if (r.deals) {
        for (var deal of r.deals) {
          if (deal.tag) deal.tag = cache.tags[deal.tag._id]
        }
      }

      // $log('migrateInflated.r'.white, r)
      return r
    },
      //-- TODO, watch out for cache changing via adds and deletes of records
    inflatedTags(expert) {
      var tags = []
      for (var t of (expert.tags || []))
      {
        if (t._id) {
          var tt = cache['tags'][t._id]
          if (tt) {
            var {name,slug} = tt
            tags.push( _.extend({name,slug},t) )
          }
          else
            $log(`expert.tag with Id ${t.tagId} not in cache`)
            // return cb(Error(`tag with Id ${t.tagId} not in cache`))
        }
      }

      if (expert.deals) {
        for (var deal of expert.deals) {
          if (deal.tag) deal.tag = cache.tags[deal.tag._id]
        }
      }

      return tags
    },
    cb: {
      addAvatar(cb) {
        return (e,r) => {
          if (e || !r) return cb(e,r)
          if (!r.user) {
            r.isV0 = true
            r.avatar = (r.email) ? md5.gravatarUrl(r.email) : r.pic
          }
          if (!r.pic)
            r.pic = md5.gravatarUrl(r.email||r.user.email)
          r.avatar = r.pic
          r.tags = data.select.inflatedTags(r)
          cb(null,r)
        }
      },
      migrateSearch(cb) {
        return (e,r) => {
          if (r) {
            for (var exp of r) {
              if (exp.user) {
                exp.name = exp.user.name
                exp.email = exp.user.email
                exp.username = exp.user.username
              }
              exp.avatar = md5.gravatarUrl(exp.email)
            }
          }
          cb(e,r)
        }
      },
      migrateInflate(cb) {
        return (e,r) => {
          if (e || !r) return cb(e)
          cb(null, data.select.migrateInflate(r))
        }
      },
      me(cb) {
        return (e,r) => {
          if (e || !r) return cb(e, r)
          r = data.select.migrateInflate(r)
          cb(null, selectFromObject(r, data.select.me))
        }
      },
      inflateList(cb) {
        return (e, experts) => {
          if (e) return cb(e)
          for (var expert of experts)
            expert = data.select.migrateInflate(expert)
          var experts = experts.filter(exp=>exp!=null)
          cb(null, experts)
        }
      }
    }
  },

  query: {
    ranked(tags, exclude, budget, includeBusy) {
      // $log('getRanked', query)

      var q = {
        'tags._id': { $in: tags.map(t=>t._id) }
      }

      if (!includeBusy)
        q['availability.status'] = { $ne: 'busy' }

      // if (exclude) {
        // q['user.username'] = { $nin: exclude }
      // }

      // TODO add minimum rate filter
      // if (query.rate)
      // rate: { $lt: request.budget }

      return q
    }
  },

  options: {
    newest100: { limit: 100, sort: { '_id': -1 }, join: { 'userId': mojoUser } },

    active100: { limit: 100, sort: { 'meta.lastTouch._id': -1 }, join: { 'userId': mojoUser } },
  },

  data: {

  }

}


module.exports = data
