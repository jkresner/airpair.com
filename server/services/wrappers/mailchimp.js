var logging         = false
var {maillists}     = require('../users.data').data
var listDict        = {
  '903d16f497': 'AirPair Newsletter',
  '89214a2507': 'AirPair Developer Digest',
  '69de3eea5d': 'AirPair Authors',
  'f905e62324': 'AirPair Experts'
}


var wrapper = {

  init() {
    var MailChimpApi = global.MailChimpApi ||
      require('mailchimp/lib/mailchimp/MailChimpAPI_v2_0')

    var options = {
      packageInfo: { name: 'mailchimp', version: '1.1.0' },
      version: '2.0'
    }

    wrapper.api = new MailChimpApi(config.mail.mailchimp.apiKey,options)
  },

  //-- Problem with this one is it doesn't tell you if they un-subscribed
  //-- So we can't figure out if to remove them
  subscriptions(email, cb) {
    var email = { email, euid: '', leid: '' }
    wrapper.api.call('helper', 'lists-for-email', { email }, function (e, r) {
      if (logging) $log('mailchimp.lists-for-email'.cyan, e, r)
      if (e && e.toString().indexOf("is not subscribed to any lists") != -1)
        return cb(null, _.map(maillists,(l)=>_.extend({subscribed:false},l)))
      if (e) return cb(e)
      else {
        var subs = []
        for (var apList of maillists)
        {
          var subscribed = _.find(r, (list) => list.id == apList.id) != null
          subs.push(_.extend({subscribed},apList))
        }

        cb(null,subs)
      }
    })
  },

  lists(cb) {
    wrapper.api.call('lists', 'list', {}, function (e, r) {
      if (logging) $log('mailchimp.lists'.cyan, e, r)
      if (e) cb(e)
      else
        cb(null,r)
    })
  },

  // abuseReport(listId, cb) {
  //   wrapper.api.call('lists', 'abuse-reports', {id:listId}, function (e, r) {
  //     if (logging) $log('mailchimp.abuse-reports', e, r)
  //     if (e) cb(e)
  //     else cb(null,r)
  //   })
  // },

  //-- status ['subscribed','unsubscribed','cleaned']
  members(listId, status, cb) {
    wrapper.api.call('lists', 'members', {id:listId,status:'unsubscribed'}, (e, r) => {
      if (logging) $log('mailchimp.members-unsubscribed'.cyan, e, r)
      if (e) cb(e)
      else cb(null,r)
    })
  },

  //-- status ['subscribed','unsubscribed','cleaned']
  memberLists(email, cb) {
    var email = { email, euid: '', leid: '' }
    var listId = '903d16f497'
    wrapper.api.call('lists', 'member-info', {id:listId,emails:[email]}, (e, r) => {
      if (logging) $log(`mailchimp.member-info[${email.email}]`.cyan, e, r)
      if (e) return cb(e)
      if (r.success_count == 0) return cb(e,r)
      var rawLists = r.data[0].lists
      if (logging) $log('mailchimp.rawLists'.cyan, rawLists)
      var lists = [{name:r.data[0].list_name,id:listId,status:r.data[0].status}]
      for (var l of rawLists) {
        if (_.has(listDict,l.id))
          lists.push(_.extend({name:listDict[l.id]},l))
      }
      cb(null,lists)
    })
  },

  sync(email, merge_vars, lists, cb) {
    var syncedList = []
    wrapper.memberLists(email, (e,r)=> {
      if (e) return cb(e)
      if (r.success_count == 0 &&
        r.errors[0].error.indexOf('The id passed does not exist on this list') == 0)
      {
        var retry = ()=>wrapper.sync(email,merge_vars,lists,cb)
        wrapper.subscribe('AirPair Newsletter', email, merge_vars, null, false, false, retry)
      }
      else {
        for (var listName of lists) {
          var synced = _.find(r, (l)=>l.name == listName)
          if (synced && (synced.status == 'unsubscribed' || synced.status == 'cleaned'))
            syncedList = syncedList
            //-- Do nothing
          else
          {
            syncedList.push(listName)
            // $log('syncedList'.green, syncedList, listName)
            if (!synced)
              wrapper.subscribe(listName, email, merge_vars, null, false, false, ()=>{})
            // else if (synced.status == 'subscribed')
          }
        }
        for (var synced of r)
        {
          if (!_.contains(syncedList,synced.name)&&synced.status=='subscribed')
            syncedList.push(synced.name)
        }
        // $log(e,r)
        cb(null, syncedList)
      }
    })
  },

  subscribe(listName, email, merge_vars, email_type, double_optin, send_welcome, cb) {
    email_type = email_type || 'html'
    var email = { email, euid: '', leid: '' }
    var id = _.find(maillists,(l)=>l.name==listName).id
    if (logging) $log('lists.subscribe', email, id)
    wrapper.api.call('lists', 'subscribe', { id, email, merge_vars, email_type, double_optin, send_welcome }, (e, r) => {
      if (logging) $log('mailchimp.subscribe'.cyan, e, r)
      if (e) cb(e)
      else
        cb(null,r)
    })
  },

  unsubscribe(listName, email, cb) {
    var email = { email, euid: '', leid: '' }
    var id = _.find(maillists,(l)=>l.name==listName).id
    wrapper.api.call('lists', 'unsubscribe', { id, email }, (e, r) => {
      if (logging) $log('mailchimp.unsubscribe'.cyan, e, r)
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
