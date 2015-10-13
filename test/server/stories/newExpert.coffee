
UNIQUIFY_USER = (key) ->
  uniqueKey = FIXTURE.uniquify('users', key, 'name email linked.gh.id linked.gp.id googleId key')
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
  user.localization = FIXTURE.wrappers.localization_melbourne
  user.bio = "a bio for apexpert 1 #{timeSeed()}"
  if (user.social)
    user.social.gh = user.social.gh || FIXTURE.users.ape1.social.gh
  else
    user.social = { gh: FIXTURE.users.ape1.social.gh }
  user.googleId = timeSeed()
  user.google = user.google || FIXTURE.users.ape1.google

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
