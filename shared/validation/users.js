module.exports = {

	changeEmail: (email) =>
	{
		if (!email || !email.match(/.+@.+\.+.+/))
			return "Invalid email address"
		return ""
	},

	passwordStrength: (password) =>
	{
		// adapted from http://stackoverflow.com/questions/5142103/regex-for-password-strength
		// tested on scriptular.com
		if (!password || !password.match(/.{5,10}/))
			return "weak password (need min 5, max 10 chars)"
		return ""
	}
}
