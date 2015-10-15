module.exports = {

  unMigratedBookMe: [
    '54d7bd5aecaab6030032bc8e', '54fe332c03124e03005f98ad' // Seb + Gideon
  ],


  zesty1: {
    "_id" : ObjectId("53643dbd61a27c020000000b"),
    "availability" : "Not of critical urgency, but ASAP if possible, otherwise I'll be spending time looking at it myself. I'm in San Francisco, CA.",
    "brief" : "We have a fleet of drivers who are out during the day making food deliveries. Events (such as \"food picked up\", \"order delivered\") are sent back as they use our mobile app.\n\nI'd like to set up a simple status page that receives these events and displays a simple stream of them in real time. There's a lot we'd want to do with it in the future, but for now some assistance in setting this up from somebody who has real-time web app experience would be appreciated.\n\nI expect that I would want to make a new Rails app for this and that I would want to have it open a websocket to receive the events. But that's about as far as I've got.\n\nThanks!",
    "budget" : 130,
    "canceledDetail" : "",
    "company" : {
      "_id" : "52d8e173235755020000001d",
      "contacts" : [
      {
        "fullName" : "Chris Hollindale",
        "email" : "chris@hollindale.co.uk",
        "gmail" : "chris@hollindale.co.uk",
        "title" : "",
        "phone" : "4155139091",
        "userId" : "52d8e12c1c67d1a4859d1cab",
        "pic" : "https://lh3.googleusercontent.com/-X-6oaT6F9x8/AAAAAAAAAAI/AAAAAAAAARk/HXpXsWweXnY/photo.jpg",
        "twitter" : "chrishol",
        "timezone" : "GMT-0800 (PST)",
        "_id" : "53643be661a27c020000000a",
        "firstName" : "Chris"
      }
      ],
      "__v" : 0,
      "about" : "Healthy food delivery! (YC W2014)\n\nZesty lets you order healthy meals from your favorite local restaurants. Cooked without the bad stuff, see nutrition facts and photos, filter for low carb, gluten free, paleo and more!\n\nWe also offer a healthy catering service to businesses of all sizes.\n",
      "name" : "Zesty",
      "url" : "zesty.com"
    },
    "events" : [
    {
      "utc" : "2014-05-14T16:09:33.416Z",
      "name" : "expert view",
      "by" : {
        "id" : "534edf9b1c67d1a4859d2daa",
        "name" : "Nickolas Means"
      }
    },
    {
      "utc" : "2014-05-03T01:21:36.362Z",
      "name" : "anon view",
      "by" : "anon"
    },
    {
      "by" : {
        "name" : "Chris Hollindale",
        "id" : "52d8e12c1c67d1a4859d1cab"
      },
      "name" : "created",
      "utc" : "2014-05-03T00:52:13.451Z"
    },
    {
      "utc" : "2014-05-23T19:43:36.094Z",
      "name" : "updated",
      "by" : {
        "id" : ObjectId("5277c72066a6f999a465face"),
        "name" : "Igor Lebovic"
      }
    },
    {
      "utc" : "2014-07-10T20:17:28.981Z",
      "name" : "anon view",
      "by" : "anon"
    },
    {
      "utc" : "2014-11-17T20:19:03.877Z",
      "name" : "anon view",
      "by" : "anon"
    },
    {
      "utc" : "2014-11-17T20:19:04.045Z",
      "name" : "anon view",
      "by" : "anon"
    }
    ],
    "hours" : "1",
    "incompleteDetail" : "",
    "owner" : "jk",
    "pricing" : "opensource",
    "status" : "completed",
    "suggested" : [
    {
      "_id" : ObjectId("536442b3208d290200000009"),
      "expertRating" : 5,
      "expertFeedback" : "This is ideal for me!",
      "expertComment" : "This sounds really interesting. I've worked on location-based mobile games where we required real-time feeds. We managed to get this working on mobile networks by pushing all traffic over port 443 (HTTPS).\nAlso, I'm working on a Chrome extension at the moment that needs to send real-time data to a Rails server, and that's been working quite well.\n\nLet's do this!",
      "expertAvailability" : "Sydney, Australia. UTC+10h.\nI can do 6-10AM San Francisco time, any day is okay.",
      "events" : [
      {
        "utc" : "2014-05-03T01:13:23.936Z",
        "name" : "first contacted",
        "by" : {
          "id" : "5175efbfa3802cc4d5a5e6ed",
          "name" : "Jonathon Kresner"
        }
      },
      {
        "utc" : "2014-05-05T00:04:45.006Z",
        "name" : "viewed",
        "by" : {
          "id" : "520c12d266a6f999a465f5f3",
          "name" : "David Parry"
        }
      },
      {
        "by" : {
          "name" : "David Parry",
          "id" : "520c12d266a6f999a465f5f3"
        },
        "name" : "expert updated",
        "utc" : "2014-05-05T00:10:00.939Z"
      },
      {
        "utc" : "2014-05-05T00:12:23.191Z",
        "name" : "expert updated",
        "by" : {
          "id" : "520c12d266a6f999a465f5f3",
          "name" : "David Parry"
        }
      },
      {
        "by" : {
          "name" : "David Parry",
          "id" : "520c12d266a6f999a465f5f3"
        },
        "name" : "viewed",
        "utc" : "2014-05-05T03:14:58.366Z"
      },
      {
        "utc" : "2014-05-05T12:28:15.071Z",
        "name" : "viewed",
        "by" : {
          "id" : "520c12d266a6f999a465f5f3",
          "name" : "David Parry"
        }
      }
      ],
      "expertStatus" : "available",
      "expert" : {
        "_id" : ObjectId("520c13bfb3e6350200000008"),
        "email" : "david.parry@suranyami.com",
        "gmail" : "david.parry@suranyami.com",
        "name" : "David Parry",
        "rate" : 110,
        "userId" : ObjectId("520c12d266a6f999a465f5f3"),
        "tw" : {
          "username" : "suranyami"
        },
        "in" : {
          "id" : "rWOS6ol4MP"
        },
        "gh" : {
          "username" : "suranyami"
        }
      }
    },
    {
      "_id" : ObjectId("536442b6208d29020000000a"),
      "events" : [
      {
        "by" : {
          "name" : "Jonathon Kresner",
          "id" : "5175efbfa3802cc4d5a5e6ed"
        },
        "name" : "first contacted",
        "utc" : "2014-05-03T01:13:26.548Z"
      },
      {
        "utc" : "2014-05-13T22:39:18.535Z",
        "name" : "viewed",
        "by" : {
          "id" : "534edf9b1c67d1a4859d2daa",
          "name" : "Nickolas Means"
        }
      },
      {
        "by" : {
          "name" : "Nickolas Means",
          "id" : "534edf9b1c67d1a4859d2daa"
        },
        "name" : "viewed",
        "utc" : "2014-05-14T16:09:33.417Z"
      }
      ],
      "expertStatus" : "waiting",
      "expert" : {
        "userId" : ObjectId("534edf9b1c67d1a4859d2daa"),
        "rate" : 70,
        "name" : "Nickolas Means",
        "gmail" : "nmeans@gmail.com",
        "email" : "nmeans@gmail.com",
        "_id" : ObjectId("534edfc00f33e7020000000c"),
        "tw" : {
          "username" : "nmeans"
        },
        "in" : {
          "id" : "MV420oFhjy"
        },
        "bb" : {
          "id" : "leenasn"
        },
        "so" : {
          "link" : "788574/leenasn"
        },
        "gh" : {
          "username" : "nmeans"
        }
      }
    },
    {
      "_id" : ObjectId("536442c6126e5b0200000009"),
      "events" : [
      {
        "utc" : "2014-05-03T01:13:42.044Z",
        "name" : "first contacted",
        "by" : {
          "id" : "5175efbfa3802cc4d5a5e6ed",
          "name" : "Jonathon Kresner"
        }
      }
      ],
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("52f17fe5f13bc7020000003b"),
        "email" : "ivan@app.io",
        "gmail" : "ivan@app.io",
        "name" : "Ivan Vanderbyl",
        "rate" : 70,
        "userId" : ObjectId("52f17fa51c67d1a4859d1f8a"),
        "tw" : {
          "username" : "IvanVanderbyl"
        },
        "in" : {
          "id" : "xPyDeRFiq6"
        },
        "so" : {
          "link" : "353392/ivan"
        },
        "gh" : {
          "username" : "ivanvanderbyl"
        }
      }
    }
    ],
    "tags" : [
    {
      "soId" : "ruby-on-rails",
      "short" : "ruby-on-rails",
      "name" : "ruby-on-rails",
      "_id" : "514825fa2a26ea020000002f"
    },
    {
      "soId" : "websocket",
      "short" : "websocket",
      "name" : "websocket",
      "_id" : "5181d0aa66a6f999a465ed67"
    }
    ],
    "userId" : ObjectId("52d8e12c1c67d1a4859d1cab")
  },




  btownsend: {
    "_id" : ObjectId("55f093e56882141100f3aab5"),
    "type" : "advice",
    "by" : {
      "avatar" : "//0.gravatar.com/avatar/de6dd63bd3ceaa418e2314d2b25d2807",
      "email" : "btownsend@trackerproducts.com",
      "name" : "Ben Townsend"
    },
    "userId" : ObjectId("55e78240d409a1110093d252"),
    "status" : "complete",
    "marketingTags" : [],
    "messages" : [
    {
      "type" : "review",
      "_id" : ObjectId("55f34475674bfd1100cab853"),
      "subject" : "Ready for some jenkins, elastic-beanstalk and aws AirPairing?\n",
      "fromId" : ObjectId("5175efbfa3802cc4d5a5e6ed"),
      "toId" : ObjectId("55e78240d409a1110093d252"),
      "body" : "Hi again Ben,\n\nHope you've have had some time to look over your responses. Who are you going to book? Best not wait too long like last time as expert schedules and availability changes rapidly.\n\nhttps://www.airpair.com/review/55f093e56882141100f3aab5\n\nBest,\n\nJonathon"
    }
    ],
    "suggested" : [
    {
      "expertAvailability" : "Friday, 9/18 any time. I understand if this may not be soon enough for the client and that you may have to find someone else.",
      "expertComment" : "Hello, I'd be happy to help. There is a lot of variation and \"messiness\" in general in the monitoring space, but I've helped other clients select and implement different solutions.",
      "suggestedRate" : {
        "expert" : 170,
        "total" : 210
      },
      "_id" : ObjectId("55f0ab75855b5111002bbb63"),
      "matchedBy" : {
        "_id" : "55f0ab75855b5111002bbb62",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertStatus" : "available",
      "reply" : {
        "time" : ISODate("2015-09-09T22:11:02.230Z")
      },
      "expert" : {
        "username" : "josh_padnick",
        "email" : "josh@phoenixdevops.com",
        "name" : "Josh Padnick",
        "location" : "Phoenix, AZ, USA",
        "timezone" : "Mountain Standard Time",
        "userId" : ObjectId("546e200d8f8c80299bcc518d"),
        "rate" : 230,
        "gmail" : "josh@phoenixdevops.com",
        "_id" : ObjectId("54876c0987c8e1020001c6a9"),
        "tw" : {
          "username" : "OhMyGoshJosh"
        },
        "in" : {
          "id" : "LmWoIKGxQX"
        },
        "so" : {
          "link" : "2308858/josh-padnick"
        },
        "gh" : {
          "username" : "josh-padnick"
        },
        "tags" : [
        {
          "name" : "AWS",
          "slug" : "aws",
          "sort" : 0,
          "_id" : "514825fa2a26ea0200000007"
        },
        {
          "name" : "amazon",
          "slug" : "amazon",
          "sort" : 1,
          "_id" : "5181d0ab66a6f999a465ef77"
        },
        {
          "name" : "devops",
          "slug" : "devops",
          "sort" : 2,
          "_id" : "5358c8081c67d1a4859d2f18"
        }
        ]
      }
    },
    {
      "suggestedRate" : {
        "expert" : 128,
        "total" : 186
      },
      "_id" : ObjectId("55f0abc894b4b21100aa0f03"),
      "matchedBy" : {
        "_id" : ObjectId("55f0abc894b4b21100aa0f02"),
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertComment" : "I have experience deploying multiple apps to AWS, and can likely help you. However, I don't know what language/framework you are running, and that plays a significant role in knowing how much I can help you. Perhaps we can discuss on Airpair's Slack?",
      "expertAvailability" : "Evening of 9/9, after 7pm CDT; 9/10 before 2PM CDT.",
      "expertStatus" : "available",
      "reply" : {
        "time" : ISODate("2015-09-09T22:17:46.710Z")
      },
      "expert" : {
        "_id" : ObjectId("529e685c1a4bf00200000017"),
        "gmail" : "bdcravens@gmail.com",
        "rate" : 110,
        "userId" : ObjectId("529e680966a6f999a465fd14"),
        "timezone" : "Central Daylight Time",
        "location" : "Houston, TX, USA",
        "name" : "Billy Cravens",
        "email" : "bdcravens@gmail.com",
        "username" : "bdcravens",
        "tw" : {
          "username" : "bdcravens"
        },
        "in" : {
          "id" : "heXUZ8MiCA"
        },
        "so" : {
          "link" : "369838/billy-cravens"
        },
        "gh" : {
          "username" : "bdcravens"
        },
        "tags" : [
        {
          "name" : "AWS",
          "slug" : "aws",
          "_id" : "514825fa2a26ea0200000007",
          "sort" : 0
        },
        {
          "name" : "coldfusion",
          "slug" : "coldfusion",
          "_id" : "5181d0a966a6f999a465ec2d",
          "sort" : 1
        },
        {
          "name" : "vagrant",
          "slug" : "vagrant",
          "_id" : "51f7e26566a6f999a465f4b6",
          "sort" : 2
        },
        {
          "name" : "Chef",
          "slug" : "chef",
          "_id" : "514825fa2a26ea020000000f",
          "sort" : 3
        },
        {
          "name" : "ruby",
          "slug" : "ruby",
          "_id" : "514825fa2a26ea0200000031",
          "sort" : 4
        },
        {
          "name" : "Ruby on Rails",
          "slug" : "ruby-on-rails",
          "_id" : "514825fa2a26ea020000002f",
          "sort" : 5
        },
        {
          "name" : "mysql",
          "slug" : "mysql",
          "_id" : "514825fa2a26ea0200000027",
          "sort" : 6
        },
        {
          "name" : "Microsoft Sql Server",
          "slug" : "sqlserver",
          "_id" : "514825fa2a26ea0200000026",
          "sort" : 7
        },
        {
          "name" : "Linux",
          "slug" : "linux",
          "_id" : "514825fa2a26ea0200000023",
          "sort" : 8
        },
        {
          "name" : "selenium",
          "slug" : "selenium",
          "_id" : "5181d0a966a6f999a465ebfa",
          "sort" : 9
        },
        {
          "name" : "selenium-rc",
          "slug" : "selenium-rc",
          "_id" : "5181d0ac66a6f999a465f06f",
          "sort" : 10
        },
        {
          "name" : "selenium-webdriver",
          "slug" : "selenium-webdriver",
          "_id" : "5181d0ac66a6f999a465f09d",
          "sort" : 11
        },
        {
          "name" : "selenium2",
          "slug" : "selenium2",
          "_id" : "5181d0ac66a6f999a465f01f",
          "sort" : 12
        },
        {
          "name" : "nokogiri",
          "slug" : "nokogiri",
          "_id" : "5181d0ab66a6f999a465efd8",
          "sort" : 13
        },
        {
          "name" : "railo",
          "slug" : "railo",
          "_id" : "52f4a0fa1c67d1a4859d21b0",
          "sort" : 14
        }
        ]
      }
    },
    {
      "expertAvailability" : "I'm available tomorrow (Friday) before 11am or from 1-2pm EDT (New York time). For this sort of engagement I'd recommend splitting into 2 1 hour sessions to allow for time between to research & test things on your setup.",
      "expertComment" : "Ben, I've run large (200+ instances, 1500+ at peak) and small (2 servers) on AWS and traditional colos, I'd be happy to take some time to help you prepare for production traffic.",
      "matchedBy" : {
        "_id" : "55f0ab3b94b4b21100aa0eda",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("55f0ab3b94b4b21100aa0edb"),
      "suggestedRate" : {
        "expert" : 170,
        "total" : 210
      },
      "expertStatus" : "available",
      "reply" : {
        "time" : ISODate("2015-09-10T20:12:12.863Z")
      },
      "expert" : {
        "username" : "ryansb",
        "email" : "ryan.sc.brown@gmail.com",
        "name" : "Ryan Brown",
        "location" : "Buffalo, NY, USA",
        "timezone" : "Eastern Daylight Time",
        "userId" : ObjectId("524c762c66a6f999a465f8bf"),
        "rate" : 190,
        "gmail" : "ryan.sc.brown@gmail.com",
        "_id" : ObjectId("524c772818a667020000002a"),
        "tw" : {
          "username" : "ryan_sb"
        },
        "in" : {
          "id" : "VkpYMKnpB3"
        },
        "gh" : {
          "username" : "ryansb"
        },
        "tags" : [
        {
          "name" : "python",
          "slug" : "python",
          "sort" : 1,
          "_id" : "514825fa2a26ea020000002d"
        },
        {
          "name" : "go",
          "slug" : "go",
          "sort" : 2,
          "_id" : "5181d0aa66a6f999a465ee3c"
        },
        {
          "name" : "code-review",
          "slug" : "code-review",
          "sort" : 10,
          "_id" : "5181d0ad66a6f999a465f1a0"
        },
        {
          "name" : "AWS",
          "slug" : "aws",
          "sort" : 3,
          "_id" : "514825fa2a26ea0200000007"
        },
        {
          "name" : "amazon-s3",
          "slug" : "amazon-s3",
          "sort" : 5,
          "_id" : "5181d0a966a6f999a465ec9f"
        },
        {
          "name" : "amazon-ec2",
          "slug" : "amazon-ec2",
          "sort" : 6,
          "_id" : "514a3e17bf8213020000002f"
        },
        {
          "name" : "bash",
          "slug" : "bash",
          "sort" : 3,
          "_id" : "515207f0eecddf0200000014"
        },
        {
          "name" : "openstack",
          "slug" : "openstack",
          "sort" : 7,
          "_id" : "51acf13066a6f999a465f362"
        },
        {
          "name" : "zsh",
          "slug" : "zsh",
          "sort" : 11,
          "_id" : "535f1be01c67d1a4859d2ff8"
        },
        {
          "name" : "flask",
          "slug" : "flask",
          "sort" : 9,
          "_id" : "5181d0ab66a6f999a465eec5"
        },
        {
          "name" : "pyramid",
          "slug" : "pyramid",
          "sort" : 12,
          "_id" : "5153f1c6d96db10200000009"
        },
        {
          "name" : "Django",
          "slug" : "django",
          "sort" : 13,
          "_id" : "514830f257e7aa0200000014"
        },
        {
          "name" : "ansible",
          "slug" : "ansible",
          "sort" : 14,
          "_id" : "5289278a66a6f999a465fba8"
        },
        {
          "name" : "Chef",
          "slug" : "chef",
          "sort" : 15,
          "_id" : "514825fa2a26ea020000000f"
        },
        {
          "name" : "Linux",
          "slug" : "linux",
          "sort" : 16,
          "_id" : "514825fa2a26ea0200000023"
        },
        {
          "name" : "sysadmin",
          "slug" : "sysadmin",
          "sort" : 17,
          "_id" : "51520242eecddf0200000006"
        },
        {
          "name" : "openshift",
          "slug" : "openshift",
          "sort" : 8,
          "_id" : "51aba75666a6f999a465f350"
        },
        {
          "name" : "open-source",
          "slug" : "open-source",
          "sort" : 4,
          "_id" : "5181d0aa66a6f999a465ecd9"
        }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : "55f0ab1a94b4b21100aa0ec4",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("55f0ab1a94b4b21100aa0ec5"),
      "suggestedRate" : {
        "expert" : 79,
        "total" : 158
      },
      "expertComment" : "I likely don't have enough knowledge to help you. You might find more help out there also if you give more details about your actually stack e.g. what your code bases is in PHP/Ruby/Node/Java? And what in particular you're looking for stats wise? It sounds more like you need someone more to help you run load testing so you can be sure your production environment with manage your expected user target.",
      "expertAvailability" : "Not available",
      "expertStatus" : "busy",
      "reply" : {
        "time" : ISODate("2015-09-09T22:07:26.387Z")
      },
      "expert" : {
        "_id" : ObjectId("55e5d094bc3a0c1100e636d0"),
        "rate" : 40,
        "userId" : ObjectId("5328b7df1c67d1a4859d2867"),
        "timezone" : "British Summer Time",
        "location" : "Flitwick, Bedford, Central Bedfordshire MK45, UK",
        "username" : "peterfox",
        "email" : "slyfoxy@gmail.com",
        "name" : "Peter Fox",
        "tw" : {
          "username" : "SlyFireFox"
        },
        "so" : {
          "link" : "795290/peter-fox"
        },
        "gh" : {
          "username" : "peterfox"
        },
        "tags" : [
        {
          "name" : "laravel",
          "slug" : "laravel",
          "sort" : 1,
          "_id" : "515a8cbdeb85470200000029"
        },
        {
          "name" : "graphaware",
          "slug" : "graphaware",
          "sort" : 1,
          "_id" : "55e5ce368e247d11009e9c2a"
        },
        {
          "name" : "symfony2",
          "slug" : "symfony2",
          "sort" : 2,
          "_id" : "5181d0a966a6f999a465ebbc"
        },
        {
          "name" : "neo4j",
          "slug" : "neo4j",
          "sort" : 6,
          "_id" : "5181d0ab66a6f999a465efc3"
        },
        {
          "name" : "PHP",
          "slug" : "php",
          "sort" : 3,
          "_id" : "514825fa2a26ea020000002b"
        },
        {
          "name" : "aws-lambda",
          "slug" : "aws-lambda",
          "sort" : 4,
          "_id" : "55b6e4d2fb8c2d1100541773"
        },
        {
          "name" : "elastic-beanstalk",
          "slug" : "elastic-beanstalk",
          "sort" : 5,
          "_id" : "5398a4831c67d1a4859d3476"
        },
        {
          "name" : "java",
          "slug" : "java",
          "sort" : 7,
          "_id" : "514825fa2a26ea020000001e"
        }
        ]
      }
    },
    {
      "suggestedRate" : {
        "expert" : 93,
        "total" : 166
      },
      "_id" : ObjectId("55f0ab45855b5111002bbb53"),
      "matchedBy" : {
        "_id" : "55f0ab45855b5111002bbb52",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("557198649791611100558da7"),
        "rate" : 60,
        "userId" : ObjectId("557192d5b376c81100de6beb"),
        "timezone" : "British Summer Time",
        "location" : "Bristol, City of Bristol, UK",
        "name" : "Jon Rea",
        "email" : "jon.rea@gmail.com",
        "username" : "JonnyWideFoot",
        "tw" : {
          "username" : "JonnyWideFoot"
        },
        "in" : {
          "id" : "6RjubtBa__"
        },
        "so" : {
          "link" : "426273/jon-rea"
        },
        "gh" : {
          "username" : "JonnyWideFoot"
        },
        "tags" : [
        {
          "name" : "c#",
          "slug" : "c%23",
          "_id" : "514825fa2a26ea020000000e",
          "sort" : 0
        },
        {
          "name" : "asp.net",
          "slug" : "asp.net",
          "_id" : "514a3f2ebf82130200000030",
          "sort" : 1
        },
        {
          "name" : "asp.net-mvc",
          "slug" : "asp.net-mvc",
          "_id" : "5181d0a966a6f999a465eb34",
          "sort" : 2
        },
        {
          "name" : "asp.net-webforms",
          "slug" : "asp.net-webforms",
          "_id" : "5181d0ab66a6f999a465efe3",
          "sort" : 3
        },
        {
          "name" : "WinForms",
          "slug" : "winforms",
          "_id" : "514a50c1bf821302000000ad",
          "sort" : 4
        },
        {
          "name" : "wcf-data-services",
          "slug" : "wcf-data-services",
          "_id" : "5181d0ab66a6f999a465efb3",
          "sort" : 5
        },
        {
          "name" : "Windows Presentation Foundation",
          "slug" : "wpf",
          "_id" : "514a50d7bf821302000000af",
          "sort" : 6
        },
        {
          "name" : "windows-universal",
          "slug" : "windows-universal",
          "_id" : "545249d58f8c80299bcc4df1",
          "sort" : 8
        },
        {
          "name" : "windows-phone",
          "slug" : "windows-phone",
          "_id" : "5181d0ab66a6f999a465ef5e",
          "sort" : 8
        },
        {
          "name" : "Windows Azure",
          "slug" : "azure",
          "_id" : "514825fa2a26ea0200000008",
          "sort" : 9
        },
        {
          "name" : "AWS",
          "slug" : "aws",
          "_id" : "514825fa2a26ea0200000007",
          "sort" : 10
        },
        {
          "name" : "elastic-beanstalk",
          "slug" : "elastic-beanstalk",
          "_id" : "5398a4831c67d1a4859d3476",
          "sort" : 11
        },
        {
          "name" : "amazon-route53",
          "slug" : "amazon-route53",
          "_id" : "534c998b1c67d1a4859d2d44",
          "sort" : 12
        },
        {
          "name" : "amazon-ec2",
          "slug" : "amazon-ec2",
          "_id" : "514a3e17bf8213020000002f",
          "sort" : 13
        },
        {
          "name" : "amazon-s3",
          "slug" : "amazon-s3",
          "_id" : "5181d0a966a6f999a465ec9f",
          "sort" : 14
        }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : "55f0ab7d94b4b21100aa0eed",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("55f0ab7d94b4b21100aa0eee"),
      "suggestedRate" : {
        "expert" : 135,
        "total" : 190
      },
      "expertStatus" : "waiting",
      "expert" : {
        "username" : "kesor",
        "email" : "evgeny@devops.co.il",
        "name" : "Evgeny Zislis",
        "location" : "Tel Aviv-Yafo, Israel",
        "timezone" : "Israel Daylight Time",
        "userId" : ObjectId("52f24e491c67d1a4859d208d"),
        "rate" : 120,
        "gmail" : "evgeny@devops.co.il",
        "_id" : ObjectId("52f24f1890df5e0200000083"),
        "tw" : {
          "username" : "kesor6"
        },
        "in" : {
          "id" : "9ZPSg_JcCY"
        },
        "so" : {
          "link" : "11414/evgeny"
        },
        "gh" : {
          "username" : "kesor"
        },
        "tags" : [
        {
          "name" : "Chef",
          "slug" : "chef",
          "_id" : "514825fa2a26ea020000000f",
          "sort" : 0
        },
        {
          "name" : "bash",
          "slug" : "bash",
          "_id" : "515207f0eecddf0200000014",
          "sort" : 1
        },
        {
          "name" : "capistrano",
          "slug" : "capistrano",
          "_id" : "5181d0ab66a6f999a465ef0f",
          "sort" : 2
        },
        {
          "name" : "deployment",
          "slug" : "deployment",
          "_id" : "515b73a3eb85470200000041",
          "sort" : 3
        },
        {
          "name" : "MongoDB",
          "slug" : "mongodb",
          "_id" : "514825fa2a26ea0200000025",
          "sort" : 4
        },
        {
          "name" : "AWS",
          "slug" : "aws",
          "_id" : "514825fa2a26ea0200000007",
          "sort" : 5
        },
        {
          "name" : "teamcity",
          "slug" : "teamcity",
          "_id" : "5181d0ab66a6f999a465ef53",
          "sort" : 6
        },
        {
          "name" : "amazon-ec2",
          "slug" : "amazon-ec2",
          "_id" : "514a3e17bf8213020000002f",
          "sort" : 7
        },
        {
          "name" : "amazon-s3",
          "slug" : "amazon-s3",
          "_id" : "5181d0a966a6f999a465ec9f",
          "sort" : 8
        },
        {
          "name" : "amazon-web-services",
          "slug" : "amazon-web-services",
          "_id" : "5181d0a966a6f999a465ec8a",
          "sort" : 9
        },
        {
          "name" : "Linux",
          "slug" : "linux",
          "_id" : "514825fa2a26ea0200000023",
          "sort" : 10
        },
        {
          "name" : "NGINX",
          "slug" : "nginx",
          "_id" : "5153f494d96db10200000011",
          "sort" : 11
        },
        {
          "name" : "ssh",
          "slug" : "ssh",
          "_id" : "5181d0a966a6f999a465ec74",
          "sort" : 12
        },
        {
          "name" : "monitoring",
          "slug" : "monitoring",
          "_id" : "5181d0ab66a6f999a465efea",
          "sort" : 13
        },
        {
          "name" : "git",
          "slug" : "git",
          "_id" : "5181d0a966a6f999a465eb40",
          "sort" : 14
        },
        {
          "name" : "elasticsearch",
          "slug" : "elasticsearch",
          "sort" : 15,
          "_id" : "515499dcd96db10200000049"
        },
        {
          "name" : "kibana",
          "slug" : "kibana",
          "sort" : 16,
          "_id" : "543f4efa8f8c80299bcc4bef"
        },
        {
          "name" : "logstash",
          "slug" : "logstash",
          "sort" : 17,
          "_id" : "530e42981c67d1a4859d250b"
        },
        {
          "name" : "ec2-container-service",
          "slug" : "ec2-container-service",
          "sort" : 18,
          "_id" : "556e023f95af9311007e9988"
        }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : ObjectId("55f0ac0294b4b21100aa0f0f"),
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("55f0ac0294b4b21100aa0f10"),
      "suggestedRate" : {
        "expert" : 128,
        "total" : 186
      },
      "expertStatus" : "waiting",
      "expert" : {
        "username" : "akatz",
        "userId" : ObjectId("520436b566a6f999a465f534"),
        "timezone" : "GMT-0400 (EDT)",
        "rate" : 110,
        "name" : "Avrohom Katz",
        "gmail" : "iambpentameter@gmail.com",
        "email" : "iambpentameter@gmail.com",
        "_id" : ObjectId("5204378b4af6ba020000003b"),
        "tw" : {
          "username" : "akatz"
        },
        "gh" : {
          "username" : "akatz"
        },
        "tags" : [
        {
          "name" : "AWS",
          "slug" : "aws",
          "_id" : "514825fa2a26ea0200000007"
        },
        {
          "name" : "Ruby on Rails",
          "slug" : "ruby-on-rails",
          "_id" : "514825fa2a26ea020000002f"
        },
        {
          "name" : "ember.js",
          "slug" : "ember.js",
          "_id" : "5181d0aa66a6f999a465eceb"
        },
        {
          "name" : "Backbone.js",
          "slug" : "backbone.js",
          "_id" : "5149d9d37bc6da020000000a"
        },
        {
          "name" : "jquery",
          "slug" : "jquery",
          "_id" : "514825fa2a26ea0200000021"
        },
        {
          "name" : "Chef",
          "slug" : "chef",
          "_id" : "514825fa2a26ea020000000f"
        },
        {
          "name" : "rspec2",
          "slug" : "rspec2",
          "_id" : "5181d0ad66a6f999a465f19f"
        },
        {
          "name" : "rspec",
          "slug" : "rspec",
          "_id" : "5181d0a966a6f999a465ec4a"
        },
        {
          "name" : "vim",
          "slug" : "vim",
          "_id" : "5181d0a966a6f999a465ebaa"
        },
        {
          "name" : "mysql",
          "slug" : "mysql",
          "_id" : "514825fa2a26ea0200000027"
        },
        {
          "name" : "automation",
          "slug" : "automation",
          "_id" : "5181d0aa66a6f999a465ecf8"
        },
        {
          "name" : "continuous-integration",
          "slug" : "continuous-integration",
          "_id" : "5181d0aa66a6f999a465eda3"
        },
        {
          "name" : "jenkins",
          "slug" : "jenkins",
          "_id" : "5181d0aa66a6f999a465ecfe"
        },
        {
          "name" : "amazon-web-services",
          "slug" : "amazon-web-services",
          "_id" : "5181d0a966a6f999a465ec8a"
        }
        ]
      }
    }
    ],
    "tags" : [
    {
      "sort" : 0,
      "slug" : "jenkins",
      "_id" : ObjectId("5181d0aa66a6f999a465ecfe")
    },
    {
      "sort" : 1,
      "slug" : "elastic-beanstalk",
      "_id" : ObjectId("5398a4831c67d1a4859d3476")
    },
    {
      "_id" : ObjectId("514825fa2a26ea0200000007"),
      "slug" : "aws",
      "sort" : 2
    }
    ],
    "adm" : {
      "booked" : ISODate("2015-09-15T00:12:03.808Z"),
      "reviewable" : ISODate("2015-09-09T22:11:02.233Z"),
      "received" : ISODate("2015-09-09T20:45:27.452Z"),
      "submitted" : ISODate("2015-09-09T20:19:29.787Z"),
      "active" : true,
      "owner" : "jk",
      "lastTouch" : {
        "action" : "remove:Manuel Doninger",
        "utc" : ISODate("2015-09-14T19:11:44.427Z"),
        "by" : {
          "_id" : ObjectId("5175efbfa3802cc4d5a5e6ed"),
          "name" : "Jonathon Kresner"
        }
      }
    },
    "lastTouch" : {
      "by" : {
        "name" : "Ben Townsend",
        "_id" : ObjectId("55e78240d409a1110093d252")
      },
      "utc" : ISODate("2015-09-15T00:12:03.808Z"),
      "action" : "booked"
    },
    "experience" : "proficient",
    "brief" : "We are weeks from launching a new application on AWS.  We are some 18 months into dev.  We want to make certain we have the right monitoring tools in place and know what the tools are telling us.\n\nWe are using Amazon Web Services with Elastic Beanstalk, Jenkins for continuous builds and Ruxit for monitoring.",
    "time" : "rush",
    "hours" : "2",
    "budget" : 210,
    "title" : "2 hour aws, angularjs and web-applications advice",
    "user" : {
      "chat" : {
        "slack" : {
          "profile" : {}
        }
      },
      "cohort" : {
        "firstRequest" : {},
        "engagement" : {}
      },
      "google" : {
        "token" : {
          "attributes" : {}
        },
        "_json" : {
          "image" : {},
          "name" : {}
        },
        "name" : {}
      },
      "local" : {},
      "localization" : {
        "timezoneData" : {},
        "locationData" : {
          "geometry" : {
            "viewport" : {
              "Ea" : {},
              "Ja" : {}
            },
            "location" : {}
          }
        }
      },
      "social" : {
        "sl" : {}
      }
    }
  }

}
