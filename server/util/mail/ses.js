var Ses = require('awssum-amazon-ses').Ses

var logging = true

module.exports = function() {

	var ses = new Ses({
		accessKeyId     : config.mail.ses.access_key,
		secretAccessKey : config.mail.ses.secret_key
	})

	var emailDefaults = {
		TextCharset: 'UTF-8',
		HtmlCharset: 'UTF-8',
		SubjectCharset: 'UTF-8',
		Source: 'jk@airpair.com'
	}

	return {
		send: (to, data, callback) =>
		{
			if (!callback) callback = (e) => { if (e) $log(e.stack) }
			if (typeof(to) == 'string') to = [to]
			data.ToAddresses = to

			if (logging) $log('ses.send', to, data.Subject, data.Text)

			data = _.defaults(data, emailDefaults)

			if (config.mail.on)
				ses.SendEmail(data, callback)
			else
				callback()
		}
	}

}
