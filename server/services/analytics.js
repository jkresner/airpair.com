import Svc from '../services/_service'
import Landing from '../models/landing'
var logging = false
var {ObjectId} = require('mongoose').Types


var util = {

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

  // segmentTraitsFromUser(user) {
  //   var traits = {
  //     name: user.name,
  //     email: user.email,
  //     // lastSeen: new Date(),  //-- leave this up to the client as it doesn't work via segment
  //     createdAt: user.cohort.engagement.visit_first,
  //     paymentInfoSet: user.primaryPayMethodId != null
  //   }
  //   if (user.username) traits.username = user.username
  //   // isExpert / isCustomer

  //   return traits;
  // }

}

var ViewsCollection = require('../models/view').collection
var viewSvc = {

  getByUserId(userId, cb)
  {
    if (logging) $log('views.getByUserId'.trace, userId)
    userId = ObjectId(userId.toString())
    ViewsCollection.find({userId}).sort({_id:-1}).toArray(cb)
  },

  getByAnonymousId(anonymousId, cb)
  {
    if (logging) $log('views.getByAnonymousId'.trace, anonymousId)
    ViewsCollection.find({anonymousId}).sort({_id:-1}).toArray(cb)
  },

  alias(anonymousId, userId, cb)
  {
    if (logging) $log('views.alias'.trace, anonymousId, userId)
    userId = ObjectId(userId.toString())
    ViewsCollection.update({anonymousId}, {$set:{userId}}, { multi: true }, cb)
  },

  create(o, cb)
  {
    if (o.userId) o.userId = ObjectId(o.userId.toString())
    if (logging) $log('views.create'.trace, o)
    ViewsCollection.insert(o, cb)
  }

}


var Impressions = require('../models/impression').collection
var impressionSvc = {
  alias(sId, uId, cb) {
    uId = ObjectId(uId.toString())
    Impressions.update({sId}, {$set:{uId}}, { multi: true }, cb)
  },
  create(o, cb) {
    if (o.uId) o.uId = ObjectId(o.uId.toString())
    Impressions.insert(o, cb)
  }
}


function $$log(action, data, user, sessionID, ctx) {
  //-- TODO think about adding persistence
  var uid = (user) ? user.email.gray || user._id.gray
    : `${sessionID.substring(0,12)}${(ctx&&ctx.ip)?ctx.ip.replace(':ffff',''):''}`.cyan

  uid = uid+"                                     ".substring(0,37-uid.length)

  switch (action) {
    case 'First':
      var ref = (data.ref) ? ` <<< ${data.ref}` : ''
      if (data.url.indexOf('so-welcome') != -1)
        $log(uid, `FIRST   > ${data.url}${ref}`.yellow)
      else
        $log(uid, `FIRST   > ${data.url}${ref}`.cyan)
      break
    case 'View':
      if (data.url.indexOf('so-welcome') != -1)
        $log(uid, `VIEW    > ${data.url}`.yellow)
      else
        $log(uid, `VIEW    > ${data.url}`.cyan)
      break
    case 'Login':
      $log(uid, `LOGIN   > ${data._id}`.green)
      break
    case 'Signup':
      $log(uid, `SINGUP  > ${data._id}`.green)
      break
    case 'Request':
      $log(uid, `REQUEST > ${data.action}`, `http://adm.airpa.ir/r/${data._id}`.white)
      break
    case 'Order':
      $log(uid, `ORDER  > $${data.total}`, `http://adm.airpa.ir/o/${data._id}`.white)
      break
    case 'Payment':
      $log(uid, `PAYMENT > $${data.total}`, `http://adm.airpa.ir/o/${data.orderId}`.white)
      break
    case 'Save':
      if (data.type == 'paymethod')
        $log(uid, `PAYM    > ${data.method} ${data.cardType} SAVED!!!`.yellow)
      else if (data.type == 'email')
        $log(uid, `EMAILC  > ${data.email} << ${data.previous}[${data.previousVerified}] `.green)
      else if (data.type == 'emailVerified')
        $log(uid, `EMAILV  > ${data.email}`.green)
      else
        $log(uid, `${action.toUpperCase()}  > ${JSON.stringify(data)}`.yellow)
      break
    default:
      $log(uid, `${action.toUpperCase()} > ${JSON.stringify(data)}`.yellow)
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


  impression(user, sessionID, img, context, done) {
    var d = {img,ip:context.ip}
    var userId = (user) ? user._id: null
    if (userId) d.uId = userId
    else d.sId = sessionID
    if (context.referer) d.ref = context.referer
    if (context.userAgent) d.ua = context.userAgent
    impressionSvc.create(d, () => {})
    done = done || (doneBackup || function() {})
    done()
  },


  track(user, sessionID, event, properties, context, done) {
    // var payload = util.buildSegmentPayload('track', user, sessionID, {event,properties,context})
    // segment.track(payload, done || doneBackup)
    $$log(event,properties,user,sessionID, context)
    done = done || (doneBackup || function() {})
    done()
  },


  view(user, sessionID, type, name, properties, context, done) {
    var m = { event:'View', integrations: { 'All': false, 'Mixpanel': true }}

    properties.url = properties.path

    // write to mongo
    var {objectId,url} = properties
    var {referer} = context
    var campaign = (context.utms) ? util.convertToDumbSegmentCampaignSHIT(context.utms) : undefined
    var userId = (user) ? user._id: null

    var d = {url:properties.path,type,objectId,ip:context.ip}
    if (userId) d.userId = userId
    else d.anonymousId = sessionID
    if (campaign) d.campaign = campaign
    if (referer) d.referer = referer
    if (context.userAgent) d.ua = context.userAgent

    viewSvc.create(d, () => {})

    if (!properties.firstRequest) // anoying in the logs
      $$log('View', properties, user, sessionID, context)

    done = done || (doneBackup || function() {})
    done()
  },


  identify(user, context, identifyEvent, identifyEventProps, done) {
    // var traits = util.segmentTraitsFromUser(user)
    // var context = null // ?? to populate

    done()
    // segment.identify(util.buildSegmentPayload('identify', user, null, {traits,context}), () => {
    //   if (logging) $log('**** identified'.yellow)
    //   analytics.track(user, null, identifyEvent, identifyEventProps, context, () => {
    //     if (logging) $log(`**** ${identifyEvent}`.yellow)
    //     done()
    //   })
    //   segment.flush()
    // })
  },


  alias(sessionID, user, aliasEvent, done) {
    if (logging) $log('alias', user.email, sessionID, aliasEvent, done)
    var userId = user._id.toString()

    // segment.alias({ previousId: sessionID, userId: user.email }, (e, b) => {
    //   if (logging) $log('**** aliased'.blue)
    //   analytics.track(user, null, aliasEvent, {_id:user._id,email:user.email,sessionID}, null, () => {
    //     if (logging) $log(`**** ${aliasEvent}`.blue)
    //     done()
    //   })
    // })
    // segment.flush()

    viewSvc.alias(sessionID, user._id, ()=>{})


    done()
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
      impressionSvc.alias(sessionID, user._id, ()=>{})

      var context = {sessionID} // ??
      analytics.identify(user, context, 'Login', _.extend(properties,{type:'revisit'}), () => {})
      cb(aliases)
    }
  },

}



module.exports = {views:viewSvc,analytics}
