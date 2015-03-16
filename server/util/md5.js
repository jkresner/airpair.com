var crypto = require('crypto')


export function md5(str, encoding) {
  return crypto
    .createHash('md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}


export function gravatarUrl(email) {
  if (!email) {
    $log(`gravatarUrl.err called with null email`.red)
    return null
  }
  return `//0.gravatar.com/avatar/${md5(email)}`
}
