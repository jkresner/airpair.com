var MailChimpApi = global.MailChimpApi ||
  require('mailchimp/lib/mailchimp/MailChimpAPI_v2_0')

var options = {
  packageInfo: { name: 'mailchimp', version: '1.1.0' },
  version: '2.0'
}

var api = new MailChimpApi(config.mail.mailchimp.apiKey,options)



var wrapper = {
  lists(cb) {
    api.call('lists', 'list', {}, function (error, data) {
      // $log('back from MailChimpAPI', error, data)
      if (error) cb(error)
      else
        cb(null,data)
    });
  }
}



module.exports = wrapper
