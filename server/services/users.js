var logging         = false
import BaseSvc      from '../services/_service'
var User            = require('../models/user')
var svc             = new BaseSvc(User, logging)
var Data            = require('./users.data')
var UserAuth        = require('./users.auth')
var UserCohort      = require('./users.cohort')
var cbSession       = Data.select.cb.session

var get = {

  search(searchTerm, cb) {
    var opts = { options: { limit: 4 }, fields: Data.select.search }
    var rex = new RegExp(searchTerm, "i")
    var query = searchTerm ? { '$or' : [{email : rex},{name : rex},{'google.displayName' : rex},{'google._json.email' : rex}] } : null;
    svc.searchMany(query, opts, Data.select.cb.searchResults(cb))
  },

  getUsersInRole(role, cb) {
    svc.searchMany({ roles:role }, { fields: Data.select.usersInRole }, cb)
  },

  getById(id, cb) {
    svc.searchOne({ _id:this.user._id },{}, cb)
  },

  getProviderScopes(cb) {
    Wrappers.GitHub.getScopes(this.user, cb)
  },

  getSession(cb) {
    // $log('getSession anonymous'.magenta, this.user == null)
    if (this.user == null)
    {
      var avatar = Data.data.anonAvatars[_.random(1)]

      if (this.session.anonData && this.session.anonData.email)
      {
        Data.select.setAvatar(this.session.anonData)
        avatar = this.session.anonData.avatar
      }

      var session = _.extend({
          authenticated: false,
          sessionID: this.sessionID,
          avatar
        }, this.session.anonData)

      Data.select.inflateTagsAndBookmarks(session, cb)
    }
    else
    {
      svc.searchOne({ _id:this.user._id },{ fields: Data.select.sessionFull }, cbSession(this, cb))
    }
  },

  getSiteNotifications(cb) {
    svc.searchOne({ _id:this.user._id }, {}, Data.select.cb.siteNotifications(cb))
  }

}

//-- Not sure, but this will probably become intelligent
function updateAsIdentity(data, trackData, cb) {
  if (trackData)
    analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})


  if (this.user) {
    var done = cbSession(this, cb)

    var ctxUser = this.user
    var id = this.user._id

    // var unset = { bitbucketId: 1 }
    // svc.updateWithUnset(id, unset, (e,user) => {})

    // o.updated = new Date() ??
    // authorization etc.
    svc.updateWithSet(id, data, (e,user) => {
      if (e) return cb(e)
      if (!user) return cb(Error(`Failed to update user with id: ${id}`))

      // console.log('track save', ctx, data)

      //-- Very magic important line
      if (!_.isEqual(this.session.passport.user, Data.select.sessionFromUser(user)))
        this.session.passport.user = Data.select.sessionFromUser(user)

      //-- Migrate social accounts to v1 structure
      {
        var migrate = false
        var social = user.social || {}
        var connected = _.keys(social).length
        if (user.bitbucket && !social.bb) social.bb = user.bitbucket
        if (user.github && !social.gh) social.gh = user.github
        if (user.linkedin && !social.in) social.in = user.linkedin
        if (user.stack && !social.so) social.so = user.stack
        if (user.twitter && !social.tw) social.tw = user.twitter
        if (_.keys(social).length != connected) migrate = true
        user.social = social
        // $log('migrate.social', migrate)
        var bookmarks = user.bookmarks || []
        var tags = user.tags || []
        var siteNotifications = user.siteNotifications || []
        var roles = user.roles || []
 // || !user.bookmarks || !user.tags || !user.siteNotifications || !user.roles
        if (migrate) {
          $log(`Mirgrating user ${user._id} ${user.email}`.yellow)
          svc.updateWithSet(id, {social,bookmarks,tags,siteNotifications,roles}, done)
        }
        else
          done(null, user)
      }

    })
  }
  else {
    // $log('in updateAsIdentity: anon', data, this)

    this.session.anonData = _.extend(this.session.anonData, data)
    get.getSession.call(this, cb)

  }
}



function toggleSessionItem(type, item, maxAnon, maxAuthd, comparator, trackData, cb)
{
  var up = {}
  if (this.user) {
    return svc.searchOne({ _id: this.user._id }, null, (e,r) => {
      if (e || !r) return cb(e,r)
      var list = util.toggleItemInArray(r[type], item, comparator)
      if (list.length > maxAuthd) return cb(Error(`Max allowed ${type} reached`))
      up[type] = list
      updateAsIdentity.call(this, up, trackData, cb)
    })
  }

  var existing = this.session.anonData[type]
  var list = util.toggleItemInArray(existing, item, comparator)
  if (list.length > maxAnon) return cb(Error(`Max ${maxAnon} ${type} reached. <a href="/login">Login</a> to increase limit.`))
  up[type] = list
  updateAsIdentity.call(this, up, trackData, cb)
}



