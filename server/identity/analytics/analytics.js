var Analytics = require('analytics-node')
var setDevSettings = (config.env == 'dev' || config.env == 'test')
var segmentOpts = setDevSettings ? { flushAt: 1 } : {}
var segment = new Analytics(config.analytics.segmentio.writekey, segmentOpts)
var logging = true
var viewSvc = require('../../services/views')


var doneBackup = null

//-- don't' want to send userId / anonymousId on the wire if null
var buildPayload = (userId, anonymousId, payload) => {
  if (userId) payload.userId = userId.toString()
  if (anonymousId) payload.anonymousId = anonymousId
  return payload;
}

var traitsFromUser = (user) =>
{
  var traits = { 
    
    name: user.name, 
    email: user.email, 
    // lastSeen: new Date(),  //-- leave this up to the client as it doesn't work via segment
    createdAt: user.cohort.engagement.visit_first  
  }
  if (user.username) traits.username = user.username

  // isExpert / isCustomer    

  return traits;
}

var track = (userId, anonymousId, event, properties, context, done) => {
  if (logging) $log('track', userId, anonymousId, event, properties, context)    
  segment.track(buildPayload(userId,anonymousId,{event,properties,context}), 
    done || doneBackup)
}


var view = (userId, anonymousId, type, name, properties, context, done) => {
  // if (logging) $log('view', userId, anonymousId, type, name, properties, context)
  //category:type,name,

  // var p = buildPayload(userId,anonymousId,{context})
  // p.properties = {
  //   title: properties.title,
  //   url: properties.url,
  //   path: properties.path
  // }

  // $log('p', config.analytics.segmentio.writekey, p)
  // segment.page(p)

  properties.url = properties.path
  var m = { event:'View', integrations: { 'All': false, 'Mixpanel': true }} 
  var mProperties = _.extend(properties, {type,name})
  var mPayload = _.extend(m,buildPayload(userId,anonymousId,{properties:mProperties,context})) 

  // $log('mPayload', mPayload)
  segment.track(mPayload, done || doneBackup)
  
  // if (context.campaign) segment.identify(buildPayload(userId, anonymousId, {context}))

  // write to mongo    
  var {objectId,url} = properties
  var {referer,campaign} = context
  viewSvc.create({userId,anonymousId,url:properties.path,type,objectId,campaign,referer}, (e,r)=>{})
}


var identify = (user, context, identifyEvent, done) => {
  if (logging) $log('identify', user._id, context, identifyEvent)
  
  var traits = traitsFromUser(user)

  segment.identify(buildPayload(user._id, null, {traits,context}))
  segment.track({ userId: user._id.toString(), event: identifyEvent }, done || doneBackup)
}


var alias = (anonymousId, user, aliasEvent, done) => {
  if (logging) $log('alias', anonymousId, user._id, aliasEvent, done)
  var userId = user._id.toString()

  segment.alias({ previousId: anonymousId, userId: userId }, (e, b) => {
    $log('**** aliased'.yellow)
    segment.identify({userId: userId, traits: traitsFromUser(user) }, (ee, bb) => {
      $log('**** identified'.yellow)
      segment.track({
        userId: userId,
        event: aliasEvent
      }, (eee, bbb) => {
        $log('**** signedup'.yellow)
        done()
      })
      segment.flush()
    })
  })
  segment.flush()

  viewSvc.alias(anonymousId, user._id, ()=>{})
}

var aliasMigrateV0 = (sessionID, user, done) => {
  done = done || doneBackup
  var userId = user._id.toString()
  var googleEmail = user.google._json.email
  segment.alias({ previousId: sessionID, userId: googleEmail }, (e1, b1) => { 
    $log(`**** aliase migrate ${sessionID} ${googleEmail}`.yellow)
    //-- do I need to call identify on the server?
    segment.track({ userId: googleEmail, event: 'Migrate Alias P1', properties: {sessionID,userId,googleEmail} }, (e2, b2) => {
      alias(googleEmail, user, 'Migrate Alias P2', done)
      segment.identify( { userId:sessionID, traits: { name: `${user.name} (anon)`, userId: user._id.toString() } } )
    })
  })  
  segment.flush()
  viewSvc.alias(sessionID, userId, ()=>{})    
}

