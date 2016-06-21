var {User}                   = DAL
var {select,query,opts,data} = require('./users.data')
var selectFromObj         = require('meanair-shared').TypesUtil.Object.select
var md5                   = require('../util/md5')


var get = {

  search(searchTerm, cb) {
    var matchFields = 'name email auth.gp.name auth.gp.email'
    User.searchByRegex(searchTerm, matchFields, opts.search, select.cb.searchResults(cb))
  },

  getMe(cb) {
    User.getById(this.user._id, cb)
  },

  getSession(cb) {
    cb(null, this.user)
  }

}


function updateAsIdentity(data, trackData, cb) {
  if (!this.user) return cb(Error('User.anon.updateAsIdentity'))

  if (trackData)
    analytics.echo(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})

  // var {user} = this

    // var unset = { bitbucketId: 1 }
    // svc.updateWithUnset(id, unset, (e,user) => {})

    // o.updated = new Date() ??
    // authorization etc.
  User.updateSet(this.user._id, data, {select:'_id name username emails photos location initials'}, (e,r) => {
    // console.log('user.updateAsIdentity e r'.white, e, r)
    if (e) return cb(e)
    if (!r) return cb(Error(`Failed to update user with id: ${this.user._id}`))

    var session = _.select(r, '_id name username')
    session.email = _.find(r.emails, em => em.primary).value
    session.avatar = (r.photos ? r.photos[0].value : md5.gravatarUrl(session.email)).split('?')[0]

    // console.log('user.updateAsIdentity'.white, r)
//      //-- Very magic important line
    // if (!_.isEqual(this.session.passport.user, sessionOfUser))
    this.session.passport.user = session
    console.log('user.updateAsIdentity'.yellow, this.session.passport.user)
    // console.log('user.updateAsIdentity session'.white, session)

    cb(e, r)
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
      User.updateUnset(this.user._id, ['username'], (e,r) => {
        //-- could think about update of passport.session when re-writing
        cb(e, r)
      })
    else
      User.getByQuery({username}, '_id username name', (e,r) => {
        // Should be checked already before validate
        if (r && !_.idsEqual(this.user._id, r._id))
          return cb(Error(`${username} already taken, please choose a different username`))
        updateAsIdentity.call(this, {username}, null, cb)
      })
  },

  changeInitials(initials, cb) {
    updateAsIdentity.call(this, {initials}, null, cb)
  },

  changeLocationTimezone(locationData, cb) {
    var timeZoneTimestamp = moment().unix()
    Wrappers.Timezone.getTimezoneFromCoordinates(locationData.coordinates, timeZoneTimestamp, (e,r) => {
      if (e) return cb(e)

      var updates = {
        location: {
          name: locationData.formatted_address,
          shortName: locationData.name,
          timeZoneId: r.raw_response.timeZoneId,
        },
        'raw.locationData': locationData
      }

      updateAsIdentity.call(this, updates, null, cb)
    })
  },

  // verifyEmail(hash, cb) {
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
  // }

}



module.exports = assign(get,save)
