//hacked from https://github.com/google/google-api-nodejs-client/blob/master/examples/oauth2.js

/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function(gulp, config, options, callback) {

 return function() {
  console.log("********************************************************************************")
  console.log("Important: Be sure to deauthorize 'AirPair Dev' before continuing");
  console.log("If the app is already authorized, no refresh token will be received");
  console.log("You can do that here: https://security.google.com/settings/security/permissions");
  console.log("********************************************************************************")

  var dev_config = {
    auth: {
      google: {
        clientID: '1019727294613-rjf83l9dl3rqb5courtokvdadaj2dlk5.apps.googleusercontent.com',
        clientSecret: 'Kd6ceFORVbABH7p5UbKURexZ'
      }
    }
  }

  var google = require('googleapis');
  var OAuth2Client = google.auth.OAuth2;
  var plus = google.plus('v1');

  // Client ID and client secret are available at
  // https://code.google.com/apis/console
  var config = dev_config // change to prod config if you need to genearte a prod refresh_token
  var CLIENT_ID = config.auth.google.clientID;
  var CLIENT_SECRET = config.auth.google.clientSecret;
  var REDIRECT_URL = 'http://localhost:3333/dev/setup/google/callback';

  var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
  var refreshToken = null;

  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/youtube' //can be a space-delimited string or an array of scopes
  });

  var readline = require('readline');
  var rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  setTimeout(function(){
    console.log("");
    console.log("********************************************************************************");
    console.log('Visit the url: ', url.white);
    console.log("");
    rl.question('Then enter the code in your browser URL (e.g. 4/gUhj...) here: ', function(code) {
      // request access token
      oauth2Client.getToken(code, function(err, tokens) {

        if (err) console.error("Error retrieving tokens", err);
        refreshToken = tokens.refresh_token;
        console.log("Your refresh token is ", refreshToken);
        oauth2Client.setCredentials(tokens);

        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err2, profile) {
          if (err2) return console.log('An error occured', err2);

          var emailAddress = null;
          profile.emails.forEach(function(entry){
            if (entry.type == "account"){
              emailAddress = entry.value;
            }
          });
          console.log("Add the following line to your ~/.bashrc:");
          console.log("export AUTH_GOOGLE_REFRESH_TOKEN='" + emailAddress + ":" + refreshToken + "'");
          callback()
        });
      });
    });
  }, 500);

  }
}
