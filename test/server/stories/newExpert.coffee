injectOAuthPayoutMethod = (user, providerName, pmKey,cb) ->
  require('../../../server/services/paymethods').addOAuthPayoutmethod.call({user},
    providerName, FIXTURE.clone('paymethods.'+pmKey),{},(e,r)->cb(r))

UNIQUIFY_USER = (key) ->
  uniqueKey = FIXTURE.uniquify('users', key, 'name email auth.gh.id auth.gp.id googleId')
  Object.assign(FIXTURE.users[uniqueKey],{key:uniqueKey,_id:new ObjectId()})


newUser = require('./newUser')

defaults =
  melbourne:
    name:       FIXTURE.wrappers.localization_melbourne.locationData.formatted_address,
    short:      FIXTURE.wrappers.localization_melbourne.locationData.name,
    timeZoneId: FIXTURE.wrappers.localization_melbourne.timezoneData.timeZoneId
  gh:
    FIXTURE.clone('users.ape1').auth.gh
  gp:
    FIXTURE.clone('users.ape1').auth.gp

module.exports = (key, opts, done) ->

  if !done and opts.constructor is Function
    done = opts
    opts = {login:false}

  {data,login} = opts

  user = UNIQUIFY_USER(key)
  # $log('user.key'.white, user.key, user)
  user.username = user.key
  user.initials = "ap-#{timeSeed()}"
  user.bio = "a bio for apexpert 1 #{timeSeed()}"
  user.location = defaults.melbourne

  if (user.auth)
    user.auth.gh = _.extend(defaults.gh||{},user.auth.gh||{})
  else
    user.auth = { gh: defaults.gh }

  user.auth.gp = _.extend(defaults.gp||{},user.auth.gp||{})

  if (user.auth.gh) then user.auth.gh.id += timeSeed()
  if (user.auth.gp) then user.auth.gp.id += timeSeed()

  expData = opts.data || {}
  if (expData.user)
    Object.assign(user,expData.user)


  DB.ensureDoc 'User', user, (e, r) ->
    FIXTURE.users[user.key] = user
    LOGIN {key:user.key}, (s) ->
      s.userKey = user.key
      d = rate: 70, breif: 'yo', tags: [FIXTURE.tags.angular]
      POST "/experts/me", d, (expert) ->
        expect(expert._id, "no expert id")
        FIXTURE.experts[user.key] = expert
        if !opts.payoutmethod
          done(s, expert)
        else
          injectOAuthPayoutMethod s, 'paypal', 'payout_paypal_enus_verified', (payoutmethod) ->
            done expert, s, payoutmethod
