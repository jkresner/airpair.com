module.exports = {

  users: {
    SoumyaAcharya: {
      "_id" : "51a6668866a6f999a465f2fc",
      "google" : {
          "provider" : "google",
          "id" : "101673072972612685381",
          "displayName" : "Soumya Acharya",
          "name" : {
              "familyName" : "Acharya",
              "givenName" : "Soumya"
          },
          "emails" : [
              {
                  "value" : "cse.soumya@gmail.com"
              }
          ],
          "_json" : {
              "id" : "101673072972612685381",
              "email" : "cse.soumya@gmail.com",
              "verified_email" : true,
              "name" : "Soumya Acharya",
              "given_name" : "Soumya",
              "family_name" : "Acharya",
              "link" : "https://plus.google.com/101673072972612685381",
              "picture" : "https://lh4.googleusercontent.com/-w0mXQHh01HQ/AAAAAAAAAAI/AAAAAAAAAH0/ZmxKgv7nHFI/photo.jpg",
              "gender" : "male",
              "locale" : "en"
          },
          "token" : {
          }
      },
      "googleId" : "101673072972612685381"
    }
  },


  settings: {
  	jk: {
	    "paymentMethods" : [
	        {
	            "type" : "paypal",
	            "isPrimary" : true,
	            "info" : {
	                "email" : "jkresner@gmail.com"
	            },
	            "_id" : "539b5c5c1f18ce0200d105d0"
	        },
	        {
	            "type" : "stripe",
	            "info" : {
	                "subscription" : null,
	                "default_card" : "card_4KveLBBqT0rs0P",
	                "cards" : {
	                    "count" : 1,
	                    "data" : [
	                        {
	                            "type" : "Visa",
	                            "customer" : "cus_5Kvew1gjYgXWZd",
	                            "address_zip_check" : null,
	                            "address_line1_check" : null,
	                            "cvc_check" : "pass",
	                            "address_country" : null,
	                            "address_zip" : null,
	                            "address_state" : null,
	                            "address_city" : null,
	                            "address_line2" : null,
	                            "address_line1" : null,
	                            "name" : null,
	                            "country" : "US",
	                            "fingerprint" : "MR0HO4NuvjtLvhjr",
	                            "exp_year" : 2017,
	                            "exp_month" : 4,
	                            "funding" : "credit",
	                            "brand" : "Visa",
	                            "last4" : "4925",
	                            "object" : "card",
	                            "id" : "card_4KveLBBqT0rs0P"
	                        }
	                    ],
	                    "url" : "/v1/customers/cus_5Kvew1gjYgXWZd/cards",
	                    "has_more" : false,
	                    "total_count" : 1,
	                    "object" : "list"
	                },
	                "currency" : null,
	                "account_balance" : 0,
	                "discount" : null,
	                "subscriptions" : {
	                    "count" : 0,
	                    "data" : [],
	                    "url" : "/v1/customers/cus_4Kvew1gjYgXWZd/subscriptions",
	                    "has_more" : false,
	                    "total_count" : 0,
	                    "object" : "list"
	                },
	                "delinquent" : false,
	                "email" : "jk@airpair.com",
	                "description" : null,
	                "livemode" : true,
	                "id" : "cus_5Kvew1gjYgXWZd",
	                "created" : 1404415342,
	                "object" : "customer"
	            },
	            "isPrimary" : false,
	            "_id" : "53b5ad6f69548e0200ee8018"
	        }
		    ]
		}
  },

  payMethods: {
    testStripe: {
      "_id" : "54761b10f624144898f94d7a",
      "info" : {
          "object" : "customer",
          "created" : 1404415342,
          "id" : "cus_4ehXDqE9ikiZHf",
          "livemode" : false,
          "description" : null,
          "email" : "jk@airpair.com",
          "delinquent" : false,
          "subscriptions" : {
              "object" : "list",
              "total_count" : 0,
              "has_more" : false,
              "url" : "/v1/customers/cus_4ehXDqE9ikiZHf/subscriptions",
              "data" : [],
              "count" : 0
          },
          "discount" : null,
          "account_balance" : 0,
          "currency" : null,
          "cards" : {
              "object" : "list",
              "total_count" : 1,
              "has_more" : false,
              "url" : "/v1/customers/cus_4ehXDqE9ikiZHf/cards",
              "data" : [
                  {
                      "id" : "card_4ehXLqLP8yyR2D",
                      "object" : "card",
                      "last4" : "4925",
                      "brand" : "Visa",
                      "funding" : "credit",
                      "exp_month" : 4,
                      "exp_year" : 2017,
                      "fingerprint" : "MR0HO4NuvjtLvhjr",
                      "country" : "US",
                      "name" : null,
                      "address_line1" : null,
                      "address_line2" : null,
                      "address_city" : null,
                      "address_state" : null,
                      "address_zip" : null,
                      "address_country" : null,
                      "cvc_check" : "pass",
                      "address_line1_check" : null,
                      "address_zip_check" : null,
                      "customer" : "cus_4ehXDqE9ikiZHf",
                      "type" : "Visa"
                  }
              ],
              "count" : 1
          },
          "default_card" : "card_4ehXLqLP8yyR2D",
          "subscription" : null
      },
      "type" : "stripe",
      "name" : "Test card",
    }
  },

  companys: {
  	urbn : {
	    "name" : "Ubersense",
	    "url" : "www.ubersense.com",
	    "about" : "Ubersense is a mobile app that is helping athletes improve at sports using video and expert coaching. Ubersense iOS apps have been used by more than a million athletes and coaches at all levels, in all kinds of sports.",
	    "contacts" : [
	        {
	            "fullName" : "Amit Jardosh",
	            "email" : "amit.jardosh@gmail.com",
	            "gmail" : "amit.jardosh@gmail.com",
	            "title" : "",
	            "phone" : "",
	            "userId" : "51a4c3f566a6f999a465f2ef",
	            "pic" : "https://lh6.googleusercontent.com/-Nl10iDSmQfQ/AAAAAAAAAAI/AAAAAAAABuU/bXgQXuZgofc/photo.jpg",
	            "twitter" : "",
	            "timezone" : "GMT-0700 (PDT)",
	        }
	    ]
		}
  },

  orders: {
    jkHist: [
      {
        "company" : {
          "contacts" : [
              {
                  "_id" : "52702a2700a177020000001f",
                  "timezone" : "GMT-0700 (PDT)",
                  "twitter" : "jkresner",
                  "pic" : "https://lh3.googleusercontent.com/-NKYL9eK5Gis/AAAAAAAAAAI/AAAAAAAAABY/291KLuvT0iI/photo.jpg",
                  "userId" : "5175efbfa3802cc4d5a5e6ed",
                  "phone" : "",
                  "title" : "",
                  "gmail" : "jk@airpair.com",
                  "email" : "jk@airpair.com",
                  "fullName" : "Jonathon Kresner"
              }
          ],
          "name" : "airpair, inc.",
          "_id" : "5181ed3e312c520200000004"
        },
        "lineItems" : [
          {
            "qty" : 1,
            "suggestion" : {
                "expert" : {
                    "paymentMethod" : {
                        "type" : "paypal",
                        "info" : {
                            "email" : "paypal@cloudspark.com.au"
                        }
                    },
                    "pic" : "https://lh5.googleusercontent.com/-i29sTxvEDO8/AAAAAAAAAAI/AAAAAAAAABc/DMBwkJL645s/photo.jpg",
                    "email" : "michael@cloudspark.com.au",
                    "rate" : 110,
                    "username" : "mjpearson",
                    "name" : "Michael Pearson",
                    "userId" : "520c1abe66a6f999a465f5f5",
                    "_id" : "520c1b13b3e6350200000009"
                },
                "suggestedRate" : {
                    "nda" : {
                        "total" : 160,
                        "expert" : 90
                    },
                    "private" : {
                        "total" : 110,
                        "expert" : 70
                    },
                    "opensource" : {
                        "total" : 90,
                        "expert" : 70
                    }
                },
                "_id" : "526efa423a400f0200000023"
            },
            "total" : 90,
            "type" : "opensource",
            "unitPrice" : 90,
            "redeemedCalls" : [
              {
                  "callId" : "538e3065cfefef0200c47ac7",
                  "qtyRedeemed" : 1,
                  "_id" : "538e3065cfefef0200c47ac8",
                  "qtyCompleted" : 1
              }
            ]
          }
        ],
        "marketingTags" : [],
        "owner" : "jk",
        "payment" : {
          "paymentExecStatus" : "CREATED",
        },
        "paymentStatus" : "paidout",
        "paymentType" : "paypal",
        "profit" : 20,
        "requestId" : "526ef8de3a400f0200000021",
        "total" : 90,
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "utc" : "2013-10-30T06:00:44.000Z"
      },
      {
        "company" : {
          "contacts" : [
              {
                  "firstName" : "Jonathon",
                  "_id" : "5401189005b4b202000f824b",
                  "timezone" : "GMT-0700 (PDT)",
                  "twitter" : "jkresner",
                  "pic" : "https://lh3.googleusercontent.com/-NKYL9eK5Gis/AAAAAAAAAAI/AAAAAAAAABY/291KLuvT0iI/photo.jpg",
                  "userId" : "5175efbfa3802cc4d5a5e6ed",
                  "phone" : "",
                  "title" : "",
                  "gmail" : "jk@airpair.com",
                  "email" : "jk@airpair.com",
                  "fullName" : "Jonathon Kresner"
              }
          ],
          "name" : "AirPair",
          "_id" : "5181ed3e312c520200000004"
        },
        "lineItems" : [
          {
            "type" : "opensource",
            "total" : 84,
            "unitPrice" : 84,
            "qty" : 1,
            "suggestion" : {
                "_id" : "54012c8505b4b202000f8252",
                "suggestedRate" : {
                    "opensource" : {
                        "expert" : 52,
                        "total" : 84
                    },
                    "private" : {
                        "expert" : 52,
                        "total" : 104
                    },
                    "nda" : {
                        "expert" : 72,
                        "total" : 154
                    }
                },
                "expert" : {
                    "_id" : "53fcd1e588b04602008451d3",
                    "userId" : "53fcd18c8f8c80299bcc4477",
                    "name" : "Lauren Bridges",
                    "username" : "nikinash",
                    "rate" : 40,
                    "email" : "krush.art@gmail.com",
                    "pic" : "https://pbs.twimg.com/profile_images/378800000099099216/4becf6265298df80896d3ad9ab51f9ea_normal.jpeg",
                    "paymentMethod" : {
                        "info" : {
                            "email" : "krush.art@gmail.com"
                        },
                        "type" : "paypal"
                    }
                }
            },
            "redeemedCalls" : [{
                  "callId" : "54038604c94d3d020003ddf5",
                  "qtyRedeemed" : 1,
                  "_id" : "54038604c94d3d020003ddf6",
                  "qtyCompleted" : 1
              }
            ]
          }
        ],
        "marketingTags" : [{"group" : "aoa", "type" : "channel","name" : "aoa", "_id" : "53b3697cdd88e60200970bd9"}],
        "owner" : "jk",
        "payment" : {
          "receipt_email" : "jk@airpair.com",
          "card" : { "id" : "card_4KveLkAqT0rs0P" },
          "id" : "ch_4gm4ZcAPIKYbkJ"
        },
        "paymentStatus" : "paidout",
        "paymentType" : "stripe",
        "payouts" : [{
              "type" : "paypal",
              "status" : "success",
          }
        ],
        "profit" : 32,
        "requestId" : "540118ddedf8ec020097bb3f",
        "total" : 84,
        //"userId" : "5175efbfa3802cc4d5a5e6ed",
        "utc" : "2014-08-31T02:56:54.000Z"
      }
    ]
  }

}
