module.exports = {

	email: (email) =>
	{
		if (!email || !email.match(/.+@.+\.+.+/))
			return "Invalid email address"
		return ""
	},

	passwordStrength: (password) =>
	{
		if (!password || !password.match(/.{5,10}/))
			return "Invalid password (need min 5, max 10 chars)"
		return ""
	},

	hash: (hash) =>
	{
		if (!hash || hash.match(/\s/))
			return "Invalid hash"
		return ""
	}
}
