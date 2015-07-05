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
            "bookingId" : ObjectId("54dc2d2fd137810a00f2813b"),
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

  v0Payout: {
    "_id" : ObjectId("5399ff199abf9b020082ee9c"),
    "company" : {
        "contacts" : [
            {
                "firstName" : "Joe",
                "_id" : "53965a64b0177a0200f7b739",
                "timezone" : "GMT-0700 (PDT)",
                "twitter" : "joemellin",
                "pic" : "https://lh4.googleusercontent.com/-ihNYoznCJx8/AAAAAAAAAAI/AAAAAAAABCc/vAfW5Jv4rd0/photo.jpg",
                "userId" : "53965a5a1c67d1a4859d3453",
                "phone" : "",
                "title" : "",
                "gmail" : "mellin.joe@gmail.com",
                "email" : "mellin.joe@gmail.com",
                "fullName" : "Joe Mellin"
            }
        ],
        "name" : "Individual",
        "_id" : "53965a64b0177a0200f7b738"
    },
    "lineItems" : [
        {
        "type" : "opensource",
        "total" : 90,
        "unitPrice" : 90,
        "qty" : 1,
        "suggestion" : {
            "_id" : "53967da0d0453102001f2081",
            "suggestedRate" : {
                "opensource" : { "expert" : 70, "total" : 90 },
                "private" : { "expert" : 70, "total" : 110 },
                "nda" : { "expert" : 90,  "total" : 160 }
            },
            "expert" : {
                "_id" : "5241c121c20d3f020000000e",
                "userId" : "5241c04a66a6f999a465f861",
                "name" : "Evan R",
                "username" : "Eunoia",
                "rate" : 70,
                "email" : "goldcpufish@gmail.com",
                "pic" : "https://secure.gravatar.com/avatar/2b426203c95dc30cc2893d48b2393c7e",
                "paymentMethod" : {  "info" : { "email" : "evan.rse@gmail.com" }, "type" : "paypal" }
            }
        },
        "_id" : ObjectId("5399ff1a9abf9b020082ee9d"),
        "redeemedCalls" : [
            {"callId" : ObjectId("539a4912a7d320020035bd97"),"qtyRedeemed" : 1,
                "_id" : ObjectId("539a4912a7d320020035bd98"),"qtyCompleted" : 1}
        ]
      }
    ],
    "marketingTags" : [],
    "owner" : "jk",
    "payment" : {
        "paymentExecStatus" : "CREATED",
        "payKey" : "AP-2FY29769231018544",
        "responseEnvelope" : {
            "build" : "10902368",
            "correlationId" : "8529042dcade1",
            "ack" : "Success",
            "timestamp" : "2014-06-12T12:27:22.510-07:00"
        },
        "payout" : {
            "responseEnvelope" : {
                "timestamp" : "2014-06-24T07:50:53.499-07:00",
                "ack" : "Success",
                "correlationId" : "e49903e49923d",
                "build" : "10902368"
            },
            "paymentExecStatus" : "COMPLETED"
        }
    },
    "paymentStatus" : "paidout",
    "paymentType" : "paypal",
    "payouts" : [],
    "profit" : 20,
    "requestId" : ObjectId("53965ab3d0453102001f207a"),
    "total" : 90,
    "userId" : ObjectId("53965a5a1c67d1a4859d3453"),
    "utc" : ISODate("2014-06-12T19:27:22.000Z")
  }

}
