var Analytics = require('analytics-node')
var setDevSettings = (config.env == 'dev' || config.env == 'test')
var segmentOpts = setDevSettings ? { flushAt: 1 } : {}
var segment = new Analytics(config.analytics.segmentio.writekey, segmentOpts)
var logging = false
var viewSvc = require('../../services/views')


var doneBackup = null

//-- don't' want to send userId / anonymousId on the wire if null
var buildPayload = (type, user, anonymousId, payload) => {
  if (user) payload.userId = user.email
  else payload.anonymousId = anonymousId
  if (logging) $log(`analytics.${type}`.yellow, payload)
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
  var mPayload = _.extend(m,buildPayload('mp.view', user,sessionID,{properties:mProperties,context}))

  segment.track(mPayload, done || doneBackup)

  // if (context.campaign) segment.identify(buildPayload(userId, anonymousId, {context}))

  // write to mongo
  var {objectId,url} = properties
  var {referer,campaign} = context
  var userId = (user) ? user._id: null
  viewSvc.create({userId,anonymousId:sessionID,url:properties.path,
    type,objectId,campaign,referer}, (e,r)=>{})
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
  setCallback: (cb) => {
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
  upsert: (user, existingUser, sessionID, cb) =>
  {
    var {aliases} = user.cohort
    var noAliases = !aliases || aliases.length == 0

    // This is a new user (easy peasy)
    if (noAliases && !existingUser) {
      aliases = [sessionID] // we make the assumption that we're going to alias on the update
      analytics.alias(sessionID, user, 'Signup', () => {})
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
