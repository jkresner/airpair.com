import Svc from '../services/_service'
import User from '../models/user'
import * as md5 from '../util/md5'
var util = require('../../shared/util')

var bcrypt = require('bcrypt')

var logging = false
var svc = new Svc(User, logging)


var fields = {
  sessionFull: { '__v': 1, '_id': 1, 'roles': 1, 'bitbucket.username': 1, 'bitbucket.displayName': 1, 'github.username': 1, 'github.displayName': 1, 'google.id':1, 'linkedin.id': 1, 'stack.user_id': 1, 'stack.link': 1, 'twitter.username': 1, 'email': 1, 'emailVerified': 1, 'name': 1, 'initials': 1, 'bio': 1, tags: 1, bookmarks: 1, 'cohort.engagement': 1 },
  usersInRole: { '_id': 1, 'roles': 1, 'email': 1, 'name': 1, 'initials': 1 }
} 


// Add the user if new, or update if existing based on the search
// If a new user we intelligently link analytics and track signup 
function upsertSmart(search, upsert, cb) {
  if (logging) $log('upsertSmart', JSON.stringify(search), JSON.stringify(upsert))
  
  var {session,sessionID} = this
  var loginFromNewAnonymousSession = false

  svc.searchOne(search, null, (e, r) => {
    if (e) { return cb(e) }
    
    var existingUser = (r) ? true : false;

    if (upsert.google)
    {
      //-- stop user clobbering user.google details
      if (r && r.googleId && (r.googleId != upsert.google.id))
      {
        return cb(Error(`Cannot overwrite google login ${r.google._json.email} with ${upsert.google._json.email}`),null)
      }      

      //-- copy google details to top level users details
      if (!r || !r.email)
      {
        upsert.email = upsert.google._json.email 
        upsert.name = upsert.google.displayName   
        upsert.emailVerified = false
      }
    }

    if (existingUser) 
    {
      if (!r.emailVerified)
      { 
        upsert.emailVerified = false 
      }
      if (r.tags) {
        // need more intelligent logic to avoid dups & such
        upsert.tags = _.union(r.tags, upsert.tags) 
      }
      if (r.bookmarks) {
        // need more intelligent logic to avoid dups & such
        upsert.bookmarks = _.union(r.tags, upsert.bookmarks) 
      }
      if (r.cohort) {
        var aliases = r.cohort.aliases; 
        if ( !_.contains(r.cohort.aliases, sessionID) ) {
          loginFromNewAnonymousSession = true
          r.cohort.aliases.push(sessionID)
        }
       
        upsert.cohort = { engagement: {
          visit_first: r.cohort.engagement.visit_first,
          visit_last: new Date(),
          visit_signup: r.cohort.engagement.visit_signup,
          visits: r.cohort.engagement.visits }, // should implemented this properly
          aliases: r.cohort.aliases
        }   
      } else {
        upsert.cohort = { engagement: {
          visit_first: util.sessionCreatedAt(session),
          visit_last: new Date(),
          visit_signup: util.sessionCreatedAt(session),
          visits: [new Date()] }, // should implemented this properly
          aliases: [sessionID]
        }           
      }
    } 
    
    if (!existingUser)
    {
      upsert.cohort = { engagement: {
        visit_first: util.sessionCreatedAt(session),
        visit_last: new Date(),
        visit_signup: new Date(),
        visits: [new Date()] },
        aliases: [sessionID]
      }
    }

    User.findOneAndUpdate(search, upsert, { upsert: true }, (err, user) => {
      var done = () => { cb(err, user) }

      if (err) $log('User.upsert.err', err && err.stack)
      if (logging) $log('User.upsert', JSON.stringify(user))
      if (existingUser)
      {
        if (loginFromNewAnonymousSession) 
          analytics.alias(sessionID, null, user, 'Login', done)        
        else {
          var context = {} // ??
          analytics.track(user._id, null, 'Login', { sessionID: sessionID }, context, done)
        }
        //identify ? //lastSeen // username // createdAt
      } 
      else
      {
        analytics.alias(sessionID, user.cohort.engagement.visit_first, user, 'Signup', done)
      }  
    })
  })
}


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
  svc.searchMany({ roles:role }, { fields: fields.usersInRole }, cb)
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

  svc.searchOne({ _id:this.user._id },{ fields: fields.sessionFull }, (e,r) => {
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
