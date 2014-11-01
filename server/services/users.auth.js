import * as md5     from '../util/md5'
import User         from '../models/user'
var Data =      		require('./users.data')
var util =          require('../../shared/util')
var bcrypt =        require('bcrypt')
var logging = 			true

//-- in here we've decided to user the Mongoose user model directly
//-- to remove complexity / dependency and have full control of logging
//-- for when shit hits the fan

// For password and email hashing
var generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8))


var wrap = (fnName, done, cb) =>
	(e,r) => {
		if (e) {
			if (logging) $log(fnName+'.error')
			$log(e)
			//winston.error
			// winston.error(JSON.stringify(errData))
			done(e)
		}
		else {
			if (logging) $log((fnName+'.ok').white)
			if (r) r = r.toObject()
			cb(r)
		}
	}


function getCohortProperties(session, existingUser)
{
	//-- Default engagement for a new user
	var visit_first = util.sessionCreatedAt(session)
	var visit_signup = new Date()
	var visit_last = new Date()
	var visits = [util.dateWithDayAccuracy()]
	var aliases = []   // we add the aliases after successful sign up

	if (existingUser)
	{
		var {cohort} = existingUser

		//-This is an existing v0 user.
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
		}
	}

	return {engagement:{visit_first,visit_signup,visit_last,visits},aliases}
}


// upsertSmart
// Intelligent logic around updating user accounts on Signup and Login for
// User info and analytics. Adds the user if new, or updates if existing
// based on the search which could be by _id or provider e.g. { googleId: 'someId' }
function upsertSmart(upsert, existing, cb) {
	if (logging) $log('upsertSmart', 'existing[', JSON.stringify(existing), '] upsert =>', JSON.stringify(upsert))

	//-- Include users anon data in the upsert
	upsert = _.extend(upsert, this.session.anonData || {})
	upsert.cohort = getCohortProperties(this.session, existing)

	if (existing)
	{
		if (!existing.emailVerified) upsert.emailVerified = false

		if (existing.tags)
			upsert.tags = util.combineItems(existing.tags, upsert.tags, 'tagId')
		if (existing.bookmarks)
			upsert.bookmarks = util.combineItems(existing.bookmarks, upsert.bookmarks, 'objectId')
	}

	var existStr = (existing) ? existing._id : "new user"
	var {sessionID} = this

	User.findOneAndUpdate({ email: upsert.email }, upsert, { upsert: true },
		wrap(`upsert [${existStr}] [${JSON.stringify(upsert)}] []`, cb, (user) => {

		cb(null, user)

		//-- Do the rest async
		analytics.upsert(user, existing, sessionID, (aliases) => {
			if (aliases && aliases.length != user.cohort.aliases.length)
			{
				if (logging) $log(`updating ${user._id} {aliases}`.yellow)
				User.findOneAndUpdate({_id:user._id}, { 'cohort.aliases': aliases }, ()=>{} )
			}
		})

	}))
}


function googleLogin(profile, done)
{
	// var inValid = Validate.googleLogin(email)
	// if (inValid) return cb(svc.Forbidden(inValid))
	$log('glogin', Data.query.existing(profile._json.email))

	User.findOne(Data.query.existing(profile._json.email),
		wrap(`googleLogin.existing ${profile._json.email}`, done, (existing) => {

		var upsert = { googleId: profile.id, google: profile }

		if (existing && this.user)
			return cb(Error("Should not be here. G+ Login not yet implemented for authd users. <a href='/auth/logout'>logout</a>?"))

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

		upsertSmart.call(this, upsert, existing, done)

	}))
}


function localSignup(email, password, name, done) {
	// var inValid = Validate.localSignup(email)
	// if (inValid) return cb(svc.Forbidden(inValid))

	User.findOne(Data.query.existing(email),
		wrap(`localSignup.existing ${email} ${name}`, done, (existing) => {

	  if (existing)
	  {
	    // if (logging) $log('existing', existing)

	    var info = ""
	    if (existing.email == email) info = "user already exists"
	    if (existing.google && existing.google._json.email == email)
	    	info = "try google login"
	    return done(null, false, info)
	  }

    var upsert = {
    	name, email,
      emailVerified: false,
      local: { password: generateHash(password) }
		}

		upsertSmart.call(this, upsert, null, done)

	}))

}


function localLogin(email, password, done) {
	// var inValid = Validate.localLogin(email)
	// if (inValid) return cb(svc.Forbidden(inValid))

	User.findOne(Data.query.existing(email),
		wrap(`localLogin.existing ${email}`, done, (existing) => {

		var info = null
		var validPassword = (password, hash) => bcrypt.compareSync(password, hash)

		if (!existing)
			info = "no user found"
		else if (!existing.local || !existing.local.password)
			info = "try google login"
		else if (!validPassword(password, existing.local.password))
			info = "wrong password"

		if (info) return done(null, false, info)


		var upsert = { email: email }

		upsertSmart.call(this, upsert, existing, done)

	}))
}

export default {
	localLogin: localLogin,
	localSignup: localSignup,
	googleLogin: googleLogin
}

