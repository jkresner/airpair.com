module.exports = {

  swap1: {
    "_id": ObjectId("54dc2d2fd137810a00f2813b"),
    "createdById": ObjectId("54b49bf67b1047516695d508"),
    "customerId": ObjectId("54b49bf67b1047516695d508"),
    "expertId": ObjectId("53041710a9a333020000001d"),
    "type": "opensource",
    "minutes": 60,
    "status": "followup",
    "gcal": {},
    "datetime": ISODate("2015-03-12T03:33:18.576Z"),
    "suggestedTimes": [{byId:ObjectId("54b49bf67b1047516695d508"),time:ISODate("2015-03-12T03:33:18.576Z")}],
    "orderId": ObjectId("54dc2d2ed137810a00f2813a"),
    "recordings": [
        {
            "type": "youtube",
            "data": {
                "youTubeId": "9B_lgce1QMc",
                "localized": {
                    "description": "AirPair Daniel + Sunngs",
                    "title": "AirPair Daniel + Sunngs"
                },
                "liveBroadcastContent": "upcoming",
                "categoryId": "24",
                "channelTitle": "Air Pair",
                "description": "AirPair Daniel + Sunngs",
                "title": "AirPair Daniel + Sunngs",
                "channelId": "UCX6ZQp3RdEU_9kFNrRB-rIQ",
                "publishedAt": "2015-02-18T02:34:52.000Z"
            },
            "hangoutUrl": "https://talkgadget.google.com/hangouts/_/gytmwgvocggm2hrtdd4tvv6jhma",
            "youTubeAccount": "Air Pair",
            "_id": ObjectId("54e3fa5078c9700a0043a379")
        }
    ],
    "participants": [
        {
            "role": "customer",
            "_id": ObjectId("54dc2d2fd137810a00f2813d"),
            "info": {"_id": ObjectId("54b49bf67b1047516695d508"),
                "name": "Daniel Cardenas","email": "dan85.cardenas@gmail.com"}
        },
        {
            "role": "expert",
            "_id": ObjectId("54dc2d2fd137810a00f2813c"),
            "info": {"_id": ObjectId("530416e51c67d1a4859d23c8"),
                "name": "Adam Kerr","email": "ajrkerr@gmail.com"}
        }
    ]
  },

  timezones: {
    "_id": ObjectId("558aa2454be238d1956cb8aa"),
    "createdById": ObjectId("552d81ec35c4e411001ae059"),
    "customerId": ObjectId("552d81ec35c4e411001ae059"),
    "expertId": ObjectId("529e685c1a4bf00200000017"),
    "type": "private",
    "minutes": 90,
    "datetime": ISODate("2016-06-25T00:00:00.000Z"),
    "suggestedTimes": [{byId:ObjectId("552d81ec35c4e411001ae059"),time:ISODate("2016-06-25T00:00:00.000Z")}],
    "status": "pending",
    "orderId": ObjectId("558aa2454be238d1956cb8a9"),
    "notes": [],
    "recordings": [],
    "participants": [
        {
            "location": "San Francisco, CA, USA",
            "timeZoneId": "America/Los_Angeles",
            "role": "customer",
            "_id": ObjectId("558aa2454be238d1956cb8ac"),
            "info": {
                "_id": ObjectId("552d81ec35c4e411001ae059"),
                "name": "Morgan Wildermuth",
                "email": "morgan.wildermuth@gmail.com"
            }
        },
        {
            "location": "Houston, TX, USA",
            "timeZoneId": "America/Chicago",
            "role": "expert",
            "_id": ObjectId("558aa2454be238d1956cb8ab"),
            "info": {
                "_id": ObjectId("529e680966a6f999a465fd14"),
                "name": "Billy Cravens",
                "email": "bdcravens@gmail.com"
            }
        }
    ],
    "__v": 0,
  },


  admUpdate: {
     "_id":         ObjectId("558a5926e19a011100849e52"),
     "createdById": ObjectId("54d390c41f49fb0a00ecb076"),
     "customerId":  ObjectId("54d390c41f49fb0a00ecb076"),
     "expertId":    ObjectId("54f8cba24b346e0c00097a6a"),
     // "orderId":     ObjectId("558a5925e19a011100849e4f"),
     // "chatId":      ObjectId("5589c48a135d561100c30b44"),
     "datetime":    ISODate("2015-07-01T18:00:00.000Z"),
     "type":        "private",
     "status":      "confirmed",
     "minutes":     60,
     "__v":         0,
     "notes":       [],
     "recordings":  [],
     "suggestedTimes": [
       {
         byId:ObjectId("54d390c41f49fb0a00ecb076"),time:ISODate("2015-07-01T18:00:00.000Z")
       }
     ],
     "participants": [
       {
         "_id":        ObjectId("558a5926e19a011100849e54"),
         "role":       "customer",
         "location":   "London, UK",
         "timeZoneId": "Europe/London",
         "chat": {
           "slack": { "name": "joelemmer", "id": "U06DX6H8Q" }
         },
         "info": {
           "_id":   ObjectId("54d390c41f49fb0a00ecb076"),
           "name":  "joe lemmer",
           "email": "participant1@null.com",
         }
       },
       {
         "_id":      ObjectId("558a5926e19a011100849e53"),
         "location": "London, UK",
         "role":     "expert",
         "timeZoneId": "Europe/London",
         "chat": {
           "slack": { "name": "michal", "id": "U042H77KS" }
         },
         "info": {
           "_id":   ObjectId("54ccab31bb208709007cf47c"),
           "name":  "michal charemza",
           "email": "participant2@null.com",
         }
       }
     ],
     "gcal": {
         "id":   "orf53n0lh0pkhuhnr2sbhusl0c",
         "kind": "calendar#event",
         "etag": "\"2870260402878000\"",
         "status":   "confirmed",
         "created":  "2015-06-24T07:16:41.000Z",
         "updated":  "2015-06-24T07:16:41.439Z",
         "summary":  "AIRPAIR-DEV: TEST",
         "htmlLink": "https://www.google.com/calendar/event?eid=b3JmNTNuMGxoMHBraHVobnIyc2JodXNsMGMgYWlycGFpci5jb18xOXQwMW4wZ2Q2Zzc1NDhrMzhwZDNtNWJtMEBn",
         "description": "Your matchmaker, will set up a Google\nhangout for this session and share the link with you a few\nminutes prior to the session.\n\nYou are encouraged to make sure beforehand your mic/webcam are working\non your system. Please let your matchmaker know if you'd like to do\na dry run.\n\nBooking: https://airpair.com/booking/558a5926e19a011100849e52",
         "colorId": "10",
         "creator": {
           "email": "team@airpair.com",
           "displayName": "Air Pair"
         },
         "organizer": {
           "email": "airpair.co_19t01n0gd6g7548k38pd3m5bm0@group.calendar.google.com",
           "displayName": "Air Pairings",
           "self": true
         },
         "start": { "dateTime": "2015-07-01T11:00:00-07:00" },
         "end":   { "dateTime": "2015-07-01T12:00:00-07:00" },
         // "start": {"dateTime": ISODate("2015-07-01T00:30:00.576Z")},
         // "end":   {"dateTime": ISODate("2015-07-01T01:30:00.576Z")},
         "iCalUID": "orf53n0lh0pkhuhnr2sbhusl0c@google.com",
         "sequence": 0,
         "attendees": [
           {
             "email": "participant1@null.com",
             "responseStatus": "needsAction",
           },
           {
             "email": "participant2@null.com",
             "displayName": "Michal Charemza",
             "responseStatus": "needsAction",
           }
         ],
         "reminders": { "useDefault": true }
     },
  },

}
