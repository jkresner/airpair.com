// ** Can't use destructuring assigment up the top here because the sub
// attributes don't exist when we require this file, but do when invoked
// (after extended with the models + lib from meanair-auth)
module.exports = function(DAL, Data, Shared, Lib) {
  var cfg = global.config.auth.oauth

  function validate(user, existing, provider, profile, tokens) {
    if (provider != 'github')
       return `Only GitHub login supported for this app`

    if (!tokens.token) return `Github user token required`
    if (!profile.login) return `Github login/username required`
    if (!profile.id) return `Github user id required`

    if (user && user.auth && user.auth.gh) {
      var current = user.auth.gh
      if (current.id != profile.id)
        return `GitHub OAuth fail with [${profile.id}:${profile.login}]. Already logged in with [${current.id}:${current.login}]`
    }
  }

  return {

    validate,


    exec(provider, profile, tokens, done) {
      DAL.User.getByQuery({'auth.gh.id':profile.id}, (e, existing) => {
        if (e) return done(e)

        var inValid = validate(this.user, existing, provider, profile, tokens)
        if (inValid) return done(Shared.Unauthorized(inValid))

        $logIt('auth.login', 'gh:login', `${profile.login}: ${JSON.stringify(profile).gray}`)
        if (existing) Object.assign(this,{existing})
        var fn = existing ? 'loginOAuth' : 'signupOAuth'

        Lib[fn](this, 'gh', 'github', profile, tokens, (e,r) => {
          this.ctx.analytics = { event: `${existing?'login':'signup'}:gh:oauth`, alias: r }
          if (e) return done(e)
          r.avatar = r.photos ? r.photos[0].value : null
          done(e, r)
        })
      })
    },


    project: Data.Project.full

  }
}
