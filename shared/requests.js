var util = require('./util')

var reqFns = {

  buildDefaultFarmTweet(request) {
    var tags = util.tagsString(request.tags)
    return `Get paid $${request.budget-30}/hr to help w ${ tags } over video chat`
  },

  sortByLastAdmTouch(requests) {
    return _.sortBy(requests,(r)=>r.adm.lastTouch.utc)
  },

  // calcFunnelMetrics(requests) {
  //   var count = 1;
  //   var todays = [], incomplete = [], complete = [];
  //   return _.sortBy(requests,(r)=>r.adm.lastTouch.utc)
  // },

  calcMeta(request) {
    var r = request
    var created = util.ObjectId2Moment(request._id)
    var submitted = (r.adm && r.adm.submitted) ? moment(r.adm.submitted) : false
    var meta = {
      created, submitted,
      moreThan1HourOld: (submitted) ? submitted.isBefore(moment().add('-1','hours')) : submitted,
      moreThan2HourOld: (submitted) ? submitted.isBefore(moment().add('-2','hours')) : submitted,
      moreThan1DayOld: (submitted) ? submitted.isBefore(moment().add('-1','days')) : submitted,
      moreThan2DayOld: (submitted) ? submitted.isBefore(moment().add('-2','days')) : submitted,
      shortBrief: r.brief.length < 100,
      okToDelete: r.suggested.length == 0
    }
    if (submitted)
      meta.timeToSubmit = moment.duration(submitted.diff(created)).humanize()
    if (submitted && r.adm.received)
      meta.timeToReceived = moment.duration(submitted.diff(r.adm.received)).humanize()
    if (submitted && r.adm.reviewable)
      meta.timeToReviewable = moment.duration(submitted.diff(r.adm.reviewable)).humanize()
    if (submitted && r.adm.booked)
      meta.timeToBook = moment.duration(submitted.diff(r.adm.booked)).humanize()

    meta.timeToCancelFromWaiting = r.status == 'waiting' && meta.moreThan1DayOld

    return meta
  },

  shouldSend(request, meta) {
    var r = request, m = meta;
    return {
      received:(r) => r.status == 'received' && !_.find(r.messages,(msg) => msg.type == 'received'),
      review:(r) => r.status == 'review' && _.find(r.suggested,(s)=>s.expertStatus=='available') && !_.find(r.messages,(msg) => msg.type == 'review'),
      cancelfromwaiting:(r,m) => r.status == 'waiting' && m.timeToCancelFromWaiting && !_.find(r.messages,(msg) => msg.type == 'cancelfromwaiting'),
      generic:(r,m) => true,
    }
  },

  defaultTitle(r) {
    var tagsString = util.tagsString(r.tags)
    var hourString = (r.hours > 1) ? 'hours' : 'hour of'
    if (r.type != 'other')
      return `${r.hours} hour ${tagsString} ${r.type}`
    else
      return `${r.hours} ${hourString} ${tagsString} help`
  },

  mojoQuery(r) {
    var q = 'tags='
    if (!r.tags || r.tags.length == 0) return null
    r.tags.forEach((tag)=>{
      q = q+encodeURIComponent(tag.slug)+','
    })
    q = q.replace(new RegExp(',$'), '')
    if (r.suggested && r.suggested.length > 0)
    {
      q = q + '&exclude='
      r.suggested.forEach((s)=>{
        if (s.expert.username)
          q = q + s.expert.username + ','
      })
      q = q.replace(new RegExp(',$'), '')
    }
    return q
  }

}


module.exports = reqFns
