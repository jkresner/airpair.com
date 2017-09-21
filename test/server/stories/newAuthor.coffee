module.exports = (key, opts, done) ->
  if !done and opts.constructor is Function
    done = opts
    opts = {login:true}

  seedKey = FIXTURE.uniquify("users",key,'name emails.value username auth.gh.id auth.gh.login auth.gh.name auth.gh.emails.email auth.gp.id auth.gp.email auth.tw.id')
  fUser = FIXTURE.users[seedKey]
  delete fUser.key
  fUser.log = { last: {}, history: [] }
  fUser.auth.gh.tokens = fUser.auth.gh.tokens||{}
  fUser.auth.gh.tokens[global.config.auth.appKey] = {token:'test'}

  if opts.ghKey
    {token,username} = FIXTURE.githubusers[opts.ghKey]
    fUser.auth.gh.login = username
    fUser.auth.gh.tokens[global.config.wrappers.gitPublisher.appKey] = { token }

  DB.ensureDoc 'User', fUser, (e, r) ->
    if (e) then $log("DB.insert.user[#{seedKey}]", e)
    FIXTURE.users[seedKey] = r
    # $log('NEW_AUTOR'.yellow, FIXTURE.users[seedKey])
    if opts.login
      LOGIN seedKey, {session:null}, (session) ->
        done session
    else
      done()

  seedKey