var save = {

  //-------- Tags and bookmarks

  toggleTag(tag, cb) {
    var name = tag.name
    var tagId = tag._id
    tag = { _id: svc.newId().toString(), tagId: tag._id, sort: 0 }
    var tagCompator = (i) => _.idsEqual(i.tagId, tagId)
    var trackData = { type: 'tag', name }
    toggleSessionItem.call(this, 'tags', tag, 3, 6, tagCompator, trackData, cb)
  },

  toggleBookmark(type, id, cb) {
    if (!type) $log('toggleBookmark.type', type, cb)
    var bookmark = { _id: svc.newId().toString(), objectId: id, type, sort: 0 }
    var bookmarkComparator = (i) => _.idsEqual(i.objectId,id)
    var props = cache.bookmark(type,id)
    var trackData = { type: 'bookmark', objectType: type, objectId: id, url: props.url, name: props.title }
    toggleSessionItem.call(this, 'bookmarks', bookmark, 3, 15, bookmarkComparator, trackData, cb)
  },

  //-- Used for saing sort order
  updateTags(tags, cb) {
    for (var t of tags) { if (!t.tagId) t.tagId = t._id } // if you pass in normal tags it breaks
    updateAsIdentity.call(this, {tags}, null, cb)
  },

  updateBookmarks(bookmarks, cb) {
    updateAsIdentity.call(this, {bookmarks}, null, cb)
  },

  toggleSiteNotification(name, cb) {
    svc.searchOne({ _id:this.user._id }, null, (e,r) => {
      var existing = _.find(r.siteNotifications, (n) => n.name == name)
      if (!r.siteNotifications)
        r.siteNotifications = [{name}]
      else if (existing)
        r.siteNotifications = _.without(r.siteNotifications, existing)
      else
        r.siteNotifications.push({name})

      updateAsIdentity.call(this, {siteNotifications:r.siteNotifications}, null, Data.select.cb.siteNotifications(cb))
      // svc.update(this.user._id, r, Data.select.cb.siteNotifications(cb))
    })
  },

  //-------- Admin user updates

  toggleUserInRole(userId, role, cb) {
    svc.searchOne({ _id:userId }, null, (e,r) => {
      if (!r.roles)
        r.roles = [role]
      else if ( _.contains(r.roles, role) )
        r.roles = _.without(r.roles, role)
      else
        r.roles.push(role)

      // note here we are not updating as the identity
      // so we call svc.update rather than update
      svc.update(userId, r, cb)
    })
  },

  changeBio(bio, cb) {
    var ups = {bio}
    updateAsIdentity.call(this, ups, {type:'expertBio', by: this.user.email}, cb)
  },

  changeName(name, cb) {
    updateAsIdentity.call(this, {name}, null, cb)
  },

  changeUsername(username, cb) {
    var userId = this.user._id
    if (!username || username == '') {
      User.findOneAndUpdate({_id:this.user._id}, { $unset: { username: '' } } , cbSession(this, cb))
    }
    else {
      svc.searchOne({username}, null, (e,r) => {
        if (r && !_.idsEqual(userId,r._id)) {
          return cb(svc.Forbidden(`${username} already taken, please choose a different username`))
        }
        updateAsIdentity.call(this, {username}, null, cb)
      })
    }
  },

  changePrimaryPayMethodId(primaryPayMethodId, cb) {
    updateAsIdentity.call(this, {primaryPayMethodId}, null, cb)
  },

  changeInitials(initials, cb) {
    updateAsIdentity.call(this, {initials}, null, cb)
  },

  // Change email can be used both to change an email
  // and to set and send a new email hash for verification
  changeEmail(email, cb) {
    email = email.trim().toLowerCase()
    if (this.user) {
      var isVerifyRequest = this.user.email == email
      updateEmailToBeVerified.call(this, email, cb, (e, user, hash) => {
        if (!e && hash && isVerifyRequest)
          mailman.sendVerifyEmail(user, hash)
        cb(e, user)
      })
    } else
      svc.searchOne(Data.query.existing(email), null, (e,r) => {
        if (r) {
          delete this.session.anonData.email
          return cb(svc.Forbidden(`${email} already registered.`))
        }
        updateAsIdentity.call(this, {email}, null, cb)
      })
  },

  verifyEmail(hash, cb) {
    svc.searchOne({ email:this.user.email }, null, (e,r) => {
      if (e || !r) {
        $log('verifyEmail.error'.red, e, r)
        return cb(e,r)
      }
      if (r.local.changeEmailHash == hash) {
        var trackData = { type: 'emailVerified', email: this.user.email }
        updateAsIdentity.call(this, { emailVerified: true }, trackData, cb)
      }
      else
        cb(Error("e-mail verification failed, hash is not valid"))
    })
  },

  //-------- Account email
  requestPasswordChange(email, cb) {
    var anonymous = this.user == null
    svc.searchOne(Data.query.existing(email), null, (e,user) => {
      if (e || !user) return cb(svc.Forbidden(`No user found with email ${email}`))

      var ups = { local: _.extend(user.local || {}, {
        changePasswordHash: Data.data.generateHash(email),
        passwordHashGenerated: new Date()
      })}

      //-- Previously had a google login without a v1 upsert migrate
      if (!user.email && user.google) {
        ups.email = user.google._json.email
        ups.name = user.google.displayName || 'there noname'
      }

      var trackData = { type: 'change-password-request', email, anonymous }
      analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})
      // self.user = user
      //-- Update the user record regardless if anonymous or authenticated
      svc.updateWithSet(user._id, ups, (e,r) => {
        if (e) return cb(e)
        mailman.sendChangePasswordEmail(r, ups.local.changePasswordHash)
        return cb(null, {email})
      })
    })
  },

  changePassword(hash, password, cb) {
    svc.searchOne({'local.changePasswordHash': hash}, null, (e,user) => {
      if (e||!user) return cb(svc.Forbidden('Valid reset hash not found. Your token could be used or expired. Try <a href="/v1/auth/reset">Reset your password</a> again?'))

      // we've just received the hash that we sent to user.email
      // so mark their email as verified
      delete user.local.changePasswordHash
      delete user.local.passwordHashGenerated
      user.local.password = Data.data.generateHash(password)

      var update = {
        'emailVerified': true,
        local: user.local
      }

      var trackData = { type: 'password', hash }
      this.user = user
      updateAsIdentity.call(this, update, trackData, cb)
    })
  },

  changeLocationTimezone(locationData, cb) {
    var lat = locationData.geometry.location.A || locationData.geometry.location.k
    var lon = locationData.geometry.location.F || locationData.geometry.location.D
    var timeZoneTimestamp = moment().unix()
    Wrappers.Timezone.getTimezoneFromCoordinates(lat, lon, timeZoneTimestamp, (e,r) => {
      if (logging) $log('changeLocationTimezone'.cyan, e, r)
      if (e) return cb(e)

      var localization = {
        location: locationData.formatted_address,
        locationData: _.pick(locationData, 'address_components', 'geometry', 'name'),
        timezone: r.raw_response.timeZoneName,
        timezoneData: r.raw_response,
      }

      updateAsIdentity.call(this, {localization}, null, cb)
    })
  },

}


