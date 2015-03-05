import BaseSvc      from '../services/_service'
import User         from '../models/user'
var util =          require('../../shared/util')
var bcrypt =        require('bcrypt')
var Data =          require('./users.data')
var logging         = config.log.auth || false
var svc             = new BaseSvc(User, logging)
var cbSession       = Data.select.cb.fullSession


var wrap = (fnName, errorCB, cb) =>
 (e,r) => {
   if (e) {
     if (logging) $log(`${fnName}.error`.red, e)
     errorCB(e)
   }
   else {
     if (logging) $log(`${fnName}.ok`.white)
     if (r) r = r.toObject()
     cb(r)
   }
 }


function getCohortProperties(existingUser, session, done)
{
  //-- Default engagement
  var visit_first = util.momentSessionCreated(session).toDate()
  var visit_signup = new Date()
  var visit_last = new Date()
  var visits = [util.dateWithDayAccuracy()]
  var aliases = []  // we add the aliases after successful sign up
  var firstRequest = session.firstRequest

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
      aliases = cohort.aliases || []
      firstRequest = cohort.firstRequest || session.firstRequest
    }
  }

  return {engagement:{visit_first,visit_signup,visit_last,visits},aliases,firstRequest}
}



// upsertSmart
// Intelligent logic around updating user accounts on Signup and Login for
// User info and analytics. Adds the user if new, or updates if existing
// based on the search which could be by _id or provider e.g. { googleId: 'someId' }
function upsertSmart(upsert, existing, cb) {
  if (logging) $log(`upsertSmart', 'existing[${JSON.stringify(existing)}] upsert =>${JSON.stringify(upsert)}`)

  upsert = _.extend(upsert, this.session.anonData || {})
  upsert.cohort = getCohortProperties(existing, this.session)

  if (existing) {
    if (!existing.emailVerified) upsert.emailVerified = false

    if (existing.tags)
      upsert.tags = util.combineItems(existing.tags, upsert.tags, 'tagId')
    if (existing.bookmarks)
      upsert.bookmarks = util.combineItems(existing.bookmarks, upsert.bookmarks, 'objectId')
  }

  //-- Session is their cookie, which may or may not have been their first visit
  var {sessionID} = this
  Data.query.existing(upsert.email)
  var _id = (existing) ? existing._id : svc.newId()
  User.findOneAndUpdate({_id}, upsert, { upsert: true },
    wrap(`upsert [${_id}][existing:${existing!=null}] [${JSON.stringify(upsert)}] []`, cb, (user) => {

    cb(null, user)

    if (analytics.upsert)
      analytics.upsert(user, existing, sessionID, (aliases) => {
        if (aliases && aliases.length != user.cohort.aliases.length)
        {
          if (logging) $log(`updating ${user._id} ${aliases}`.yellow, aliases)
          User.findOneAndUpdate({_id:user._id}, { 'cohort.aliases': aliases }, ()=>{} )
        }
      })
  }))

}


function connectGoogle(profile, errorCB, done) {
  User.findOne({_id: this.user._id}, (err, loggedInUser) => {
    if (err || !loggedInUser) return errorCB(err || 'Failed to googleConnect, loggedInUser not found', loggedInUser)

    //-- stop user clobbering user.google details
    if (loggedInUser.googleId && loggedInUser.googleId != profile.id)
      return errorCB(Error(`Cannot overwrite existing google login ${loggedInUser.google._json.email} with ${profile._json.email}. Try <a href='/auth/logout'>Logout</a> and log back in with that google account?`))

    User.findOne({googleId: profile.id}, (ee, existingGoogleUser) => {

      if ( (loggedInUser && !existingGoogleUser) ||
        _.idsEqual(loggedInUser._id, existingGoogleUser._id) )

        User.findOneAndUpdate({_id:this.user._id}, { googleId: profile.id, google: profile }, (e,r) => {
          if (e || !r) errorCB(e||'connectGoogle, no user found.',r)
          var trackData = { type: 'oauth', provider: 'google', id: profile.id }
          analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})
          done(e, r)
        })

      else
        return errorCB(Error(`Another user account already has the ${profile._json.email} google account connected with it. Try <a href='/auth/logout'>Logout</a> and log back in with google?`))
    })
  })
}


