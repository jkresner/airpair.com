var util = require('../../../shared/util')

global.getNewUserData = function(userKey)
{
  var seed = data.users[userKey]
  var suffix = moment().format('X')
  return {
    email: seed.email.replace('@',suffix+'@'),
    name: seed.name+suffix,
    password: 'testpass'+suffix,
    userKey: userKey + suffix
  }
}

global.newUserSession = function(userKey)
{
  var suffix = moment().format('X')
  var session = { cookie: {
    originalMaxAge: 2419200000,
    _expires: moment().add(2419200000, 'ms').subtract(1,'s') }
  }
  cookieCreatedAt = util.momentSessionCreated(session)
  return {user:null,sessionID:`test${userKey}${suffix}`,session}
}


var dataHelpers = {

}

module.exports = dataHelpers
