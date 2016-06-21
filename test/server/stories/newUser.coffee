
# UNIQUIFY_USER = (key) ->
  # uniqueKey = FIXTURE.uniquify('users', key, 'name email username auth.gh.id auth.gp.id auth.password.value')
  # assign(FIXTURE.users[uniqueKey],{key:uniqueKey,_id:new ObjectId()})


module.exports = (key, opts, done) ->
  if !done and opts.constructor is Function
    done = opts
    opts = {login:true}

  {data,paymethod,login} = opts
  user = FIXTURE.clone("users.#{key}")
  user._id = new ObjectId()

  suffix = DATA.timeSeed()

  paymethodId = if paymethod is true then new ObjectId() else null
  if paymethodId
    paymethod = _.extend({_id:paymethodId,userId:user._id}, FIXTURE.paymethods.braintree_visa)
    user.primaryPayMethodId = paymethodId
    DB.Collections.paymethods.insert paymethod, ->

  # temporary stuff
  user.emailVerified = true
  user.email = user.email.replace('@',"#{suffix}@")
  user.location =
    name:       FIXTURE.wrappers.localization_melbourne.locationData.formatted_address,
    shortName:  FIXTURE.wrappers.localization_melbourne.locationData.name,
    timeZoneId: FIXTURE.wrappers.localization_melbourne.timezoneData.timeZoneId


  user.emails = [{value:user.email,primary:true,verified:true}]

  assign(user, opts.data||{})

  user.auth = { gh: DATA.ghProfile(key, true) }
  user.username = user.auth.gh.login || user.emails[0].value.split('@')[0]

  user.key = key+suffix

  FIXTURE.users[user.key] = user
  # $log('user', user.location, FIXTURE.users[user.key])
  # if opts.oauth
    # user.auth[oauth] = 'bhac'
  # else
    # user.auth.password = hash: 'basdfsdfsdf'

  # $log('create user'.yellow, user.key.white, user)
  DB.Collections.users.insert user, (e, r) ->
    if (e) then $log('DB.insert.user', e)
    if login
      # $log('STORY.newUser'.yellow, user.key.white)
      LOGIN user.auth.gh, {retainSession:false}, (session) ->
        # $log('STORY.newUser.session'.yellow, session, user.key)
        if (paymethodId)
          session.primaryPayMethodId = paymethodId # convinience
        done session, user.key
    else
      done user.key


