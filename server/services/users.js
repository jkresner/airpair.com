import Svc from '../services/_service'
import User from '../models/user'
import * as md5 from '../util/md5'

var bcrypt = require('bcrypt')

var logging = false
var svc = new Svc(User, logging)


var fields = {
  sessionFull: { '__v': 1, '_id': 1, 'roles': 1, 'bitbucket.username': 1, 'bitbucket.displayName': 1, 'github.username': 1, 'github.displayName': 1, 'google.id':1, 'linkedin.id': 1, 'stack.user_id': 1, 'stack.link': 1, 'twitter.username': 1, 'email': 1, 'emailVerified': 1, 'name': 1, 'initials': 1, 'bio': 1 },
  usersInRole: { '_id': 1, 'roles': 1, 'email': 1, 'name': 1, 'initials': 1 }
} 

//-- TODO, move upsert fn into the UserService class
// Add the user if new, or updating if existing base on the search
// If a new user we intelligently link analytics and track signup 
var upsertSmart = (search, upsert, done) => {
  if (logging) $log('upsertSmart', JSON.stringify(search), JSON.stringify(upsert))
  
  svc.searchOne(search, null, (e, r) => {
    if (e) { return done(e) }
    if (!r)
    {
      console.log('TODO', 'alias', 'track','signup')
    }
    else 
    {
      if (!r.emailVerified)
      { 
        upsert.emailVerified = false 
      }
    }

    if (upsert.google)
    {
      //-- copy google details to top level users details
      if (!r || !r.email)
      {
        upsert.email = upsert.google._json.email 
        upsert.name = upsert.google.displayName   
        upsert.emailVerified = false
      }

      if (r && r.googleId && r.googleId != upsert.google.id)
      {
        return done(Error(`Cannot overwrite google login ${r.google._json.email} with ${upsert.google._json.email}`),null)
      }      
    }

    User.findOneAndUpdate(search, upsert, { upsert: true }, (err, user) => {
      if (err) $log('User.upsert.err', err && err.stack)
      if (logging) $log('User.upsert', JSON.stringify(user))
      done(err, user)
    })
  })
}


export function upsertProviderProfile(loggedInUser, providerName, profile, done) {
  var search = {}
  search[providerName+'Id'] = profile.id

  if (loggedInUser) search = { '_id': loggedInUser._id }

  var upsert = {}
  upsert[providerName+'Id'] = profile.id
  upsert[providerName] = profile

  upsertSmart(search, upsert, done)
}


export function tryLocalSignup(email, password, name, done) {
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
      upsertSmart(search, data, done)
    }
  })
}


export function tryLocalLogin(email, password, done) {
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
    return done(e, r, failMsg)
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


export function setAvatar(user) {
  if (user && user.email) user.avatar = md5.gravatarUrl(user.email)
} 


export function getSessionLite(cb) {
  if (this.user == null) 
    return cb(null, null)
  else if (!this.user.avatar)
    setAvatar(this.user)

  return cb(null, this.user)
}


var VALID_ROLES = ['admin',       // Get access to all admin backend app
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


export function getSessionByUserId(cb) {
  if (this.user == null) return cb(null, null)
  svc.searchOne({ _id:this.user._id },{ fields: fields.sessionFull }, (e,r) => {
    setAvatar(r)
    cb(e,r)
  })
}  
