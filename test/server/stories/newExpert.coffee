timeSeed = -> moment().format('X')


module.exports = (seedKey, expData, done) ->
  userKey = "#{seedKey}#{timeSeed()}"
  username = "#{seedKey}-#{timeSeed()}"
  initials = "ap-#{timeSeed()}"
  localization = FIXTURE.wrappers.localization_melbourne
  bio = "a bio for apexpert 1 #{timeSeed()}"
  user = _.extend({initials,localization,bio}, FIXTURE.users[seedKey])
  if (user.social)
    user.social.gh = user.social.gh || FIXTURE.users.ape1.social.gh
  else
    user.social = { gh: FIXTURE.users.ape1.social.gh }
  user._id = newId()
  user.username = userKey
  user.googleId = userKey
  user.google = user.google || FIXTURE.users.ape1.google
  user.email = user.email.replace('@',timeSeed()+'@')
  DB.ensureDoc 'User', user, ->
    FIXTURE.users[userKey] = user
    LOGIN {key:userKey}, (s) ->
      s.userKey = userKey
      d = rate: 70, breif: 'yo', tags: [FIXTURE.tags.angular]
      POST "/experts/me", d, (expert) ->
        done(s, expert)
