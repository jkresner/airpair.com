var validateEmail = (email) =>
{
  if (!email || !email.match(/.+@.+\.+.+/))
    return "Invalid email address"
}

module.exports = {

  changeName: (name) =>
  {
    if (!name) return "Name required"
    if (name.indexOf(' ')==-1) return "Full name (e.g. 'John Smith') required"
  },

  changeEmail: (email) =>
  {
    return validateEmail(email)
  },

  requestPasswordChange: (email) =>
  {
    return validateEmail(email)
  },

  changePassword: (hash, password) =>
  {
    if (!hash || hash.match(/\s/))
      return "Invalid hash"
    if (!password || !password.match(/.{5,40}/))
      return "Invalid password (need min 5, max 40 chars)"
  }
}
