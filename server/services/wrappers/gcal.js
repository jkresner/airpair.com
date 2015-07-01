
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

  getEvent(eventId, cb) {
    wrapper.api.events.get({ auth, calendarId, eventId }, function(err, event) {
      if (err) return cb(err)
      cb(null, event)
    })
  },

  createEvent(eventName, sendNotifications, start, minutes, attendees, description, admInitials, cb) {
    if (!config.calendar.on) {
      console.warn('config.calendar is off'.red);
      return cb()
    }

    var colorId = undefined
    if (admInitials) {
      colorId = owner2colorIndex[admInitials]
    }

    var event = {
      start:       { dateTime: moment(start).toISOString() },
      end:         { dateTime: moment(start).add(minutes,'minutes').toISOString() },
      summary:     eventName,
      colorId:     colorId,
      attendees:   attendees,
      description: description,
      reminders: {
        useDefault: false,
        overrides: [
          {'method': 'email', 'minutes': 24 * 60},
        ],
      },
    }

    var data = {
      auth: auth,
      calendarId: calendarId,
      sendNotifications: sendNotifications,
      resource: event,
    }

    if (logging) $log('createEvent:'.yellow, event)

    wrapper.api.events.insert(data, function(err, result) {
      if (err) return cb(err)
      cb(null, result)
    })
  },

  updateEventDateTimes(eventId, start, end, cb) {
    if (!config.calendar.on) return cb()

    var params = {
      start: {dateTime: start.toISOString()},
      end:   {dateTime: end.toISOString()},
    }

    var data = {
      auth: auth,
      calendarId: calendarId,
      eventId: eventId,
      resource: params,
    }

    wrapper.api.events.patch(data, function(err2, event2) {
      if (err2) return cb(err2)
      cb(null, event2)
    })
  }

}

module.exports = wrapper;
