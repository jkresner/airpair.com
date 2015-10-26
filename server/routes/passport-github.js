var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


function Strategy(options, verify) {
  options = options || {}
  options.authorizationURL = options.authorizationURL || 'https://github.com/login/oauth/authorize'
  options.tokenURL = options.tokenURL || 'https://github.com/login/oauth/access_token'
  options.scopeSeparator = options.scopeSeparator || ','
  options.customHeaders = options.customHeaders || {}

  if (!options.customHeaders['User-Agent'])
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-github'

  OAuth2Strategy.call(this, options, verify)
  this.name = 'github'
  this._userProfileURL = options.userProfileURL || 'https://api.github.com/user'
  this._oauth2.useAuthorizationHeaderforGET(true)
  if (options.emails) {
    if (!options.userAgent) throw Error("Github config, userAgent required with emails options enabaled")
    this._userEmailsUrl =  options.userEmailsURL || 'https://api.github.com/user/emails'
  }
}


util.inherits(Strategy, OAuth2Strategy);


Strategy.prototype.userProfile = function(accessToken, done) {
  var {_oauth2,_userProfileURL,_userEmailsUrl} = this

  _oauth2.get(_userProfileURL, accessToken, function (e, body, res) {
    var json

    if (e) {
      $log('GitHub.userProfile.err', e)
      return done(new InternalOAuthError('Failed to fetch user profile', e))
    }

    try {
      json = JSON.parse(body)
    } catch (ex) {
      $log('GithHub.parseProfile', body, ex)
      return done(new Error('Failed to parse user profile'))
    }

    var profile = { provider: 'github', id: json.id }
    profile._raw = body
    profile._json = json

    if (!_userEmailsUrl)
      done(null, profile)
    else
      _oauth2.get(_userEmailsUrl, accessToken, function (e, body, res) {
        if (e)
          return done(new InternalOAuthError('Failed to fetch user emails', e))

        profile._json.emails = JSON.parse(body)
        done(null, profile)
      })
  })
}


module.exports = Strategy;
