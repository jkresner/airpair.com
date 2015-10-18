var logging = false
var mongoose = require('mongoose')
var {ObjectId} = mongoose.Types
var Id = mongoose.Schema.ObjectId

var {mongoUrl} = config.analytics
var analyticsDB = mongoose.createConnection(mongoUrl)
analyticsDB.on('error', e =>
  $log('ERROR on mongo connect to analytics {mongoUrl}:'.red, e))
analyticsDB.once('open', e =>
  $log(`CONNECTED to ${mongoUrl}  (for analytics)`.white))



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

}

var Events = analyticsDB.model('Event', new mongoose.Schema({
  uId:       { type: Id, index: true, sparse: true },
  name:      { type: String, required: true },
  data:      { type: {}, required: false },
})).collection

// cleanup 2015.07.13
// db.views.update({ __v: { $exists:1 } },{ $unset: { __v: "1" } },{ 'multi': true })
// db.views.update({ userId: null },{ $unset: { userId: "1" } },{ 'multi': true })
// db.views.remove({ utc: { $lt:ISODate('2015-08-02 10:00:00.002Z') }, userId:{$exists:0}, campaign: {$exists:0}, referer: {$exists:0}  })
//-- (Don't need utc if already have the _id)
// db.views.update({ utc: { $exists:1 } },{ $unset: { utc: "1" } },{ 'multi': true })
var objectType = ['post','workshop','expert','tag','landing']
var Views = analyticsDB.model('View', new mongoose.Schema({
  userId:       { type: Id, index: true, sparse: true },
  anonymousId:  { type: String, index: true, sparse: true },
  objectId:     { type: Id, required: true },
  type:         { enum: objectType, type: String, required: true, lowercase: true },
  url:          { type: String, required: true },
  campaign:     { type: {} },
  ip:           { type: String },
  ua:           { type: String },
  referer:      { type: String }
})).collection


var viewSvc = {
  getByUserId(userId, cb) {
    if (logging) $log('views.getByUserId'.trace, userId)
    userId = ObjectId(userId.toString())
    Views.find({userId}).sort({_id:-1}).toArray(cb)
  },
  getByAnonymousId(anonymousId, cb) {
    if (logging) $log('views.getByAnonymousId'.trace, anonymousId)
    Views.find({anonymousId}).sort({_id:-1}).toArray(cb)
  },
  alias(anonymousId, userId, cb) {
    if (logging) $log('views.alias'.trace, anonymousId, userId)
    userId = ObjectId(userId.toString())
    Views.update({anonymousId}, {$set:{userId}}, { multi: true }, cb)
  },
  create(o, cb) {
    if (o.userId) o.userId = ObjectId(o.userId.toString())
    if (logging) $log('views.create'.trace, o)
    Views.insert(o, cb)
  }
}


var Impressions = analyticsDB.model('Impression', new mongoose.Schema({
  img:          { type: String, required: true },
  uId:          { type: Id, index: true, sparse: true },
  sId:          { type: String, ref: 'v1Session', index: true, sparse: true },
  ip:           { type: String, required: true },
  ref:          { type: String, required: true },
  ua:           { type: String }
})).collection

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
  var uid = (user) ? user.name.gray || user._id.toString().gray
    : `${sessionID.substring(0,12)}${(ctx&&ctx.ip)?ctx.ip.replace(':ffff',''):''}`.cyan

  uid = uid+"                                     ".substring(0,37-uid.length)

  var ref = ((data.ref) ? (` <<< `.cyan+`${data.ref}`.replace(/\/+$/, '').blue) : '')
    .replace('https://','').replace('http://','').replace('www.','');

  switch (action.toUpperCase()) {
    case 'FIRST':
      $log(uid, `FIRST   > ${data.url}`.cyan+ref)
      break
    case 'VIEW':
      $log(uid, `VIEW    > ${data.url}`.cyan+ref)
      break
    case 'LOGIN':
      $log(uid, `LOGIN   > ${data._id}`.green)
      break
    case 'SIGNUP':
      $log(uid, `SINGUP  > ${data._id}`.green)
      break
    case 'REQUEST':
      $log(uid, `REQUEST > ${data.action}`, `http://adm.airpa.ir/r/${data._id}`.white)
      break
    case 'ORDER':
      $log(uid, `ORDER  > $${data.total}`, `http://adm.airpa.ir/o/${data._id}`.white)
      break
    case 'PAYMENT':
      $log(uid, `PAYMENT > $${data.total}`, `http://adm.airpa.ir/o/${data.orderId}`.white)
      break
    case 'SAVE':
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


  echo(user, sessionID, event, properties, context, done) {
    $$log(event,properties,user,sessionID, context)
    done = done || (doneBackup || function() {})
    done()
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


  event(name, user, data, context, done) {
    // $log('event'.cyan, name, data, user)
    $$log(name, data, user, null, context)
    var o = { uId: ObjectId(user._id.toString()), name }
    if (data && data.constructor == Object)
      o.data = data

    var cb = done || (doneBackup || function() {})
    Events.insert(o, cb)
  },


  alias(user, sessionID, eventName, data, done) {
    if (logging) $log('alias', user.email, sessionID, done)

    analytics.event(eventName, user, data)
    viewSvc.alias(sessionID, user._id, ()=>{})
    impressionSvc.alias(sessionID, user._id, ()=>{})

    var cb = done || (doneBackup || function() {})
    cb()
  },


  // params:
  // user = most up to date user
  // existingUser = not null if they are logging in, null if it's a singup
  // sessionID = the random Id of their current session
  upsert(user, existingUser, sessionID, cb) {
    throw "No way"
    // var {aliases} = user.cohort
    // var noAliases = !aliases || aliases.length == 0

    // var properties = {_id:user._id,email:user.email,googleId:user.googleId,sessionID}

    // // This is a new user (easy peasy)
    // if (noAliases && !existingUser) {
    //   aliases = [sessionID] // we make the assumption that we're going to alias on the update


    //   //Add an event to make tracking local vs google signups easier and more consistent
    //   if (user.googleId)
    //     analytics.track(user, null, 'Save', {type:'email',email:user.google._json.email}, {sessionID}, ()=>{
    //       analytics.alias(sessionID, user, 'Signup', () =>
    //         analytics.track(user, null, 'Login', _.extend(properties,{type:'google'}), {}, () => {}))
    //     })
    //   else
    //     analytics.alias(sessionID, user, 'Signup', () =>
    //       analytics.track(user, null, 'Login', _.extend(properties,{type:'password'}), {}, () => {}))

    //   cb(aliases)
    // }
    // else
    // {
    //   aliases = aliases || []

    //   //-- This is an existing user from a new device / browser
    //   if ( ! _.contains(aliases, sessionID) ) {
    //     if (logging) $log('newAnonSessionID', sessionID)
    //     aliases.push(sessionID)
    //   }

    //   //-- but update all the anonymous views to the userId
    //   viewSvc.alias(sessionID, user._id, ()=>{})
    //   impressionSvc.alias(sessionID, user._id, ()=>{})

    //   var context = {sessionID} // ??
    //   analytics.identify(user, context, 'Login', _.extend(properties,{type:'revisit'}), () => {})
    //   cb(aliases)
    // }
  },

}



module.exports = {views:viewSvc,analytics}
