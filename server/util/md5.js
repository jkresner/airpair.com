var crypto = require('crypto')


function md5(str, encoding) {
  return crypto
    .createHash('md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}


function gravatarUrl(email) {
  if (!email) {
    $log(`gravatarUrl.err called with null email`.red)
    return null
  }
  return `//0.gravatar.com/avatar/${md5(email)}`
}


module.exports = { md5, gravatarUrl }
