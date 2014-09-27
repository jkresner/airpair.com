export function logError(e, user, req) 
{
  if (!e) return

  var userInfo = (user && user.name) ? 
    `${user.name} ${user.email} ${user._id}` : 'anonymous'

  var reqInfo = req ? 
    `${req.method} ${req.url}` : ''

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