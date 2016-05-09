module.exports = {

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


  preMigrateRebook: {
    "_id" : ObjectId("53f6ed3f2dd89e0200fab9bb"),
    "adm" : {
      "booked" : ISODate("2015-01-28T06:57:35.446Z"),
      "owner" : "ad"
    },
    "availability" : "I need help sometime in the next few weeks. I am in the California Bay Area (PST). I'm available any time. I'm looking for someone who can really help me get up to speed - that's why I am choosing the open source discount because I think there must be others out there in my shoes as well and I have been very frustrated with trying to learn all this new stuff...it's a whole new world!\n\nMy hourly budget is set at $90, but I will consider any price for the right person who can come in and help me get this done.",
    "brief" : "We are a very early stage startup. I'm in the beginning stages of developing the front-end of our complex web app. I need help getting up to speed with modern web development and I need help setting up the environment, making architectural decisions (choosing libraries etc.), bouncing ideas off someone experienced, and I need to get the project rolling.\n\nI'm an experienced .net developer (asp.net and asp.net mvc etc.). I've been developing for many years, but I have been out of the look on the modern web development movement. I need someone to get me up to speed fast and help me hit the pavement running with our web app.\n\nAs a note, I am developing on a windows machine and the app will be hosted on a windows server, so architectural decisions, tools, etc. need to work in that environment. ",
    "budget" : 150,
    "hours" : "1",
    "owner" : "ad",
    "pricing" : "private",
    "status" : "booked",
    "suggested" : [
        {
          "suggestedRate" : {
              "total" : 130,
              "expert" : 85
          },
          "matchedBy" : {
              "userId" : "53ea4d4b8f8c80299bcc4142",
              "initials" : "ad"
          },
          "_id" : ObjectId("53f77d9663c6a802001eab98"),
          "expertComment" : "Hey Richard,\n\nI may be able to help with this. I'm an ASP.NET Insider and have 5+ years of experience with developing web apps on the Microsoft stack. I also may be able to give recommendations for alternate tech stacks since I've spent the last two years developing NodeJS and Rails applications on Linux.",
          "expertAvailability" : "Friday, Saturdays, and Sundays CST any time. Just need a couple days notice.",
          "expertStatus" : "available",
          "expert" : {
              "_id" : ObjectId("52cc257d1b80d70200000021"),
              "rate" : 70,
              "email" : "ar@amirrajan.net",
              "tags" : []
          }
        },
        {
          "suggestedRate" : {
              "total" : 146,
              "expert" : 113
          },
          "matchedBy" : {
              "userId" : "53ea4d4b8f8c80299bcc4142",
              "initials" : "ad"
          },
          "_id" : ObjectId("53f77e1a05e60c0200ad05b0"),
          "expertComment" : "Looks like we're a match. I'm also experienced with the microsoft stack. I'm also a contributor for various open source projects including the popular NancyFX web framework. I LOVE angular and would probably steer you toward using either Nancy or WebAPI and Angular for your new modern way of developing web apps.",
          "expertAvailability" : "I travel between my home near Nashville, TN and my second home in the mountains of south Honduras. I'm currently in Honduras where the timezone is GMT-6 (Central Time Zone). It's 12:15 as I write this.",
          "expertStatus" : "available",
          "expert" : {
              "_id" : ObjectId("53e52d60ec1d260200aba3a2"),
              "rate" : 110,
              "email" : "byron@acklenavenue.com",
              "tags" : []
          }
        },
        {
          "suggestedRate" : {
              "total" : 130,
              "expert" : 85
          },
          "matchedBy" : {
              "initials" : "ad",
              "userId" : "53ea4d4b8f8c80299bcc4142"
          },
          "_id" : ObjectId("53f77e2363c6a802001eab99"),
          "expertComment" : "Hello - I'd be happy to work with you to consider using AngularJS paired with .NET Web Api 2 and Bootstrap as a mobile-first framework.",
          "expertAvailability" : "Fairfield, CA - remote/screenshare - pair programing.",
          "expertStatus" : "available",
          "expert" : {
              "_id" : ObjectId("53425557b33d7f020000001b"),
              "rate" : 70,
              "email" : "codeinfusion@gmail.com",
              "tags" : []
          }
        },
        {
          "suggestedRate" : {
              "total" : 130,
              "expert" : 85
          },
          "expertComment" : "For the past 15 years I've been building enterprise web applications for small businesses and Fortune 500 companies alike. During that time my focus was originally primarily the .NET stack just like you! I shifted that focus as I saw the market shifting, and I even wrote an article for AirPair about that shift - https://www.airpair.com/mean-stack/posts/developers-moving-dotnet-to-mean.\n\nI've done 100's of successful AirPair's with developers like you and I love the chance to get together and build that perfect solution - when two developers work together they always come up with a great solution.\n\nFinally, I have experience building and hosting this architecture in a Windows environment.",
          "expertAvailability" : "MST - flexible.",
          "_id" : ObjectId("54860076734a850200d64d2c"),
          "expertStatus" : "available",
          "expert" : {
            "_id" : ObjectId("53cfe315a60ad902009c5954"),
            "rate" : 70,
            "email" : "mperren@gmail.com",
            "tags" : []
          }
        }
    ],
    "tags" : [
      { "_id" : ObjectId("5277082066a6f999a465fac9"), "sort" : 0 },
      { "_id" : ObjectId("5149dccb5fc6390200000013"), "sort" : 1 },
      { "_id" : ObjectId("51828a7b66a6f999a465f293"), "sort" : 2 },
      { "_id" : ObjectId("514825fa2a26ea020000001a"), "sort" : 3 },
      { "_id" : ObjectId("514a478ebf8213020000006f"), "sort" : 4 },
      { "_id" : ObjectId("514825fa2a26ea020000003b"), "sort" : 5 }
    ],
    "userId" : ObjectId("53f6e6758f8c80299bcc43b3"),
    "by" : {
        "avatar" : "//0.gravatar.com/avatar/8ab3cb468c2f3bb65172b51309eced35",
        "email" : "rdeslonde@deslondesoftware.com",
        "name" : "Richard DesLonde"
    },
    "time" : "regular",
    "experience" : "proficient",
    "lastTouch" : {
        "by" : {
            "name" : "Richard DesLonde",
            "_id" : ObjectId("53f6e6758f8c80299bcc43b3")
        },
        "utc" : ISODate("2015-10-01T02:24:38.661Z"),
        "action" : "booked"
    }
  },

  aJob: {
    "_id" : ObjectId("53f6ed3f2dd89e0200fab9bb"),
    "userId" : ObjectId("53f6e6758f8c80299bcc43b3"),
    "adm" : {
        "owner" : "ad",
        "booked" : ISODate("2015-01-28T06:57:35.446Z")
    },
    "availability" : "I need help sometime in the next few weeks. I am in the California Bay Area (PST). I'm available any time. I'm looking for someone who can really help me get up to speed - that's why I am choosing the open source discount because I think there must be others out there in my shoes as well and I have been very frustrated with trying to learn all this new stuff...it's a whole new world!\n\nMy hourly budget is set at $90, but I will consider any price for the right person who can come in and help me get this done.",
    "brief" : "We are a very early stage startup. I'm in the beginning stages of developing the front-end of our complex web app. I need help getting up to speed with modern web development and I need help setting up the environment, making architectural decisions (choosing libraries etc.), bouncing ideas off someone experienced, and I need to get the project rolling.\n\nI'm an experienced .net developer (asp.net and asp.net mvc etc.). I've been developing for many years, but I have been out of the look on the modern web development movement. I need someone to get me up to speed fast and help me hit the pavement running with our web app.\n\nAs a note, I am developing on a windows machine and the app will be hosted on a windows server, so architectural decisions, tools, etc. need to work in that environment. ",
    "budget" : 150,
    "hours" : "1",
    "owner" : "ad",
    "pricing" : "private",
    "status" : "booked",
    "suggested" : [
        {
            "suggestedRate" : {
                "total" : 146,
                "expert" : 113
            },
            "matchedBy" : {
                "userId" : "53ea4d4b8f8c80299bcc4142",
                "initials" : "ad"
            },
            "_id" : ObjectId("53f77e1a05e60c0200ad05b0"),
            "expertComment" : "Looks like we're a match. I'm also experienced with the microsoft stack. I'm also a contributor for various open source projects including the popular NancyFX web framework. I LOVE angular and would probably steer you toward using either Nancy or WebAPI and Angular for your new modern way of developing web apps.",
            "expertAvailability" : "I travel between my home near Nashville, TN and my second home in the mountains of south Honduras. I'm currently in Honduras where the timezone is GMT-6 (Central Time Zone). It's 12:15 as I write this.",
            "expertStatus" : "available",
            "expert" : {
                "_id" : ObjectId("53e52d60ec1d260200aba3a2"),
                "rate" : 110,
                "email" : "byron@acklenavenue.com",
                "tags" : []
            }
        }
    ],
    "tags" : [
        {
            "_id" : ObjectId("5277082066a6f999a465fac9"),
            "sort" : 0
        },
        {
            "_id" : ObjectId("5149dccb5fc6390200000013"),
            "sort" : 1
        },
        {
            "_id" : ObjectId("51828a7b66a6f999a465f293"),
            "sort" : 2
        },
        {
            "_id" : ObjectId("514825fa2a26ea020000001a"),
            "sort" : 3
        },
        {
            "_id" : ObjectId("514a478ebf8213020000006f"),
            "sort" : 4
        },
        {
            "_id" : ObjectId("514825fa2a26ea020000003b"),
            "sort" : 5
        }
    ],
    "by" : {
        "avatar" : "//0.gravatar.com/avatar/8ab3cb468c2f3bb65172b51309eced35",
        "email" : "rdeslonde@deslondesoftware.com",
        "name" : "Richard DesLonde"
    },
    "time" : "regular",
    "experience" : "proficient",
    "lastTouch" : {
        "by" : {
            "name" : "Richard DesLonde",
            "_id" : ObjectId("570249c71d62d7b070786774")
        },
        "utc" : ISODate("2016-04-04T11:02:31.324Z"),
        "_id" : ObjectId("570249c7b98321b070596ba6"),
        "action" : "booked"
    }
  }
}
