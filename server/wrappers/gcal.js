var auth = null, calendarId = null, google = require('googleapis');


var wrapper = {

  name: 'Calendar',

  init() {
    var cfg = global.config.wrappers.calendar
    var {clientID,clientSecret,refresh_token} = cfg.google
    calendarId = cfg.google.calendarId

    var OAuth2Client = google.auth.OAuth2
    auth = new OAuth2Client(clientID, clientSecret)
    auth.setCredentials({refresh_token})

    this.api = google.calendar('v3')
  },

  //-- user this for dev
  listCalendars(cb) {
    this.api.calendarList.list({ auth }, cb)
  },

  listEvents(cb) {
    this.api.events.list({ auth, calendarId }, function(err, data) {
      if (err) return console.log('An error occured', err)
      console.log('events', data.length)
      cb(data)
    })
  },

  getEvent(eventId, cb) {
    this.api.events.get({ auth, calendarId, eventId }, function(err, event) {
      if (err) return cb(err)
      cb(null, event)
    })
  },


  createEvent(eventName, sendNotifications, start, minutes, attendees, description, admInitials, cb) {

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
      '10': 10, //51b749 bold green
      '11': 11 //dc2127 bold red
    }

    var colorId = undefined
    // if (admInitials) {
      colorId = owner2colorIndex['10']
    // }

    var createData = {
      auth,
      calendarId,
      sendNotifications,
      resource: {
        start:       { dateTime: moment(start).toISOString() },
        end:         { dateTime: moment(start).add(minutes,'minutes').toISOString() },
        summary:     eventName,
        colorId:     colorId,
        attendees:   attendees,
        description: description,
        // TODO: think through user experience and play with reminder settings
        // reminders: {
        //   useDefault: false,
        //   overrides: [
        //     {'method': 'email', 'minutes': 24 * 60},
        //   ],
        // },
      }
    }

    $logIt('wrpr.call', 'Calendar.createEvent:', JSON.stringify(createData))

    if (config.wrappers.calendar.on)
      this.api.events.insert(createData, cb)
    else {
      console.warn('config.wrappers.calendar is off'.red);
      cb(null,{'off':'this is a config.wrappers.calendar.off response',attendees:[{},{}]})
    }
  },

  updateEvent(eventId, sendNotifications, start, minutes, cb) {
    var patchData = {
      auth,
      calendarId,
      sendNotifications,
      eventId,
      resource: {
        start:       { dateTime: moment(start).toISOString() },
        end:         { dateTime: moment(start).add(minutes,'minutes').toISOString() },
      }
    }

    $logIt('wrpr.call', 'Calendar.updateEvent:', JSON.stringify(patchData))

    if (config.wrappers.calendar.on)
      this.api.events.patch(patchData, cb)
    else {
      console.warn('config.wrappers.calendar is off'.red);
      cb(null,{'off':'this is a config.wrappers.calendar.off response',attendees:[{},{}]})
    }
  }

}

module.exports = wrapper;
