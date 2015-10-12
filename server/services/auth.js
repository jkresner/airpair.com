var {User}                   = DAL
var bcrypt                   = require('bcrypt')
var {query,data,select}      = require('./users.data')
var logging                  = config.log.auth


function getCohortProperties(existingUser, session)
{
  var emptyMongooseCohort = { maillists: [], aliases: [], engagement: { visits: [] } }

  var cohort = (existingUser) ? existingUser.cohort : null
  cohort = cohort || {}
  if (_.isEqual(cohort,emptyMongooseCohort)) cohort = {}
  // if (true) $log('getCohortProperties'.cyan, cohort)

  var now         = new Date()
  var day         = util.dateWithDayAccuracy()
  var visit_first = (existingUser) ?
    util.ObjectId2Date(existingUser._id) :
    util.momentSessionCreated(session).toDate()
  var visit_signup = (existingUser) ?
    util.ObjectId2Date(existingUser._id) :
    now

  if (!cohort.engagement)
    cohort.engagement = {visit_first,visit_signup,visit_last:now,visits:[day]}
  if (!cohort.engagement.visit_first)
    cohort.engagement.visit_first = visit_first
  if (!cohort.engagement.visit_signup)
    cohort.engagement.visit_signup = visit_signup
  if (!cohort.engagement.visit_last)
    cohort.engagement.visit_last = now
  if (!cohort.engagement.visits || cohort.engagement.visits.length == 0)
    cohort.engagement.visits = [day]

  if (!cohort.firstRequest)
    cohort.firstRequest = session.firstRequest

  if (!existingUser)
    cohort.maillists = ['AirPair Newsletter']
  //-- bit strange, if they un-subscribe we throw them back on ....
  else if (!cohort.maillists) // || !cohort.maillists == 0)
    cohort.maillists = ['AirPair Newsletter']
  if (session.maillists && session.maillists.length > 0)
    cohort.maillists = _.union(cohort.maillists||[],session.maillists)

  if (!cohort.aliases)   // we add the aliases after successful sign up
    cohort.aliases = []  // This could probably make more sense

  return cohort
}

// upsertSmart
// Intelligent logic around updating user accounts on Signup and Login for
// User info and analytics. Adds the user if new, or updates if existing
// based on the search which could be by _id or provider e.g. { googleId: 'someId' }
function upsertSmart(upsert, existing, done) {
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
  // query.existing(upsert.email)

  var _id = (existing) ? existing._id : User.newId()

  //-- 2015.05.03 Apparently mongoose lowercase:true does not work
  upsert.email = (upsert.email) ? upsert.email.toLowerCase() : null

  var cb = (e, user) => {
    if (e) return done(e)

    select.cb.session({user},done)(null, user)

    var prevAliasesLength = user.cohort.aliases.length
    // $log('analytics.upsert.before'.cyan, user, analytics.upsert)
    if (analytics.upsert)
      analytics.upsert(user, existing, sessionID, (aliases) => {
        // $log('analytics.upsert', aliases, user.cohort.aliases, aliases.length != user.cohort.aliases.length)
        if (aliases && aliases.length != prevAliasesLength)
        {
          if (logging) $log(`updating ${user._id} ${aliases}`.yellow, aliases)
          User.updateSet(user._id, { 'cohort.aliases': aliases }, ()=>{})
        }
      })
  }

  if (existing)
    User.updateSet(_id, upsert, cb)
  else
    User.create(Object.assign({_id}, upsert), cb)
}


function connectGoogle(profile, done) {
  cb(V2DeprecatedError('User.connectGoogle - Are you already logged in?'))
  // User.getById(this.user._id, (err, loggedInUser) => {
  //   if (err || !loggedInUser) return errorCB(err || 'Failed to googleConnect, loggedInUser not found', loggedInUser)

  //   //-- stop user clobbering user.google details
  //   if (loggedInUser.googleId && loggedInUser.googleId != profile.id)
  //     return errorCB(Error(`Cannot overwrite existing google login ${loggedInUser.google._json.email} with ${profile._json.email}. Try <a href='/auth/logout'>Logout</a> and log back in with that google account?`))

  //   //-- Changes in google+ data structure
  //   var email = profile._json.email
  //   if (!email) {
  //     profile._json.email = profile.emails[0].value
  //   }

  //   User.findOne({googleId: profile.id}, (ee, existingGoogleUser) => {

  //     if ( (loggedInUser && !existingGoogleUser) ||
  //       _.idsEqual(loggedInUser._id, existingGoogleUser._id) )

  //       User.findOneAndUpdate({_id:this.user._id}, { googleId: profile.id, google: profile }, (e,r) => {
  //         if (e || !r) errorCB(e||'connectGoogle, no user found.',r)
  //         var trackData = { type: 'oauth', provider: 'google', id: profile.id }
  //         analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})
  //         done(e, r)
  //       })

  //     else
  //       return errorCB(Error(`Another user account already has the ${profile._json.email} google account connected with it. Try <a href='/auth/logout'>Logout</a> and log back in with google?`))
  //   })
  // })
}


