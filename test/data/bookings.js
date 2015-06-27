module.exports = {

  swap1: {
    "_id" : ObjectId("54dc2d2fd137810a00f2813b"),
    "createdById" : ObjectId("54b49bf67b1047516695d508"),
    "customerId" : ObjectId("54b49bf67b1047516695d508"),
    "expertId" : ObjectId("53041710a9a333020000001d"),
    "type" : "opensource",
    "minutes" : 60,
    "status" : "followup",
    "gcal" : {},
    "datetime" : ISODate("2015-03-12T03:33:18.576Z"),
    "suggestedTimes" : [{byId:ObjectId("54b49bf67b1047516695d508"),time:ISODate("2015-03-12T03:33:18.576Z")}],
    "orderId" : ObjectId("54dc2d2ed137810a00f2813a"),
    "recordings" : [
        {
            "type" : "youtube",
            "data" : {
                "youTubeId" : "9B_lgce1QMc",
                "localized" : {
                    "description" : "AirPair Daniel + Sunngs",
                    "title" : "AirPair Daniel + Sunngs"
                },
                "liveBroadcastContent" : "upcoming",
                "categoryId" : "24",
                "channelTitle" : "Air Pair",
                "description" : "AirPair Daniel + Sunngs",
                "title" : "AirPair Daniel + Sunngs",
                "channelId" : "UCX6ZQp3RdEU_9kFNrRB-rIQ",
                "publishedAt" : "2015-02-18T02:34:52.000Z"
            },
            "hangoutUrl" : "https://talkgadget.google.com/hangouts/_/gytmwgvocggm2hrtdd4tvv6jhma",
            "youTubeAccount" : "Air Pair",
            "_id" : ObjectId("54e3fa5078c9700a0043a379")
        }
    ],
    "participants" : [
        {
            "role" : "customer",
            "_id" : ObjectId("54dc2d2fd137810a00f2813d"),
            "info" : {"_id" : ObjectId("54b49bf67b1047516695d508"),
                "name" : "Daniel Cardenas","email" : "dan85.cardenas@gmail.com"}
        },
        {
            "role" : "expert",
            "_id" : ObjectId("54dc2d2fd137810a00f2813c"),
            "info" : {"_id" : ObjectId("530416e51c67d1a4859d23c8"),
                "name" : "Adam Kerr","email" : "ajrkerr@gmail.com"}
        }
    ]
  },

  timezones: {
    "_id" : ObjectId("558aa2454be238d1956cb8aa"),
    "createdById" : ObjectId("552d81ec35c4e411001ae059"),
    "customerId" : ObjectId("552d81ec35c4e411001ae059"),
    "expertId" : ObjectId("529e685c1a4bf00200000017"),
    "type" : "private",
    "minutes" : 90,
    "datetime" : ISODate("2016-06-25T00:00:00.000Z"),
    "suggestedTimes" : [{byId:ObjectId("552d81ec35c4e411001ae059"),time:ISODate("2016-06-25T00:00:00.000Z")}],
    "status" : "pending",
    "orderId" : ObjectId("558aa2454be238d1956cb8a9"),
    "notes" : [],
    "recordings" : [],
    "participants" : [
        {
            "location" : "San Francisco, CA, USA",
            "timeZoneId" : "America/Los_Angeles",
            "role" : "customer",
            "_id" : ObjectId("558aa2454be238d1956cb8ac"),
            "info" : {
                "_id" : ObjectId("552d81ec35c4e411001ae059"),
                "name" : "Morgan Wildermuth",
                "email" : "morgan.wildermuth@gmail.com"
            }
        },
        {
            "location" : "Houston, TX, USA",
            "timeZoneId" : "America/Chicago",
            "role" : "expert",
            "_id" : ObjectId("558aa2454be238d1956cb8ab"),
            "info" : {
                "_id" : ObjectId("529e680966a6f999a465fd14"),
                "name" : "Billy Cravens",
                "email" : "bdcravens@gmail.com"
            }
        }
    ],
    "__v" : 0
  }
}
