// ** Can't use destructuring assigment up the top here because the sub
// attributes don't exist when we require this file, but do when invoked
// (after extended with the models + lib from meanair-auth)
module.exports = function(DAL, Data, DRY) {
  var cfg = global.config.auth.oauth

  function validate(user, existing, provider, profile, tokens) {
    if (provider != 'github')
       return `Only GitHub login supported for this app`

    if (!tokens.token) return `Github user token required`
    if (!profile.login) return `Github login/username required`
    if (!profile.id) return `Github user id required`
    // if (!profile.name) return `Github name required`

    if (user && user.auth && user.auth.gh) {
      var current = user.auth.gh
      if (current.id != profile.id)
        return `GitHub OAuth fail with [${profile.id}:${profile.login}]. Already logged in with [${current.id}:${current.login}]`
    }

    var email = _.find(profile.emails, o => o.primary && o.verified)
    if (!email) return `No verified email on GitHub account ${profile.login}:${profile.id}`
  }

  return {

    validate,


    exec(provider, profile, tokens, done) {
      // $log('loginCust.profile', profile)
      DRY.userByAuth(null, 'gh', profile, (e, existing) => {
        // $log('loginCust.userByAuth', e, existing, profile)
        if (e) return done(e)

        var inValid = validate(this.user, existing, provider, profile, tokens)
        if (inValid) return done(DRY.Unauthorized(inValid))

        LOG('auth.login', 'gh:login', `${profile.login}: ${JSON.stringify(profile).gray}`)
        if (existing) assign(this,{existing})
        var fn = existing ? 'loginOAuth' : 'signupOAuth'

        DRY[fn](this, 'gh', 'github', profile, tokens, (e,r) => {
          if (e) return done(e)
          r.avatar = r.photos ? r.photos[0].value : null
          if (r.avatar) r.avatar = r.avatar.split('?')[0]
          r.username = r.username || profile.login

          assign(this.analytics, {
            event:`${existing?'login':'signup'}:oauth:gh`,
            alias: _.pick(r,["_id","name","email","username"]),
            data: { user:_.pick(r,["_id","name","avatar"]), profile } })

          // console.log('loginCust'.yellow, r)

          done(e, r)
        })
      })
    },


    project: Data.Project.full

  }
}
