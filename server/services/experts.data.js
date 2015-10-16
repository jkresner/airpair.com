var md5           = require('../util/md5')
var {selectFromObject}    = util

var mojoUser = 'email name initials username location auth.gp.link auth.gh.login auth.gh.followers auth.so.link auth.so.reputation auth.bb.username auth.in.id auth.tw.username'

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
      'matching': 1,
      'lastTouch.utc': 1,
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
      'isV0': 1,
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
    userCopy: {
      '_id': 1,
      'name': 1,
      'email': 1,
      'emailVerified': 1,
      'username': 1,
      'initials': 1,
      'bio': 1,
      'location': 1,
      'social.gp.id': 1,
      'social.gp.link': 1,
      'social.gh.followers': 1,
      'social.gh.login': 1,
      'social.so.link': 1,
      'social.so.reputation': 1,
      'social.bb.username': 1,
      'social.bb.followers': 1,
      'social.in.id': 1,
      'social.in.endorsements': 1,
      'social.tw.username': 1,
      'social.tw.followers_count': 1,
    },
    updateME: {
      '_id': 1,
      'userId': 1,
      'user': 1,
      'settings': 1,
      'rate': 1,
      'brief': 1,
      'tags': 1,
      'homepage': 1,
      'matching': 1,
      'activity': 1,
      'lastTouch': 1,
      'availability': 1,
      'gmail': 1,
      'pic': 1,
      // 'karma': 1,
      //v0 ?
      bookMe: 1
    },
    v0unset:'name email username location timezone homepage karma gh gp tw in al so bb',
    migrateInflate(r) {
      // $log('migrateInflate.r', r)
      if (!r.user) return

      // $log('migrateInflate'.yellow, r._id, r, r.user)
      r.avatar = (r.email||r.gmail||r.user.email) ?
        md5.gravatarUrl(r.email||r.gmail||r.user.email) : r.pic

      var social = r.user.social || r.user.auth
      delete r.user.social
      delete r.user.auth

      // $log('social'.white, r.user)
      // how we handle staying v0 on front-end
      r.userId = r.user._id
      delete r.user._id
      r = _.extend(_.extend(r,r.user),social)
      r.timezone = r.location.timeZoneId
      r.location = r.location.name
      r.avatar = md5.gravatarUrl(r.email)
      delete r.user
      if (r.localization) delete r.localization

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
            $log(`tag with Id ${t.tagId} not in cache`)
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
        'rate': { $gt: 0 },
        'tags._id': { $in: tags.map(t=>t._id) }
      }

      if (!includeBusy)
        q['availability.status'] = { $ne: 'busy' }

      if (exclude) {
        q['username'] = { $nin: exclude }
        q['user.username'] = { $nin: exclude }
      }

      // TODO add minimum rate filter
      // if (query.rate)
      // rate: { $lt: request.budget }

      return q
    }
  },

  options: {
    newest100: { limit: 100, sort: { '_id': -1 }, join: { 'userId': mojoUser } },
    active100: { limit: 100, sort: { 'lastTouch.utc': -1 } }
  },

  data: {
    getForExpertsPage: {
      experts: [
        {
          _id: '5230d1a9746ee90200000018',
          name: 'Ari Lerner',
          username: 'auser',
          avatar: 'https://avatars1.githubusercontent.com/u/529',
          tags: ['angularjs','ruby-on-rails','erlang'],
          bio: 'ng-book author',
          rate: 280
        },
        {
          _id: '524304901c9b0f0200000012',
          name: 'Matias Niemelä',
          username: 'matsko',
          avatar: '//secure.gravatar.com/avatar/3c0ca2c60c5cc418c6b3dbed47b23b69',
          tags: ['angularjs', 'html5', 'testing'],
          bio: 'AngularJS Core Team Member',
          rate: 280
        },
        {
          _id: '52fb2ea294ba990200000037',
          name: 'Basarat Ali',
          username: 'basarat',
          avatar: '//secure.gravatar.com/avatar/1400be56ff17549b926dd3260da4a494',
          tags: ['typescript','javascript','angularjs'],
          bio: '',
          rate: 130
        },
        {
          _id: '52728efff7f1d4020000001a',
          name: 'Todd Motto',
          username: 'toddmotto',
          avatar: '//secure.gravatar.com/avatar/b56bb22b3a4b83c6b534b4c114671380',
          tags: ['angularjs','chrome','html5'],
          bio: 'Google Developer Expert',
          rate: 250
        },
        {
          _id: '532950ab264a24020000001f',
          name: 'Abe Haskins',
          username: 'abeisgreat',
          avatar: '//secure.gravatar.com/avatar/fbb79df0f24e736c8e37f9f195a738cc',
          tags: ['angularjs','firebase','angularfire'],
          bio: 'AngularFire Contributor',
          rate: 220
        },
        {
          _id: '5395ecdb09353b020021bf24',
          name: 'Uri Shaked',
          username: 'urish',
          avatar: '//secure.gravatar.com/avatar/fbf41c66afb1e3807b7b330c2d8fcc28',
          tags: ['angularjs', 'node.js', 'gulp'],
          bio: 'Google Developer Expert',
          rate: 160
        },
        {
          _id: '52f16191b437df020000003d',
          name: 'Mark Meyer',
          username: 'nuclearghost',
          avatar: '//secure.gravatar.com/avatar/6c2f0695e0ca4445a223ce325c7fb970',
          tags: ['angularjs','angular-ui','ios'],
          bio: '',
          rate: 90
        },
        {
          _id: '5387a1e7e558890200722fd5',
          name: 'Fernando Villalobos',
          username: 'fervisa',
          avatar: '//secure.gravatar.com/avatar/0e74aa62f0a56b438237adf678eae3a0',
          tags: ['angularjs','coffeescript','ruby'],
          bio: '',
          rate: 40
        }
      ]
    }
  }

}


module.exports = data
