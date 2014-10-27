module.exports = {

	changeEmail: (email) =>
	{
		if (!email || !email.match(/.+@.+\.+.+/))
			return "Invalid email address"
		return ""
	}

}


