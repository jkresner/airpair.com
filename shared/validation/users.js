
var validateEmail = (email) =>
{
	if (!email || !email.match(/.+@.+\.+.+/))
		return `Invalid email address`
}

module.exports = {

	localLogin: (user) =>
	{
		if (user && user._id)
			return `Cannot login. Already signed in as ${user.name}. Logout first?`

	},

	localSignup: (user, email, name, password) =>
	{
	  if (user && user._id)
	    return `Cannot signup. Already signed in as ${user.name}. Logout first?`

		if (!email || !email.match(/.+@.+\.+.+/))
			return `Invalid email address`

		if (!name)
			return `Invalid name`

		if (!password)
			return `Invalid password`
	},

	googleLogin: (user, email, name) =>
	{
	  if (user && user._id)
	    return `Cannot login. Already signed in as ${user.name}. Logout first?`

		if (!email || !email.match(/.+@.+\.+.+/))
			return `Invalid email address`

		if (!name)
			return `Invalid name`
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
			return `Invalid hash`
		if (!password || !password.match(/.{5,10}/))
			return `Invalid password (need min 5, max 10 chars)`
	}
}
