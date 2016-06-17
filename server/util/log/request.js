var knownNonErrors = [
  // 'Page not found',
  // 'Invalid email address',
  // 'failed to obtain access token',
  // 'Cannot determine state of server',
  // 'Cannot signup, user already exists',
  // 'Cannot book yourself on request',
  // 'Email belongs to another account',
  // 'Cannot suggest the same expert twice',
  // 'tagfrom3rdparty not found',
  // 'No user found with email',
  // //auth,
  // "Login failed. github.oauth profile has no verified email",
  // "Login failed. Name required on github profile",
  // "Login fail. No user found",
  // "Login fail. Incorrect password",
  // "Failed to fetch user profile",
  // //slack
  // 'already_in_team',
  // 'already_invited'
]


module.exports = function(req, e)
{
  var stackFilter = new RegExp(process.env.INSTRUMENT_FILTER||'test')

  if (!e) return
  if (e.message) {
    for (var known of knownNonErrors) {
      if (e.message.indexOf(known) != -1) return
    }
  }

  var msg = e.message || e

  if (req) {
    msg += `\n${req.method} ${config.http.host}${req.url}`
    msg += `\n${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`

    var user = req.user
    var uid = user ? user.email : req.sessionID
    var userInfo = (user && user.name) ?
      `\n${user.name} ${user.email} ${user._id}` : `\nanonymous ${uid}`

    msg += userInfo

    if (req.header('Referer'))
      msg += `\n << ${req.header('Referer')}`

    if (req.header('user-agent'))
    {
      var isBot = (util.isBot(req.header('user-agent'), /bot/i)) ? 'true' : 'false'
      msg += `\n isBot:${isBot}:${req.header('user-agent')}`
    }

    if (req.method != 'GET' && req.body)
      msg += `\n\n ${JSON.stringify(req.body)}`
  }
  else if (user)
  {
    msg += `\nNo request context`
    msg += `\n${user.name} ${user.email} ${user._id}`
  }

  if (e.stack) {
    var lines = []
    for (var ln of e.stack.split('\n'))
      if (!stackFilter.test(ln)) lines.push(ln)
    msg += `\n\n${moment()}\n${lines.join('\n')}`
  }

  return msg

}
