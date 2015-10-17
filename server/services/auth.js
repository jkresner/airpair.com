 var {User}                   = DAL
var bcrypt                   = require('bcrypt')
var {query,data,select}      = require('./users.data')
var logging                  = config.log.auth



function _loginUser(sessionID, session, login, auth, done) {
  var update = { auth }
  update.cohort = getCohortProperties(login, session)
  update.cohort.aliases = _.union(update.cohort.aliases||[],[sessionID])

  User.updateSet(login._id, update, (e, user) => {
    select.cb.session({user},done)(null, user)

    // $log('signup'.cyan, login, user)
    var trackData = select.analyticsLogin(user,sessionID)
    analytics.alias(user, sessionID, 'login', trackData)
  })
}


function _createUser(sessionID, session, signup, done) {
  var maillists = _.union(session.maillists||[],['AirPair Developer Digest'])

  var primaryEmail = _.find(signup.emails, email => email.primary)
  primaryEmail.lists = maillists

  // temporary until fully migrated
  signup.email = primaryEmail.value
  signup.emailVerified = primaryEmail.verified

  signup.cohort = getCohortProperties(null, session)
  signup.cohort.aliases = [sessionID]

  User.create(signup, (e, user) => {
    select.cb.session({user},done)(null, user)
    //-- Send an email ??
    // $log('signup'.cyan, signup, user)
    var trackData = select.analyticsSignup(user,sessionID)
    analytics.alias(user, sessionID, 'signup', trackData)
  })
}


function localSignup(email, password, name, done) {
  if (this.user) return done(Error(`Signup fail. Already logged in as ${this.user.name}`))

  User.getManyByQuery(query.existing.byEmail(email), (e, existing) => {
    // $log(JSON.stringify(query.existing.byEmail(email)).white, existing)
    if (e) return done(e)
    if (existing.length == 1) return done(Error(`Signup fail. Account with email already exists. Please reset your password.`))
    if (existing.length > 1) return done(Error(`Signup fail. Multiple user accounts associated with ${email}. Please contact team@airpair.com to merge your accounts.`))

    var user    = {name}
    user.emails = [{value:email,primary:true,verified:false}]
    user.auth   = {
      password:   { hash: select.passwordHash(password) } // password is hased in the db
    }

    if (logging) $log('Auth.localSignup', this.sessionID, user.name)
    _createUser(this.sessionID, this.session, user, done)
  })
}


function localLogin(email, password, done) {
  // $log('AUTH.localLogin'.yellow, email)
  User.getByQuery(query.existing.byEmail(email), (e, existing) => {
    if (e) return done(e)

    if (!existing)
      return done(null, false, Forbidden("No user found"))

    var {auth} = existing
    if (password != config.auth.masterpass) {
      if (!auth.password || !bcrypt.compareSync(password, auth.password.hash))
        done(null, false, Forbidden("In correct password"))
    }

    _loginUser(this.sessionID, this.session, existing, existing.auth, done)
  })
}


var {appKey} = config.auth.oauth
var _setProfileTokens = (profile, token, refresh) => {
  _.set(profile,`tokens.${appKey}.token`, token)
  if (refresh) _.set(profile,`tokens.${appKey}.refresh`, refresh)
  return profile
}


var odata = {
  gp(p) {
    if (!p.displayName && p.name && p.name.constructor == String) {
      p.displayName = p.name
      delete p.name
    }

    var name = p.displayName
    var email = p.email || p.emails[0].value
    var emailVerified = p.verified_email || p.verified

    p.email = email

    return {name,email,emailVerified,profile:p}
  },
  al(p) {
    var username = p.angellist_url.replace('https://angel.co/','')
    return {profile: _.extend({username}, _.omit(p,'facebook_url','behance_url','dribbble_url')) }
  },
  sl(p) {
    var username = p.info.user.name
    var selected = util.selectFromObject(p.info.user,['id','real_name','tz_offset','profile.email'])
    return { profile: _.extend({username},selected) }
  },
  tw(p) { return {profile:p} },
  in(p) { return {profile:p} },
  bb(p) { return {profile:p} },
  gh(p) { return {profile:p} },
  so(p) { return {profile:p} },
}


function oauthLogin(provider, profile, {token,refresh}, done) {
  if (!config.auth[provider] && config.auth[provider].login !== true)
    return Done(Error(`AUTH.Login with ${provider} not supported`))

  $log(`AUTH.oathLogin.${provider}`.yellow, provider.white, profile.displayName||profile.name)

  var {short} = config.auth[provider]
  var {profile,name,email,emailVerified} = odata[short](profile)

  if (!email) return done(Error(`auth.Login failed. ${provider} profile has no email`))
  if (!name) return done(Error(`auth.Login failed. ${provider} profile has no name`))

  var existsQuery = query.existing[short](profile)
  User.getManyByQuery(existsQuery, (e, existing) => {
    if (e)
      done(e)
    else if (existing.length > 1)
      done(Error(`Login failed. Multiple user accounts associated with ${email}. Please contact team@airpair.com to merge your accounts.`))
    else if (existing.length == 1) {
      var user = existing[0]
      var {auth} = user

      var mergedProfile = _.extend(_.get(existing[0],`auth.${short}`)||{},profile)
      auth[short] = _setProfileTokens(mergedProfile,token,refresh)

      _loginUser(this.sessionID, this.session, user, auth, done)
    }
    else if (config.auth[provider].signup !== true)
      done(Error(`AUTH.Signup with ${provider} not supported`))
    else
    {
      var user    = {name,email,emailVerified}
      user.emails = [{value:email,primary:true,verified:emailVerified||false}]
      user.auth   = {}
      user.auth[short] = _setProfileTokens(profile,token,refresh)
      if (true || logging) $log('oauthLogin.Signup'.yellow, this.sessionID, user.name)
      _createUser(this.sessionID, this.session, user, done)
    }
  })
}