function googleLogin(profile, errorCB, done) {
  if (this.user) return connectGoogle.call(this, profile, errorCB, done)

  User.findOne(Data.query.existing(profile._json.email),
    wrap(`googleLogin.existing ${profile._json.email}`, errorCB, (existing) => {


    var upsert = { googleId: profile.id, google: profile }
    //-- copy google details to top level users details
    if (!existing || !existing.email)
    {
      upsert.email = upsert.google._json.email
      upsert.name = upsert.google.displayName
      upsert.emailVerified = false
    }
    else {
      // In case google login email different from contact email
      upsert.email = existing.email
    }

    // gotcha, don't remove
    // 'Google login for existing v1 user works after played with singup form'
    if (this.session.anonData) delete this.session.anonData.email

    upsertSmart.call(this, upsert, existing, done)

  }))
}


function localSignup(email, password, name, errorCB, done) {
  if (this.user)
    errorCB(Error(`Cannot signup. Already signed in as ${this.user.email}. Logout first?`),null)

  User.findOne(Data.query.existing(email),
    wrap(`localSignup.existing ${email} ${name}`, errorCB, (existing) => {

    if (existing)
    {
       var info = ""
       if (existing.email == email) info = "Cannot signup, user already exists"
       if (existing.google && existing.google._json.email == email)
         info = "Cannot signup, you previously created an account with your google login"
       return errorCB(null, false, info)
    }

    var upsert = { name, email, emailVerified: false,
      local: {
        password: Data.data.generateHash(password), // password is hased in the db
      }
    }

    if (password == 'home'
      || password == 'subscribe'
      || password == 'postcomp'
      || password == 'so')
    {
      upsert.local.changePasswordHash = Data.data.generateHash(email)
      upsert.local.passwordHashGenerated = new Date
    }

    upsertSmart.call(this, upsert, null, (e,r) => {
      if (!e) {
        if (password == 'home')
          mailman.signupHomeWelcomeEmail(r, upsert.local.changePasswordHash)
        if (password == 'postcomp') {
          //-- TODO Subscribe user to post complist
          mailman.signupPostcompEmail(r, upsert.local.changePasswordHash)
        }
        if (password == 'so')
          mailman.signupHomeWelcomeEmail(r, upsert.local.changePasswordHash)
        if (password == 'subscribe')
          mailman.singupSubscribeEmail(r, upsert.local.changePasswordHash)
      }
      done(e,r)
    })

  }))

}


function localLogin(email, password, errorCB, done) {
  User.findOne(Data.query.existing(email),
    wrap(`localLogin.existing ${email}`, errorCB, (existing) => {

    var info = null
    var validPassword = (password, hash) => bcrypt.compareSync(password, hash)

    if (!existing)
      info = "no user found"
    else if (!existing.local || !existing.local.password)
      info = "try google login"
    else if (!validPassword(password, existing.local.password))
      info = "wrong password"

    if (info) return errorCB(null, false, info)

    var upsert = { email: email }

    //-- Change password on v0 google login
    if (!existing.email)
    {
      upsert.email = existing.google._json.email
      upsert.name = existing.google.displayName
      upsert.emailVerified = true
    }

    upsertSmart.call(this, upsert, existing, done)

  }))
}


function connectProvider(provider, short, profile, errorCB, done) {
  var ups = { $set : { } }
  ups['$set'][`social.${short}`] = profile

  if (short == 'al')
    profile.username = profile._json.angellist_url.replace('https://angel.co/','')
  if (short == 'tw')
    ups.bio = profile._json.description

  User.findOneAndUpdate({_id:this.user._id}, ups, (e,r) => {
    if (e || !r) errorCB(e||'connectProvider, no user found.',r)
    var trackData = { type: 'oauth', provider, id: profile.id }
    analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})
    done(e, r)
  })
}



module.exports = {
  googleLogin, localSignup, localLogin, connectProvider
}
