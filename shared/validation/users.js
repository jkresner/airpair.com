
var validateEmail = (email) =>
{
	if (!email || !email.match(/.+@.+\.+.+/))
		return "Invalid email address"
	return ""
}

module.exports = {

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
		if (!password || !password.match(/.{5,10}/))
			return "Invalid password (need min 5, max 10 chars)"
		return ""
	}
}