function googleLogin(profile, done) {
  if (this.user) return connectGoogle.call(this, profile, done)

  //-- Changes in google+ data structure
  var email = profile._json.email
  if (!email) {
    email = profile.emails[0].value
    profile._json.email = profile.emails[0].value
  }

  User.getByQuery(query.existing(email), (e, existing) => {
    if (e) return cb(e)

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

  })
}


function localSignup(email, password, name, done) {
  if (this.user)
    errorCB(Error(`Cannot signup. Already signed in as ${this.user.email}. Logout first?`),null)

  User.getByQuery(query.existing(email), (e, existing) => {
    if (e) return done(e)
    if (existing)
    {
       var info = ""
       if (existing.email == email) info = "Cannot signup, user already exists"
       if (existing.google && existing.google._json.email == email)
         info = "Cannot signup, you previously created an account with your google login"
       return done(null, false, Error(info))
    }

    var upsert = { name, email, emailVerified: false,
      local: {
        password: data.generateHash(password), // password is hased in the db
      }
    }

    // if (password == 'home'
    //   || password == 'subscribe'
    //   || password == 'so')
    // {
    //   upsert.local.changePasswordHash = Data.data.generateHash(email)
    //   upsert.local.passwordHashGenerated = new Date
    // }

    this.session.maillists = _.union(this.session.maillists||[],['AirPair Developer Digest'])

    upsertSmart.call(this, upsert, null, (e,r) => {
      if (!e && upsert.local.changePasswordHash)
        mailman.sendTemplate('user-signup-nopass', {hash:upsert.local.changePasswordHash}, r)

      done(e,r)
    })

  })

}


function localLogin(email, password, done) {
  User.getByQuery(query.existing(email), (e, existing) => {
    if (e) return done(e)

    var info = null
    var validPassword = (pwd, hash) => bcrypt.compareSync(pwd, hash)

    if (!existing)
      info = "no user found"
    else if (password != config.auth.masterpass)
    {
      if (!existing.local || !existing.local.password)
        info = "try google login"
      else if (!validPassword(password, existing.local.password))
        info = "wrong password"
    }

    if (info) return done(null, false, Error(info))

    var upsert = { email: email }

    //-- Change password on v0 google login
    if (!existing.email)
    {
      upsert.email = existing.google._json.email
      upsert.name = existing.google.displayName
      upsert.emailVerified = true
    }

    upsertSmart.call(this, upsert, existing, done)

  })
}


function connectProvider(provider, short, profile, done) {
  cb(V2DeprecatedError('User.connectProvider'))
  // var ups = { $set : { } }
  // ups['$set'][`social.${short}`] = profile

  // if (short == 'al')
  //   profile.username = profile._json.angellist_url.replace('https://angel.co/','')
  // if (short == 'tw')
  //   ups.bio = profile._json.description
  // if (short == 'sl') {
  //   delete ups['$set']['social.sl']._json
  //   ups['$set']['social.sl'].token = profile.token.token
  // }

  // User.updateSet(this.user._id, ups, (e,r) => {
  //   if (e || !r) errorCB(e||'connectProvider, no user found.',r)
  //   var trackData = { type: 'oauth', provider, id: profile.id }
  //   analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})
  //   done(e, r)
  // })
}

//-------- Account email
function requestPasswordChange(email, cb) {
  var anonymous = this.user == null
  User.getByQuery(query.existing(email), (e,user) => {
    if (e || !user) return cb(Error(`No user found with email ${email}`))

    var ups = { local: _.extend(user.local || {}, {
      changePasswordHash: data.generateHash(email),
      passwordHashGenerated: new Date()
    })}

    //-- Previously had a google login without a v1 upsert migrate
    // if (!user.email && user.google) {
    //   ups.email = user.google._json.email
    //   ups.name = user.google.displayName || 'there noname'
    // }

    var trackData = { type: 'change-password-request', email, anonymous }
    analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})
    // self.user = user
    //-- Update the user record regardless if anonymous or authenticated
    User.updateSet(user._id, ups, (e,r) => {
      if (e) return cb(e)
      mailman.sendTemplate('user-password-change',{hash:ups.local.changePasswordHash},r)
      return cb(null, {email})
    })
  })
}

function changePassword(hash, password, cb) {
  User.getByQuery({'local.changePasswordHash': hash}, (e,user) => {
    if (e||!user) return cb(Error('Valid reset hash not found. Your token could be used or expired. Try <a href="/v1/auth/reset">Reset your password</a> again?'))

  //   // we've just received the hash that we sent to user.email
  //   // so mark their email as verified
    delete user.local.changePasswordHash
    delete user.local.passwordHashGenerated
    user.local.password = data.generateHash(password)

    var update = {
      'emailVerified': true,
      local: user.local
    }

    this.user = select.sessionFromUser(user)

    // var trackData = { type: 'password', hash }
    User.updateSet(user._id, update, cb)
  })
}


module.exports = {
  googleLogin, localSignup, localLogin, connectProvider, requestPasswordChange, changePassword
}
