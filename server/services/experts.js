var logging               = false
var {Expert,User}         = DAL
var UserSvc               = require('../services/users')
var RequestSvc            = require('../services/requests')
var BookingSvc            = require('../services/bookings')
var {selectFromObject}    = util
var {select,options}      = require('./experts.data')
var selectCB              = select.cb


var get = {

  getById(id, cb) {
    Expert.getById(id,{join:{userId:select.mojoUser}},selectCB.migrateInflate(cb))
  },

  getByIdForAdmin(id, cb) {
    Expert.getById(id,{join:{userId:select.mojoUser}},selectCB.addAvatar(cb))
  },

  getMe(cb) {
    Expert.getByQuery({userId:this.user._id}, {join:{userId:select.mojoUser}}, selectCB.me((e,r)=>{
      if (!e && !r) return cb(null, {user:selectFromObject(this.user, select.userCopy)})
      cb(e,r)
    }))
  },

  getHistory(expert, cb) {
    var user = { _id: expert.userId }
    $callSvc(RequestSvc.getExperts,{user})(expert,(ee,requests)=>{
      if (ee) return cb(ee)
      var calls = []
      for (var req of requests) {
        if (!req.by && req.company) {
          req.by = {_id:req.userId,
            name: req.company.contacts[0].fullName,
            email: req.company.contacts[0].email
          }
        }
        if (req.company) delete req.company
      }
      $callSvc(BookingSvc.getByExpertIdForMatching,this)(expert._id,(e,bookings)=>{
        if (e) return cb(ee)
        cb(null,{requests,bookings:
          _.sortBy(_.union(calls,bookings),(b)=>-1*moment(b.datetime).unix())
        })
      })
    })
  },

  search(term, cb) {
    // var searchFields = 'user.name user.email user.username name email username'
      // + 'user.auth.gh.username user.auth.tw.username user.auth.gh.username user.auth.tw.username'
    var searchFields = 'name email username auth.gp.displayName'
    var opts = { limit: 5, andQuery: { rate: { '$gt': 0 } } }

    User.searchByRegex(term, searchFields, {select:searchFields,limit:20}, (e,r) => {
      var uIds = _.pluck(r,'_id')
      Expert.getManyByQuery({userId:{$in:uIds}}, opts, (ee,rr)=>{
        for (var expert of rr)
          expert.user = _.find(r, u => _.idsEqual(u._id,expert.userId))

        selectCB.migrateSearch(cb)(ee, rr)
      })
    })
  },

  getByUsername(term, cb) {
    var q = {'$or':[
      {'user.username':term},
      {'username':term},
      {'bookme.urlSlug':term}
    ]}
    Expert.getByQuery(q, { select: select.me }, selectCB.migrateInflate(cb))
  },

  getNewForAdmin(cb) {
    Expert.getManyByQuery({}, options.newest100, selectCB.inflateList(cb))
  },

  getActiveForAdmin(cb) {
    Expert.getManyByQuery({meta:{$exists:1}}, options.active100, selectCB.inflateList(cb))
  },

  getByDeal(id, cb) {
    var search = {'deals._id':id}
    if (id.length != 24) search = {'deals.code':id}
    Expert.getByQuery(search, selectCB.migrateInflate(cb))
  },

}

// function saveWithTouch(original, ups, action, trackData, done) {
//   var lastTouch = svc.newTouch.call(this, action)

//   var tagIdx = 0
//   for (var t of ups.tags) {
//     if (!t.sort)
//       t.sort = tagIdx
//     tagIdx = tagIdx + 1
//   }

//   //-- consistency with v0 + save db space
//   // if (expert.user.social) {
//   //   if (expert.user.social.so)
//   //     expert.user.social.so.link = expert.user.social.so.link.replace('http://stackoverflow.com/users/','')
//   //   if (expert.user.google) {
//   //     expert.user.social.gp = expert.user.google
//   //     delete expert.user.google
//   //   }
//   // }
//   var cb = () => get.getMe.call(this, done)

//   if (action == 'create') {
//     ups.lastTouch = lastTouch
//     ups.activity = [lastTouch]
//     Expert.create(ups, cb)
//   }
//   else {
//     var previousAction = original.lastTouch ? original.lastTouch.action : null
//     if (action != previousAction ||
//       moment(original.lastTouch.utc).isBefore(moment().add(1, 'hours')))
//     {
//       ups.lastTouch = lastTouch
//       ups.activity = original.activity || []

//       if (_.idsEqual(this.user._id,original.userId))  // Don't want activity for admins
//         ups.activity.push(lastTouch)
//     }

//     Expert.updateSet(original._id, _.omit(ups,['_id']), cb)
//   }

//   // if (trackData)
//   //   analytics.track(this.user, this.sessionID, 'Save',
//   //     _.extend(trackData,{type:expert,action}), {}, ()=>{})
// }


var save = {

  createDeal(expert, deal, cb) {
    cb(V2DeprecatedError('Experts.createDeal'))
    // deal.lastTouch = svc.newTouch.call(this, 'createDeal')
    // deal.activity = [deal.lastTouch]
    // deal.rake = deal.rake || 10 //-- To become more intelligent and custom per deal
    // expert.deals = expert.deals || []
    // expert.deals.push(deal)
    // $callSvc(updateWithTouch, this)(expert, 'createDeal', null, selectCB.me(cb))
  },

  deactivateDeal(expert, dealId, cb) {
    cb(V2DeprecatedError('Experts.deactivateDeal'))
    // var deal = _.find(expert.deals,(d)=>_.idsEqual(d._id,dealId))
    // deal.lastTouch = svc.newTouch.call(this, 'dectivateDeal')
    // deal.expiry = new Date
    // $callSvc(updateWithTouch, this)(expert, 'dectivateDeal', null, selectCB.me(cb))
  },

  addNote(original, note, cb)
  {
    var notes = original.notes || []
    notes.push({body:note,by:{_id:this.user._id,name:this.user.name}})
    Expert.updateSet(original._id, {notes}, cb)
  },

  deleteById(original, cb) {
    Expert.delete(original, cb)
  },
}

module.exports = _.extend(get, save)
