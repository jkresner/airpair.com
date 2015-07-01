
var logging = true

// https://developers.google.com/google-apps/calendar/v3/reference/colors/get
var owner2colorIndex = {
  '0': undefined, // default color for the calendar, #9A9CFF
  '1': 1,  //a4bdfc blue
  '2': 2,  //7ae7bf green
  '3': 3,  //dbadff purple
  '4': 4,  //ff887c red
  '5': 5,  //fbd75b yellow
  jk: 6,  //ffb878 orange
  '7': 7,  //46d6db turqoise
  '8': 8,  //e1e1e1 gray
  '9': 9,  //5484ed bold blue
  pg: 10, //51b749 bold green
  '11': 11 //dc2127 bold red
}

var {calendarId,owner,ownerRefreshToken} = config.calendar.google
var auth  = null

var wrapper = {

  init() {
    var google = require('googleapis')
    var OAuth2Client = google.auth.OAuth2
    auth = new OAuth2Client(config.auth.google.clientID, config.auth.google.clientSecret)
    auth.setCredentials({ refresh_token: ownerRefreshToken })
    wrapper.api = google.calendar('v3')
  },

  //-- user this for dev
  listCalendars(cb) {
    wrapper.api.calendarList.list({ auth }, cb)
  },

  listEvents(cb) {
    wrapper.api.events.list({ auth, calendarId }, function(err, data) {
      if (err) return console.log('An error occured', err)
      console.log('events', data.length)
      cb(data)
    })
  },

  createEvent(eventName, sendNotifications, start, minutes, attendees, description, admInitials, cb) {
    if (!config.calendar.on) return cb()
    var end = { dateTime: moment(start).add(minutes,'minutes').toISOString() } //.substring(0,16)+'-08:00' }
    var start = { dateTime: start.toISOString() } //.substring(0,16)+'-08:00' }

    if (logging) $log('createEvent', start, end, attendees, eventName, admInitials, description)
    var summary = eventName
    var colorId = (admInitials) ? owner2colorIndex[admInitials] : undefined
    var hangoutLink = null
    var resource = { summary, start, end, attendees, description, colorId, hangoutLink }

    $log('insert', { auth, calendarId, sendNotifications, resource })
    wrapper.api.events.insert({ auth, calendarId, sendNotifications, resource }, function(err, data) {
      if (err) return cb(err)
      cb(null, data)
    })
  },
  // updateEvent(event, cb) {
  //   var eventId = event.id
  //   gcal.events.patch({ auth, calendarId, eventId, params: event }, function(err, data) {
  //     if (err) return console.log('An error occured', err)
  //     console.log('events', data.length)
  //     cb(data)
  //   })
  // }
}

module.exports = wrapper;
