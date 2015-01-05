import BaseSvc      from '../services/_service'
import User         from '../models/user'
var util =          require('../../shared/util')
var bcrypt =        require('bcrypt')
var Data =          require('./users.data')
var Validate =      require('../../shared/validation/users.js')
var logging         = false
var svc             = new BaseSvc(User, logging)


var cbTrackSave = (ctx, data, cb) =>
  (e,r) => {
    if (e) return cb(e)
    // console.log('track save', ctx, data)
    analytics.track(ctx.user, ctx.sessionID, 'Save', data, {}, ()=>{})
    cb(null, r)
  }


var cbSession = (ctx, cb) =>
  (e, r) => {
    if (e || !r) {
      if (logging) $log('cbSession', e, r)
      return cb(e, r)
    }
    var obj = util.selectFromObject(r, Data.select.sessionFull)
    if (obj.roles && obj.roles.length == 0) delete obj.roles
    Data.select.setAvatar(obj)
    if (ctx.user)
      ctx.session.passport.user = Data.select.sessionFromUser(obj)
    Data.select.inflateTagsAndBookmarks(obj, cb)
  }


//-- TODO, consider analytics context ?

function getUpsertEngagementProperties(existingUser, sessionID, sessionCreatedAt, firstRequest, done)
{
  //-- Default engagement
  var visit_first = sessionCreatedAt
  var visit_signup = new Date()
  var visit_last = new Date()
  var visits = [util.dateWithDayAccuracy()]
  var aliases = null
  var firstRequest = firstRequest

  // This is a new user (easy peasy)
  if (existingUser)
  {
    var {cohort} = existingUser

    //-- This is an existing v0 user. We need to alias their google._json.email to their userId for v1
    if (!cohort || !cohort.engagement.visit_first)
    {
      var v0AccountCreatedAt = util.ObjectId2Date(existingUser._id)
      visit_first = v0AccountCreatedAt
      visit_signup = v0AccountCreatedAt
    }
    else
    {
      // keep existing fist visit, signup and visits
      visit_first = cohort.engagement.visit_first
      visit_signup = cohort.engagement.visit_signup
      visits = cohort.engagement.visits
      aliases = cohort.aliases
      firstRequest = cohort.firstRequest || firstRequest
    }
  }

  return {engagement:{visit_first,visit_signup,visit_last,visits},aliases,firstRequest}
}

// upsertSmart
// Intelligent logic around updating user accounts on Signup and Login for user info and analytics.
// Adds the user if new, or updates if existing based on the search which could be by _id or provider e.g. { googleId: 'someId' }
function upsertSmart(search, upsert, cb) {
  if (logging) $log('upsertSmart', JSON.stringify(search), JSON.stringify(upsert))

  var done = cbSession(this, cb)
  //-- Session is their cookie, which may or may not have been their first visit
  var sessionCreatedAt = util.momentSessionCreated(this.session).toDate()
  var firstRequest = this.session.firstRequest
  var {sessionID} = this

  svc.searchOne(search, null, (e, r) => {
    if (e) { return cb(e) }
    upsert.cohort = getUpsertEngagementProperties(r,sessionID,sessionCreatedAt,firstRequest)

    if (upsert.google)
    {
      //-- stop user clobbering user.google details
      if (r && r.googleId && (r.googleId != upsert.google.id))
        return cb(Error(`Cannot overwrite google login ${r.google._json.email} with ${upsert.google._json.email}. <a href="/v1/auth/logout">Logout</a> first?`),null)

      //-- copy google details to top level users details
      if (!r || !r.email)
      {
        upsert.email = upsert.google._json.email
        upsert.name = upsert.google.displayName
        upsert.emailVerified = false
      }
    }

    if (r)
    {
      if (!r.emailVerified)
        upsert.emailVerified = false
      if (r.tags)
        upsert.tags = util.combineItems(r.tags, upsert.tags, 'tagId')
      if (r.bookmarks)
        upsert.bookmarks = util.combineItems(r.bookmarks, upsert.bookmarks, 'objectId')

      if (!r.email && !upsert.google)
      {
        upsert.email = r.google._json.email
        upsert.name = r.google.displayName
        upsert.emailVerified = true
      }
    }

    User.findOneAndUpdate(search, upsert, { upsert: true }, (err, user) => {
      if (err) {
        var errData = { search: search, upsert: upsert, existing: r }
        winston.error(JSON.stringify(errData))
        return cb(err)
      }

      if (!analytics.upsert) return done(null, user)

      analytics.upsert(user, r, sessionID, (aliases) => {
        if (logging) $log('back from the analytics.upsert **********************************')
        if (aliases && user.cohort.aliases &&
          aliases.length == user.cohort.aliases.length)
        {
          done(null, user)
        }
        else
          User.findOneAndUpdate(search, { 'cohort.aliases': aliases }, done)
      })
    })
  })
}

