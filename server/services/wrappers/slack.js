var logging                       = true
var {select}                      = require('../chats.data')
var {owner,support,pairbot,jk}    = config.wrappers.chat.slack

var clientCall;
var cCall = function(user, method, data, cbProp, select, cb) {
  var client = null
  if (user == 'owner') client = this.api.owner
  else if (user == 'support') client = this.api.support
  else if (user == 'pairbot') client = this.api.pairbot
  else client = this.api.getClient(user.token)
  var start = new Date()
  client.api(method, data, (e,response) => {
    // if (method == 'groups.info') $log(method.white, JSON.stringify(response))
    var duration = new Date() - start
    if (duration > 1000) console.log(`[slack.${method}].slow`.cyan, `${duration}`.red)
    if (e) return cb(e)
    var r = (cbProp) ? response[cbProp] : response
    if (select) {
      if (r.constructor === Array)
        r = _.map(r,(elem)=>util.selectFromObject(elem, select))
      else
        r = util.selectFromObject(r, select)
    }
    if (logging) {
      var logMethod = `slack.api[${method}]`.green
      if (method == 'users.list') $log(logMethod, r.length)
      else if (method == 'chat.postMessage') $log(logMethod, r.text||(r.attachments?r.attachments[0].fallback:''))
      else if (method == 'groups.info') $log(logMethod, r.purpose.value, r.members)
      else if (method == 'groups.history') $log(logMethod, r.length)
      else if (method == 'groups.rename') $log(logMethod, r.id, r.name)
      else if (method == 'groups.setPurpose') $log(logMethod, r.purpose)
      else
        $log(`slack[${method}].result`, (r && r.length) ? r.length : 1, (r && r.length) ? r[0] : r)
    }
    cb(null, r)
  })
}

var wrapper = {

  init() {
    var SlackAPI = require('slackey')
    this.api = new SlackAPI({})

    //-- Has full access (team@)
    this.api.owner = wrapper.api.getClient(owner.token)
    //-- Should be in every private group (support@)
    this.api.support = wrapper.api.getClient(support.token)
    //-- Should be in every private group (bot)
    this.api.pairbot = wrapper.api.getClient(pairbot.token)

    var self = this
    clientCall = function() { cCall.apply(self, arguments) }
  },

  teamInfo(cb)
  {
    clientCall('owner', 'team.info', {}, 'team', select.team, cb)
  },

  meInfo(user, cb)
  {
    clientCall(user, 'auth.test', null, null, null, cb)
  },

  // updateMe(user, first_name, last_name, cb)
  // {
  //   clientCall(user, 'users.info', { user:user.id }, 'user', null, (ee, r)=>{
  //     if (ee) return cb(ee)
  //     var {profile} = r
  //     $log('profile', r.id)
  //     // var body = {users:r.id,profile:profile,set_active:true,_attempts:1}
  //     clientCall(user, 'users.profile.set', profile, null, null, cb)
  //   })
  // },

  getChannels(cb)
  {
    clientCall('owner', 'channels.list', null, 'channels', null, cb)
  },

  getUsers(cb)
  {
    // cache.slackUsers((callback)=>{
    clientCall('owner', 'users.list', null, 'members', select.slackUser, (e,r) => {
      if (e) return cb(e)
      global.userHash = {}
      for (var u of r) userHash[u.id] = u.name
      cb(null, r)
    })
      //
      //
    // }, cb)
  },

  checkUserSync(info)
  {
    //-- This method will explode if the cache isn't preloaded
    var slackUsers = cache.slack_users
    if (!slackUsers) $log('Slack.checkUserSync cache not loaded'.red)

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
    if (info.name) {
      var fnameLower = info.name.toLowerCase()
      for (var u of slackUsers) {
        //-- checking by name like this will cause problems when we
        //-- have two users with the same name, but may be ok with email checkd first
        if (u.real_name && u.real_name.trim().replace('  ',' ').toLowerCase() == fnameLower) return u
      }
    }

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
        clientCall(user, 'groups.list', null, 'groups', select.slackGroup, (e,r)=>{
          if (e) return cb(e)
          var groups = []
          for (var g of r)
            // don't cache airpair-channel / -support etc.
            if (g.name.indexOf('airpair-')==-1) {
              g.members = _.without(g.members, support.id , pairbot.id , jk.id)
              groups.push(g)
            }
          callback(null, groups)
        })
      }, cb)
    else
      clientCall(user, 'groups.list', null, 'groups', select.slackGroup, cb)
  },

  searchGroupsByName(term, cb)
  {
    term = term.toLowerCase()
    this.getGroups('pairbot', (e,r)=>{
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
      // if (!_.contains(members,(m)=>m==jk.id)) members.push(jk.id)
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
    if (message.type == 'attachment')
      return wrapper.postAttachments(user, channel, [message], cb)

    var data = { channel, text: message, parse: 'full' }
    if (user == 'pairbot') data.username = 'pairbot'
    clientCall(user, 'chat.postMessage', data, 'message', null, cb)
  },

  postAttachments(user, channel, attachments, cb)
  {
    var data = { channel, attachments }
    if (user == 'pairbot') data.username = 'pairbot'
    data.attachments = JSON.stringify(data.attachments)
    clientCall(user, 'chat.postMessage', data, null, null, cb)
  },

  getIMChats(user, cb)
  {
    var chats = [] //'ims', ,
    var synced = 1

    var getHistory = (info, count) => {
      clientCall(user, 'im.history', {channel:info.id,count:500}, 'messages', null, (ee,history)=>{
          if (ee) return cb(ee)
          history = _.map(history,(h)=>_.omit(h,'type'))
          // $log('history', info.id, history)
          chats.push({ info, history })
          if (synced++ >= count)
            cb(null, chats)
        })
    }

    clientCall(user, 'im.list', {}, 'ims', select.slackIM, (e,chatInfos) => {
      if (e) return cb(e)
      var count = chatInfos.length
      for (var info of chatInfos)
        getHistory(info, count)
    })
  }
}

module.exports = wrapper
