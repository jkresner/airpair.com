var OAuthProvider = require('./oauthbase')
var LocalProvider = require('./localbase')
var AuthService   = require('../../../services/auth')


var providers = {
  twitter: { short: 'tw', strategy: require('passport-twitter').Strategy },
  github: { short: 'gh', strategy: require('passport-github').Strategy },
  // stackexchange: { short: 'so', strategy: require('passport-stackexchange').Strategy },
  bitbucket: { short: 'bb', strategy: require('passport-bitbucket').Strategy },
  linkedin: { short: 'in', strategy: require('passport-linkedin').Strategy },
  angellist: { short: 'al', strategy: require('passport-angellist').Strategy },
  slack: { short: 'sl', strategy: require('passport-slack-ponycode').SlackStrategy },
}

var connect = (proivderName) => {
  var {strategy, short} = providers[proivderName]
  return OAuthProvider.init(proivderName, strategy,
    (req, provider, profile, done) =>
      $callSvc(AuthService.connectProvider,req)(proivderName, short, profile, done) )
}

module.exports = {

  local: {
    login: LocalProvider.init('local-login', (req, email, password, done) => {
      $callSvc(AuthService.localLogin,req)(email, password, done)
    }),

    signup: LocalProvider.init('local-singup', (req, email, password, done) => {
      $callSvc(AuthService.localSignup,req)(email, password, req.body.name, done)
    })
  },

  google: {
    oAuth: OAuthProvider.init('google', require('passport-google-oauth').OAuth2Strategy, (req, provider, profile, done) => {
      $callSvc(AuthService.googleLogin,req)(profile, done)
    })
  },

  github: { oAuth: connect('github', require('passport-github').Strategy) },
  twitter: { oAuth: connect('twitter', require('passport-twitter').Strategy) },
  // stackexchange: { oAuth: connect('stackexchange', require('passport-stackexchange').Strategy) },
  bitbucket: { oAuth: connect('bitbucket', require('passport-bitbucket').Strategy) },
  linkedin: { oAuth: connect('linkedin', require('passport-linkedin').Strategy) },
  angellist: { oAuth: connect('angellist', require('passport-angellist').Strategy) },
  slack: { oAuth: connect('slack', require('passport-slack-ponycode').SlackStrategy) }

}
