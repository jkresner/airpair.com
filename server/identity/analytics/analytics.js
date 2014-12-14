var Analytics = require('analytics-node')
var setDevSettings = (config.env == 'dev' || config.env == 'test')
var segmentOpts = setDevSettings ? { flushAt: 1 } : {}
var segment = new Analytics(config.analytics.segmentio.writekey, segmentOpts)
var logging = false
var viewSvc = require('../../services/views')
var doneBackup = null


var convertToDumbSegmentCampaignSHIT = (utms) =>
{
  var c = null
  var {utm_campaign,utm_source,utm_medium,utm_term,utm_content} = utms
  if (utm_campaign) (c) ? (c.name = utm_campaign) : (c = {name:utm_campaign})
  if (utm_source) (c) ? (c.source = utm_source) : (c = {source:utm_source})
  if (utm_medium) (c) ? (c.medium = utm_medium) : (c = {medium:utm_medium})
  if (utm_term) (c) ? (c.term = utm_term) : (c = {term:utm_term})
  if (utm_content) (c) ? (c.content = utm_content) : (c = {content:utm_content})

  return (c) ? c : null
}

//-- don't' want to send userId / anonymousId on the wire if null
var buildPayload = (type, user, anonymousId, payload) => {
  if (user) payload.userId = user.email
  else payload.anonymousId = anonymousId
  if (logging) { $log(`analytics.${type}`.yellow); $log(`analytics.${type}`, payload) }
  return payload;
}

var traitsFromUser = (user) =>
{
  var traits = {
    name: user.name,
    email: user.email,
    // lastSeen: new Date(),  //-- leave this up to the client as it doesn't work via segment
    createdAt: user.cohort.engagement.visit_first,
    paymentInfoSet: user.primaryPayMethodId != null
  }
  if (user.username) traits.username = user.username

  // isExpert / isCustomer

  return traits;
}

var track = (user, sessionId, event, properties, context, done) => {
  segment.track(buildPayload('track', user, sessionId, {event,properties,context}),
    done || doneBackup)
}


var view = (user, sessionID, type, name, properties, context, done) => {

  // FUCK SEGMENT PAGE
  // segment.page(p)

  properties.url = properties.path
  var m = { event:'View', integrations: { 'All': false, 'Mixpanel': true }}

  var mProperties = _.extend(properties, {type,name})
  if (context.utms) _.extend(mProperties, context.utms)

  var mPayload = _.extend(m,buildPayload('mp.view', user, sessionID , {properties:mProperties}))

  // console.log('mPayload', mPayload)
  segment.track(mPayload, done || doneBackup)


  // write to mongo
  var {objectId,url} = properties
  var {referer} = context
  var campaign = (context.utms) ? convertToDumbSegmentCampaignSHIT(context.utms) : undefined
  var userId = (user) ? user._id: null
  viewSvc.create({userId,anonymousId:sessionID,url:properties.path,
    type,objectId,campaign,referer}, (e,r) => {})
}


var identify = (user, context, identifyEvent, identifyEventProps, done) => {
  var traits = traitsFromUser(user)
  var context = null // ?? to populate

  segment.identify(buildPayload('identify', user, null, {traits,context}), () => {
    if (logging) $log('**** identified'.yellow)
    track(user, null, identifyEvent, identifyEventProps, context, () => {
      if (logging) $log(`**** ${identifyEvent}`.yellow)
      done()
    })
    segment.flush()
  })
}


var alias = (sessionID, user, aliasEvent, done) => {
  if (logging) $log('alias', user.email, sessionID, aliasEvent, done)
  var userId = user._id.toString()

  segment.alias({ previousId: sessionID, userId: user.email }, (e, b) => {
    if (logging) $log('**** aliased'.yellow)
    identify(user, {}, aliasEvent, {sessionID}, done)
  })
  segment.flush()

  viewSvc.alias(sessionID, user._id, ()=>{})
}


module.exports = {

  // used for testing
  setCallback(cb) {
    doneBackup = (e, batch) => {
      if (logging) $log('**** analytics done'.yellow)
      doneBackup = null
      cb()
    }
  },

  // params:
  // user = most up to date user
  // existingUser = not null if they are logging in, if it's a singup will be null
  // sessionID = the random Id of their current session
  upsert(user, existingUser, sessionID, cb) {
    var {aliases} = user.cohort
    var noAliases = !aliases || aliases.length == 0

    // This is a new user (easy peasy)
    if (noAliases && !existingUser) {
      aliases = [sessionID] // we make the assumption that we're going to alias on the update

      //Add an event to make tracking local vs google signups easier and more consistent
      if (user.googleId)
        analytics.track(user, null, 'Save', {type:'email',email:user.google._json.email}, {sessionID}, ()=>{
          analytics.alias(sessionID, user, 'Signup', () =>
            analytics.track(user, null, 'Login', {}, {sessionID}, () => {}))
        })
      else
        analytics.alias(sessionID, user, 'Signup', () =>
          analytics.track(user, null, 'Login', {}, {sessionID}, () => {}))

      cb(aliases)
    }
    else
    {
      aliases = aliases || []

      //-- This is an existing user from a new device / browser
      if ( ! _.contains(aliases, sessionID) ) {
        if (logging) $log('newAnonSessionID', sessionID)
        aliases.push(sessionID)
      }

      //-- but update all the anonymous views to the userId
      viewSvc.alias(sessionID, user._id, ()=>{})

      var context = {sessionID} // ??
      analytics.identify(user, context, 'Login', {sessionID}, () => {})
      cb(aliases)
    }
  },

  track,
  view,
  identify,
  alias

}
