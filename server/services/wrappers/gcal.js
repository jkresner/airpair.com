var google = require('googleapis')
var OAuth2Client = google.auth.OAuth2
var gcal = google.calendar('v3')
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


var cfg = config.calendar.google
var calendarId = cfg.calendarId
var auth = new OAuth2Client(cfg.clientId, cfg.clientSecret, cfg.redirectUrl)
auth.setCredentials({ access_token: cfg.access_token })


// var readline = require('readline');
// var rl = readline.createInterface({ input: process.stdin, output: process.stdout })

// function getAccessToken(oauth2Client, callback) {
//   // generate consent page url
//   var url = auth.generateAuthUrl({
//     access_type: 'offline', // will return a refresh token
//     scope: 'https://www.googleapis.com/auth/calendar'
//   });

//   console.log('Visit the url: ', url);
//   rl.question('Enter the code here:', function(code) {
//     // request access token
//     auth.getToken(code, function(err, tokens) {
//       // set tokens to the client
//       // TODO: tokens should be set by OAuth2 client.
//       $log('tokens'.white, tokens)
//       auth.setCredentials(tokens);
//       callback();
//     });
//   });
// }

// getAccessToken(auth, function() {
// })


var calFns = {
  // listCalendars(cb) {
  //   gcal.calendarList.list({ userId: 'me', auth }, function(err, data) {
  //     if (err) return console.log('An error occured', err)
  //     console.log('data', data)
  //     cb(data)
  //   })
  // },
  listEvents(cb) {
    gcal.events.list({ auth, calendarId }, function(err, data) {
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
    gcal.events.insert({ auth, calendarId, sendNotifications, resource }, function(err, data) {
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

module.exports = calFns;
