var logging                  = false
var {User}                   = DAL
var {select,query,opts,data} = require('./users.data')
var cbSession                = select.cb.session

var get = {

  search(searchTerm, cb) {
    var matchFields = 'name email auth.gp.name auth.gp.email'
    User.searchByRegex(searchTerm, matchFields, opts.search, select.cb.searchResults(cb))
  },

  getMe(cb) {
    User.getById(this.user._id, cb)
  },

  getSession(cb) {
    // // $log('getSession anonymous'.magenta, this.user == null)
    if (this.user)
      User.getById(this.user._id,{ select: select.sessionFull }, cbSession(this, cb))
    else
    {
      // var avatar = Data.data.anonAvatars[_.random(1)]

      // if (this.session.anonData && this.session.anonData.email)
      // {
      //   Data.select.setAvatar(this.session.anonData)
      //   avatar = this.session.anonData.avatar
      // }

      var session = _.extend({
        authenticated: false,
        sessionID: this.sessionID,
        // avatar
      }, this.session.anonData)

      select.inflateTagsAndBookmarks(session, cb)
    }
  },

  getUsersInRole(role, cb) {
    User.getManyByQuery({ roles:role }, { select: select.usersInRole }, cb)
  },

  getProviderScopes(cb) {
    cb(V2DeprecatedError('User.getProviderScopes'))
    // Wrappers.GitHub.getScopes(this.user, cb)
  },

  getSiteNotifications(cb) {
    cb(V2DeprecatedError('User.getSiteNotifications'))
    // svc.searchOne({ _id:this.user._id }, {}, Data.select.cb.siteNotifications(cb))
  }

}

//-- Not sure, but this will probably become intelligent
function updateAsIdentity(data, trackData, cb) {
  if (!this.user) return cb(V2DeprecatedError('User.anon.updateAsIdentity'))

  if (trackData)
    analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})

  var {user} = this

    // var unset = { bitbucketId: 1 }
    // svc.updateWithUnset(id, unset, (e,user) => {})

    // o.updated = new Date() ??
    // authorization etc.
  User.updateSet(user._id, data, (e,r) => {
    if (e) return cb(e)
    if (!r) return cb(Error(`Failed to update user with id: ${user._id}`))
    var sessionOfUser = select.sessionFromUser(r)
//      // console.log('track save', ctx, data)

//      //-- Very magic important line
    if (!_.isEqual(this.session.passport.user, sessionOfUser))
      this.session.passport.user = sessionOfUser

    cbSession(this, cb)(e,r)
  })

 // //      //-- Migrate social accounts to v1 structure
 //      {
 //        var migrate = false
 //        var social = user.social || {}
 //        var connected = _.keys(social).length
 //        if (user.bitbucket && !social.bb) social.bb = user.bitbucket
 //        if (user.github && !social.gh) social.gh = user.github
 //        if (user.linkedin && !social.in) social.in = user.linkedin
 //        if (user.stack && !social.so) social.so = user.stack
 //        if (user.twitter && !social.tw) social.tw = user.twitter
 //        if (_.keys(social).length != connected) migrate = true
 //        user.social = social
 //        $log('migrate.social', migrate)
 //        var bookmarks = user.bookmarks || []
 //        var tags = user.tags || []
 //        var siteNotifications = user.siteNotifications || []
 //        var roles = user.roles || []
 // // || !user.bookmarks || !user.tags || !user.siteNotifications || !user.roles
 //        if (migrate) {
 //          $log(`Mirgrating user ${user._id} ${user.email}`.yellow)
 //          svc.updateWithSet(id, {social,bookmarks,tags,siteNotifications,roles}, done)
 //        }
        // else
          // done(null, user)
  // }
  // else {

  //   this.session.anonData = _.extend(this.session.anonData, data)
  //   get.getSession.call(this, cb)

  // }
}



// function toggleSessionItem(type, item, maxAnon, maxAuthd, comparator, trackData, cb)
// {
//   var up = {}
//   if (this.user) {
//     return svc.searchOne({ _id: this.user._id }, null, (e,r) => {
//       if (e || !r) return cb(e,r)
//       var list = util.toggleItemInArray(r[type], item, comparator)
//       if (list.length > maxAuthd) return cb(Error(`Max allowed ${type} reached`))
//       up[type] = list
//       updateAsIdentity.call(this, up, trackData, cb)
//     })
//   }

