import Svc                from '../services/_service'
var logging               = false
var Chat                  = require('../models/Chat')
var svc                   = new Svc(Chat, logging)
var UserSvc               = require('../services/users')

var get = {

  getById: svc.getById,

  searchSyncOptions(term, cb)
  {
    Wrappers.Slack.searchGroupsByName(term, (e,r)=>{
      var groups = []
      for (var group of r||[])
        groups.push(_.extend({type:'group',provider:'slack',data:group}))
      cb(e,groups)
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

  // createSync(type, providerId, cb)
  // {
  //   if (type != 'slack') cb(Error("Only slack sync supported"))
  //   Wrappers.Slack.getGroupWithHistory(providerId, (e,r)=>{
  //     svc.searchOne({providerId},{},(ee,rr)=>{
  //       if (ee) return cb(ee,rr)
  //       if (!rr) {
  //         r.type = "group"
  //         r.provider = 'slack'
  //         r.providerId = r.data.id
  //         r.synced = new Date
  //         r.adminId = this.user._id
  //         return svc.create(r,cb)
  //       }
  //       else {
  //         var history =
  //           _.sortBy(_.unique(_.union(r.history,rr.history),false,'ts'),'ts') //-- TODO test this line
  //         var ups = _.extend(rr,r)
  //         ups.history = history
  //         return svc.update(rr._id,ups,cb)
  //       }
  //     })
  //   })
  // },

  // deleteRedirectById(id, cb) {
  //   svc.deleteById(id, cb)
  // }

}


module.exports = _.extend(get, save)
