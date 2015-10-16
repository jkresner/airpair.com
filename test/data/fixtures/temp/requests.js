module.exports = {
	ariwadam: {
    "_id" : "54a6416f5d13d00b00e827bd",
    "adm" : {
        "submitted" : "2015-01-02T07:02:23.181Z",
        "owner" : "pg",
        "received" : "2015-01-02T17:12:31.852Z",
        "lastTouch" : {
            "action" : "closed:completed",
            "utc" : "2015-01-03T00:45:27.883Z",
            "by" : {
                "_id" : "5367fd6d1c67d1a4859d30e7",
                "name" : "Prateek Gupta"
            }
        },
        "farmed" : "2015-01-02T17:12:37.599Z",
        "reviewable" : "2015-01-02T17:31:44.520Z"
    },
    "brief" : "I have a _very_ specific issue I'm working with. \n\nThe application I'm writing takes a photo every hour. I have everything working while the device is awake. I'm using a broadcast receiver to emit an event at a certain interval which starts an activity. When that activity launches, it boots up a camera preview, the camera `takePicture` method is called, and all is well.\n\nWhen the device is asleep, however, the device wakes up, but the photo is not yet taken (presumably because the preview surface is not yet visible to the user). \n\nI've tried to fix it in various ways, wrapping it in another activity, firing two broadcast events, delaying the launch of the activity or the taking the photo action. Nothing seems to help.",
    "budget" : 150,
    "by" : {
        "avatar" : "//0.gravatar.com/avatar/13a0bcca035366b4b348326417e1747c",
        "email" : "writeari@gmail.com",
        "name" : "Ari Lerner"
    },
    "experience" : "advanced",
    "hours" : "1",
    "lastTouch" : {
        "action" : "updateByCustomer",
        "utc" : "2015-01-03T00:29:04.071Z",
        "by" : {
            "_id" : "5230d19766a6f999a465f7e0",
            "name" : "Ari Lerner"
        }
    },
    "messages" : [
        // {
        //     "type" : "received",
        //     "subject" : "1 hour android code-review\n",
        //     "body" : "Hi Ari,\n\nMy name is Prateek, I'm your personal AirPair Matchmaker assigned to help find you the perfect android expert. I'm also available to answer questions and to make sure your experience is smooth from now through to getting your challenges solved.\n\nI will be back with a link to book your session asap.\n\nBest,\n\nPrateek\n\n--\nPrateek Gupta\ntwitter.com/airpair",
        //     "fromId" : "5367fd6d1c67d1a4859d30e7",
        //     "toId" :"5230d19766a6f999a465f7e0",
        //     "_id" : "54a737d00c3e910b0096fb60"
        // },
        // {
        //     "type" : "review",
        //     "subject" : "Ready for some android AirPairing?\n",
        //     "body" : "Hi again Ari,\n\nHope you've have had some time to look over your responses. Are you happy with your experts? Please tell me straight away if they do not meet your expectations. My personal recommendation is Adam Bliss because he's one of our top android expert. When you're ready just go back to the page with your replies and hit \"Book\". Once that's done I'll help you schedule a time with the expert.\n\nhttps://www.airpair.com/review/54a6416f5d13d00b00e827bd\n\nP.S. You can buy AirPairing credit in bulk ahead of time and get as much as 20% extra. Once you have credit the cost of each session gets deducted from your balance.\n\nhttps://www.airpair.com/billing/top-up\n\nBest,\n\nPrateek",
        //     "fromId" : "5367fd6d1c67d1a4859d30e7",
        //     "toId" :"5230d19766a6f999a465f7e0",
        //     "_id" : "54a737d00c3e910b0096fb5f"
        // }
    ],
    "status" : "review",
    "suggested" : [
        {
            "matchedBy" : {
                "userId" : "5367fd6d1c67d1a4859d30e7",
                "initials" : "pg"
            },
            "_id" : "54a6d18a2ea7f80b0018adbb",
            "suggestedRate" : {
                "total" : 130,
                "expert" : 85
            },
            "expertComment" : "Hi, you're right that the preview surface must be visible before the photo can be taken. You also need to wait a little bit for the camera to come online, as it can take up to 30 frames (depending on your hardware) for it to auto-balance the whiteness, brightness, and focus. If you still aren't getting a picture, there may be clues in the cryptic OMX logging output which I can help you decypher.",
            "expertAvailability" : "Available immediately, 9am-9pm Pacific Time",
            "expertStatus" : "available",
            "reply" : {
                "time" : "2015-01-02T17:31:44.517Z"
            },
            "expert" : {
                "_id" : "51a6cc55960c490200000006",
                "email" : "abliss@gmail.com",
                "gmail" : "abliss@gmail.com",
                "name" : "Adam Bliss",
                "username" : "abliss",
                "rate" : 70,
                "userId" : "51a6c65e66a6f999a465f30b",
                "tw" : { "username" : "abliss" },
                "in" : { "id" : "o2928bHLan" },
                "so" : { "link" : "1239095/adam-bliss" },
                "gh" : { "username" : "abliss" }
            }
        },
        {
            "expertComment" : "Here is my resume link :\nhttps://drive.google.com/file/d/0B2mQB8C-YLGnY1ZpUjZtWEMzVG8/view",
            "expertAvailability" : "availble now.",
            "suggestedRate" : {
                "expert" : 64,
                "total" : 118
            },
            "_id" : "54a6db548d22030b005ea6ad",
            "expertStatus" : "available",
            "reply" : {
                "time" : "2015-01-02T17:54:28.288Z"
            },
            "expert" : {
                "_id" : "531c304ee582c5020000001d",
                "email" : "ashish.fagna@gmail.com",
                "gmail" : "ashish.fagna@gmail.com",
                "name" : "Ashish Kumar",
                "username" : "ashish1dev",
                "rate" : 40,
                "userId" : "5318d8191c67d1a4859d26ca",
                "tw" : { "username" : "ashish_fagna" },
                "in" : { "id" : "INjn-MP1a4" },
                "so" : { "link" : "1812318/user1812318" },
                "gh" : { "username" : "ashish1dev" }
            }
        },
        {
            "matchedBy" : {
                "initials" : "pg",
                "userId" : "5367fd6d1c67d1a4859d30e7"
            },
            "_id" : "54a6d18e8d22030b005ea56a",
            "suggestedRate" : {
                "expert" : 85,
                "total" : 130
            },
            "expertStatus" : "waiting",
            "expert" : {
                "_id" : "53a8caf02f37250200b4b88a",
                "email" : "elkriefy@gmail.com",
                "gmail" : "elkriefy@gmail.com",
                "name" : "Yossi Elkrief",
                "username" : "MaTriXy",
                "rate" : 70,
                "userId" : "53a8cab61c67d1a4859d3675",
                "tw" : { "username" : "elkriefy" },
                "in" : { "id" : "mMXm3lhKH3" },
                "bb" : { "id" : "MaTriXy" },
                "so" : { "link" : "529518/matrixy" },
                "gh" : { "username" : "MaTriXy" }
            }
        },
    ],
    "tags" : [ {   "_id" : "514825fa2a26ea0200000006", "slug" : "android", "sort" : 0 } ],
    "time" : "regular",
    "type" : "code-review",
    "userId" : "5230d19766a6f999a465f7e0"
  },

  suggestReply: {
    "_id" : ObjectId("550e6f237d6ec20c0042cd43"),
    "type" : "advice",
    "by" : {
        "avatar" : "//0.gravatar.com/avatar/20f6f13e624f03757b6a216facb176f0",
        "email" : "mayan@mathen.net",
        "name" : "Mayan Mathen"
    },
    "userId" : ObjectId("547be5488f8c80299bcc52de"),
    "status" : "waiting",
    "calls" : [],
    "marketingTags" : [],
    "messages" : [
        {
            "toId" : ObjectId("547be5488f8c80299bcc52de"),
            "fromId" : ObjectId("5367fd6d1c67d1a4859d30e7"),
            "body" : "Hi Mayan, welcome back!\n\nI am reaching out to our experts for availability and I will be sending you an email with a link to book your session. \n\nDo you have more details, please feel free to share using this link. \n\nhttps://www.airpair.com/help/request/550e6f237d6ec20c0042cd43\n\nBest,\n\nPrateek\n\n--\nPrateek Gupta\ntwitter.com/airpair",
            "subject" : "1 hour splunk and firewall advice\n",
            "_id" : ObjectId("550ec7687d6ec20c0042d27d"),
            "type" : "received"
        }
    ],
    "suggested" : [],
    "tags" : [
        {"_id" : ObjectId("52dd4d671c67d1a4859d1cf3"),"slug" : "splunk","sort" : 0},
        {"_id" : ObjectId("5181d0ae66a6f999a465f279"),"slug" : "firewall", "sort" : 1}
    ],
    "adm" : {
        "lastTouch" : {
            "by" : {
                "name" : "Admin User",
                "_id" : ObjectId("54551be15f221efa174238d1")
            },
            "utc" : ISODate("2015-03-22T20:47:22.200Z"),
            "action" : "updateByAdmin"
        },
        "received" : ISODate("2015-03-22T13:45:12.212Z"),
        "owner" : "ad",
        "active" : true,
        "submitted" : ISODate("2015-03-22T07:29:37.094Z")
    },
    "lastTouch" : {
        "by" : {
            "name" : "Noel Kuntze",
            "_id" : ObjectId("530e48711c67d1a4859d250d")
        },
        "utc" : ISODate("2015-03-22T15:14:39.380Z"),
        "action" : "replyByExpert:available"
    },
    "experience" : "proficient",
    "brief" : "Push logs from firewall to Splunk. Firewall is a Palo Alto networks",
    "time" : "regular",
    "hours" : "1",
    "budget" : 150,
    "title" : "1 hour splunk and firewall advice"
  },


  swap1: {
    "_id" : ObjectId("54cad97ec80a3809004361e7"),
    "type" : "mentoring",
    "by" : {
        "avatar" : "//0.gravatar.com/avatar/dda1d954478dbf96adbeb860562c01a3",
        "email" : "dan85.cardenas@gmail.com","name" : "Daniel Cardenas"
    },
    "userId" : ObjectId("54b49bf67b1047516695d508"),
    "status" : "complete",
    "messages" : [
        {
            "type" : "received",
            "_id" : ObjectId("54cad97ec80a3809004361e7"),
            "subject" : "1 hour ruby-on-rails mentoring\n",
            "body" : "Hi Daniel,\n\nMy name is Prateek, I'm your personal AirPair Matchmaker assigned to help find you the perfect ruby-on-rails expert. I'm also available to answer questions and to make sure your experience is smooth from now through to getting your challenges solved. \n\nI am just reaching out to our experts for availability to get you started asap. Normally, our turnaround time for Rails is about 2 hrs. When would you like to start?\n\nI am looking forward to your response.\n\nBest,\n\nPrateek\n\n--\nPrateek Gupta\ntwitter.com/airpair",
            "fromId" : ObjectId("5367fd6d1c67d1a4859d30e7"),
            "toId" : ObjectId("54b49bf67b1047516695d508")
        }
    ],
    "suggested" : [
        {
            "matchedBy" : { "userId" : "5367fd6d1c67d1a4859d30e7", "initials" : "pg" },
            "_id" : ObjectId("54cadb262aadfe0900d651b5"),
            "suggestedRate" : { "total" : 70, "expert" : 40 },
            "expertComment" : "I've been a fullstack rails dev for the past 5 years.  My current employer focuses on pair programming and test driven development.   I have written/worked on a couple of gems in the past.  Most of my experience has been with structuring larger applications in Rails 3.",
            "expertAvailability" : "Evenings and Weekends.  I live in Toronto, so EDT (GMT -5hrs).",
            "expertStatus" : "available",
            "reply" : { "time" : ISODate("2015-01-30T01:21:22.314Z") },
            "expert" : {
                "_id" : ObjectId("53041710a9a333020000001d"),
                "email" : "ajrkerr@gmail.com",
                "gmail" : "ajrkerr@gmail.com",
                "name" : "Adam Kerr",
                "rate" : 70,
                "userId" : ObjectId("530416e51c67d1a4859d23c8"),
                "tw" : {"username" : "ajrkerr" },
                "in" : {"id" : "ssF0A7duY4"},
                "so" : {"link" : "800664/ajrkerr"},
                "gh" : {"username" : "ajrkerr"}
            }
        },
        {
            "matchedBy" : {
                "initials" : "pg",
                "userId" : "5367fd6d1c67d1a4859d30e7"
            },
            "_id" : ObjectId("54cadb1c2aadfe0900d651b3"),
            "suggestedRate" : {
                "expert" : 40,
                "total" : 70
            },
            "expertComment" : "Hi Daniel. I really would like to have a review session with you.",
            "expertAvailability" : "I am available, tell me what time fit to you.",
            "expertStatus" : "available",
            "reply" : {"time" : ISODate("2015-01-30T01:25:30.990Z")},
            "expert" : {
                "_id" : ObjectId("52587ddc2cac42020000001c"),
                "email" : "rodrigopqn@gmail.com",
                "gmail" : "rodrigopqn@gmail.com",
                "name" : "Rodrigo Pinto",
                "rate" : 70,
                "userId" : ObjectId("52587dad66a6f999a465f9d3"),
                "tw" : {"username" : "rodrigoospinto"},
                "in" : {"id" : "WN3pN2yLlm"},
                "gh" : {"username" : "rodrigopinto"}
            }
        },
        {
            "expertComment" : "Bonjour!\n\n I can definitely help you get up to speed in Ruby. I am an adjunct professor who teaches Ruby & Rails at New York University. I also have 8 years ruby experience.\n\nI look forward to hearing from you.",
            "expertAvailability" : "My personal availability on weekdays are:\n0800hrs-1900hrs EST",
            "suggestedRate" : {"total" : 70,"expert" : 40},
            "_id" : ObjectId("54e221ed24d2860a003a80ee"),
            "expertStatus" : "available",
            "reply" : {
                "time" : ISODate("2015-02-16T16:59:25.459Z")
            },
            "expert" : {
                "_id" : ObjectId("52127d5fc6a5870200000007"),
                "email" : "rashaunstovall@gmail.com",
                "gmail" : "rashaunstovall@gmail.com",
                "name" : "Ra'Shaun Stovall",
                "rate" : 70,
                "userId" : ObjectId("52127d4066a6f999a465f637"),
                "tw" : {"username" : "snuggsi"},
                "in" : {"id" : "SJu5-UP-9Y"},
                "gh" : {"username" : "snuggs"}
            }
        },
        {
            "matchedBy" : {"userId" : "5367fd6d1c67d1a4859d30e7","initials" : "pg"},
            "_id" : ObjectId("54cadafac80a38090043620d"),
            "suggestedRate" : {"total" : 70,"expert" : 40},
            "expertStatus" : "waiting",
            "expert" : {
                "_id" : ObjectId("5359bef3c558c2020000002f"),
                "email" : "dcestari@gmail.com",
                "gmail" : "dcestari@gmail.com",
                "name" : "Daniel Cestari",
                "rate" : 230,
                "userId" : ObjectId("5359bd0e1c67d1a4859d2f74"),
                "tw" : {"username" : "dcestari"},
                "in" : {"id" : "2EAxYvhnal"},
                "bb" : {"id" : "dcestari"},
                "so" : {"link" : "452964/dcestari"},
                "gh" : {"username" : "dcestari"}
            }
        },
        {
            "matchedBy" : {"initials" : "pg","userId" : "5367fd6d1c67d1a4859d30e7"},
            "_id" : ObjectId("54cadafd2aadfe0900d651a5"),
            "suggestedRate" : {
                "expert" : 40,
                "total" : 70
            },
            "expertStatus" : "waiting",
            "expert" : {
                "_id" : ObjectId("5387a1e7e558890200722fd5"),
                "email" : "fernando.visa@gmail.com",
                "gmail" : "fernando.visa@gmail.com",
                "name" : "Fernando Villalobos",
                "rate" : 40,
                "userId" : ObjectId("5387a1af1c67d1a4859d3342"),
                "tw" : {"username" : "fervisa"},
                "gh" : {"username" : "fervisa"}
            }
        },
        {
            "matchedBy" : {
                "userId" : "5367fd6d1c67d1a4859d30e7",
                "initials" : "pg"
            },
            "_id" : ObjectId("54cadb112aadfe0900d651b1"),
            "suggestedRate" : {
                "total" : 70,
                "expert" : 40
            },
            "expertStatus" : "waiting",
            "expert" : {
                "_id" : ObjectId("52eb1d03e441b30200000039"),
                "email" : "hiddentiger@gmail.com",
                "gmail" : "hiddentiger@gmail.com",
                "name" : "Kieran Andrews",
                "rate" : 40,
                "userId" : ObjectId("52eb1cd21c67d1a4859d1e2e"),
                "tw" : {"username" : "HiddenTiger"},
                "in" : {"id" : "uQ1W7ZqRew"},
                "so" : {"link" : "359736/kieran-andrews"},
                "gh" : {"username" : "TigerWolf"
                }
            }
        }
    ],
    tags: [
      {"slug" : "ruby-on-rails",
      "_id" : ObjectId("514825fa2a26ea020000002f")
      ,"sort" : 0}],
    "lastTouch" : {
        "action" : "replyByExpert:available",
        "utc" : ISODate("2015-02-16T16:59:25.462Z"),
        "by" : {
            "_id" : ObjectId("52127d4066a6f999a465f637"),
            "name" : "Ra'Shaun Stovall"
        }
    },
    "adm" : {
        "submitted" : ISODate("2015-01-30T01:08:57.050Z"),
        "owner" : "pg",
        "received" : ISODate("2015-01-30T01:14:21.576Z"),
        "lastTouch" : {
            "action" : "closed:complete",
            "utc" : ISODate("2015-02-17T00:19:26.881Z"),
            "by" : {
                "_id" : ObjectId("5367fd6d1c67d1a4859d30e7"),
                "name" : "Prateek Gupta"
            }
        },
        "farmed" : ISODate("2015-01-30T01:14:26.384Z"),
        "reviewable" : ISODate("2015-01-30T01:21:22.324Z"),
        "booked" : ISODate("2015-01-30T01:36:40.415Z"),
        "closed" : ISODate("2015-02-17T00:19:26.881Z")
    },
    "experience" : "beginner",
    "brief" : "Would like to go over some code i wrote.",
    "time" : "regular",
    "hours" : "1",
    "budget" : 70,
    "title" : "1 hour ruby-on-rails mentoring"
  },

}
