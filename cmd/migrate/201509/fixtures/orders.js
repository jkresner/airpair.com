module.exports = {


  byStaff: {
    "52b3c4ff66a6f999a465fe3e": "expert@airpair.com",
    "5175efbfa3802cc4d5a5e6ed": "jk@airpair.com",
    "5277c72066a6f999a465face": "dickhead@airpair.com",
    "547654088f8c80299bcc527b": "mc@airpair.com",
    "5305ad4e1c67d1a4859d2404": "mi@airpair.com"
  },


  workshopCredit: {
    "_id" : ObjectId("547654e0871cf00b00df0999"),
    "by" : {
        "email" : "mc@airpair.com",
        "name" : "Moises Cassab",
        "_id" : ObjectId("5463a0568f8c80299bcc4ff5")
    },
    "lineItems" : [
    {
        "_id" : ObjectId("547654e0871cf00b00df0998"),
        "type" : "credit",
        "qty" : 1,
        "unitPrice" : 0,
        "total" : 0,
        "balance" : 50,
        "profit" : 0,
        "info" : {
            "redeemedLines" : [
            {
                "lineItemId" : ObjectId("547cd02468a25c0b005e7939"),
                "amount" : 30,
                "partial" : false
            }
            ],
            "expires" : ISODate("2015-02-26T00:00:00.000Z"),
            "remaining" : 20,
            "source" : "Angular Workshops Feedback",
            "name" : "$50 Credit"
        }
    }
    ],
    "owner" : "",
    "payment" : {
        "type" : "$0 order"
    },
    "profit" : 0,
    "total" : 0,
    "userId" : ObjectId("547654088f8c80299bcc527b"),
    "utc" : ISODate("2014-11-26T22:32:00.471Z")
  }


}
