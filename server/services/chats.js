var {Chat,User}             = DAL
var {channels}              = config.wrappers.chat.slack

var get = {

  getById(_id, cb) {
    Chat.getById(_id,cb)
  },

  searchSyncOptions(terms, cb)
  {
    Wrappers.Slack.searchGroupsByName(terms[0], (e,g0) =>{
      Wrappers.Slack.searchGroupsByName(terms[1], (ee,g1) =>{
        if (e||ee) return cb(e||ee)
        cb(null, _.map(
          _.union(g0,g1)||[],(g)=>_.extend({type:'group',provider:'slack',info:g}))
        )
      })
    })
  },

  searchParticipantSyncOptions(participants, cb)
  {
    var allHaveSlack = true
    var memberIds = []
    for (var p of participants) {
      if (p.chat) memberIds.push(p.chat.slack.id)
      else allHaveSlack = false
    }

    if (memberIds.length < 2)
      return cb(null,null,[])

    var possibles = []
    var match = null

    // TODO: could use expert token to be more efficient ...
    Wrappers.Slack.getGroups('pairbot',(e,r)=>{
      for (var info of r) {
        var intersection = _.intersection(info.members,memberIds)
        if (intersection.length == participants.length)
          match = _.extend({type:'group',provider:'slack',info})
        else if (intersection.length > 1)
          possibles.push(_.extend({type:'group',provider:'slack',info}))
      }
      cb(e,match,possibles)
    })
  }
}


var save = {

  inviteToTeam(userId, cb)
  {
    //-- User data access should probably be handled by param + validation
    User.getById(userId, (e,r)=>{
      if (e) return cb(e)
      if (!r || !r.email || !r.name) return cb(Error(`UserId[${userId}] does not have a valid email and name`))
      $log(`Inviting ${r.email} ${r.name} to slack`)
      Wrappers.Slack.inviteToTeam(r.name, r.email, cb)
    })
  },

  createCreate(provider, chat, participants, cb)
  {
    if (provider != 'slack') cb(Error("Only slack sync supported"))
    var members = []
    for (var p of participants)
      if (p.chat && p.chat.slack) members.push(p.chat.slack.id)
    Wrappers.Slack.createGroup({}, chat, members, (ee,rr) => {
      if (ee) return cb(ee)
      var o = {
        type: "group",
        synced: new Date,
        adminId: this.user._id,
        provider: 'slack',
        providerId: rr.id,
        history: [],
        info: rr
      }
      return Chat.create(o,cb)
    })
  },

  createSync(provider, providerId, cb)
  {
    if (provider != 'slack') cb(Error("Only slack sync supported"))
    Wrappers.Slack.getGroupWithHistory(providerId, (e,r)=>{
      if (e) return cb(e,r)
      Chat.getByQuery({providerId},(ee,rr)=>{
        if (ee) return cb(ee,rr)
        if (!rr) {
          $log('history'.cyan, r.info)
          var o = {
            type: "group",
            synced: new Date,
            adminId: this.user._id,
            provider: 'slack',
            providerId: r.info.id,
            info: r.info,
            history: r.history
          }
          return Chat.create(o,cb)
        }
        else {
          var history = _.sortBy(_.unique(_.union(r.history,rr.history),false,'ts'),'ts')
          var ups = _.extend(rr,r)
          ups.history = history
          return Chat.updateSet(rr._id, _.omit(ups,['_id']), cb)
        }
      })
    })
  },

  sync(_id, groupInfo, cb)
  {
    Chat.getById(_id,(ee,rr)=>{
      if (ee||!rr) return cb(ee,rr)
      if (rr.provider != 'slack') cb(Error("Only slack sync supported"))

      var {name,purpose} = groupInfo

      // stop hitting slack api on every single save
      // if (moment(rr.synced).isAfter(moment().add(-30,'second'))) return cb(null,rr)

      Wrappers.Slack.getGroupWithHistory(rr.providerId, (e,r)=>{
        if (e) return cb(e,r)

        var history = _.sortBy(_.unique(_.union(r.history,rr.history),false,'ts'),'ts')

        if (r.info.name != name) {
          Wrappers.Slack.renameGroup({},rr.providerId,groupInfo.name,()=>{})
          // var msg = `${this.user.email}::  ${r.info.name}  -> ${groupInfo.name}`
          // Wrappers.Slack.postMessage('pairbot', channels.pipeline.id, msg, ()=>{})
        }
        if (r.info.purpose.value != purpose) {
          $log('update purpose', r.info.purpose.value, purpose)
          Wrappers.Slack.setGroupPurpose({},rr.providerId,purpose,()=>{})
        }

        return Chat.updateSet(rr._id,{history,name,purpose,synced:new Date},cb)
      })
    })
  },

  syncIMs(cb) {
    cb(V2DeprecatedError('Chat.syncIMs'))
    // var displayFormat = 'DDD MM.DD H:mm'
    // Wrappers.Slack.getUsers(()=>{
    //   var read = 0, done = 1

    //   User.getManyByQuery({'social.sl':{$exists:true}}, '_id name social.sl.id social.sl.token', (e,users) => {
    //     var print = (u) =>
    //      (e,r) => {
    //         $log(u.name.cyan, e, (r) ? r.length : '')
    //         for (var chat of r || []) {
    //           var withcU = (global.userHash[chat.info.user]) ? global.userHash[chat.info.user] : chat.info.user
    //           if (withcU!='jk'&&withcU!='airpair'&&withcU!='USLACKBOT') {
    //             $log(`chat ${u.name}`.yellow, chat.history.length, withcU)
    //             if (chat.history && chat.history.length > 0) {
    //               var withJK = false
    //               var log = ""
    //               for (var msg of chat.history || []) {
    //                 // if (global.userHash[msg.user] == 'jk') withJK = true
    //                 var withU = (global.userHash[msg.user]) ? global.userHash[msg.user] : msg.user
    //                 if (withU == 'jk' || withU == 'USLACKBOT') withJK = true
    //                 else log += `\n${moment.unix(msg.ts).format(displayFormat).white} ${withU} ${msg.text}`
    //               }
    //               if (!withJK)
    //                 $log(log)
    //               else
    //                 $log('with JK'.gray)
    //             }
    //           }
    //         }
    //         if (done++ >= users.length) return cb(null, users.length)
    //         else $log(`done[${done}/${users.length}]`)
    //       }

    //     var getIt = (u) =>
    //         () => Wrappers.Slack.getIMChats(u.social.sl, print(u))

    //     for (var u of users) {
    //       if (u.social.sl.id != config.wrappers.chat.slack.jk.io)
    //       {
    //         read++
    //         _.delay(getIt(u), read*1000)
    //       }

    //     }
    //     // cb(e,r)
    //   })
    // })
  }

}


module.exports = _.extend(get, save)
