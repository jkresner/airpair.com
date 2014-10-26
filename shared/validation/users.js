module.exports = {

	changeEmail: (email) =>
	{
		if (!email || !email.match(/.+@.+\.+.+/))
			return "email required"
		return ""
	}

}


