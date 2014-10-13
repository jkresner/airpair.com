import BaseSvc      from '../services/_service'
import * as md5     from '../util/md5'
var util =          require('../../shared/util')
var bcrypt =        require('bcrypt')
import User         from '../models/user'
var UserData =      require('./users.data')

var logging         = false
var svc             = new BaseSvc(User, logging)


//-- TODO, consider analytics context ?

function getUpsertEngagementProperties(existingUser, sessionID, sessionCreatedAt, done)
{
  //-- Default engagement
  var visit_first = sessionCreatedAt
  var visit_signup = new Date()
  var visit_last = new Date()
  var visits = [util.dateWithDayAccuracy()]
  var aliases = null

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
    }
  }

  return {engagement:{visit_first,visit_signup,visit_last,visits},aliases}
}

// upsertSmart
// Intelligent logic around updating user accounts on Signup and Login for user info and analytics.
// Adds the user if new, or updates if existing based on the search which could be by _id or provider e.g. { googleId: 'someId' }
function upsertSmart(search, upsert, cb) {
  if (logging) $log('upsertSmart', JSON.stringify(search), JSON.stringify(upsert))

  //-- Session is their cookie, which may or may not have been their first visit
  var sessionCreatedAt = util.sessionCreatedAt(this.session)
  var {sessionID} = this

  svc.searchOne(search, null, (e, r) => {
    if (e) { return cb(e) }

    upsert.cohort = getUpsertEngagementProperties(r,sessionID,sessionCreatedAt)

    if (upsert.google)
    {
      //-- stop user clobbering user.google details
      if (r && r.googleId && (r.googleId != upsert.google.id))
        return cb(Error(`Cannot overwrite google login ${r.google._json.email} with ${upsert.google._json.email}`),null)
            

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
        // need more intelligent logic to avoid dups & such
        upsert.tags = _.union(r.tags, upsert.tags) 
      if (r.bookmarks)
        // need more intelligent logic to avoid dups & such
        upsert.bookmarks = _.union(r.tags, upsert.bookmarks) 
    } 

    User.findOneAndUpdate(search, upsert, { upsert: true }, (err, user) => {
      if (logging || err) $log('User.upsert', err, user)
      if (err) return cb(err)
      if (!analytics.upsert) return cb(null, user)
      
      analytics.upsert(user, r, sessionID, (aliases) => {
        if (aliases && user.cohort.aliases &&
            aliases.length == user.cohort.aliases.length) cb(null, user)
        else 
          User.findOneAndUpdate(search, { 'cohort.aliases': aliases }, cb)
      })
    })
  })
}


//-- Todo, implement and link with middleware using the last_visit property
// export function addCohortVisitDate()
// {

// }


export function upsertProviderProfile(providerName, profile, done) {
  var search = {}
  search[providerName+'Id'] = profile.id

  if (this.user && this.user._id) 
    search = { '_id': this.user._id }

  var upsert = {}
  upsert[providerName+'Id'] = profile.id
  upsert[providerName] = profile

  if (!this.user && this.session.anonData)
    upsert = _.extend(upsert, this.session.anonData)

  upsertSmart.call(this, search, upsert, done)
}


export function tryLocalSignup(email, password, name, done) {
  if (this.user && this.user._id)
    done(Error(`Cannot signup. Already signed in as ${user.name}. Logout first?`),null)

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
      var generateHash = (password) =>
        bcrypt.hashSync(password, bcrypt.genSaltSync(8))

      var data = { 
        email: email,
        emailVerified: false,
        name: name,
        local: { password: generateHash(password) }
      }

      if (this.session.anonData) 
        data = _.extend(this.session.anonData, data)

      upsertSmart.call(this, search, data, done)
    }
  })
}


export function tryLocalLogin(email, password, done) {
  if (this.user && this.user._id)
    done(Error(`Cannot login. Already signed in as ${user.name}. Logout first?`),null)  

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
        failMsg = "wrong password"; r = false }
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
    var updated = _.extend(r, data)
    User.findOneAndUpdate({_id:r._id}, updated, (err, user) => {
      if (err) $log('User.update.err', err && err.stack)
      if (logging) $log('User.update', JSON.stringify(user))
      cb(err, user)
    })
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
  svc.searchMany({ roles:role }, { fields: UserData.select.usersInRole }, cb)
} 



export function setAvatar(user) {
  if (user && user.email) user.avatar = md5.gravatarUrl(user.email)
} 


export function getSession(cb) {
  if (this.user == null) {
    var s = {authenticated:false,sessionID:this.sessionID}
    if (this.session.anonData)
    {
      s.tags = this.session.anonData.tags;
      s.bookmarks = this.session.anonData.bookmarks;
    }
    return cb(null, s)
  } 
  else if (!this.user.avatar) 
  {
    setAvatar(this.user)
  }

  return cb(null, this.user)
}


export function getSessionFull(cb) {
  if (!this.user) 
    return getSession.call(this, cb)

  svc.searchOne({ _id:this.user._id },{ fields: UserData.select.sessionFull }, (e,r) => {
    setAvatar(r)
    cb(e,r)
  })
}  


export function toggleTag(tag, cb) {
  tag = { _id: tag._id, name: tag.name, slug: tag.slug }

  if (this.user) {
    svc.searchOne({ _id:this.user_id }, null, (e,r) => {    
      if (e || !r) return cb(e,r)
      r.tags = util.toggleItemInArray(r.tags,tag)
      this.user.tags = r.tags
      svc.update(userId, r, cb)
    })
  }
  else {
    this.session.anonData.tags = 
      util.toggleItemInArray(this.session.anonData.tags, tag)
    
    return getSession.call(this, cb)
  }
} 

export function toggleBookmark(tag, cb) {
  tag = { _id: tag._id, name: tag.name, slug: tag.slug }

  if (this.user) {
    svc.searchOne({ _id:this.user_id }, null, (e,r) => {    
      if (e || !r) return cb(e,r)
      r.tags = util.toggleItemInArray(r.tags,tag)
      this.user.tags = r.tags
      svc.update(userId, r, cb)
    })
  }
  else {
    this.session.anonData.tags = 
      util.toggleItemInArray(this.session.anonData.tags, tag)
    
    return getSession.call(this, cb)
  }
} 

export function verifyEmail(hash, cb) {
  if (bcrypt.compareSync(this.user.email, hash)) {
    svc.update(this.user._id, { emailVerified: true }, function(err) {
      cb(err, {status:302, redirectTo:'/email_verified'});
    });
  }
  else
    cb(new Error("e-mail verification failed"), undefined);
}
