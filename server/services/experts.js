var logging               = false
var {Expert}              = DAL
var {selectFromObject}    = util
var {select,options}      = require('./experts.data')
var selectCB              = select.cb
var UserSvc               = require('../services/users')
var RequestSvc            = require('../services/requests')
var BookingSvc            = require('../services/bookings')

var get = {

  getById(id, cb) {
    Expert.getById(id,selectCB.migrateInflate(cb))
  },

  getByIdForAdmin(id, cb) {
    Expert.getById(id,selectCB.addAvatar(cb))
  },

  getMe(cb) {
    Expert.getByQuery({userId:this.user._id}, selectCB.me((e,r)=>{
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
    var searchFields = 'user.name user.email user.username name email username'
      + 'gh.username tw.username user.social.gh.username user.social.tw.username'
    var opts = { limit: 5, andQuery: { rate: { '$gt': 0 } }, select: select.search }
    Expert.search(term, searchFields, opts, selectCB.migrateSearch(cb))
  },

  getByUsername(term, cb) {
    var q = {'$or':[
      {'user.username':term},
      {'username':term},
      {'bookme.urlSlug':term}
    ]}
    Exper.getByQuery(q, { fields: select.me }, selectCB.migrateInflate(cb))
  },

  getNewForAdmin(cb) {
    Expert.getManyByQuery({}, options.newest100, selectCB.inflateList(cb))
  },

  getActiveForAdmin(cb) {
    Expert.getManyByQuery({}, options.active100, selectCB.inflateList(cb))
  },

  getByDeal(id, cb) {
    var search = {'deals._id':id}
    if (id.length != 24) search = {'deals.code':id}
    Expert.getByQuery(search, selectCB.migrateInflate(cb))
  },

}

function updateWithTouch(expert, action, trackData, cb) {
  var previousAction = (expert.lastTouch) ? expert.lastTouch.action : null
  // if (action != previousAction ||
  //   moment(expert.lastTouch.utc).isBefore(moment().add(1, 'hours')))
  // {
  //   // expert.lastTouch = svc.newTouch.call(this, action)
  //   expert.activity = expert.activity || []
  //   // if (_.idsEqual(this.user._id,expert.userId))  // Don't want activity for admins
  //   expert.activity.push(expert.lastTouch)
  // }

  var tagIdx = 0
  for (var t of expert.tags) {
    if (!t.sort)
      t.sort = tagIdx
    tagIdx = tagIdx + 1
  }

  //-- consistency with v0 + save db space
  if (expert.user.social) {
    if (expert.user.social.so)
      expert.user.social.so.link = expert.user.social.so.link.replace('http://stackoverflow.com/users/','')
    if (expert.user.google) {
      expert.user.social.gp = expert.user.google
      delete expert.user.google
    }
  }

  if (action == 'create') {
    Expert.create(expert, cb)
  }
  else {

    if (expert.gp || expert.gh || expert.so || expert.bb ||
      expert.in || expert.tw || expert.name || expert.username ||
      expert.gmail || expert.timezone || expert.location ||
      expert.homepage || expert.karma)
    {
      Expert.updateUnset(expert._id, select.v0unset, (e,r)=>{})
      expert = _.omit(expert, _.keys(select.v0unset))
      $log(`Migrating v0 expert ${expert._id} ${expert.user.name}`.yellow)
    }

    Expert.updateSet(expert._id, expert, cb)
  }

  if (trackData)
    analytics.track(this.user, this.sessionID, 'Save',
      _.extend(trackData,{type:expert,action}), {}, ()=>{})
}


var save = {

  create(expert, cb) {
    var trackData = { name: this.user.name }
    expert.user = selectFromObject(this.user, select.userCopy)
    expert.userId = this.user._id
    $callSvc(updateWithTouch, this)(expert, 'create', trackData, (e,r) => {
      if (r._id)
        $callSvc(UserSvc.setExpertCohort, this)(r._id)
      selectCB.me(cb)(e,r)
    })
  },

  updateMe(original, ups, cb) {
    var trackData = { name: this.user.name, _id: original._id }
    ups.user = selectFromObject(this.user, select.userCopy)
    var expert = selectFromObject(_.extend(original,ups), select.updateMe)
    $callSvc(updateWithTouch, this)(expert, 'update', trackData, selectCB.me(cb))
    $callSvc(UserSvc.setExpertCohort, this)(ups._id)
  },

  updateAvailability(original, availability, cb) {
    // availability.lastTouch = svc.newTouch.call(this, availability.status)
    Expert.updateSet(original._id, {availability}, selectCB.me(cb))
  },

  createDeal(expert, deal, cb) {
    // deal.lastTouch = svc.newTouch.call(this, 'createDeal')
    deal.activity = [deal.lastTouch]
    deal.rake = deal.rake || 10 //-- To become more intelligent and custom per deal
    expert.deals = expert.deals || []
    expert.deals.push(deal)
    $callSvc(updateWithTouch, this)(expert, 'createDeal', null, selectCB.me(cb))
  },

  deactivateDeal(expert, dealId, cb) {
    var deal = _.find(expert.deals,(d)=>_.idsEqual(d._id,dealId))
    // deal.lastTouch = svc.newTouch.call(this, 'dectivateDeal')
    deal.expiry = new Date
    $callSvc(updateWithTouch, this)(expert, 'dectivateDeal', null, selectCB.me(cb))
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