//   var existing = this.session.anonData[type]
//   var list = util.toggleItemInArray(existing, item, comparator)
//   if (list.length > maxAnon) return cb(Error(`Max ${maxAnon} ${type} reached. <a href="/login">Login</a> to increase limit.`))
//   up[type] = list
//   updateAsIdentity.call(this, up, trackData, cb)
// }



var save = {

  //-------- Tags and bookmarks

  toggleTag(tag, cb) {
    cb(V2DeprecatedError('User.toggleTag'))
    // var name = tag.name
    // var tagId = tag._id
    // tag = { _id: svc.newId().toString(), tagId: tag._id, sort: 0 }
    // var tagCompator = (i) => _.idsEqual(i.tagId, tagId)
    // var trackData = { type: 'tag', name }
    // toggleSessionItem.call(this, 'tags', tag, 3, 6, tagCompator, trackData, cb)
  },

  toggleBookmark(type, id, cb) {
    cb(V2DeprecatedError('User.toggleBookmark'))
    // if (!type) $log('toggleBookmark.type', type, cb)
    // var bookmark = { _id: svc.newId().toString(), objectId: id, type, sort: 0 }
    // var bookmarkComparator = (i) => _.idsEqual(i.objectId,id)
    // var props = cache.bookmark(type,id)
    // var trackData = { type: 'bookmark', objectType: type, objectId: id, url: props.url, name: props.title }
    // toggleSessionItem.call(this, 'bookmarks', bookmark, 3, 15, bookmarkComparator, trackData, cb)
  },


  updateBookmarks(bookmarks, cb) {
    cb(V2DeprecatedError('User.updateBookmarks'))
    // updateAsIdentity.call(this, {bookmarks}, null, cb)
  },

  toggleSiteNotification(name, cb) {
    cb(V2DeprecatedError('User.toggleSiteNotification'))
    // var opts = { fields: { _id:1,siteNotifications:1} }
    // svc.searchOne({ _id:this.user._id }, opts, (e,r) => {
    //   if (e) return cb(e)
    //   var siteNotifications = (r) ? r.siteNotifications : []
    //   if (!siteNotifications || siteNotifications.length == 0)
    //     siteNotifications = [{name}]
    //   else
    //   {
    //     var existing = _.find(siteNotifications, (n) => n.name == name)
    //     if (existing)
    //       siteNotifications = _.without(siteNotifications, existing)
    //     else
    //       siteNotifications.push({name})
    //   }

    //   svc.update(this.user._id, {siteNotifications}, Data.select.cb.siteNotifications(cb))
    // })
  },

  // Change email can be used both to change an email
  // and to set and send a new email hash for verification
  changeEmail(email, cb) {
    cb(V2DeprecatedError('User.changeEmail'))
    // email = email.trim().toLowerCase()
    // if (this.user) {
    //   var isVerifyRequest = this.user.email == email
    //   updateEmailToBeVerified.call(this, email, cb, (e, user, hash) => {
    //     if (!e && hash && isVerifyRequest)
    //       mailman.sendTemplate('user-verify-email',{hash}, user)
    //     cb(e, user)
    //   })
    // } else
    //   svc.searchOne(Data.query.existing(email), null, (e,r) => {
    //     if (r) {
    //       delete this.session.anonData.email
    //       return cb(svc.Forbidden(`${email} already registered.`))
    //     }
    //     updateAsIdentity.call(this, {email}, null, cb)
    //   })
  },

  updateEmailToBeVerified(email, errorCB, successCB) {
    cb(V2DeprecatedError('User.updateEmailToBeVerified'))
    // email = email.toLowerCase()
    // var {user} = this
    // var trackData = { type: 'email', email, previous: user.email, previousVerified: user.emailVerified }

    // svc.searchOne({_id:this.user._id}, {}, (ee, r) => {
    //   if (r.email == email && r.emailVerified) return errorCB(Error(`${email} already verified`))

    //   var ups = { local: r.local || {} }

    //   if (r.email != email) {
    //     ups.email = email
    //     ups.emailVerified = false
    //   }

    //   if (!r.local || !r.local.changeEmailHash || !r.local.emailHashGenerated
    //     || !moment(r.local.emailHashGenerated).isAfter(moment().add(-3,'hours')))
    //   {
    //     ups.local.changeEmailHash = Data.data.generateHash(email)
    //     ups.local.emailHashGenerated = new Date
    //   }

    //   updateAsIdentity.call(this, ups, trackData, (e,user) => {
    //     if (e) {
    //       if (e.message.indexOf('duplicate key error index') != -1) return errorCB(Error('Email belongs to another account'))
    //     }
    //     successCB(e, user, ups.local.changeEmailHash)
    //   })
    // })
  },

  //-------- Admin user updates

  toggleUserInRole(userId, role, cb) {
    cb(V2DeprecatedError('User.toggleUserInRole'))
    // svc.searchOne({ _id:userId }, null, (e,r) => {
    //   if (!r.roles)
    //     r.roles = [role]
    //   else if ( _.contains(r.roles, role) )
    //     r.roles = _.without(r.roles, role)
    //   else
    //     r.roles.push(role)

    //   // note here we are not updating as the identity
    //   // so we call svc.update rather than update
    //   svc.update(userId, r, cb)
    // })
  },


  changePrimaryPayMethodId(primaryPayMethodId, cb) {
    updateAsIdentity.call(this, {primaryPayMethodId}, null, cb)
  },

  //-- Used for saing sort order
  updateTags(tags, cb) {
    for (var t of tags) { if (!t.tagId) t.tagId = t._id } // if you pass in normal tags it breaks
    updateAsIdentity.call(this, {tags}, null, cb)
  },

  changeBio(bio, cb) {
    var ups = {bio}
    updateAsIdentity.call(this, ups, {type:'expertBio', by: this.user.email}, cb)
  },

  changeName(name, cb) {
    updateAsIdentity.call(this, {name}, null, cb)
  },

  changeUsername(username, cb) {
    // var userId = this.user._id
    if (!username || username == '')
      User.updateUnset(this.user._id, ['username'], cbSession(this, cb))
    else
      User.getByQuery({username}, '_id username name', (e,r) => {
        // Should be checked already before validate
        if (r && !_.idsEqual(this.user._id, r._id))
          return cb(`${username} already taken, please choose a different username`)
        updateAsIdentity.call(this, {username}, null, cb)
      })
  },

  changeInitials(initials, cb) {
    updateAsIdentity.call(this, {initials}, null, cb)
  },

  changeLocationTimezone(locationData, cb) {

    var timeZoneTimestamp = moment().unix()
    Wrappers.Timezone.getTimezoneFromCoordinates(locationData.coordinates, timeZoneTimestamp, (e,r) => {
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

  verifyEmail(hash, cb) {
    // svc.searchOne({ email:this.user.email }, null, (e,r) => {
    //   if (e || !r) {
    //     $log('verifyEmail.error'.red, e, r)
    //     return cb(e,r)
    //   }
    //   if (r.local.changeEmailHash == hash) {
    //     var trackData = { type: 'emailVerified', email: this.user.email }
    //     updateAsIdentity.call(this, { emailVerified: true }, trackData, cb)
    //   }
    //   else
    //     cb(Error("e-mail verification failed, hash is not valid"))
    // })
  }

}


// function callAuthSvcFn(thisCtx, fnName, args) {
//   var cb = args[args.length-1]
//   args = [].slice.call(args)
//   var cbSessioned = cbSession(thisCtx,cb)
//   args.push(cbSessioned)
//   UserAuth[fnName].apply(thisCtx, args)
// }

// var authWraps = {
//   googleLogin() { callAuthSvcFn(this,'googleLogin',arguments) },
//   localSignup() { callAuthSvcFn(this,'localSignup',arguments) },
//   localLogin() { callAuthSvcFn(this,'localLogin',arguments) },
//   connectProvider() { callAuthSvcFn(this,'connectProvider',arguments) }
// }


module.exports = Object.assign(get,save)
