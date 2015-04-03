module.exports = {

  swap1: {
    "_id" : ObjectId("54dc2d2ed137810a00f2813a"),
    "userId" : ObjectId("54b49bf67b1047516695d508"),
    "total" : 60,
    "profit" : 20,
    "by" : {
        "email" : "dan85.cardenas@gmail.com",
        "name" : "Daniel Cardenas",
        "_id" : ObjectId("54b49bf67b1047516695d508")
    },
    "requestId" : ObjectId("54cad97ec80a3809004361e7"),
    "payMethodId" : ObjectId("54cad928c80a3809004361df"),
    "payment" : {
        "processorAuthorizationCode" : "000262",
        "createdAt" : "2015-02-12T04:33:50Z",
        "orderId" : "54dc2d2ed137810a00f2813a",
        "status" : "submitted_for_settlement",
        "type" : "braintree",
        "id" : "6zq77y2"
    },
    "utc" : ISODate("2015-02-12T04:33:50.050Z"),
    "lineItems" : [
        {
            "_id" : ObjectId("54dc2d2ed137810a00f28139"),
            "type" : "payg",
            "qty" : 0,
            "unitPrice" : 60,
            "total" : 0,
            "balance" : 0,
            "profit" : 0,
            "info" : { "name" : "$60 Paid" }
        },
        {
            "_id" : ObjectId("54dc2d2ed137810a00f28138"),
            "type" : "airpair",
            "qty" : 1,
            "unitPrice" : 60,
            "total" : 60,
            "balance" : 0,
            "profit" : 20,
            "info" : {
                "expert" : {
                    "userId" : "530416e51c67d1a4859d23c8", "avatar" : "//0.gravatar.com/avatar/8b6d240a3a697982a0e77ee7871ac70b",
                    "name" : "Adam Kerr", "_id" : "53041710a9a333020000001d"
                },
                "paidout" : false,
                "minutes" : "60",
                "time" : "2015-03-12T03:33:18.576Z",
                "type" : "opensource",
                "name" : "60 min (Adam Kerr)"
            }
        }
    ]
  },

}
