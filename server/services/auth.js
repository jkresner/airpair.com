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


function localSignup(email, password, name, done) {
  cb(V2DeprecatedError('User.getSiteNotifications'))

  // if (this.user)
  //   errorCB(Error(`Cannot signup. Already signed in as ${this.user.email}. Logout first?`),null)

  // User.getByQuery(query.existing(email), (e, existing) => {
  //   if (e) return done(e)
  //   if (existing)
  //   {
  //      var info = ""
  //      if (existing.email == email) info = "Cannot signup, user already exists"
  //      if (existing.google && existing.google._json.email == email)
  //        info = "Cannot signup, you previously created an account with your google login"
  //      return done(null, false, Error(info))
  //   }

  //   var upsert = { name, email, emailVerified: false,
  //     local: {
  //       password: data.generateHash(password), // password is hased in the db
  //     }
  //   }

  //   // if (password == 'home'
  //   //   || password == 'subscribe'
  //   //   || password == 'so')
  //   // {
  //   //   upsert.local.changePasswordHash = Data.data.generateHash(email)
  //   //   upsert.local.passwordHashGenerated = new Date
  //   // }

  //   this.session.maillists = _.union(this.session.maillists||[],['AirPair Developer Digest'])

  //   upsertSmart.call(this, upsert, null, (e,r) => {
  //     if (!e && upsert.local.changePasswordHash)
  //       mailman.sendTemplate('user-signup-nopass', {hash:upsert.local.changePasswordHash}, r)

  //     done(e,r)
  //   })

  // })
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
    // if (!existing.email)
    // {
    //   upsert.email = existing.google._json.email
    //   upsert.name = existing.google.displayName
    //   upsert.emailVerified = true
    // }

    upsertSmart.call(this, upsert, existing, done)

  })
}


var {appKey} = config.auth.oAuth

function oauthLogin(provider, profile, done) {
  var {short} = config.auth[provider]

  //-- Changes in google+ data structure
  var {email,id} = profile
  if (!email && short == 'gp')
    email = profile.emails[0].value


  User.getByQuery(query[short].existing(email, id), (e, existing) => {
    if (e) return cb(e)

    var upsert = {}
    upsert[`auth.${short}`] = profile
    //-- copy google details to top level users details
    if (!existing || !existing.email)
    {
      upsert.email = profile.email
      upsert.name = profile.displayName
      upsert.emailVerified = profile.verified_email
    }
    else {
      // In case google login email different from contact email
      upsert.email = existing.email
    }

    upsertSmart.call(this, upsert, existing, done)

  })
}


function link(provider, profile, {token,refresh}, done) {
  $log('link.${provider}'.white, profile, token, refresh)

  if (!this.user) {
    if (provider == 'google') return oauthLogin.apply(this, arguments)
    else return Done(Error(`auth.Login with ${provider} not supported`))
  }

  var {short} = config.auth[provider]
  var {_id} = this.user

  User.getById(_id, {select:`auth.${short}`}, (e, {auth})=>{
    if (auth[short]) {
      if (auth[short].id != profile.id)
        return done(Error(`Unlink existing ${provider} account first`))

      profile = _.extend(auth[short], profile)
    }

    _.set(profile,`tokens.${appKey}.token`, token)
    if (refresh)
      _.set(profile,`tokens.${appKey}.refresh`, refresh)
    var $set = {}
    $set[`auth.${short}`] = profile
    User.updateSet(_id, $set, done)
  })

  //   var trackData = { type: 'oauth', provider, id: profile.id }
  //   analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})
  // if (short == 'al')
  //   profile.username = profile._json.angellist_url.replace('https://angel.co/','')
  // if (short == 'tw')
  //   ups.bio = profile._json.description
  // if (short == 'sl') {
  //   delete ups['$set']['social.sl']._json
  //   ups['$set']['social.sl'].token = profile.token.token
  // }
}

//-------- Account email
function requestPasswordChange(email, cb) {
  done(V2DeprecatedError('Auth.requestPasswordChange'))

  // var anonymous = this.user == null
  // User.getByQuery(query.existing(email), (e,user) => {
  //   if (e || !user) return cb(Error(`No user found with email ${email}`))

  //   var ups = { local: _.extend(user.local || {}, {
  //     changePasswordHash: data.generateHash(email),
  //     passwordHashGenerated: new Date()
  //   })}

  //   //-- Previously had a google login without a v1 upsert migrate
  //   // if (!user.email && user.google) {
  //   //   ups.email = user.google._json.email
  //   //   ups.name = user.google.displayName || 'there noname'
  //   // }

  //   var trackData = { type: 'change-password-request', email, anonymous }
  //   analytics.track(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})
  //   // self.user = user
  //   //-- Update the user record regardless if anonymous or authenticated
  //   User.updateSet(user._id, ups, (e,r) => {
  //     if (e) return cb(e)
  //     mailman.sendTemplate('user-password-change',{hash:ups.local.changePasswordHash},r)
  //     return cb(null, {email})
  //   })
  // })
}

function changePassword(hash, password, cb) {
  done(V2DeprecatedError('Auth.requestPasswordChange'))

  // if (hash != "123456789")
  //   return cb(Error('Invalid reset hash. <a href="/v1/auth/reset">Send it again</a>?'))

  // var _id = decodeHash(hash)

  // User.getByQuery({'local.changePasswordHash': hash}, (e,user) => {
  //   if (e||!user)

  //   var update = {
  //     'emailVerified': true,
  //     'auth.password.vale': data.generateHash(password)
  //   }

  //   this.user = select.sessionFromUser(user)

  //   // var trackData = { type: 'password', hash }
  //   User.updateSet(user._id, update, cb)
  // })
}


module.exports = {
  localSignup, localLogin, link, requestPasswordChange, changePassword
}
