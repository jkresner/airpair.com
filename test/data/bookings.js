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


}