// local function for password and email hashing
var generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8))


export function upsertProviderProfile(providerName, profile, done) {
  var search = {}
  search[providerName+'Id'] = profile.id
  if (providerName == 'google')
    search = { '$or': [{email:profile._json.email},search] }
  if (this.user && this.user._id)
    search = { '_id': this.user._id }

  var upsert = {}
  upsert[providerName+'Id'] = profile.id
  upsert[providerName] = profile

  if (!this.user && this.session.anonData)
    upsert = _.extend(upsert, this.session.anonData)

  delete upsert.email // gotcha, don't remove

  upsertSmart.call(this, search, upsert, done)
}


export function tryLocalSignup(email, password, name, done) {
  if (this.user && this.user._id)
    done(Error(`Cannot signup. Already signed in as ${this.user.email}. Logout first?`),null)

  var search = { '$or': [{email:email},{'google._json.email':email}] }
  svc.searchOne(search, null, (e, r) => {
    if (e) { return done(e) }
    else if (r) {
      var info = ""
      if (r.email == email) { info = "user already exists"; }
      if (r.google && r.google._json.email == email) { info = "try google login"; }
      return done(null, false, info)
    }
    else
    {
      var data = {
        email: email,
        emailVerified: false,
        name: name,
        local: {
          password: generateHash(password), //-- Forsubscrber sign ups
          emailHash: '',
          changePasswordHash: generateHash(email)
        }
      }

      if (this.session.anonData)
        data = _.extend(this.session.anonData, data)

      upsertSmart.call(this, search, data, (e,r) => {
        if (password == 'fast-ap-signup' && !e) mailman.subscriberWelcomeEmail(r, data.local.changePasswordHash)
        done(e,r)
      })
    }
  })
}


export function tryLocalLogin(email, password, done) {
  if (this.user && this.user._id)
    done(Error(`Cannot login. Already signed in as ${user.name}. Logout first?`),null)

  email = email.toLowerCase()

  var search = { '$or': [{email:email},{'google._json.email':email}] }

  svc.searchOne(search, null, (e, r) => {
    var failMsg = null
    if (!e)
    {
      var validPassword = (password, hash) =>
        bcrypt.compareSync(password, hash)

      if (!r)
        failMsg = "no user found"
      else if (!r.local || !r.local.password) {
        failMsg = "try google login"; r = false }
      else if (!validPassword(password, r.local.password)) {
        failMsg = "bad password"; r = false }
    }

    if (e || failMsg) return done(e, r, failMsg)
    else
    {
      //-- Want to update last login etc.
      upsertSmart.call(this, {_id:r._id}, {}, done)
    }
  })
}


//-- Not sure, but this will probably become intelligent
export function update(id, data, cb) {
  // o.updated = new Date() ??
  // authorization etc.
  svc.getById(id, (e,r) => {
    if (e) return cb(e)
    if (!r) return cb(Error(`Failed to update user with id: ${id}`))
    var updated = _.extend(r, data)
    svc.update(r._id, updated, (err, user) => {
      if (err) $log('User.update.err', err && err.stack)
      if (logging) $log('User.update', JSON.stringify(user))
      if (cb) cb(err, user)
    })
  })
}


export function updateProfile(name, initials, username, cb) {
  var userId = this.user._id
  var ups = {name}
  if (initials) ups.initials = initials
  if (username) ups.username = username
  var done = cbSession(this, cb)
  if (!username)
    return update(userId, ups, done)

  svc.searchOne({username}, null, function(e,r) {
    if (r) {
      return cb(svc.Forbidden(`username ${username} already taken`))
    }
    update(userId, ups, done)
  })
}



var VALID_ROLES = ['admin',       // Get access to all admin backend app
                   'dev',         // Get application error notification
                   'pipeliner',   // Get pipeline emails
                   'editor',      // Can publish posts
                   'matchmaker']  // Can make suggestions + schedule times

export function toggleUserInRole(userId, role, cb) {
  if (!_.contains(VALID_ROLES, role)) {
    return cb(new Error('Invalid role'))
  }

  svc.searchOne({ _id:userId }, null, (e,r) => {
    if (e || !r) return cb(e,r)

    if (!r.roles)
      r.roles = [role]
    else if ( _.contains(r.roles, role) )
      r.roles = _.without(r.roles, role)
    else
      r.roles.push(role)

    svc.update(userId, r, cb)
  })
}


