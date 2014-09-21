import Svc from '../services/_service'
import User from '../models/user'
import * as md5 from '../util/md5'

var bcrypt = require('bcrypt')

var logging = false
var svc = new Svc(User, logging)


var generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8))

var validPassword = (password, hash) => 
  bcrypt.compareSync(password, hash)  


//-- TODO, move upsert fn into the UserService class
// Add the user if new, or updating if existing base on the search
// If a new user we intelligently link analytics and track signup 
var upsertSmart = (search, upsert, done) => {
  if (logging) $log('upsertSmart', JSON.stringify(search), JSON.stringify(upsert))
  
  User.findOne(search, (e, r) => {
    if (e) { return done(e) }
    if (!r)
    {
      console.log('alias')
      console.log('track','signup')
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

  if (loggedInUser) {
    search = { '_id': loggedInUser._id }
  }

  var upsert = {}
  upsert[providerName+'Id'] = profile.id
  upsert[providerName] = profile

  upsertSmart(search, upsert, done)
}


export function tryLocalSignup(email, password, name, done) {
  var search = { '$or': [{email:email},{'google._json.email':email}] }
  User.findOne(search, (e, r) => {
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
        local: { password: generateHash(password) }
      }
      upsertSmart(search, data, done)
    }
  })
}


export function tryLocalLogin(email, password, done) {
  var search = { '$or': [{email:email},{'google._json.email':email}] }

  User.findOne(search, (e, r) => {
    var failMsg = null
    if (!e)
    {
      if (!r) { failMsg = "no user found"; }
      else if (!r.local || !r.local.password) { 
        failMsg = "try google login"; r = false;  }
      else if (!validPassword(password, r.local.password)) { 
        failMsg = "wrong password"; r = false; }
    }
    return done(e, r, failMsg)
  })
}



export function setAvatar(user) {
  if (user && user.email) { user.avatar = md5.gravatarUrl(user.email) }
} 


export function getSessionLite(cb) {
  if (this.user == null) { return cb(null, null); }
  setAvatar(this.user)
  return cb(null, this.user)
}


export function getSessionByUserId(cb) {
  if (this.user == null) { return cb(null, null); }

  var fields = {
    '__v': 1, 
    '_id': 1, 
    'bitbucket.username': 1, 'bitbucket.displayName': 1,
    'github.username': 1, 'github.displayName': 1,
    'google.id':1,
    'linkedin.id': 1,
    'stack.user_id': 1, 'stack.link': 1,
    'twitter.username': 1,
    'email': 1,
    'emailVerified': 1,
    'name': 1,      
    'initials': 1,            
    'bio': 1
  }
  svc.searchOne({ _id:this.user._id },{ fields: fields }, (e,r)=> {
    setAvatar(r)
    cb(e,r)
  })
}  