module.exports = {

  // used for testing
  setCallback: (cb) => {
    doneBackup = (e, batch) => { 
      $log('**** analytics done'.yellow)
      doneBackup = null
      cb() 
    }
  },

  upsert: (user, existingUser, sessionID, cb) =>
  {
    var {aliases} = user.cohort
    var noAliases = !aliases || aliases.length == 0

    // This is a new user (easy peasy)
    if (noAliases && !existingUser) {
      aliases = [sessionID] // we make the assumption that we're going to alias on the update
      analytics.alias(sessionID, user, 'Signup', () => cb(aliases) )
    }
    //-- For an existing v0 user, we need to alias their google._json.email to their userId    
    else if (noAliases && existingUser.google)
    {
      if (logging) $log('noAliases.existingUser', [existingUser.google._json.email])
      aliases = [existingUser.google._json.email]
      analytics.alias(existingUser.google._json.email, user, 'Login Migrate', () => cb(aliases))
      viewSvc.alias(sessionID, user._id, ()=>{})   //-- but update all the anonymous views to the userId
    }
    else
    {
      //-- This is an existing user from a new device / browser
      if ( ! _.contains(aliases, sessionID) ) {
        if (logging) $log('newAnonSessionID', sessionID)
        aliases.push(sessionID)
        analytics.alias(sessionID, user, 'Login', () => cb(aliases))
      }
      else
      {
        if (logging) $log('justAloging')
        var context = {sessionID} // ??
        analytics.identify(user, context, 'Login', () => cb(aliases))
      }
    }
  },

  track, 
  view, 
  identify, 
  alias

}

//-- Pairing with segment chris
//-- (1) If running both client and server - web hook consistent.
//-- (2) identify on the server
//-- (3) Alias from email to id will loose anon chain
//-- (4) calling page after identify
  //-- do you want proxy
  //-- by identify, some integration will pick traits, and context

//-------------------
// anon , sessionID
// 1) userId: sessionID
//  --
//  alias (sessionID, userId)
// vs

// 2) anonymousId: sessionID
//  --
//  alias (sessionID, userId) // when they sign up

// 3) userId: emailAdresss

//  alias (mixpanelId, emailAdresss) //-- in the past (previous app)
//  alias (emailAdresss, userId) // app v0 to app v1 (for old users)

 // anonymousId: sessionID
 // --
 // alias (sessionID, userId)
//-------------------




// https://segment.io/docs/api/tracking/track/
// -- app
// A dictionary of information about the current application, containing name, version and build. This is collected automatically from our mobile libraries when possible.
// -- campaign
// A dictionary of information about the campaign that resulted in the API call, containing name, source, medium, term and content. This maps directly to the common UTM campaign parameters.
// -- device
// A dictionary of information about the device, containing id, manufacturer, model, name, type and version.
// -- ip
// The current user’s IP address.
// -- library
// A dictionary of information about the library making the requests to the API, containing name and version.
// -- locale
// The locale string for the current user, for example en-US.
// -- location
// A dictionary of information about the user’s current location, containing city, country, latitude, longitude, region and speed.
// -- network
// A dictionary of information about the current network connection, containing bluetooth, carrier, cellular and wifi.
// -- os
// A dictionary of information about the operating system, containing name and version.
// -- referrer
// A dictionary of information about the way the user was referred to the website or app, containing type, name, url and link.
// -- screen
// A dictionary of information about the device’s screen, containing density, height and width.
// -- traits
// A dictionary of traits of the current user. This is useful in cases where you need to track an event, but also associate information from a previous identify call.
// -- userAgent
// The user agent of the device making the request.