export function getUsersInRole(role, cb) {
  svc.searchMany({ roles:role }, { fields: Data.select.usersInRole }, cb)
}


var anonAvatars = [
  "/static/img/css/sidenav/default-cat.png",
  "/static/img/css/sidenav/default-mario.png",
  "/static/img/css/sidenav/default-stormtrooper.png"
]

export function getSession(cb) {
  if (this.user == null)
  {
    var avatar = anonAvatars[_.random(1)]

    if (this.session.anonData && this.session.anonData.email)
    {
      Data.select.setAvatar(this.session.anonData)
      avatar = this.session.anonData.avatar
    }

    var session = _.extend({ authenticated:false,sessionID:this.sessionID, avatar }, this.session.anonData)
    Data.select.inflateTagsAndBookmarks(session, cb)
  }
  else
  {
    if (!this.user.avatar) Data.select.setAvatar(this.user)
    Data.select.inflateTagsAndBookmarks(this.user, cb)
  }
}


export function getSessionFull(cb) {
  if (!this.user)
    return getSession.call(this, cb)

  svc.searchOne({ _id:this.user._id },{ fields: Data.select.sessionFull }, cbSession(this, cb))
}


function toggleSessionItem(type, item, maxAnon, maxAuthd, comparator, cb)
{
  var self = this
  if (this.user) {
    var userId = this.user._id
    svc.searchOne({ _id: userId }, null, (e,r) => {
      if (e || !r) return cb(e,r)
      var list = util.toggleItemInArray(r[type], item, comparator)
      if (list.length > maxAuthd) return cb(Error(`Max allowed ${type} reached`))

      var up = {}
      up[type] = list

      svc.update(userId, up, cbSession(self, cb))
    })
  }
  else {
    var existing = this.session.anonData[type]

    var list = util.toggleItemInArray(existing, item, comparator)
    if (list.length > maxAnon) return cb(Error(`Max ${maxAnon} ${type} reached. <a href="/login">Login</a> to increase limit.`))
    this.session.anonData[type] = list

    getSession.call(this, cb)
  }
}

export function toggleTag(tag, cb) {
  var name = tag.name
  var tagId = tag._id
  tag = { _id: svc.newId().toString(), tagId: tag._id, sort: 0 }
  var tagCompator = (i) => _.idsEqual(i.tagId, tagId)
  var trackData = { type: 'tag', name }
  toggleSessionItem.call(this, 'tags', tag, 3, 6, tagCompator, cbTrackSave(this, trackData, cb))
}

export function toggleBookmark(type, id, cb) {
  if (!type) $log('toggleBookmark.type', type, cb)
  var bookmark = { _id: svc.newId().toString(), objectId: id, type, sort: 0 }
  var bookmarkComparator = (i) => _.idsEqual(i.objectId,id)
  var props = cache.bookmark(type,id)
  var trackData = { type: 'bookmark', objectType: type, objectId: id, url: props.url, name: props.title }
  toggleSessionItem.call(this, 'bookmarks', bookmark, 3, 15, bookmarkComparator, cbTrackSave(this, trackData, cb))
}

export function tags(tags, cb) {
  for (var t of tags) { if (!t.tagId) t.tagId = t._id } // if you pass in normal tags it breaks
  if (this.user) {
    svc.update(this.user._id, {tags}, cbSession(this, cb));
  }
  else {
    this.session.anonData.tags = tags
    return getSession.call(this, cb);
  }
}

export function bookmarks(bookmarks, cb) {
  if (this.user) {
    svc.update(this.user._id, {bookmarks}, cbSession(this, cb));
  }
  else {
    this.session.anonData.bookmarks = bookmarks
    return getSession.call(this, cb);
  }
}

export function requestPasswordChange(email, cb) {
  var inValid = Validate.changeEmail(email)
  if (inValid) return cb(svc.Forbidden(inValid))

  var search = { '$or': [{email:email},{'google._json.email':email}] }
  var self = this
  svc.searchOne(search, null, function(e,user) {
    if (e||!user) {
      return cb(svc.Forbidden(`${email} not found`))
    }

    var update = { 'local.changePasswordHash': generateHash(email) }
    svc.update(user._id, update, (e,r) => {

      //-- Previously had a google login without a v1 upsert migrate
      if (!r.email) {
        r.email = r.google._json.email
        r.name = r.google.displayName || 'there noname'
      }

      mailman.sendChangePasswordEmail(r, r.local.changePasswordHash)

      if (self.user) return cbSession(self, cb)(e,r)
      else return cb(null, {email})
    })
  })
}

