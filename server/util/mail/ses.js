var Ses = require('awssum-amazon-ses').Ses

var logging = false

module.exports = function() {

  var ses = new Ses({
    accessKeyId     : config.mail.ses.access_key,
    secretAccessKey : config.mail.ses.secret_key
  })

  var emailDefaults = {
    TextCharset: 'UTF-8',
    HtmlCharset: 'UTF-8',
    SubjectCharset: 'UTF-8',
    Source: 'AirPair <team@airpair.com>'
  }

  return {
    send: (to, data, callback) =>
    {
      if (!callback) callback = (e) => { if (e) $log(e.stack) }
      if (typeof(to) == 'string') to = [to]
      data.ToAddresses = to

      data = _.defaults(data, emailDefaults)

      if (config.mail.on) {
        $log('mail.send ${data.Subject}', to)
        ses.SendEmail(data, callback)
      }
      else {
        // if (logging)
        $log('ses.send', to, data.Subject, data.Text)
        callback()
      }
    }
  }

}
