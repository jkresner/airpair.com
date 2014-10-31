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
  }


}

