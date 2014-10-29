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
		if (!password || !password.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/))
			return "weak password (min 8 chars, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character[!@#$&*])"
		return ""
	}

}
