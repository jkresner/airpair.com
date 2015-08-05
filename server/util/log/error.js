var knownNonErrors = [
  'Page not found',
  'try google login',
  'Cannot signup, you previously created an account with your google login',
  'Another user account already has the',
  'already registered',
  'already taken, please choose a different username',
  'Max allowed tags reached',
  'Max allowed bookmarks reached',
  'Max 3 bookmarks reached',
  'Max 3 tags reached',
  'Invalid email address',
  'no user found',
  'wrong password',
  'failed to obtain access token',
  'No user found with email',
  'Post cannot be edited by you, did you fork it already?',
  'Can not share an incompleted request',
  'Error getting collection: v1sessions',
  'Cannot determine state of server',
  'Cannot signup, user already exists',
  'Email belongs to another account',
  'Cannot suggest the same expert twice',
  'tagfrom3rdparty not found',
  //slack
  'already_in_team',
  'already_invited'
]


module.exports = function(e, user, req)
{
  if (!e) return
  if (e.message) {
    for (var known of knownNonErrors) {
      if (e.message.indexOf(known) != -1) return
    }
  }

  var msg = e.message || e

  if (req) {
    msg += `\n${req.method} ${req.url}`
    msg += `\n${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`

    var uid = (req.user) ? req.user.email : req.sessionID
    var userInfo = (user && user.name) ?
      `\n${user.name} ${user.email} ${user._id}` : `\nanonymous ${uid}`

    msg += userInfo

    if (req.header('Referer'))
      msg += `\n << ${req.header('Referer')}`

    if (req.header('user-agent'))
    {
      var isBot = (util.isBot(req.header('user-agent'))) ? 'true' : 'false'
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
    msg += `\n\n ${e.stack}`
  }

  console.log(msg.red)

  if (config.log.email)
  {
    winston.error(`${msg}`)
  }
}
