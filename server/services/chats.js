import Svc                from '../services/_service'
var logging               = false
var Chat                  = require('../models/chat')
var svc                   = new Svc(Chat, logging)
var UserSvc               = require('../services/users')
var {channels}            = config.chat.slack

var get = {

  getById: svc.getById,

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
  }

}


var save = {

  inviteToTeam(userId, cb)
  {
    $callSvc(UserSvc.getById,{user:{_id:userId}})(userId,(e,r)=>{
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
      return svc.create(o,cb)
    })
  },

  createSync(provider, providerId, cb)
  {
    if (provider != 'slack') cb(Error("Only slack sync supported"))
    Wrappers.Slack.getGroupWithHistory(providerId, (e,r)=>{
      if (e) return cb(e,r)
      svc.searchOne({providerId},{},(ee,rr)=>{
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
          return svc.create(o,cb)
        }
        else {
          var history = _.sortBy(_.unique(_.union(r.history,rr.history),false,'ts'),'ts')
          var ups = _.extend(rr,r)
          ups.history = history
          return svc.update(rr._id,ups,cb)
        }
      })
    })
  },

  sync(_id, groupInfo, cb)
  {
    svc.searchOne({_id},{},(ee,rr)=>{
      if (ee||!rr) return cb(ee,rr)
      if (rr.provider != 'slack') cb(Error("Only slack sync supported"))

      // stop hitting slack api on every single save
      if (moment(rr.synced).isAfter(moment().add(-30,'second'))) return cb(null,rr)

      Wrappers.Slack.getGroupWithHistory(rr.providerId, (e,r)=>{
        if (e) return cb(e,r)
        var history = _.sortBy(_.unique(_.union(r.history,rr.history),false,'ts'),'ts')
        var ups = _.extend(rr,r)
        ups.history = history
        if (ups.info.name[0] != groupInfo.name[0]) {
          groupInfo.name = groupInfo.name[0] + ups.info.name.substring(1)
          var msg = `${this.user.email}::  ${ups.info.name}  -> ${groupInfo.name}`
          ups.info.name = groupInfo.name
          Wrappers.Slack.renameGroup({},rr.providerId,groupInfo.name,()=>{
            Wrappers.Slack.postMessage('pairbot', channels.pipeline.id, msg, ()=>{})
          })
        }
        if (ups.info.purpose.value != groupInfo.purpose) {
          $log('update purpose'.yellow, ups.info.purpose.value, groupInfo.purpose)
          ups.info.purpose.value = groupInfo.purpose
          Wrappers.Slack.setGroupPurpose({},rr.providerId,groupInfo.purpose,()=>{})
        }
        ups.synced = new Date
        return svc.update(rr._id,ups,cb)
      })
    })
  },

  // deleteRedirectById(id, cb) {
  //   svc.deleteById(id, cb)
  // }

}


module.exports = _.extend(get, save)
