module.exports = {

  cloudflare_ok: {
    ok: true,
    result: []
  },

  cloudflare_block_ip_ok: {
    ok: true,
    result: {
      id: '38f0c88b18d079d3f6484f91fd0b5f8f',
      mode: 'block',
      allowed_modes: [ 'block', 'challenge', 'whitelist', 'js_challenge' ],
      status: 'active',
      notes: 'issue:575f3c3f246b972f9d9272f4\Not Found\n::ffff:127.0.0.1\nMozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0',
      configuration: { value: '0000:0000:0000:0000:0000:0000:ffff:127.', target: 'ip' },
      created_on: '2016-06-13T23:01:22.488490Z',
      modified_on: '2016-06-13T23:01:23.135805Z' }
  },

  localization_melbourne : {
    "location" : "Melbourne VIC, Australia",
    "locationData" : {
      "coordinates" : { "lng" : 144.9632306999999, "lat" : -37.8142155 },
      "formatted_address": "Melbourne VIC, Australia",
      "address_components" : [
        {
          "long_name" : "Melbourne",
          "short_name" : "Melbourne",
          "types" : ["locality","political" ]
        },
        {
          "long_name" : "Victoria",
          "short_name" : "VIC",
          "types" : [ "administrative_area_level_1", "political" ]
        },
        {
          "long_name" : "Australia",
          "short_name" : "AU",
          "types" : [ "country", "political" ]
        }
      ],
      "geometry" : {
          "location" : { "k" : -37.8142155, "D" : 144.9632306999999 },
          "viewport" : {
              "Ca" : { "k" : -37.8546255, "j" : -37.7994893 },
              "va" : { "j" : 144.9514222, "k" : 144.9890617999999 }
          }
      },
      "name" : "Melbourne"
    },
    "timezone" : "Australian Eastern Standard Time",
    "timezoneData" : {
        "dstOffset" : 0,
        "rawOffset" : 36000,
        "status" : "OK",
        "timeZoneId" : "Australia/Hobart",
        "timeZoneName" : "Australian Eastern Standard Time"
    }
  },


  madridLocationData: {
    "coordinates" : { "lng" :40.4167754, "lat" :-3.7037901999999576 },
    "formatted_address":"Madrid, Madrid, Spain",
    "address_components":[
      {"long_name":"Madrid","short_name":"Madrid","types":["locality","political"]},
      {"long_name":"Madrid","short_name":"Madrid","types":["administrative_area_level_4","political"]},
      {"long_name":"Área Metropolitalitana y Corredor del Henares","short_name":"Área Metropolitalitana y Corredor del Henares","types":["administrative_area_level_3","political"]},
      {"long_name":"Madrid","short_name":"M","types":["administrative_area_level_2","political"]},
      {"long_name":"Community of Madrid","short_name":"Community of Madrid","types":["administrative_area_level_1","political"]},
      {"long_name":"Spain","short_name":"ES","types":["country","political"]}
    ],
    "geometry": {
      "location":{"H":40.4167754,"L":-3.7037901999999576},
      "viewport":{
        "Ka":{"H":40.3120639,"j":40.5638447},
        "Ga":{"j":-3.834161799999947,"H":-3.52491150000003}
      }
    },
    "name":"Madrid",
  },


  timezone_melbourne : { options:
     { location: '-37.8142155,144.9632306999999',
       timestamp: 1402629305,
       language: 'en',
       key: 'AIzaSyANXimipzhyZ-Mp2_RrzjKKp4nXq5VpMGk' },
    raw_response:
     { dstOffset: 0,
       rawOffset: 36000,
       status: 'OK',
       timeZoneId: 'Australia/Hobart',
       timeZoneName: 'Australian Eastern Standard Time' },
    local_timestamp: 1402665305
  },

  stackoverflow_wiki_nofoundtag: {
    items: [],
    has_more: false,
    quota_max: 300,
    quota_remaining: 275
  },

  //https://api.stackexchange.com/tags/ember.js/wikis?site=stackoverflow
  stackoverflow_wiki_ember: {
    ok: true,
    body: {
      items: [
      {
        excerpt_last_edit_date: 1413395402,
        body_last_edit_date: 1420351795,
        excerpt: 'Ember.js is an advanced front end MVC application framework written in JavaScript and distributed under an open source license.  Click learn more... and use the preconfigured templates from the tag wiki in order to create better questions.\r\n',
        tag_name: 'ember.js'
      }
    ],
    has_more: false,
    quota_max: 300,
    quota_remaining: 283
    }
  },


  stackoverflow_wiki_ios8: {
    ok: true,
    body: {
      items: [
      {
        excerpt_last_edit_date: 1411277797, body_last_edit_date: 1408087005,
        excerpt: 'iOS 8 is the eighth version of Apple&#39;s iOS mobile operating system. It was announced at Apple&#39;s Worldwide Developers Conference (WWDC) on June 2, 2014 and was later released to the public on September 17, 2014.  See https://www.apple.com/ios/ios8/developer/ for more information.',
        tag_name: 'ios8'
      }
      ],
      has_more: false, quota_max: 300, quota_remaining: 270
    }
  },

  //https://api.stackexchange.com/tags/ember.js/info?site=stackoverflow
  stackoverflow_info_ember: {
    ok: true,
    body: {
    "items":[
      {
        "has_synonyms":true,
        "is_moderator_only":false,
        "is_required":false,
        "count":14533,
        "name":"ember.js"
      }
    ],
    "has_more":false,
    "quota_max":300,
    "quota_remaining":281
    }
  },

  //https://api.stackexchange.com/tags/ember.js/synonyms?site=stackoverflow
  stackoverflow_synonyms_ember: {
    "items":[
      {"creation_date":1344434850,"last_applied_date":1427235401,"applied_count":546,"to_tag":"ember.js","from_tag":"emberjs"},
      {"creation_date":1338657033,"last_applied_date":1427377381,"applied_count":827,"to_tag":"ember.js","from_tag":"ember"}
    ],
    "has_more":false,
    "quota_max":300,
    "quota_remaining":280
  },

  //https://api.stackexchange.com/tags/ember.js/synonyms?site=stackoverflow
  stackoverflow_related_ember: {
    "items":[
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":4033,"name":"javascript"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":3404,"name":"ember-data"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":1103,"name":"handlebars.js"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":948,"name":"ember-cli"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":557,"name":"ruby-on-rails"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":549,"name":"jquery"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":298,"name":"ember-router"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":276,"name":"json"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":249,"name":"handlebars"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":185,"name":"node.js"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":176,"name":"coffeescript"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":166,"name":"model-view-controller"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":147,"name":"rest"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":147,"name":"html"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":135,"name":"templates"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":134,"name":"routes"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":134,"name":"model"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":130,"name":"ember-simple-auth"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":127,"name":"ajax"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":121,"name":"twitter-bootstrap"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":119,"name":"controller"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":116,"name":"ember-old-router"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":105,"name":"routing"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":103,"name":"qunit"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":101,"name":"ember-app-kit"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":99,"name":"view"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":98,"name":"angularjs"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":92,"name":"css"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":90,"name":"ember-model"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":75,"name":"authentication"}
    ],
    "has_more":true,"quota_max":300,"quota_remaining":279
  },

  slack_team_info:  {
    id: 'T06U2HQQ3',
    name: 'AirPair Test'
  },

  slack_me_info: {
    url: 'https://airpairtest.slack.com/',
    team: 'AirPair Test',
    user: 'pairbot',
    team_id: 'T06U2HQQ3',
    user_id: 'U06UBBT9V'
  },

  slack_users_list: [
    {
      "id":"U06UCSHL0",
      "name":"customer-support",
      "deleted":false,
      "real_name":"{} Customer Support",
      "tz_label":"Pacific Daylight Time",
      "profile":{"email":"support@airpair.com"}
    },
    {"id":"U06UBH472","name":"experts","deleted":false,"real_name":"Experts AirPair","tz_label":"Pacific Daylight Time","profile":{"email":"experts@airpair.com"}},{"id":"U06U2QUVB","name":"gregorynicholas","deleted":false,"real_name":"gregorynicholas","tz_label":"Pacific Daylight Time","profile":{"email":"nicholas.g.gregory@gmail.com"}},{"id":"U06U2HQQK","name":"jk","deleted":false,"real_name":"{} Jonathon Kresner","tz_label":"Pacific Daylight Time","profile":{"email":"jk@airpair.com"}},{"id":"U06UCKSSF","name":"jkgmail","deleted":false,"real_name":"Jonathon Gmail","tz_label":"Pacific Daylight Time","profile":{"email":"jkresner@gmail.com"}},{"id":"U06UBBT9V","name":"pairbot","deleted":false,"real_name":"","tz_label":"Pacific Daylight Time"}
  ],

  slack_channels_list: [
    {
      "id":"C06U2H1GC",
      "name":"airpair-channel",
      "is_channel":true,
      "created":1435494439,
      "creator":"U06U2HQQK",
      "is_archived":false,
      "is_general":true,
      "is_member":true,
      "members":["U06U2HQQK","U06U2QUVB","U06UBBT9V","U06UBH472","U06UCKSSF","U06UCSHL0"],"topic":{"value":"Company-wide announcements and work-based matters","creator":"","last_set":0},
      "purpose":{"value":"This channel is for team-wide communication and announcements. All team members are in this channel.","creator":"","last_set":0},
      "num_members":6
    },
    {"id":"C06UBRE77","name":"airpair-posts","is_channel":true,"created":1435535658,"creator":"U06U2HQQK","is_archived":false,"is_general":false,"is_member":true,"members":["U06U2HQQK"],"topic":{"value":"","creator":"","last_set":0},"purpose":{"value":"","creator":"","last_set":0},"num_members":1},{"id":"C06U2H1GU","name":"airpair-support","is_channel":true,"created":1435494439,"creator":"U06U2HQQK","is_archived":false,"is_general":false,"is_member":true,"members":["U06U2HQQK","U06U2QUVB","U06UBH472","U06UCKSSF","U06UCSHL0"],"topic":{"value":"Non-work banter and water cooler conversation","creator":"","last_set":0},"purpose":{"value":"A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you'd prefer to keep out of more focused work-related channels.","creator":"","last_set":0},"num_members":5}
  ],

  slack_groups_list: [
    {"id":"G06UBFX8S","purpose":{"value":""},"topic":{"value":""},"members":["U06U2HQQK","U06U2QUVB","U06UBBT9V"],"is_archived":false,"creator":"U06U2HQQK","created":1435535644,"name":"-pipeline-"},
    {"id":"G06UFLR5K","purpose":{"value":"I have a test purpose 1435548265"},"topic":{"value":""},"members":["U06U2HQQK","U06U2QUVB","U06UBBT9V","U06UCSHL0"],"is_archived":false,"creator":"U06UCSHL0","created":1435548112,"name":"zz-test-5590ba6953c6b"},
    {"id":"G06UFKTDZ","purpose":{"value":"I have a test purpose 1435548812"},"topic":{"value":""},"members":["U06U2HQQK","U06UBBT9V","U06UCSHL0"],"is_archived":false,"creator":"U06UCSHL0","created":1435548659,"name":"zz-test-5590bc8ce8c6f"},
    {"id":"G06UFJCQ2","purpose":{"value":"I have a test purpose 1435548961"},"topic":{"value":""},"members":["U06U2HQQK","U06UBBT9V","U06UCSHL0"],"is_archived":false,"creator":"U06UCSHL0","created":1435548808,"name":"zz-test-5590bd219285f"},
    {"id":"G06UFKP2A","purpose":{"value":"I have a test purpose 1435548978"},"topic":{"value":""},"members":["U06U2HQQK","U06UBBT9V","U06UCSHL0"],"is_archived":false,"creator":"U06UCSHL0","created":1435548825,"name":"zz-test-5590bd321801e"}
  ],

  slack_createGroup_wPurpose: {
    id: 'G06UFLR5K',
    purpose: { value: { purpose: 'I have a test purpose 1435548265' } },
    topic: { value: '' },
    members: [ 'U06UCSHL0' ],
    is_archived: false,
    creator: 'U06UCSHL0',
    created: 1435548112,
    name: 'zz-test-5590ba6953c6b'
  },

  slack_getGroupWithHistory: {
    info: {
      "id":"G06UFP6AX",
      "name":"steve-gregory-55b9dba","is_group":true,"created":1435548980,
      "creator":"U06UCSHL0","is_archived":false,"is_mpim":false,"is_open":true,"last_read":"1435548980.000003",
      "latest":{"text":"<!group> Sun 06 11:58 UTC | 10:58PM AEDT | 11:58AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f3eaf2d231370211bba4|booking.airpa.ir/5656f3eaf2d231370211bba4>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538984.498078"},"unread_count":190,"unread_count_display":187,"members":["U06U2HQQK","U06UBBT9V","U06UCKSSF","U06UCSHL0"],"topic":{"value":"","creator":"","last_set":0},"purpose":{"value":"http://booking.airpa.ir/55b9dba1f07139aed9500482 Steve (AEST, Melbourne VIC, Australia) + gregory (PDT, Los Angeles, CA, USA). FEEDBACK required to payout expert for 120 mins on Sat 01 08:09 UTC | 6:09PM AEST | 1:09AM PDT","creator":"U06UCSHL0","last_set":1438243537}
    },
    messages: [
      {"text":"<!group> Sun 06 11:47 UTC | 10:47PM AEDT | 11:47AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f134ebcdc4da01c6a3bd|booking.airpa.ir/5656f134ebcdc4da01c6a3bd>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538290.491640"},
      {"text":"<!group> Sun 06 11:46 UTC | 10:46PM AEDT | 11:46AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f11374f74fd5010c43c7|booking.airpa.ir/5656f11374f74fd5010c43c7>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538258.491325"},
      {"text":"<!group> Sun 06 11:45 UTC | 10:45PM AEDT | 11:45AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f0d3f8f94ccb0149ad38|booking.airpa.ir/5656f0d3f8f94ccb0149ad38>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538193.490676"},
      {"text":"<!group> Sun 06 11:44 UTC | 10:44PM AEDT | 11:44AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f0abe0a965c8010590c9|booking.airpa.ir/5656f0abe0a965c8010590c9>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538153.490278"},
      {"user":"U06UCSHL0","purpose":"https://airpair.com/bookings/55990dcbbd5a78d846d185ad Jonathon (AEST, Melbourne VIC, Australia) + Giorgio (AEST, Melbourne VIC, Australia). WAITING to confirm 120 mins @ Tue 07 10AM UTC | 8PM AEST.","type":"message","subtype":"group_purpose","text":"<@U06UCSHL0|customer-support> set the group's purpose: https://airpair.com/bookings/55990dcbbd5a78d846d185ad Jonathon (AEST, Melbourne VIC, Australia) + Giorgio (AEST, Melbourne VIC, Australia). WAITING to confirm 120 mins @ Tue 07 10AM UTC | 8PM AEST.","ts":"1436093743.000002"},{"user":"U06UCKSSF","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UCKSSF|jkgmail> has joined the group","ts":"1435550337.000006"},
      {"user":"U06U2HQQK","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06U2HQQK|jk> has joined the group","ts":"1435548980.000005"},{"user":"U06UBBT9V","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UBBT9V|pairbot> has joined the group","ts":"1435548980.000004"},{"user":"U06UCSHL0","purpose":"I have a test purpose 1435549133","type":"message","subtype":"group_purpose","text":"<@U06UCSHL0|customer-support> set the group's purpose: I have a test purpose 1435549133","ts":"1435548980.000003"},
    ]
  },

  slack_api_group_info: {
    "group":{"id":"G06UFP6AX","name":"steve-gregory-55b9dba","is_group":true,"created":1435548980,
    "creator":"U06UCSHL0","is_archived":false,"is_mpim":false,"is_open":true,"last_read":"1435548980.000003",
    "latest":{"text":"<!group> Sun 06 11:58 UTC | 10:58PM AEDT | 11:58AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f3eaf2d231370211bba4|booking.airpa.ir/5656f3eaf2d231370211bba4>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538984.498078"},"unread_count":190,"unread_count_display":187,"members":["U06U2HQQK","U06UBBT9V","U06UCKSSF","U06UCSHL0"],"topic":{"value":"","creator":"","last_set":0},"purpose":{"value":"http://booking.airpa.ir/55b9dba1f07139aed9500482 Steve (AEST, Melbourne VIC, Australia) + gregory (PDT, Los Angeles, CA, USA). FEEDBACK required to payout expert for 120 mins on Sat 01 08:09 UTC | 6:09PM AEST | 1:09AM PDT","creator":"U06UCSHL0","last_set":1438243537}}
  },

  slack_api_groups_history: {
    messages: [
      {"text":"<!group> Sun 06 11:58 UTC | 10:58PM AEDT | 11:58AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f3eaf2d231370211bba4|booking.airpa.ir/5656f3eaf2d231370211bba4>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538984.498078"},
      {"text":"<!group> Sun 06 11:54 UTC | 10:54PM AEDT | 11:54AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f2f40334f31c02d6e8fd|booking.airpa.ir/5656f2f40334f31c02d6e8fd>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538738.495585"},
      {"text":"<!group> Sun 06 11:49 UTC | 10:49PM AEDT | 11:49AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f1adca22e6ef016c6c1a|booking.airpa.ir/5656f1adca22e6ef016c6c1a>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538411.492630"},
      {"text":"<!group> Sun 06 11:48 UTC | 10:48PM AEDT | 11:48AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f189037d48e9018f077f|booking.airpa.ir/5656f189037d48e9018f077f>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538375.492339"},
      {"text":"<!group> Sun 06 11:47 UTC | 10:47PM AEDT | 11:47AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f15ca9c012e001aa42ce|booking.airpa.ir/5656f15ca9c012e001aa42ce>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538331.491989"},
      {"text":"<!group> Sun 06 11:47 UTC | 10:47PM AEDT | 11:47AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f134ebcdc4da01c6a3bd|booking.airpa.ir/5656f134ebcdc4da01c6a3bd>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538290.491640"},
      {"text":"<!group> Sun 06 11:46 UTC | 10:46PM AEDT | 11:46AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f11374f74fd5010c43c7|booking.airpa.ir/5656f11374f74fd5010c43c7>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538258.491325"},
      {"text":"<!group> Sun 06 11:45 UTC | 10:45PM AEDT | 11:45AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f0d3f8f94ccb0149ad38|booking.airpa.ir/5656f0d3f8f94ccb0149ad38>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538193.490676"},
      {"text":"<!group> Sun 06 11:44 UTC | 10:44PM AEDT | 11:44AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f0abe0a965c8010590c9|booking.airpa.ir/5656f0abe0a965c8010590c9>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538153.490278"},
      {"user":"U06UCSHL0","purpose":"https://airpair.com/bookings/55990dcbbd5a78d846d185ad Jonathon (AEST, Melbourne VIC, Australia) + Giorgio (AEST, Melbourne VIC, Australia). WAITING to confirm 120 mins @ Tue 07 10AM UTC | 8PM AEST.","type":"message","subtype":"group_purpose","text":"<@U06UCSHL0|customer-support> set the group's purpose: https://airpair.com/bookings/55990dcbbd5a78d846d185ad Jonathon (AEST, Melbourne VIC, Australia) + Giorgio (AEST, Melbourne VIC, Australia). WAITING to confirm 120 mins @ Tue 07 10AM UTC | 8PM AEST.","ts":"1436093743.000002"},{"user":"U06UCKSSF","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UCKSSF|jkgmail> has joined the group","ts":"1435550337.000006"},
      {"user":"U06U2HQQK","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06U2HQQK|jk> has joined the group","ts":"1435548980.000005"},{"user":"U06UBBT9V","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UBBT9V|pairbot> has joined the group","ts":"1435548980.000004"},{"user":"U06UCSHL0","purpose":"I have a test purpose 1435549133","type":"message","subtype":"group_purpose","text":"<@U06UCSHL0|customer-support> set the group's purpose: I have a test purpose 1435549133","ts":"1435548980.000003"},
      {"user":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UCSHL0|customer-support> has joined the group","ts":"1435548980.000002"}
    ],
    has_more: false
  },

}