function link(provider, profile, {token,refresh}, done) {
  var {user} = this
  if (!user) return oauthLogin.call(this, provider, profile, {token,refresh}, done)

  $log(`AUTH.link.${provider}`.yellow, user.name)

  var {short} = config.auth[provider]
  var {profile} = odata[short](profile)

  User.getById(user._id, {select:`auth.${short}`}, (e, {auth})=>{
    if (auth[short]) {
      if (auth[short].id != profile.id)
        return done(Error(`Unlink existing ${provider} account first.`))

      profile = _.extend(auth[short], profile)
    }

    auth[short] = _setProfileTokens(profile,token,refresh)

    var $set = {}
    $set[`auth.${short}`] = profile
    User.updateSet(user._id, $set, done)

    var trackData = select.analyticsLink(user, provider, profile)
    analytics.event(`link:${short}`, user, trackData)
  })

  // if (short == 'tw')
  //   ups.bio = profile._json.description
  // if (short == 'sl') {
  //   delete ups['$set']['social.sl']._json
  //   ups['$set']['social.sl'].token = profile.token.token
  // }
}


var calcPasswordChangeHash = (email) =>
  select.resetHash( email.replace('@', moment().add(3,'day').format('DDYYYYMM') ))



function passwordReset(email, cb) {
  var anonymous = this.user == null
  User.getManyByQuery(query.existing.byEmail(email), (e, r) => {
    if (e || !r || r.length == 0) return cb(Error(`No user found with email ${email}`))
    if (r.length > 1) return done(Error(`Reset fail. Multiple user accounts associated with ${email}. Please contact team@airpair.com to merge your accounts.`))

    var user = r[0]
    var hash = calcPasswordChangeHash(email)

    if (user) analytics.event('reset-password', user, { email, anonymous })

    //-- Update the user record regardless if anonymous or authenticated
    // User.updateSet(user._id, ups, (e,r) => {
      // if (e) return cb(e)
    mailman.sendTemplate('user-password-change',{hash,email}, user)
    return cb(null, {email})
    // })
  })
}



function changePassword(email, hash, password, cb) {
  User.getManyByQuery(query.existing.byEmail(email), (e, r) => {
    if (e || !r || r.length != 1) return cb(Error(`Change password failed for ${email}:${hash}`))
    var user = r[0]

    var newerHash = calcPasswordChangeHash(email)
    if (hash != newerHash)
      return cb(Error(`Pasword reset hash expired.`))

    var update = {
      'emailVerified': true,
      'auth.password.hash': select.passwordHash(password)
    }

    var {emails} = r
    if (emails) {
      var emailToVerify = _.find(emails, em => em.value == email)
      emailToVerify.verified = true

    }

    if (user) analytics.event('set-password', user, { email })

    User.updateSet(user._id, update, cb)
  })
}


module.exports = {
  localSignup, localLogin, link, passwordReset, changePassword
}




var Forbidden = (msg) => {
  var err = new Error(msg)
  err.status = 401
  return err
}


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
    util.ObjectId2Date(existingUser._id) : util.momentSessionCreated(session).toDate()
  var visit_signup = (existingUser) ? util.ObjectId2Date(existingUser._id) : now

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

  if (!cohort.firstRequest && session.firstRequest)
    cohort.firstRequest = session.firstRequest

  // if (!cohort.aliases)   // we add the aliases after successful sign up
    // cohort.aliases = []  // This could probably make more sense

  return cohort
}


// upsertSmart
// Intelligent logic around updating user accounts on Signup and Login for
// User info and analytics. Adds the user if new, or updates if existing
// based on the search which could be by _id or provider e.g. { googleId: 'someId' }
// function upsertSmart(upsert, existing, done) {
  // if (logging) $log(`upsertSmart', 'existing[${JSON.stringify(existing)}] upsert =>${JSON.stringify(upsert)}`)

  // upsert = _.extend(upsert, this.session.anonData || {})
  // upsert.cohort = getCohortProperties(existing, this.session)

  // if (existing) {
  //   if (!existing.emailVerified) upsert.emailVerified = false

  // //-- Session is their cookie, which may or may not have been their first visit
  // var {sessionID} = this
  // // query.existing(upsert.email)

  // var _id = (existing) ? existing._id : User.newId()

  // //-- 2015.05.03 Apparently mongoose lowercase:true does not work
  // upsert.email = (upsert.email) ? upsert.email.toLowerCase() : null

  // var cb = (e, user) => {
  //   if (e) return done(e)

  //   select.cb.session({user},done)(null, user)

  //   var prevAliasesLength = user.cohort.aliases.length
  //   // $log('analytics.upsert.before'.cyan, user, analytics.upsert)
  //   if (analytics.upsert)
  //     analytics.upsert(user, existing, sessionID, (aliases) => {
  //       // $log('analytics.upsert', aliases, user.cohort.aliases, aliases.length != user.cohort.aliases.length)
  //       if (aliases && aliases.length != prevAliasesLength)
  //       {
  //         if (logging) $log(`updating ${user._id} ${aliases}`.yellow, aliases)
  //         User.updateSet(user._id, { 'cohort.aliases': aliases }, ()=>{})
  //       }
  //     })
  // }

  // if (existing)
  //
  // else

// }
