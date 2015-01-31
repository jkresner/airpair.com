import Svc from '../services/_service'
import View from '../models/view'
import Landing from '../models/landing'
var logging = false
var _viewSvc = new Svc(View, logging)
var Segment = require('analytics-node')
var segmentConf = config.analytics.segmentio
var segment = new Segment(segmentConf.writekey, segmentConf.options)


var util = {

  buildSegmentPayload(type, user, anonymousId, payload) {
    if (user) payload.userId = user.email
    else payload.anonymousId = anonymousId

    if (logging)
      $log(`analytics.${type}.${JSON.stringify(payload)}}`.white)

    return payload
  },

  convertToDumbSegmentCampaignSHIT(utms) {
    var c = null
    var {utm_campaign,utm_source,utm_medium,utm_term,utm_content} = utms
    if (utm_campaign) (c) ? (c.name = utm_campaign) : (c = {name:utm_campaign})
    if (utm_source) (c) ? (c.source = utm_source) : (c = {source:utm_source})
    if (utm_medium) (c) ? (c.medium = utm_medium) : (c = {medium:utm_medium})
    if (utm_term) (c) ? (c.term = utm_term) : (c = {term:utm_term})
    if (utm_content) (c) ? (c.content = utm_content) : (c = {content:utm_content})

    return (c) ? c : null
  },

  segmentTraitsFromUser(user) {
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

}


var viewSvc = {
  getByUserId(userId, cb) {
    var opts = { sort: { '_id': -1 } }
    _viewSvc.searchMany({userId}, opts, cb)
  },
  getByAnonymousId(anonymousId, cb) {
    var opts = {}
    _viewSvc.searchMany({anonymousId}, opts, cb)
  },
  alias(anonymousId, userId, cb) {
    View.update({anonymousId}, {userId}, { multi: true }, cb)
  },
  create(o, cb) {
    o.utc = new Date()
    _viewSvc.create(o, cb)
  }
}

function $$log(action, data, user, sessionID) {
  //-- TODO think about adding persistence
  var uid = (user) ? user.email || user._id : sessionID.substring(0,12)

  switch (action) {
    case 'First':
      var ref = (data.ref) ? ` <<< ${data.ref}` : ''
      if (data.url.indexOf('so-welcome') != -1)
        $log(`FIRST   ${uid} > ${data.url}${ref}`.yellow)
      else
        $log(`FIRST   ${uid} > ${data.url}${ref}`.cyan)
      break
    case 'View':
      if (data.url.indexOf('so-welcome') != -1)
        $log(`VIEW    ${uid} > ${data.url}`.yellow)
      else
        $log(`VIEW    ${uid} > ${data.url}`.cyan)
      break
    case 'Login':
      $log(`Login   ${uid} > ${data._id}`.green)
      break
    case 'Signup':
      $log(`Singup  ${uid} > ${data._id}`.green)
      break
    case 'Request':
      $log(`REQUEST ${uid} > ${data.action}`, `https://www.airpair.com/adm/pipeline/${data._id}`.white)
      break
    case 'Order':
      $log(`ORDER   ${uid} > $${data.total}`, `https://www.airpair.com/adm/orders/${data._id}`.white)
      break
    case 'Payment':
      $log(`PAYMENT ${uid} > $${data.total}`, `https://www.airpair.com/adm/orders/${data.orderId}`.white)
      break
    case 'Save':
      if (data.type == 'paymethod')
        $log(`PAYM    ${uid} > ${data.method} ${data.cardType}`.yellow)
      else if (data.type == 'email')
        $log(`EMAILC  ${uid} > ${data.email} << ${data.previous}[${data.previousVerified}] `.green)
      else if (data.type == 'emailVerified')
        $log(`EMAILV  ${uid} > ${data.email}`.green)
      else
        $log(`${action.toUpperCase()}  ${uid} > ${JSON.stringify(data)}`.yellow)
      break
    default:
      $log(`${action.toUpperCase()}  ${uid} > ${JSON.stringify(data)}`.yellow)
  }
}


var doneBackup = null

var analytics = {

  // used for testing
  setCallback(cb) {
    doneBackup = (e, batch) => {
      if (logging) $log('**** analytics done'.yellow)
      doneBackup = null
      cb()
    }
  },


  track(user, sessionID, event, properties, context, done) {
    var payload = util.buildSegmentPayload('track', user, sessionID, {event,properties,context})
    segment.track(payload, done || doneBackup)
    $$log(event,properties,user,sessionID)
  },


  view(user, sessionID, type, name, properties, context, done) {
    var m = { event:'View', integrations: { 'All': false, 'Mixpanel': true }}

    properties.url = properties.path
    var mProperties = _.extend(properties, {type,name})
    if (context.utms) _.extend(mProperties, context.utms)

    var payload = _.extend(m,util.buildSegmentPayload('mp.view', user, sessionID , {properties:mProperties}))
    segment.track(payload, done || doneBackup)

    // write to mongo
    var {objectId,url} = properties
    var {referer} = context
    var campaign = (context.utms) ? util.convertToDumbSegmentCampaignSHIT(context.utms) : undefined
    var userId = (user) ? user._id: null
    viewSvc.create({userId,anonymousId:sessionID,url:properties.path,
      type,objectId,campaign,referer}, (e,r) => {})

    if (!properties.firstRequest) // anoying in the logs
      $$log('View', properties, user, sessionID)
  },


  identify(user, context, identifyEvent, identifyEventProps, done) {
    var traits = util.segmentTraitsFromUser(user)
    var context = null // ?? to populate

    segment.identify(util.buildSegmentPayload('identify', user, null, {traits,context}), () => {
      if (logging) $log('**** identified'.yellow)
      analytics.track(user, null, identifyEvent, identifyEventProps, context, () => {
        if (logging) $log(`**** ${identifyEvent}`.yellow)
        done()
      })
      segment.flush()
    })
  },


  alias(sessionID, user, aliasEvent, done) {
    if (logging) $log('alias', user.email, sessionID, aliasEvent, done)
    var userId = user._id.toString()

    segment.alias({ previousId: sessionID, userId: user.email }, (e, b) => {
      if (logging) $log('**** aliased'.blue)
      analytics.track(user, null, aliasEvent, {_id:user._id,email:user.email,sessionID}, null, () => {
        if (logging) $log(`**** ${aliasEvent}`.blue)
        done()
      })
    })
    segment.flush()

    viewSvc.alias(sessionID, user._id, ()=>{})
  },


  // params:
  // user = most up to date user
  // existingUser = not null if they are logging in, null if it's a singup
  // sessionID = the random Id of their current session
  upsert(user, existingUser, sessionID, cb) {
    var {aliases} = user.cohort
    var noAliases = !aliases || aliases.length == 0

    var properties = {_id:user._id,email:user.email,googleId:user.googleId,sessionID}

    // This is a new user (easy peasy)
    if (noAliases && !existingUser) {
      aliases = [sessionID] // we make the assumption that we're going to alias on the update


      //Add an event to make tracking local vs google signups easier and more consistent
      if (user.googleId)
        analytics.track(user, null, 'Save', {type:'email',email:user.google._json.email}, {sessionID}, ()=>{
          analytics.alias(sessionID, user, 'Signup', () =>
            analytics.track(user, null, 'Login', _.extend(properties,{type:'google'}), {}, () => {}))
        })
      else
        analytics.alias(sessionID, user, 'Signup', () =>
          analytics.track(user, null, 'Login', _.extend(properties,{type:'password'}), {}, () => {}))

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
      analytics.identify(user, context, 'Login', _.extend(properties,{type:'revisit'}), () => {})
      cb(aliases)
    }
  },

}



module.exports = {views:viewSvc,analytics}
