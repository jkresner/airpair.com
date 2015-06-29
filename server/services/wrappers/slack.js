var logging                       = true
var {select}                      = require('../chats.data')
var {owner,support,pairbot}       = config.chat.slack


var clientCall = (user, method, data, cbProp, select, cb) => {
  var client = null
  if (user == 'owner') client = wrapper.api.owner
  else if (user == 'support') client = wrapper.api.support
  else if (user == 'pairbot') client = wrapper.api.pairbot
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
    if (logging) $log(`slack[${method}].result`.yellow, (r && r.length) ? r.length : 1, (r && r.length) ? r[0] : r)
    cb(null, r)
  })
}

var wrapper = {

  init() {
    var SlackAPI = require('slackey')
    wrapper.api = new SlackAPI({})

    //-- Has full access (team@)
    wrapper.api.owner = wrapper.api.getClient(owner.token)
    //-- Should be in every private group (support@)
    wrapper.api.support = wrapper.api.getClient(support.token)
    //-- Should be in every private group (bot)
    wrapper.api.pairbot = wrapper.api.getClient(pairbot.token)
  },

  teamInfo(cb)
  {
    clientCall('owner', 'team.info', {}, 'team', select.team, cb)
  },

  meInfo(user, cb)
  {
    clientCall(user, 'auth.test', null, null, null, cb)
  },

  updateMe(user, cb)
  {
    throw Error("not impl")
    // clientCall(user, 'auth.test', null, null, null, cb)
  },

  getChannels(cb)
  {
    clientCall('owner', 'channels.list', null, 'channels', null, cb)
  },

  getUsers(cb)
  {
    cache.slackUsers((callback)=>{
      clientCall('owner', 'users.list', null, 'members', select.slackUser, callback)
    }, cb)
  },

  checkUserSync(info)
  {
    //-- This method will explode if the cache isn't preloaded
    var slackUsers = cache.slack_users

    // Priority 0 if a username is provided
    if (info.id)
      for (var u of slackUsers)
        if (u.id == info.id) return u

    // Priority 1 if a username is provided
    if (info.username)
      for (var u of slackUsers)
        if (u.name == info.username) return u

    // Priority 2 if we have an email match
    for (var u of slackUsers)
      if (u.profile && info.email==u.profile.email) return u

    // Priority 3 fuzzy matching on name
    if (info.name)
      for (var u of slackUsers)
        //-- checking by name like this will cause problems when we
        //-- have two users with the same name, but may be ok with email checkd first
        if (u.real_name && info.name.toLowerCase()==u.real_name.toLowerCase()) return u

    return null
  },

  checkUser(info, cb)
  {
    if (info.id)
      clientCall('owner', 'users.info', { user:info.id }, 'user', select.slackUser, cb)
    else
      wrapper.getUsers((e,users)=>{
        if (e) return cb(e)
        cb(null, wrapper.checkUserSync(info))
      })
  },

  deactivateUser(id, cb)
  {
    clientCall(owner, 'users.admin.setInactive', {user:id}, null, null, cb)
  },

  inviteToTeam(fullName, email, cb)
  {
    var first_name = util.firstName(fullName)
    var last_name = util.lastName(fullName)
    clientCall(owner, 'users.admin.invite', {first_name,last_name,email}, null, null, cb)
    cache.flush('slack_users')
  },

  // getUserPresence(user, cb)
  // {
  //   var client = (user.token) ? wrapper.api.getClient(user.token) : wrapper.api.support
  //   client.api('users.getPresence', { user:user.slackId }, cb)
  // },

  getGroups(user, cb)
  {
    var user = (user.token) ? user : 'pairbot'
    if (user == 'pairbot')
      cache.slackGroups((callback)=>{
        clientCall(user, 'groups.list', null, 'groups', select.slackGroup, callback)
      }, cb)
    else
      clientCall(user, 'groups.list', null, 'groups', select.slackGroup, cb)
  },

  searchGroupsByName(term, cb)
  {
    term = term.toLowerCase()
    wrapper.getGroups('pairbot', (e,r)=>{
      if (e) return cb(e)
      var groups = []
      for (var p of r)
        if (p.name.toLowerCase().indexOf(term) != -1) groups.push(p)

      cb(null, groups)
    })
  },

  getGroupWithHistory(id, cb)
  {
    clientCall('pairbot', 'groups.info', {channel:id}, 'group', select.slackGroup, (e,info)=>{
      if (e) return cb(e)
      clientCall('pairbot', 'groups.history', {channel:id,count:500}, 'messages', null, (ee,history)=>{
        if (ee) return cb(ee)
        cb(null, { info, history: _.map(history,(h)=>_.omit(h,'type')) })
      })
    })
  },

  inviteToGroup(invitor, groupId, invitee, cb)
  {
    var user = (invitor.token) ? invitor : 'support'
    clientCall(user, 'groups.invite', { channel:groupId, user:invitee }, null, null, cb)
  },

  renameGroup(user, groupId, name, cb)
  {
    var user = (user.token) ? user : 'support'
    clientCall(user, 'groups.rename', { channel:groupId, name }, 'channel', null, cb)
  },

  setGroupPurpose(user, groupId, purpose, cb)
  {
    var user = (user.token) ? user : 'support'
    clientCall(user, 'groups.setPurpose', { channel:groupId, purpose }, null, null, cb)
  },

  createGroup(user, groupInfo, members, cb)
  {
    var user = (user.token) ? user : 'support'
    var {name,purpose} = groupInfo
    clientCall(user, 'groups.create', { name }, 'group', select.slackGroup, (e,group)=>{
      if (e) return cb(e)

      if (!_.contains(members,(m)=>m==pairbot.id)) members.push(pairbot.id)
      for (var m of members)
        clientCall(user, 'groups.invite', { channel:group.id, user:m }, null, null, (e,invite)=>{})

      wrapper.setGroupPurpose(user, group.id, purpose, (ee,rPurpose)=>{
        if (ee) return cb(ee)
        group.purpose.value = purpose
        cb(null, group)
      })
    })
    cache.flush('slack_groups')
  },

  postMessage(user, channel, message, cb)
  {
    var data = { channel, text:message, parse: 'full' }
    if (user == 'pairbot') data.username = 'pairbot'
    clientCall(user, 'chat.postMessage', data, 'message', null, cb)
  },

  postAttachments(user, channel, attachments, cb)
  {
    var data = { channel, attachments }
    if (user == 'pairbot') data.username = 'pairbot'
    data.attachments = JSON.stringify(data.attachments)
    clientCall(user, 'chat.postMessage', data, null, null, cb)
  }


  // getIMs(user, cb)
  // {
  //   clientCall(user, 'im.list', {}, null, null cb)
  // }


}

module.exports = wrapper
