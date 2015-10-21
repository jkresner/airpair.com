/**
 * Module dependencies.
 */
var OAuthUtil = require('util')
, OAuth2Strategy = require('passport-oauth').OAuth2Strategy
, request = require('superagent');


/**
 * `Strategy` constructor.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Slack application's client id
 *   - `clientSecret`  your Slack application's client secret
 *   - `callbackURL`   URL to which Slack will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'read_inbox', 'no_expiry', 'write_access', 'private_info'.
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://stackexchange.com/oauth';
  options.tokenURL = options.tokenURL || 'https://stackexchange.com/oauth/access_token';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.profileUrl = "https://api.stackexchange.com/2.2/me?site=stackoverflow&key=" + options.key;
  this._options = options;

  OAuth2Strategy.call(this, options, verify);
  this.name = 'stackexchange';
  // this._oauth2.useAuthorizationHeaderforGET(true);
}


/**
 * Inherit from `OAuth2Strategy`.
 */
OAuthUtil.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Slack.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `slack`
 *   - `id`               the user's ID
 *   - `displayName`      the user's username
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {;

  var url = this._options.profileUrl+"&access_token="+accessToken

  request.get(url, function (err, res) {

    if (err)
      return done(err);

    if (!res.ok)
      return done(Error(`Get Stackoverflow profile failed`));

    var json = res.body.items[0]

    done(null, {
      provider: 'Stackoverflow',
      id: json.user_id,
      _raw: res.body,
      _json: json
    })

  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;


