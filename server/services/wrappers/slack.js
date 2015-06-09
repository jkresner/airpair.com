var logging                       = true
var {select}                      = require('../chats.data')

var clientCall = (user, method, data, cbProp, select, cb) => {
  var client = null
  if (user == 'admin') client = wrapper.api.admin
  else if (user == 'pairbot') client = wrapper.api.admin
  else client = wrapper.api.getClient(user.token)
  client.api(method, data, (e,response) => {
    if (e) return cb(e)
    var r = (cbProp) ? response[cbProp] : response
    if (select) {
      if (r.constructor === Array)
        r = _.map(r,(elem)=>util.selectFromObject(elem, select))
      else
        r = util.selectFromObject(r, select)
    }
    if (logging) $log('slack.result'.yellow, r)
    cb(null, r)
  })
}

var wrapper = {

  init() {
    var SlackAPI = require('slackey')
    wrapper.api = new SlackAPI({})
    wrapper.api.admin = wrapper.api.getClient(config.chat.slack.admin.token)
    wrapper.api.pairbot = wrapper.api.getClient(config.chat.slack.pairbot.token)
  },

  teamInfo(cb)
  {
    clientCall('admin', 'team.info', {}, 'team', select.team, cb)
  },

  meInfo(user, cb)
  {
    clientCall(user, 'auth.test', null, null, null, cb)
  },

  getUsers(cb)
  {
    cache.slackUsers((callback)=>{
      clientCall('admin', 'users.list', null, 'members', select.slackUser, callback)
    }, cb)
  },

  checkUser(info, cb)
  {
    if (info.id)
      clientCall('admin', 'users.info', { user:info.id }, 'user', select.slackUser, cb)
    else
      wrapper.getUsers((e,users)=>{
        for (var u of users||[])
          if (u.profile && info.email==u.profile.email) return cb(null, u)

        if (info.name)
          for (var u of users||[]) {
            //-- checking by name like this will cause problems when we
            //-- have two users with the same name, but may be ok with email checkd first
            if (u.real_name && info.name.toLowerCase()==u.real_name.toLowerCase())
              return cb(null, u)
          }

        cb(e, null)
      })
  },

  inviteToTeam(fullName, email, cb)
  {
    var first_name = util.firstName(fullName)
    var last_name = util.lastName(fullName)
    clientCall(config.chat.slack.owner, 'users.admin.invite', {first_name,last_name,email}, null, null, cb)
  },

  // getUserPresence(user, cb)
  // {
  //   var client = (user.token) ? wrapper.api.getClient(user.token) : wrapper.api.admin
  //   client.api('users.getPresence', { user:user.slackId }, cb)
  // },


  getGroups(user, cb)
  {
    var user = (user.token) ? user : 'pairbot'
    clientCall(user, 'groups.list', null, 'groups', select.slackGroup, cb)
  },

  searchGroupsByName(term, cb)
  {
    term = term.toLowerCase()
    clientCall('pairbot', 'groups.list', null, 'groups', select.slackGroup, (e,r)=>{
      if (e) return cb(e)
      var groups = []
      for (var p of r)
        if (p.name.toLowerCase().indexOf(term) != -1) groups.push(p)

      cb(null, groups)
    })
  },

  getGroupWithHistory(id, cb)
  {
    clientCall('pairbot', 'groups.info', {channel:id}, 'group', select.slackGroup, (e,data)=>{
      if (e) return cb(e)
      clientCall('pairbot', 'groups.history', {channel:id,count:500}, 'messages', null, (ee,history)=>{
        if (ee) return cb(ee)
        cb(null, { data, history })
      })
    })
  },

  inviteToGroup(invitor, groupId, invitee, cb)
  {
    var user = (invitor.token) ? invitor : 'admin'
    clientCall(user, 'groups.invite', { channel:groupId, user:invitee }, null, null, cb)
  },

  renameGroup(user, groupId, name, cb)
  {
    var user = (user.token) ? user : 'admin'
    clientCall(user, 'groups.rename', { channel:groupId, name }, 'channel', null, cb)
  },


  // getIMs(user, cb)
  // {
  //   clientCall(user, 'im.list', {}, null, null cb)
  // }


}

module.exports = wrapper