export function changePassword(hash, password, cb) {
  var inValid = Validate.changePassword(hash, password)
  if (inValid) return cb(svc.Forbidden(inValid))

  var query = {'local.changePasswordHash': hash}
  var self = this
  svc.searchOne(query, null, (e,user) => {
    if (e||!user) return cb(svc.Forbidden('Valid reset hash not found. Your token could be used or expired. Try <a href="/v1/auth/reset">Reset your password</a> again?'))

    // we've just received the hash that we sent to user.email
    // so mark their email as verified
    var update = {
      'local.password': generateHash(password),
      'local.changePasswordHash': '',
      'emailVerified': true
    }
    var trackData = { type: 'password', hash }
    svc.update(user._id, update, cbTrackSave(this, trackData, (e,r) => {
      if (e || !r) return cb(e,r)
      getSessionFull.call(this,cb)
    }));
  });
}


export function changeName(name, cb) {
  var inValid = Validate.changeName(name)
  if (inValid) return cb(svc.Forbidden(inValid))

  if (this.user)
    User.findOneAndUpdate({_id:this.user._id}, { '$set': { name } }, cbSession(this, cb))
  else {
    this.session.anonData.name = name
    return getSession.call(this, cb)
  }
}

export function updateEmailToBeVerified(email, errorCB, cb) {
  email = email.toLowerCase()
  var self = this

  svc.searchOne({_id:this.user._id}, {}, (ee, r) => {
    if (r.email == email && r.emailVerified) return cb(null, r)

    if (r.email != email) {
      r.email = email
      r.emailVerified = false
    }

    r.local = r.local || {}
    if (!r.local.emailHash || !r.local.emailHashGenerated
      || !moment(r.local.emailHashGenerated).isAfter(moment().add(-3,'hours')))
    {
      r.local.emailHash = generateHash(email)
      r.local.emailHashGenerated = new Date
    }

    svc.update(this.user._id, r, (e,user) => {
      if (e) {
        if (e.message.indexOf('duplicate key error index') != -1) return errorCB(Error('Email belongs to another account'))
        return errorCB(e)
      }
      self.session.passport.user = Data.select.sessionFromUser(user)
      cb(null, user)
    })
  })
}

// Change email can be used both to change an email
// and to set and send a new email hash for verification
export function changeEmail(email, cb) {
  var inValid = Validate.changeEmail(email)
  if (inValid) return cb(svc.Forbidden(inValid))

  email = email.trim().toLowerCase()
  var self = this
  var {user} = this
  if (user)
  {
    var data = { type: 'email', email, previous: user.email, previousVerified: user.emailVerified }
    analytics.track(user, this.sessionID, 'Save', data, {}, ()=>{})

    if (user.email == email && user.emailVerified)
      return cb(`Email ${user.email} already verified... try log out and back in again?`)

    else {
      updateEmailToBeVerified.call(this, email, cb, (e,r) => {
        mailman.sendVerifyEmail(r, r.local.emailHash)
        cbSession(self, cb)(e,r)
      })
    }
  }
  else {
    var search = { '$or': [{email:email},{'google._json.email':email}] }
    svc.searchOne(search, null, function(e,r) {
      if (r) {
        delete self.session.anonData.email
        return cb(svc.Forbidden(`${email} already registered`))
      }
      self.session.anonData.email = email
      return getSession.call(self, cb)
    })
  }
}

export function verifyEmail(hash, cb) {
  var ctx = this
  svc.searchOne({ email:this.user.email }, null, (e,r) => {
    if (e || !r) {
      $log('verifyEmail', e, r)
      return cb(e,r)
    }
    if (r.local.emailHash == hash) {
      this.user.emailVerified = true
      var trackData = { type: 'emailVerified', email: this.user.email }
      svc.update(this.user._id, { emailVerified: true }, cbSession(this, cbTrackSave(ctx,trackData,cb)))
    }
    else
      cb(Error("e-mail verification failed, hash is not valid"))
  })
}


export function search(searchTerm, cb) {
  var opts = { options: { limit: 4 }, fields: Data.select.search }
  var rex = new RegExp(searchTerm, "i")
  var query = searchTerm ? { '$or' : [{email : rex},{name : rex},{'google.displayName' : rex},{'google._json.email' : rex}] } : null;
  svc.searchMany(query, opts, (e,r) =>{
    for (var u of r)
    {
      if (u.google) {
        if (!u.email && u.google._json.email) u.email = u.google._json.email
        if (!u.name && u.google.displayName) u.name = u.google.displayName
      }
      u = Data.select.setAvatar(u);
    }
    cb(e,r)
  })
}
