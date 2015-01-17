var util = require('../../shared/util')


export function logError(e, user, req)
{
  if (!e) return

  var uid = (req.user) ? req.user.email : req.sessoinID

  var userInfo = (user && user.name) ?
    `${user.name} ${user.email} ${user._id}` : `anonymous ${uid}`

  var reqInfo = 'no request context'
  if (req)
  {
    reqInfo = `${req.method} ${req.url}`
    if (req.body)
      reqInfo += ` ${JSON.stringify(req.body)}`
  }

  if (reqInfo != '')
  {
    if (req.header('Referer'))
      reqInfo = `${reqInfo} << ${req.header('Referer')}`

    if (req.header('user-agent'))
    {
      var isBot = (util.isBot(req.header('user-agent'))) ? 'true' : 'false'
      reqInfo = `${reqInfo} || isBot:${isBot}:${req.header('user-agent')}`
    }
  }

  if (!user && req) { userInfo += ` ${req.sessionID}` }

  console.log(userInfo.red)
  console.log(reqInfo.red)

  if (e.stack) {
    console.log(e.message.red)
    console.log(e.stack.grey)
  }
  else
  {
    console.log(e.toString().red)
  }

  if (config.log.email)
  {
    var errorInfo = (e.stack) ? `${e.message}\n${e.stack}` : e.toString()
    winston.error(`${userInfo}\n${reqInfo}\n${errorInfo}`)
  }
}
