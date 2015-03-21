var logging = false
var MailChimpApi = global.MailChimpApi ||
  require('mailchimp/lib/mailchimp/MailChimpAPI_v2_0')

var options = {
  packageInfo: { name: 'mailchimp', version: '1.1.0' },
  version: '2.0'
}

var api = new MailChimpApi(config.mail.mailchimp.apiKey,options)

var APlists = [
 { id: '903d16f497',
   web_id: 117353,
   name: 'AirPair Newsletter',
   description: 'General annoucements from the AirPair team. We don\'t plan to use this very often moving forward',
   subscribe_url_short: 'http://eepurl.com/Q_gVj' },
 { id: '89214a2507',
   web_id: 209265,
   name: 'AirPair Developer Digest',
   description: 'New content published on AirPair daily, every other day or weekly depending on your preferences',
   subscribe_url_short: 'http://eepurl.com/bhlYr5' },
 { id: '69de3eea5d',
   web_id: 224469,
   name: 'AirPair Authors',
   description: 'Stay in touch with the AirPair authoring community and news about AirPair\'s Social Authoring platform',
   subscribe_url_short: 'http://eepurl.com/bhlYrH' },
 { id: 'f905e62324',
   web_id: 224465,
   name: 'AirPair Experts',
   description: 'Tips for getting more AirPairs, news about Expert features and more',
   subscribe_url_short: 'http://eepurl.com/bhlYrP' },
]


var wrapper = {

  subscriptions(email, cb) {
    var email = { email, euid: '', leid: '' }
    api.call('helper', 'lists-for-email', { email }, function (e, r) {
      if (logging) $log('mailchimp.lists-for-email', e, r)
      if (e && e.toString().indexOf("is not subscribed to any lists") != -1)
        return cb(null, _.map(APlists,(l)=>_.extend({subscribed:false},l)))
      if (e) return cb(e)
      else {
        var subs = []
        for (var apList of APlists)
        {
          var subscribed = _.find(r, (list) => list.id == apList.id) != null
          subs.push(_.extend({subscribed},apList))
        }

        cb(null,subs)
      }
    })
  },


  lists(cb) {
    api.call('lists', 'list', {}, function (e, r) {
      if (logging) $log('mailchimp.lists', e, r)
      if (e) cb(e)
      else
        cb(null,r)
    })
  },


  subscribe(listName, email, merge_vars, email_type, double_optin, send_welcome, cb) {
    email_type = email_type || 'html'
    var email = { email, euid: '', leid: '' }
    var id = _.find(APlists,(l)=>l.name==listName).id
    // $log('lists.subscribe', email, id)
    api.call('lists', 'subscribe', { id, email, merge_vars, email_type, double_optin, send_welcome }, (e, r) => {
      if (logging) $log('mailchimp.subscribe', e, r)
      if (e) cb(e)
      else
        cb(null,r)
    })
  },


  unsubscribe(listName, email, cb) {
    var email = { email, euid: '', leid: '' }
    var id = _.find(APlists,(l)=>l.name==listName).id
    api.call('lists', 'unsubscribe', { id, email }, (e, r) => {
      if (logging) $log('mailchimp.unsubscribe', e, r)
      if (e) cb(e)
      else
        cb(null,r)
    })
  },

  // addGroup(listId, name, cb) {
  //   throw Error('list addGroup not implemented yet... ')
  // }

}



module.exports = wrapper


// Example subscribe json
// {
//     "apikey": "example apikey",
//     "id": "example id",
//     "email": {
//         "email": "example email",
//         "euid": "example euid",
//         "leid": "example leid"
//     },
//     "merge_vars": {
//         "new-email": "example new-email",
//         "groupings": [
//             {
//                 "id": 42,
//                 "name": "example name",
//                 "groups": [
//                     "..."
//                 ]
//             }
//         ],
//         "optin_ip": "example optin_ip",
//         "optin_time": "example optin_time",
//         "mc_location": {
//             "latitude": "example latitude",
//             "longitude": "example longitude",
//             "anything": "example anything"
//         },
//         "mc_language": "example mc_language",
//         "mc_notes": [
//             {
//                 "note": "example note",
//                 "id": 42,
//                 "action": "example action"
//             }
//         ]
//     },
//     "email_type": "example email_type",
//     "double_optin": true,
//     "update_existing": true,
//     "replace_interests": true,
//     "send_welcome": true
// }
