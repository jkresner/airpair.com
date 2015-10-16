
UNIQUIFY_USER = (key) ->
  uniqueKey = FIXTURE.uniquify('users', key, 'name email username auth.gh.id auth.gp.id auth.password.value key')
  Object.assign(FIXTURE.users[uniqueKey],{key:uniqueKey,_id:new ObjectId()})


module.exports = (key, opts, done) ->
  if !done and opts.constructor is Function
    done = opts
    opts = {login:true}

  {data,paymethod,login} = opts
  user = UNIQUIFY_USER(key)

  paymethodId = if paymethod is true then new ObjectId() else null
  if paymethodId
    paymethod = _.extend({_id:paymethodId,userId:user._id}, FIXTURE.paymethods.braintree_visa)
    user.primaryPayMethodId = paymethodId
    DB.Collections.paymethods.insert paymethod, ->

  # temporary stuff
  user.emailVerified = true
  user.location =
    name:       FIXTURE.wrappers.localization_melbourne.locationData.formatted_address,
    short:      FIXTURE.wrappers.localization_melbourne.locationData.name,
    timeZoneId: FIXTURE.wrappers.localization_melbourne.timezoneData.timeZoneId


  user.emails = [{value:user.email,primary:true,verified:true}]

  Object.assign(user, opts.data||{})

  user.auth = {}
  if opts.oauth
    user.auth[oauth] = 'bhac'
  else
    user.auth.password = hash: 'basdfsdfsdf'

  # $log('create user'.yellow, user.key.white, user)
  DB.Collections.users.insert user, (e, r) ->
    if (e) then $log('DB.insert.user', e)
    if login
      LOGIN user, (session) ->
        if (paymethodId)
          session.primaryPayMethodId = paymethodId # convinience
        done session, user.key
    else
      done user.key


