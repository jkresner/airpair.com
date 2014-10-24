export function changeEmail(email)
{
	if (!email || !email.match(/.+@.+\.+.+/))
		return "email required"
	return ""
}
