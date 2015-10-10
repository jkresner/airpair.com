var maillists       = require('./users.data').data.maillists
var emptyMongooseCohort = { maillists: [], aliases: [], engagement: { visits: [] } }

// Cohorts
//
// Experts
// 6 Months Domant
// Domant contacted twice
// Country (India)
// Company
// Has Paymethod
// Has Tags
// SiteNotifications
// Visits
// Engagement
// Email Verified

module.exports = {

  getCohortProperties(existingUser, session, done)
  {
    var cohort = (existingUser) ? existingUser.cohort : null
    cohort = cohort || {}
    if (_.isEqual(cohort,emptyMongooseCohort)) cohort = {}
    // if (true) $log('getCohortProperties'.cyan, cohort)

    var now         = new Date()
    var day         = util.dateWithDayAccuracy()
    var visit_first = (existingUser) ?
      util.ObjectId2Date(existingUser._id) :
      util.momentSessionCreated(session).toDate()
    var visit_signup = (existingUser) ?
      util.ObjectId2Date(existingUser._id) :
      now

    if (!cohort.engagement)
      cohort.engagement = {visit_first,visit_signup,visit_last:now,visits:[day]}
    if (!cohort.engagement.visit_first)
      cohort.engagement.visit_first = visit_first
    if (!cohort.engagement.visit_signup)
      cohort.engagement.visit_signup = visit_signup
    if (!cohort.engagement.visit_last)
      cohort.engagement.visit_last = now
    if (!cohort.engagement.visits || cohort.engagement.visits.length == 0)
      cohort.engagement.visits = [day]

    if (!cohort.firstRequest)
      cohort.firstRequest = session.firstRequest

    if (!existingUser)
      cohort.maillists = ['AirPair Newsletter']
    //-- bit strange, if they un-subscribe we throw them back on ....
    else if (!cohort.maillists) // || !cohort.maillists == 0)
      cohort.maillists = ['AirPair Newsletter']
    if (session.maillists && session.maillists.length > 0)
      cohort.maillists = _.union(cohort.maillists||[],session.maillists)

    if (!cohort.aliases)   // we add the aliases after successful sign up
      cohort.aliases = []  // This could probably make more sense

    return cohort
  },

  //-------- User Info

  setExpertCohort(expertId) {
    // Not sure how cohort can be null, but it's happened
    if (!this.user.cohort)
      this.user.cohort = {}

    if (!this.user.cohort.expert || this.user.cohort.expert._id != expertId)
    {
      var exCo = this.user.cohort.expert || {}
      exCo.applied = exCo.applied || new Date // When they went through v1 signup
      this.user.cohort.expert = _.extend(exCo, {_id:expertId})
      this.user.cohort.maillists = _.union(this.user.cohort.maillists||[],['AirPair Experts'])
      this.svc.updateWithSet(this.user._id, {cohort: this.user.cohort}, (ee,rr)=>{})
    }
  },


  // syncMaillists(cb) {
  //   throw Error("syncMaillists not implemented")
  // },


  // getMaillists(cb) {
  //   if (this.user)
  //   {
  //     // $log('getting from users db'.cyan, this.user)
  //     $callSvc(this.svc.getById, this)(this.user._id, (e,user) => {
  //       var cohortLists = (user.cohort && user.cohort.maillists) ? user.cohort.maillists : []
  //       var FNAME = util.firstName(user.name)
  //       var LNAME = user.name.replace(FNAME+' ','')

  //       // $log('cohortLists'.magenta, cohortLists)
  //       Wrappers.MailChimp.sync(user.email, {FNAME,LNAME}, cohortLists, (e,syncMaillists) => {
  //         if (e) return cb(e)
  //         // $log('syncMaillists'.yellow, e, syncMaillists)
  //         // var subscribed = _.pluck(_.filter(r, (l) => l.subscribed),'name')
  //         // if (_.difference(currentLists,subscribed).length > 0 ||
  //           // _.difference(subscribed,currentLists).length > 0
  //         // )
  //         var cohort =  _.extend(user.cohort || {},{maillists:syncMaillists})
  //         // $log('getMaillists cohort'.magenta, cohort)
  //         this.svc.updateWithSet(user._id, {cohort}, (ee,rr)=>{})

  //         var listsAndStatus = []
  //         for (var list of maillists) {
  //           var subscription = _.clone(list) //-- need to be careful not to screw up the master list
  //           // var subscribed = null
  //           if (_.find(syncMaillists,(l)=>l==list.name)) subscription.subscribed = true
  //           listsAndStatus.push(subscription)
  //         }
  //         // $log('listsAndStatus'.yellow, listsAndStatus)
  //         cb(null, listsAndStatus)
  //       })
  //     })
  //   }
  //   else
  //   {
  //     // $log('in users session'.cyan, this.session.maillists)
  //     //-- Just return what's in the users session because we can't tell
  //     //-- if they have verified anyway
  //     cb(null, this.session.maillists)
  //   }
  // },

  // toggleMaillist(body, cb) {
  //   var {name} = body
  //   if (this.user)
  //   {
  //     $callSvc(this.svc.getById, this)(this.user._id, (ee,user) => {
  //       var cohortLists = (user.cohort) ? user.cohort.maillists : []
  //       // $log('toggleMaillist cohortLists:'.cyan, cohortLists)
  //       if (_.contains(cohortLists, name)) {
  //         Wrappers.MailChimp.unsubscribe(name, user.email, (e,r) => cb(e,{name,subscribed:false}))
  //         cohortLists = _.without(cohortLists, name)
  //       }
  //       else {
  //         var FNAME = util.firstName(user.name)
  //         var LNAME = user.name.replace(FNAME+' ','')
  //         Wrappers.MailChimp.subscribe(name, user.email, {FNAME,LNAME}, 'html', false, false, (e,r) => cb(e,{name,subscribed:true}))
  //         cohortLists.push(name)
  //       }
  //       // $log('toggleMaillist cohortLists2:'.cyan, cohortLists)
  //       var cohort =  _.extend(user.cohort || {},{maillists:cohortLists})
  //       // $log('updateWithSet', cohort)
  //       this.svc.updateWithSet(user._id, {cohort}, (ee,rr)=>{})
  //     })
  //   }
  //   else
  //   {
  //     var {email} = body

  //     this.session.maillists = this.session.maillists || []
  //     if (_.contains(this.session.maillists, name)) {
  //       cb('Unsubscribe not supported for anonymous users. Please login.')
  //       // this.session.maillists = _.without(this.session.maillists, name)
  //       // Wrappers.MailChimp.unsubscribe(name, email, (e,r) => cb(e,this.session.maillists))
  //     }
  //     else {
  //       this.session.maillists.push(name)
  //       Wrappers.MailChimp.subscribe(name, email, {}, 'html', true, false, (e,r) => cb(e,this.session.maillists))
  //     }

  //     this.session.anonData.email = email
  //   }
  // }

}
