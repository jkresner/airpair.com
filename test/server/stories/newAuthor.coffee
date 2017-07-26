CREATOR = (key, login, done) -> (user) ->
  DB.ensureDoc 'User', user, (e, r) ->
    if (e) then $log("DB.insert.user[#{user.key}]", e)
    # $log('CREATOR'.yellow, key, e, r)
    if login
      LOGIN key, { retainSession:false }, (session) ->
        # $log("LOGIN[#{key}________]".yellow, r._id, user.auth.gh.id)
        # $log("LOGIN[#{key}]".yellow, session._id)
        done session, key
    else
      done key


ENSURE_VALID_GH = (seedKey, ghKey, cb) ->
  {token,username} = FIXTURE.githubusers[ghKey]
  DB.removeDocs 'User', {'auth.gh.login':username}, ->
    user = FIXTURE.users[seedKey]
    user.auth.gh.login = username
    tokens = {}
    tokens[global.config.auth.appKey] = { token }
    user.auth.gh.tokens = Object.assign(user.auth.gh.tokens||{},tokens)
    # $log('ENSURE_VALID_GH'.yellow, user.auth)
    cb(user)


module.exports = (key, opts, done) ->
  if !done and opts.constructor is Function
    done = opts
    opts = {login:true}

  {data,login,ghKey} = opts
  seedKey = FIXTURE.uniquify('users', key, 'name emails.value username auth.gh.id auth.gh.login auth.gh.name auth.gh.emails.email auth.gp.id auth.gp.email auth.tw.id')
  delete FIXTURE.users[seedKey].key
  FIXTURE.users[seedKey].auth.gh.id += parseInt(moment().format('X'))
  # $log('UNIQUIFY_USER'.yellow, FIXTURE.users[seedKey])
  # $log('newUser.ghKey'.yellow, ghKey)
  # Object.assign(user, opts.data||{})
  # expect(user.initials, "FIXTURE user [#{key}] missing initials").to.exist
  # expect(user.auth.gh.login, "FIXTURE [#{key}] user missing gh.login").to.exist

  CREATE_USER = CREATOR(seedKey, login, done)
  if (ghKey)
    ENSURE_VALID_GH seedKey, ghKey, CREATE_USER
  else
    CREATE_USER FIXTURE.users[seedKey]

