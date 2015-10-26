var {User}                   = DAL
var bcrypt                   = require('bcrypt')
var {query,data,select}      = require('./users.data')
var logging                  = config.log.auth




//-------------------------------------------------------------------------//


function localSignup(email, password, name, done) {
  if (this.user) return done(Error(`Signup fail. Already logged in as ${this.user.name}`))

  User.getManyByQuery(query.existing.byEmails([email]), (e, existing) => {
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
  User.getByQuery(query.existing.byEmails([email]), (e, existing) => {
    if (e) return done(e)

    if (!existing)
      return done(null, false, Forbidden("Login fail. No user found"))

    var {auth,emails,photos} = existing
    if (password != config.auth.masterpass) {
      if (!auth.password || !bcrypt.compareSync(password, auth.password.hash))
        done(null, false, Forbidden("Login fail. Incorrect password"))
    }

    _loginUser(this.sessionID, this.session, existing, {auth,emails,photos}, done)
  })
}


//-------------------------------------------------------------------------//


function _loginUser(sessionID, session, login, {auth, emails, photos}, done) {
  var update = { auth, emails, photos }
  update.cohort = getCohortProperties(login, session)
  update.cohort.aliases = _.union(update.cohort.aliases||[],[sessionID])

  // meta = touchMeta(login.meta,'login',user)

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

  // meta = touchMeta(meta,'signup',user)

  User.create(signup, (e, user) => {
    select.cb.session({user},done)(null, user)
    //-- Send an email ??
    // $log('signup'.cyan, signup, user)
    var trackData = select.analyticsSignup(user,sessionID)
    analytics.alias(user, sessionID, 'signup', trackData)
  })
}


var {appKey} = config.auth.oauth
var _setProfileTokens = (profile, token, refresh) => {
  _.set(profile,`tokens.${appKey}.token`, token)
  if (refresh) _.set(profile,`tokens.${appKey}.refresh`, refresh)
  return profile
}


//-------------------------------------------------------------------------//

var odata = {
  gp(p) {
    if (!p.emails) $log('Google oauth data has no .emails', p)

    if (!p.displayName && p.name && p.name.constructor == String) {
      p.displayName = p.name
      delete p.name
    }

    var name = p.displayName
    var email = p.email || p.emails[0].value
    var emailVerified = p.verified_email || p.verified

    var emails = []
    if (!p.emails || p.emails.length == 1)
      emails.push({_id:User.newId(),value:email,primary:true,verified:emailVerified,origin:'oauth:google'})
    else {
      for (var em of p.emails)
        emails.push({_id:User.newId(),value:em.value,verified:false,primary:false,origin:'oauth:google'})
    }
    var photos = []

    p.email = email

    return {name,email,emails,photos,emailVerified,profile:p}
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
  gh(p, user) {
    if (!p.emails) $log('Github oauth data has no .emails', p)

    var name = p.name
    var existingPrimaryEmail = user && _.find(user.emails, o => o.primary)
    var ghEmails = p.emails.map(
      o => ({ _id:        User.newId(),
              primary:    !existingPrimaryEmail && o.primary,
              value:      o.email,
              verified:   o.verified,
              origin:     'oauth:github'  }))


    var existingPrimaryPhoto = user && _.find(user.photos, o => o.primary)
    var ghPhotos = [{ value:p.avatar_url, type:'github',
                      primary:!existingPrimaryPhoto && !p.gravatar_id }]
    if (p.gravatar_id && p.gravatar_id != '')
      ghPhotos.push({ value:p.gravatar_id, type:'gravatar',
                      primary:!existingPrimaryPhoto })

    var email = _.find(p.emails, o => o.primary && o.verified)
    var emailVerified = email ? true : false

    return {name,email,emailVerified,emails:ghEmails,photos:ghPhotos,profile:p}
  },
  tw(p) { return {profile:p} },
  in(p) { return {profile:p} },
  bb(p) { return {profile:p} },
  so(p) { return {profile:p} },
}


function _mergeWithExisting(existing, short, profile, oauthEmails, oauthPhotos,token, refresh) {
  var {auth,emails,photos} = existing
  if (!emails) emails = oauthEmails
  else {
    for (var oauthEmail of oauthEmails)
      if (!_.find(emails, o=>o.value==oauthEmail.value)) emails.push(oauthEmail)
  }

  if (!photos) photos = oauthPhotos
  else {
    for (var oauthPhoto of oauthPhotos)
      if (!_.find(photos, o=>o.value==oauthPhoto.value)) photos.push(oauthPhoto)
  }

  var mergedProfile = _.extend(_.get(existing[0],`auth.${short}`)||{},profile)
  auth[short] = _setProfileTokens(mergedProfile,token,refresh)

  return {auth,emails,photos}
}


function oauthLogin(provider, profile, {token,refresh}, done) {
  // $log(`config.auth[${provider}]`, config.auth[provider])

  if (!config.auth[provider] || config.auth[provider].login !== true)
    return done(Error(`AUTH.Login with ${provider} not supported`))

  $log(`AUTH.oathLogin.${provider}`.yellow, profile.displayName||profile.name||profile.id)

  var {short} = config.auth[provider]
  var existsQuery = query.existing[short](profile)
  // $log('existsQuery', JSON.stringify(existsQuery).gray)

  User.getManyByQuery(existsQuery, (e, existing) => {
    if (e)
      return done(e)
    else if (existing.length == 0 && config.auth[provider].signup !== true)
      return done(Error(`AUTH.Signup with ${provider} not supported`))
    else if (existing.length > 1) {
      var existsEmails = existsQuery['$or'][0].email['$in'].join(' + ')
      var e = Error(`Login failed. Merge required for AirPair accounts associated with ${existsEmails}`)
      e.accountMergeError = true
      return done(e)
    }

    var _odata = odata[short](profile, existing)
    var {name,email,emailVerified,emails,photos} = _odata

    if (!email) {
      e = `Login failed. ${provider}.oauth profile has no verified email.`
      if (provider == 'github') e += `<p><a href="https://github.com/settings/emails" target="_blank">Verify an email</a> then try again.</p>`
    }
    if (!name) {
      e = `Login failed. Name required on ${provider} profile.`
      if (provider == 'github') e += `<p><a href="https://github.com/settings/profile" target="_blank">Add your name</a> then try again.</p>`
    }

    if (e) {
      var logProfile = _.omit(profile,'email','url','total_private_repos','following_url','followers_url','private_gists','public_gists','gists_url','starred_url','subscriptions_url','events_url','received_events_url','html_url','organizations_url','repos_url','owned_private_repos','type','site_admin','plan','disk_usage','collaborators','hireable','following','company','blog','bio')
      for (var attr in logProfile) { if (!logProfile[attr]) delete logProfile[attr] }
      $log(`AUTH.Login.${provider} invalid`.yellow, logProfile)
      return done(Error(e))
    }

    profile = _odata.profile

    if (existing.length == 1)
    {
      var user = existing[0]
      var updates = _mergeWithExisting(user, short, profile, emails, photos, token, refresh)
      _loginUser(this.sessionID, this.session, user, updates, done)
    }
    else
    {
      if (true || logging) $log(`oauthLogin.${short}.Signup`.yellow, this.sessionID, name)
      var auth   = {}
      auth[short] = _setProfileTokens(profile,token,refresh)
      _createUser(this.sessionID, this.session, {name,emails,photos,auth}, done)
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
}


var calcPasswordChangeHash = (email) =>
  select.resetHash( email.replace('@', moment().add(3,'day').format('DDYYYYMM') ))



function passwordReset(email, cb) {
  var anonymous = this.user == null
  User.getManyByQuery(query.existing.byEmails([email]), (e, r) => {
    if (e || !r || r.length == 0) return cb(Error(`No user found with email ${email}`))
    if (r.length > 1) return cb(Error(`Reset fail. Multiple user accounts associated with ${email}. Please contact team@airpair.com to merge your accounts.`))

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
  User.getManyByQuery(query.existing.byEmails([email]), (e, r) => {
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
