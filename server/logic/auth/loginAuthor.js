

// ** Can't use destructuring assigment up the top here because the sub
// attributes don't exist when we require this file, but do when invoked
// (after extended with the models + lib from meanair-auth)
module.exports = function(DAL, Data, DRY) {
  var cfg = global.config.auth.oauth.github
  var admit = new RegExp(cfg.admit)
  var deny = new RegExp(cfg.deny)

  function validate(user, existing, provider, profile, tokens) {
    if (provider != 'github') return `Only GitHub login supported for this app`

    if (!tokens.token) return `Github token required`
    if (!profile.login) return `Github login/username required`
    if (!profile.id) return `Github id required`

    var fullId = `GitHub account [${profile.id}:${profile.login}]`

    if (!existing)
      return `No airpair.com registrated accounts linked to ${fullId}`

    if (deny.test(profile.login) || deny.test(profile.id))
      return `OAuth GH input [${profile.id}:${profile.login}]`

    if (user && user.auth && user.auth.gh) {
      var current = user.auth.gh
      if (current.id != profile.id)
        return `Session [${current.id}:${current.login}] overrwite with ${fullId} disallowed`
    }

    var score = 0
    score += (profile.public_repos + profile.public_gists)
    score += (profile.followers*5 + profile.following)
    if (profile.name && profile.name.split(' ').length > 1)
      score += 5
    if (profile.emails > 1)
      score += 5
    if (profile.created_at.indexOf('2016') == -1)
      score += 5
    if (profile.created_at.substr(0,10) != profile.updated_at.substr(0,10))
      score += 5

    if (existing.so)
      score += parseInt(existing.so.reputation / 100)

    if (score < 250 && !admit.test(profile.login))
      return `Request ${fullId} author.airpair access to team@airpair.com`

  }

  return {

    validate,


    exec(provider, profile, tokens, done) {
      DAL.User.getByQuery({'auth.gh.id':profile.id}, Data.Opts.existing, (e, existing) => {
        if (e) return done(e)

        var inValid = validate(this.user, existing, provider, profile, tokens)
        if (inValid) return done(Shared.Unauthorized(inValid))

        // $logIt('auth.login', 'gh:login', `${profile.login}: ${JSON.stringify(profile).gray}`)

        assign(this,{existing})
        var fn = this.user ? 'linkOAuth' : 'loginOAuth'
        DRY[fn](this, 'gh', 'github', profile, tokens, (e,r) => {
          if (e) return done(e)
          r.avatar = r.photos ? r.photos[0].value : null
          done(e, r)

          // analytics.event(this, `login`,
            // assign({type:'auth:oauth:author',gh:r.auth.gh.login},_.pick(r,'name','_id')))
        })
      })
    },


    project: Data.Project.session

  }
}
