
UNIQUIFY_USER = (key) ->
  uniqueKey = FIXTURE.uniquify('users', key, 'name email auth.gh.id auth.gp.id googleId key')
  Object.assign(FIXTURE.users[uniqueKey],{key:uniqueKey,_id:new ObjectId()})


newUser = require('./newUser')


module.exports = (key, opts, done) ->

  if !done and opts.constructor is Function
    done = opts
    opts = {login:false}

  {data,login} = opts

  user = UNIQUIFY_USER(key)
  user.username = "#{key}-#{timeSeed()}"
  user.initials = "ap-#{timeSeed()}"
  user.location =
    name:       FIXTURE.wrappers.localization_melbourne.locationData.formatted_address,
    short:      FIXTURE.wrappers.localization_melbourne.locationData.name,
    timeZoneId: FIXTURE.wrappers.localization_melbourne.timezoneData.timeZoneId

  user.bio = "a bio for apexpert 1 #{timeSeed()}"
  if (user.auth)
    user.auth.gh = user.auth.gh || FIXTURE.users.ape1.auth.gh
  else
    user.auth = { gh: FIXTURE.users.ape1.auth.gh }
  user.auth.gp = user.auth.gp || FIXTURE.users.ape1.auth.gp

  expData = opts.data || {}
  if (expData.user)
    Object.assign(user,expData.user)

  DB.ensureDoc 'User', user, ->
    FIXTURE.users[user.key] = user
    LOGIN {key:user.key}, (s) ->
      d = rate: 70, breif: 'yo', tags: [FIXTURE.tags.angular]
      POST "/experts/me", d, (expert) ->
        s.userKey = user.key
        done(s, expert)
