var util = require('../../../shared/util')
var uid = require('uid-safe').sync

var generateSessionID = () => {
  return uid(24) // matches express-session's current generate method
}

var expressSessionMiddleware = {}

var middleware = (req, res, next) => {
  if (util.isBot(req.header('user-agent'))) {
    req.session = {}
    req.sessionID = generateSessionID()
    return next()
  }
  return expressSessionMiddleware(req, res, next)
}

var configure = (sessionOpts) => {
  expressSessionMiddleware = require('express-session')(sessionOpts);
}

module.exports = {
  configure,
  middleware
}
