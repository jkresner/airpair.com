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

module.exports = {

  // used for testing
  setCallback: (cb) => {
    doneBackup = (e, batch) => { 
      $log('**** analytics done'.yellow)
      doneBackup = null
      cb() 
    }
  },


  identify: (userId, anonymousId, traits, context, done) => {
    if (logging) $log('identify', userId,anonymousId,traits,context)
    segment.identify(buildPayload(userId, anonymousId, {traits,context}),
      done || doneBackup)
  },


  track: (userId, anonymousId, event, properties, context, done) => {
    if (logging) $log('track', userId, anonymousId, event, properties, context)    
    segment.track(buildPayload(userId,anonymousId,{event,properties,context}), 
      done || doneBackup)
  },


  view: (userId, anonymousId, type, name, properties, context, done) => {
    if (logging) $log('view', userId, anonymousId, type, name, properties, context)
    
    segment.page(buildPayload(userId,anonymousId,{category:type,name,properties,context}))
    
    var m = { event:'View', integrations: { 'All': false, 'Mixpanel': true }} 
    var mProperties = _.extend(properties, {type,name})
    var mPayload = _.extend(m,buildPayload(userId,anonymousId,{properties:mProperties,context})) 

    $log('mPayload', mPayload)
    segment.track(mPayload, 
      done || doneBackup)
    
    if (context.campaign) segment.identify(buildPayload(userId, anonymousId, {context}))

    // write to mongo    
    var {objectId,url} = properties
    var {referer,campaign} = context
    viewSvc.create({userId,anonymousId,url,type,objectId,campaign,referer}, null)
  },


  alias: (anonymousId, createdAt, user, aliasEvent, done) => {
    if (logging) $log('alias', anonymousId, createdAt.format(), user._id, aliasEvent, done)
    var userId = user._id.toString()

    var traits = { 
      name: user.name, 
      email: user.email, 
      lastSeen: new Date(), 
      createdAt 
    }

    segment.alias({ previousId: anonymousId, userId: userId }, (e, b) => {
      $log('**** aliased'.yellow)
      segment.identify({userId: userId, traits: traits}, (ee, bb) => {
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

    viewSvc.alias(anonymousId, user._id, null)
  }
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




// -- Revenue 
// The amount of revenue an event resulted in. This should be a decimal value in dollars, so a shirt worth $19.99 would result in a revenue of 19.99.
// -- Value 
// An abstract “value” to associate with an event. This is typically used in situations where the event doesn’t generate real-dollar revenue, but has an intrinsic value to a marketing team, like newsletter signups.