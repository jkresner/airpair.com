var logging         = false
var util =          require('../../shared/util')
var Data =          require('./users.data')
var UserAuth =      require('./users.auth')
var User =          require('../models/user')
import BaseSvc      from '../services/_service'
var svc             = new BaseSvc(User, logging)
var cbSession       = Data.select.cb.session


var get = {

  search(searchTerm, cb) {
    var opts = { options: { limit: 4 }, fields: Data.select.search }
    var rex = new RegExp(searchTerm, "i")
    var query = searchTerm ? { '$or' : [{email : rex},{name : rex},{'google.displayName' : rex},{'google._json.email' : rex}] } : null;
    svc.searchMany(query, opts, Data.select.cb.searchResults)
  },

  getUsersInRole(role, cb) {
    svc.searchMany({ roles:role }, { fields: Data.select.usersInRole }, cb)
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
          firebaseToken: this.session.firebaseToken,
          avatar
        }, this.session.anonData)

      Data.select.inflateTagsAndBookmarks(session, cb)
    }
    else
    {
      svc.searchOne({ _id:this.user._id },{ fields: Data.select.sessionFull }, cbSession(this, cb))
    }
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

    // if (this.user)
    //   User.findOneAndUpdate({_id:this.user._id}, { '$set': { name } }, cbSession(this, cb))
    // else {
    //   this.session.anonData.name = name
    //   return getSession.call(this, cb)
    // }

    // o.updated = new Date() ??
    // authorization etc.
    // $log('in updateAsIdentity', data, id)

    svc.updateWithSet(id, data, (e,user) => {
      if (e) return cb(e)
      if (!user) return cb(Error(`Failed to update user with id: ${id}`))
      // $log('in updateAsIdentity'.blue, user)

      // console.log('track save', ctx, data)
      //-- belongs in middleware ?
      // if (ctxUser)
        // ctx.session.passport.user = data.select.sessionFromUser(r)

      // $log('going to return', user)
      done(null, user)
    })
  }
  else {

    this.session.anonData = _.extend(this.session.anonData, data)
    get.getSession.call(this, cb)

  }
}



function toggleSessionItem(type, item, maxAnon, maxAuthd, comparator, trackData, cb)
{
  var up = {}
  if (this.user) {
    // $log('toggleSessionItemm', type, item, maxAnon, maxAuthd, cb)
    return svc.searchOne({ _id: this.user._id }, null, (e,r) => {
      if (e || !r) return cb(e,r)
      var list = util.toggleItemInArray(r[type], item, comparator)
      if (list.length > maxAuthd) return cb(Error(`Max allowed ${type} reached`))
      up[type] = list
      // $log('toggleSessionItemm.updateAsIdentity', up, trackData)
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
    // $log('toggleTag'.cyan, tag)
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

  //-------- User Info

  changeName(name, cb) {
    updateAsIdentity.call(this, {name}, null, cb)
  },

  changeUsername(username, cb) {
    var userId = this.user._id
    if (!username) return updateAsIdentity.call(this, {username}, cb)
    svc.searchOne({username}, null, function(e,r) {
      if (r && !_.idsEqual(userId,r._id)) {
        return cb(svc.Forbidden(`username ${username} already taken`))
      }
      updateAsIdentity.call(this, {username}, null, cb)
    })
  },

  changeInitials(initials, cb) {
    updateAsIdentity.call(this, {initials}, null, cb)
  },

  //-------- Account email

  requestPasswordChange(email, cb) {
    var self = this
    svc.searchOne(Data.query.existing(email), null, function(e,user) {
      if (e || !user) return cb(svc.Forbidden(`${email} not found`))

      var update = { local: _.extend(user.local || {}, {
        passwordHash: Data.data.generateHash(email),
        passowrdHashGenerated: new Date()
      })}

      //-- Previously had a google login without a v1 upsert migrate
      if (!user.email) {
        update.email = user.google._json.email
        update.name = user.google.displayName || 'there noname'
      }

      var trackData = { type: 'change-password-request', email, anonymous: this.user==null }
      updateAsIdentity.call(this, update, trackData, (e,r) => {
        mailman.sendChangePasswordEmail(r, update.passwordHash)
        return cb(null, {email})
      })
    })
  },

  changePassword(hash, password, cb) {
    svc.searchOne({'local.changePasswordHash': hash}, null, (e,user) => {
      if (e||!user) return cb(svc.Forbidden('Valid reset hash not found. Your token could be used or expired. Try <a href="/v1/auth/reset">Reset your password</a> again?'))

      // we've just received the hash that we sent to user.email
      // so mark their email as verified
      delete user.local.passwordHash
      delete user.local.passowrdHashGenerated

      var update = {
        'emailVerified': true,
        local: user.local
      }

      var trackData = { type: 'password', hash }
      updateAsIdentity.call(this, update, trackData, cb)
    })
  },


  // Change email can be used both to change an email
  // and to set and send a new email hash for verification
  changeEmail(email, cb) {
    email = email.trim().toLowerCase()
    var {user} = this

    if (user)
      updateEmailToBeVerified.call(this, email, cb, (e, user, hash) => {
        if (!e && hash && user)
          mailman.sendVerifyEmail(user, hash)
        cb(e, user)
      })
    else
      svc.searchOne(Data.query.existing(email), null, function(e,r) {
        if (!r) {
          delete self.session.anonData.email
          return cb(svc.Forbidden(`${email} already registered`))
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
      if (r.local.emailHash == hash) {
        this.user.emailVerified = true
        var trackData = { type: 'emailVerified', email: this.user.email }
        updateAsIdentity(this, { emailVerified: true }, trackData, cb)
      }
      else
        cb(Error("e-mail verification failed, hash is not valid"))
    })
  }

}


function updateEmailToBeVerified(email, errorCB, successCB) {
  email = email.toLowerCase()

  var data = { type: 'email', email, previous: user.email, previousVerified: user.emailVerified }
  analytics.track(user, this.sessionID, 'Save', data, {}, ()=>{})

  svc.searchOne({_id:this.user._id}, {}, (ee, r) => {
    if (r.email == email && r.emailVerified) return cb(`${email} already verified`)

    ups = { local: r.local || {} }

    if (r.email != email) {
      ups.email = email
      ups.emailVerified = false
    }

    if (!r.local.emailHash || !r.local.emailHashGenerated
      || !moment(r.local.emailHashGenerated).isAfter(moment().add(-3,'hours')))
    {
      ups.local.emailHash = Data.data.generateHash(email)
      ups.local.emailHashGenerated = new Date
    }

    updateAsIdentity.call(this, ups, (e,user) => {
      if (e) {
        if (e.message.indexOf('duplicate key error index') != -1) return errorCB(Error('Email belongs to another account'))
      }
      cb(e, user)
    })
  })
}

function callAuthSvcFn(thisCtx, fnName, args) {
  var cb = args[args.length-1]
  args = [].slice.call(args)
  var cbSessioned = cbSession(thisCtx,cb)
  // $log(cbSessioned, cbSessioned())
  args.push(cbSessioned)
  // $log('going'.white, fnName, 'args', args)
  // $log('callAuthSvcFn'.yellow, args)
  UserAuth[fnName].apply(thisCtx, args)
}

var authWraps = {
  googleLogin() { callAuthSvcFn(this,'googleLogin',arguments) },
  localSignup() { callAuthSvcFn(this,'localSignup',arguments) },
  localLogin() { callAuthSvcFn(this,'localLogin',arguments) },
}

// $log('authWraps', authWraps)

save = _.extend(save, authWraps)
module.exports = _.extend(get,save)
