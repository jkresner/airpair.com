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

  matchSwift: {
    "_id" : ObjectId("550d07a410a0860c00cea966"),
    "type" : "mentoring",
    "by" : {
        "name" : "VICTOR VASQUEZ",
        "email" : "victormv143@gmail.com",
        "avatar" : "//0.gravatar.com/avatar/0f0566bb8722b4136ba2d53838c42b6e"
    },
    "userId" : ObjectId("54dffd85ddd9060a00827828"),
    "status" : "received",
    "calls" : [],
    "marketingTags" : [],
    "messages" : [],
    "suggested" : [],
    "tags" : [
        {
            "sort" : 0,
            "slug" : "swift",
            "_id" : ObjectId("52ffea1a1c67d1a4859d2333")
        }
    ],
    "__v" : 0,
    "adm" : {
        "submitted" : ISODate("2015-03-21T05:58:08.954Z"),
        "active" : true
    },
    "lastTouch" : {
        "by" : {
            "name" : "VICTOR VASQUEZ",
            "_id" : ObjectId("54dffd85ddd9060a00827828")
        },
        "utc" : ISODate("2015-03-21T05:58:41.172Z"),
        "action" : "updateByCustomer"
    },
    "user" : {
        "google" : {
            "name" : {},
            "_json" : {},
            "token" : {
                "attributes" : {}
            }
        },
        "local" : {},
        "cohort" : {
            "firstRequest" : {},
            "engagement" : {}
        }
    },
    "experience" : "proficient",
    "brief" : "i need to create a app like snapchat",
    "time" : "regular",
    "hours" : "1",
    "budget" : 70,
    "title" : "1 hour swift mentoring"
  },

}