function updateEmailToBeVerified(email, errorCB, successCB) {
  email = email.toLowerCase()
  var {user} = this
  var trackData = { type: 'email', email, previous: user.email, previousVerified: user.emailVerified }

  svc.searchOne({_id:this.user._id}, {}, (ee, r) => {
    if (r.email == email && r.emailVerified) return errorCB(Error(`${email} already verified`))

    var ups = { local: r.local || {} }

    if (r.email != email) {
      ups.email = email
      ups.emailVerified = false
    }

    if (!r.local || !r.local.changeEmailHash || !r.local.emailHashGenerated
      || !moment(r.local.emailHashGenerated).isAfter(moment().add(-3,'hours')))
    {
      ups.local.changeEmailHash = Data.data.generateHash(email)
      ups.local.emailHashGenerated = new Date
    }

    updateAsIdentity.call(this, ups, trackData, (e,user) => {
      if (e) {
        if (e.message.indexOf('duplicate key error index') != -1) return errorCB(Error('Email belongs to another account'))
      }
      successCB(e, user, ups.local.changeEmailHash)
    })
  })
}

save.updateEmailToBeVerified = updateEmailToBeVerified
var cohortFns = _.wrapFnList(UserCohort,(fn, fnName) => {
  return function() {
    this.svc = svc
    return fn.apply(this, arguments)
  }
})


function callAuthSvcFn(thisCtx, fnName, args) {
  var cb = args[args.length-1]
  args = [].slice.call(args)
  var cbSessioned = cbSession(thisCtx,cb)
  args.push(cbSessioned)
  thisCtx.svc = svc
  thisCtx.cohortFns = cohortFns
  UserAuth[fnName].apply(thisCtx, args)
}

var authWraps = {
  googleLogin() { callAuthSvcFn(this,'googleLogin',arguments) },
  localSignup() { callAuthSvcFn(this,'localSignup',arguments) },
  localLogin() { callAuthSvcFn(this,'localLogin',arguments) },
  connectProvider() { callAuthSvcFn(this,'connectProvider',arguments) }
}


save = _.extend(save, _.extend(authWraps,cohortFns))
module.exports = _.extend(get,save)
