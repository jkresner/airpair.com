var user = {
  "_id" :  ObjectId("534edf9b1c67d1a4859d2daa"),
  "cohort" : {
    "engagement" : {
      "visit_first" : ISODate("2014-04-16T19:52:59.000Z"),
      "visit_signup" : ISODate("2014-04-16T19:52:59.000Z")
    },
    "aliases" : []
  },
  "linked" : {
    "gp" : {
      "id" : "106912387350678697214",
      "email" : "nmeans@gmail.com",
      "verified_email" : true,
      "name" : "Nickolas Means",
      "given_name" : "Nickolas",
      "family_name" : "Means",
      "link" : "https://plus.google.com/106912387350678697214",
      "picture" : "https://lh3.googleusercontent.com/-z-7uvfgkuSQ/AAAAAAAAAAI/AAAAAAAAApk/q5K-0e80H54/photo.jpg",
      "gender" : "male",
      "locale" : "en",
      "token" : {
        token: "yatoke",
        "attributes" : {}
      }
    },
    "gh" : {
      "login" : "nmeans",
      "id" : 568,
      "avatar_url" : "https://avatars.githubusercontent.com/u/568?",
      "gravatar_id" : "c6cb7f4790f6f7e823ff75bd83914362",
      "name" : "Nickolas Means",
      "company" : "Helium Syndicate",
      "blog" : "twitter.com/nmeans",
      "location" : "Austin, TX",
      "email" : "nick@heliumsyndicate.com",
      "hireable" : false,
      "bio" : null,
      "public_repos" : 39,
      "public_gists" : 8,
      "followers" : 17,
      "following" : 3,
      "created_at" : "2008-02-21T17:05:06Z",
      "updated_at" : "2014-04-14T21:30:57Z",
      "token" : {
        token: "cf92ee881f73c916c6eb65366c82af1105a087e0",
        "attributes" : {}
      }
    },
    "tw" : {
      "id" : 639193,
      "name" : "Nickolas Means",
      "screen_name" : "nmeans",
      "location" : "Austin, TX",
      "description" : "Coder, beerophile, truth-seeker. I'm a Rubyist from Austin and I spend my days fixing healthcare at WellMatch Health.",
      "url" : "http://t.co/XKnFIfXInG",
      "protected" : false,
      "followers_count" : 396,
      "friends_count" : 630,
      "listed_count" : 15,
      "created_at" : "Mon Jan 15 21:33:49 +0000 2007",
      "favourites_count" : 87,
      "utc_offset" : -18000,
      "time_zone" : "Central Time (US & Canada)",
      "geo_enabled" : true,
      "verified" : false,
      "lang" : "en",
      "profile_image_url" : "http://pbs.twimg.com/profile_images/3704224465/7fcb03c83669ee5d0d8bd8e82216a545_normal.jpeg",
      "following" : false,
      "notifications" : false,
      "suspended" : false,
      "needs_phone_verification" : false,
      "token" : {
        token: "639193-WvOpyIEqQW5N6DnnDUIjwUv2RcMifU5rUTcDUDg8svN",
        "attributes" : { "tokenSecret" : "JvNZVC6d3BywS78INaGkKvG9295axeDjdc8QhHXAfANxN" }
      }
    }
  }
}


var expert = {
  "_id" : ObjectId("534edfc00f33e7020000000c"),
  "availability" : {
    "status" : "busy",
    "minRate" : 70,
    "hours" : "1"
  },
  "brief" : "I love helping translate complicated business requirements into elegant objects, especially requirements that span disparate systems. I've also done quite a bit of payment integration (both ecommerce and SaaS), so I know my way around PCI and how to avoid holding on to PCI-scope data.",
  "gmail" : "nmeans@gmail.com",
  "rate" : 110,
  "tags" : [
    { "_id" : "514825fa2a26ea0200000031", "sort" : 0 },
    { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
    { "_id" : "515206c4eecddf0200000012", "sort" : 2 },
    { "_id" : "51cb57e266a6f999a465f3ff", "sort" : 3 },
    { "_id" : "531184ff1c67d1a4859d25f2", "sort" : 4 },
    { "_id" : "514825fa2a26ea020000002e", "sort" : 5 },
    { "_id" : "5181d0aa66a6f999a465ed67", "sort" : 6 },
    { "_id" : "530790cf1c67d1a4859d2446", "sort" : 7 },
    { "_id" : "51a81be566a6f999a465f31a", "sort" : 8 }
  ],
  "userId" : ObjectId("534edf9b1c67d1a4859d2daa")
}


var requests = [
{
  "_id" : ObjectId("53643dbd61a27c020000000b"),
  "availability" : "Not of critical urgency, but ASAP if possible, otherwise I'll be spending time looking at it myself. I'm in San Francisco, CA.",
  "brief" : "We have a fleet of drivers who are out during the day making food deliveries. Events (such as \"food picked up\", \"order delivered\") are sent back as they use our mobile app.\n\nI'd like to set up a simple status page that receives these events and displays a simple stream of them in real time. There's a lot we'd want to do with it in the future, but for now some assistance in setting this up from somebody who has real-time web app experience would be appreciated.\n\nI expect that I would want to make a new Rails app for this and that I would want to have it open a websocket to receive the events. But that's about as far as I've got.\n\nThanks!",
  "budget" : 130,
  "canceledDetail" : "",
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
      "expertStatus" : "available",
      "expert" : {
        "_id" : ObjectId("520c13bfb3e6350200000008"),
        "rate" : 110,
        "email" : "david.parry@suranyami.com"
      }
    },
    {
      "_id" : ObjectId("536442b6208d29020000000a"),
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("534edfc00f33e7020000000c"),
        "rate" : 70,
        "email" : "nmeans@gmail.com"
      }
    },
    {
      "_id" : ObjectId("536442c6126e5b0200000009"),
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("52f17fe5f13bc7020000003b"),
        "rate" : 70,
        "email" : "ivan@app.io"
      }
    }
  ],
  "tags" : [
    { "_id" : "514825fa2a26ea020000002f","sort" : 0 },
    { "_id" : "5181d0aa66a6f999a465ed67", "sort" : 1}
  ],
  "userId" : ObjectId("52d8e12c1c67d1a4859d1cab"),
  "by" : {
    "avatar" : "https://lh3.googleusercontent.com/-X-6oaT6F9x8/AAAAAAAAAAI/AAAAAAAAARk/HXpXsWweXnY/photo.jpg",
    "name" : "Chris Hollindale",
    "email" : "chris@hollindale.co.uk",
    "org" : {
      "name" : "Zesty",
      "_id" : "52d8e173235755020000001d"
    }
  }
},


// {
//   "_id" : ObjectId("5365272e44373c020000001a"),
//   "adm" : {
//     "owner" : "il",
//     "lastTouch" : ISODate("2014-12-24T11:53:40.191Z"),
//     "closed" : ISODate("2014-12-24T11:53:40.191Z")
//   },
//   "availability" : "I would like to start next week Friday.  I am on the east coast of the USA and am available nights and weekends.",
//   "brief" : "I would like to use Balanced within my dotnetnuke instance. I would like to have a javascrpit code service that would allow me to:\n\n- create/retrieve/update an account\n- verify CC and Bank account\n- process CC and Bank ACH drafts\n- issue refunds\n\nShow me how to do what I had described above.  Walk me through the process and jump in with examples and encouragement as i have not coded in a long time :-)",
//   "budget" : 80,
//   "by" : {
//     "name" : "Raynell Bell",
//     "email" : "social@peer2peernetworks.net",
//     "avatar" : "//0.gravatar.com/avatar/b57222015ae1615dc103e3eb20fc2ccb"
//   },
//   "canceledDetail" : "Unresponsive",
//   "experience" : "proficient",
//   "hours" : "1",
//   "incompleteDetail" : "",
//   "owner" : "il",
//   "pricing" : "private",
//   "status" : "completed",
//   "suggested" : [
//   {
//     "suggestedRate" : {
//       "expert" : 50,
//       "total" : 80
//     },
//     "_id" : ObjectId("53729ce404e4d70200b3170b"),
//     "expertComment" : "Hey Raynell,\n\nGoogled you, and I found  peer2peernetworks.net. Crowdfunding local real estate is a good use case for balanced payments. \n\nI've helped a couple of people on AirPair integrate balanced into their apps.  \n\nUnfortunately, I don't have experience with dotnetnuke. When we're integrating balanced into dotnetnuke, I won't be able to help with the coding as much as I usually do, but I'll be able to provide guidance on a high level. \n\nLets set up a time to talk,\nEvan Richards",
//     "expertAvailability" : "I'm the SF Bay Area. We can start today. ",
//     "expertStatus" : "available",
//     "expert" : { "_id" : ObjectId("5241c121c20d3f020000000e"),
//     "rate" : 70,
//     "email" : "goldcpufish@gmail.com"
//   }
//   },
//   {
//     "suggestedRate" : {
//       "expert" : 50,
//       "total" : 80
//     },
//     "_id" : ObjectId("53729ceb04e4d70200b3170c"),
//     "expertComment" : "I'm fairly experienced with Balanced, but I've not done any work with Node (or server-side JS in general, really) so I'm not the best fit to help you with this.",
//     "expertAvailability" : "unavailable",
//     "expertStatus" : "abstained",
//     "expert" : { "_id" : ObjectId("534edfc00f33e7020000000c"),
//     "rate" : 70,
//     "email" : "nmeans@gmail.com"
//   }
//   },
//   {
//     "suggestedRate" : {
//       "expert" : 43,
//       "total" : 76
//     },
//     "_id" : ObjectId("53729cf306db59020038682e"),
//     "expertComment" : "Currently busy onto other projects. plus dotnetnuke isnt really what I do.",
//     "expertAvailability" : "unavailable",
//     "expertStatus" : "abstained",
//     "expert" : { "_id" : ObjectId("5345eadbbd8664020000001d"),
//       "rate" : 40,
//       "email" : "its@shayon.me"
//     }
//   }
//   ],
//   "tags" : [
//     { "_id" : ObjectId("51cb57e266a6f999a465f3ff"), "sort" : 0 },
//     { "_id" : ObjectId("514825fa2a26ea020000001f"), "sort" : 1 },
//     { "_id" : ObjectId("514825fa2a26ea0200000028"), "sort" : 2 },
//     { "_id" : ObjectId("5181d0ab66a6f999a465ef9c"), "sort" : 3 },
//     { "_id" : ObjectId("5148330457e7aa020000001d"), "sort" : 4 },
//     { "_id" : ObjectId("514825fa2a26ea0200000007"), "sort" : 5 }
//   ],
//   "time" : "regular",
// "userId" : ObjectId("536522431c67d1a4859d30a5") },
// { "_id" : ObjectId("53b0395b5c5e7502006274ed"),
// "availability" : "I'm highly available. I live in Hong Kong +8 GMT. Speak English.",
// "brief" : "Hi, I'm starting a new project with a friend and have gotten the site up and running but I have some sticky points I need help with.\n\na) I can't get Faye working smoothly on my production server, websocket connections seem to die out, and I'm lost on how to get this right.\n\nb) We are already starting to see performance issues when it comes to loading lots of data. I'd like some help to build a solid repeatable architecture for infinite scrolling lists that load really fast.\n\nc) We want to integrate what we're building with discourse. Me and my friend have been looking at the project and would love to use it in our project.",
// "budget" : 80,
// "canceledDetail" : "Customer too pushy.",
// "hours" : "1",
// "incompleteDetail" : "",
// "owner" : "jk",
// "pricing" : "private",
// "status" : "canceled",
// "suggested" : [
// { "_id" : ObjectId("53b03d0dbcd49c0200fe3502"),
// "matchedBy" : {
//   "userId" : "5367fd6d1c67d1a4859d30e7",
//   "initials" : "pg"
// },
// "expertStatus" : "waiting",
// "expert" : { "_id" : ObjectId("53a08e376461040200facfc2"),
// "rate" : 70,
// "email" : "kanepyork@gmail.com"
// } },
// { "_id" : ObjectId("53b1f319a14a6c02003be526"),
// "matchedBy" : {
//   "initials" : "jk",
//   "userId" : "5175efbfa3802cc4d5a5e6ed"
// },
// "expertStatus" : "opened",
// "expert" : { "_id" : ObjectId("53a8b657c91ac30200d3735d"),
// "rate" : 160,
// "email" : "ahabeel@gmail.com"
// } },
// { "_id" : ObjectId("53b1f31ba14a6c02003be527"),
// "matchedBy" : {
//   "userId" : "5175efbfa3802cc4d5a5e6ed",
//   "initials" : "jk"
// },
// "expertStatus" : "waiting",
// "expert" : { "_id" : ObjectId("534edfc00f33e7020000000c"),
// "rate" : 110,
// "email" : "nmeans@gmail.com"
// }
// },
// {
//   "expertAvailability" : "unavailable",
//   "expertComment" : "No familiarity with Faye at all\n",
//   "_id" : ObjectId("53b2e668dca2770200ba45a8"),
//   "matchedBy" : {
//     "userId" : "5175efbfa3802cc4d5a5e6ed",
//     "initials" : "jk"
//   },
//   "expertStatus" : "abstained",
//   "expert" : { "_id" : ObjectId("51d6d2a48392040200000013"),
//   "rate" : 40,
//   "email" : "mfeckie@gmail.com"
// } },
//   { "_id" : ObjectId("53b2e678dca2770200ba45a9"),
//     "matchedBy" : {
//       "initials" : "jk",
//       "userId" : "5175efbfa3802cc4d5a5e6ed"
//     },
//     "expertStatus" : "waiting",
//     "expert" : {
//       "_id" : ObjectId("52a396764f54d70200000009"),
//       "rate" : 40,
//       "email" : "hassanemoustapha@gmail.com"
//     }
//   },
//   { "_id" : ObjectId("53b2e67aaa3b220200b918d1"),
//     "matchedBy" : {
//       "userId" : "5175efbfa3802cc4d5a5e6ed",
//       "initials" : "jk"
//     },
//     "expertStatus" : "waiting",
//     "expert" : { "_id" : ObjectId("522670a01f86bf020000004f"),
//     "rate" : 40,
//     "email" : "mmira@moobin.net"
//     }
//   }
//   ],
//   "tags" : [
//     { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 0 },
//     { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
//     { "_id" : "530790cf1c67d1a4859d2446", "sort" : 2 },
//     { "_id" : "524c8c3066a6f999a465f907", "sort" : 3 }
//   ],
//   "userId" : ObjectId("53b036518f8c80299bcc3686"),
//   "by" : {
//     "avatar" : "https://lh3.googleusercontent.com/-vPvhvntJPAM/AAAAAAAAAAI/AAAAAAAAAAA/LIEs7CzFZvY/photo.jpg",
//     "name" : "Patrick Ma",
//     "email" : "fivetwentysix@gmail.com",
//     "org" : {
//       "name" : "MA YIU MING PATRICK",
//       "_id" : "53b038155c5e7502006274ea"
//     }
//   }
// },

//   "expert" : {
//     "_id" : ObjectId("528953641c60530200000011"),
//     "rate" : 110,
//     "email" : "g.natili@gnstudio.com"
//   }
// },// {
//   "_id" : ObjectId("54c11897988ccd0a00ffb2ce"),
//   "type" : "mentoring",
//   "by" : {
//     "avatar" : "//0.gravatar.com/avatar/53d5eb81f2d31c1a44b5ba3190ed40ee",
//     "email" : "colak@fundinggates.com",
//     "name" : "Ismail Colak"
//   },
//   "userId" : ObjectId("54c117ea988ccd0a00ffb273"),
//   "status" : "complete",
//   "messages" : [
//     {
//       "type" : "received",
//       "_id" : ObjectId("54c11897988ccd0a00ffb2ce"),
//       "subject" : "10 hour balanced-payments, ruby-on-rails and ember.js mentoring\n",
//       "body" : "Hi Ismail,\n\nMy name is Ramon, I'm your personal AirPair Matchmaker assigned to help find you the perfect balanced-payments, ruby-on-rails and ember.js expert. I'm also available to answer questions and to make sure your experience is smooth from now through to getting your challenges solved. \n\nBest,\n\nRamon\n\n--\nRamon Porter\ntwitter.com/airpair",
//       "fromId" : ObjectId("54b4107a7b1047516695d4d7"),
//       "toId" : ObjectId("54c117ea988ccd0a00ffb273")
//     },
//     {
//       "type" : "review",
//       "_id" : ObjectId("54c11897988ccd0a00ffb2ce"),
//       "subject" : "Ready for some balanced-payments, ruby-on-rails and ember.js AirPairing?\n",
//       "body" : "Hi again Ismail,\n\nHope you've have had some time to look over your responses. Are you happy with your experts? Please tell me straight away if they do not meet your expectations. My personal recommendation is Michael because he is one of our top balanced-payments experts and is great to pair with. When you're ready just go back to the page with your replies and hit \"Book\". Once that's done I'll help you schedule a time with the expert.\n\nhttps://www.airpair.com/review/54c11897988ccd0a00ffb2ce\n\nBest,\n\nRamon",
//       "fromId" : ObjectId("54b4107a7b1047516695d4d7"),
//       "toId" : ObjectId("54c117ea988ccd0a00ffb273")
//     }
//   ],
//   "suggested" : [
// {
//   "matchedBy" : {
//     "userId" : "5175efbfa3802cc4d5a5e6ed",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54c12911dbd79509007b44e2"),
//   "suggestedRate" : {
//     "expert" : 113,
//     "total" : 146
//   },
//   "expertComment" : "I consulted with Balanced Payments for ~ 3 months in 2013 and have a pretty solid understanding of how their backend systems are architected. Additionally, I've done a bunch of different integrations and have a lot of experience working with customers to figure out the best way to integrate with Balanced.\n\nI'm a full time Rails dev and have even contributed to the Balanced Ruby Gem.",
//   "expertAvailability" : "Early in the morning (before 9AM) or after 6PM M-F and anytime on the weekends.",
//   "expertStatus" : "available",
//   "reply" : {
//     "time" : ISODate("2015-01-22T18:07:45.218Z")
//   },
//   "expert" : {
//     "_id" : ObjectId("5313b196e229aa0200000015"),
//     "rate" : 110,
//     "email" : "ryan.loomba@gmail.com"
//   }
// },
// {
//   "expertComment" : "Can definitely help you figure out the right architecture and help you code/debug as needed.\n\nAbout me: I've been CTO/founder for several startups and have experience integrating pretty much every payment platform there is from both rails and node backends. I've been using rails and ember since they were in beta and this past year have been doing a lot of mentoring to help people get up to speed on ember. Till recently was the top stack-overflow answerer for #emberjs.",
//   "expertAvailability" : "NYC, EST, Ideal time for me is M-F 10-7 EST but pretty flexible. I'm open this afternoon/evening if you want to start right away.",
//   "suggestedRate" : {
//     "total" : 146,
//     "expert" : 113
//   },
//   "_id" : ObjectId("54c13c821469460900c4693a"),
//   "expertStatus" : "available",
//   "reply" : {
//     "time" : ISODate("2015-01-22T18:08:02.517Z")
//   },
//   "expert" : {
//     "_id" : ObjectId("52267f2a7087f90200000008"),
//     "rate" : 110,
//     "email" : "mgrassotti@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "5175efbfa3802cc4d5a5e6ed"
//   },
//   "_id" : ObjectId("54c12942dbd79509007b450f"),
//   "suggestedRate" : {
//     "expert" : 113,
//     "total" : 146
//   },
//   "expertComment" : "Hey Ismail,\n\nI'm available to help provide insight on Balanced and setting up.\n\nI've used Balanced as the payment engine for a SaaS business that provides donation software to non-profits. I've also built my fair share of SaaS apps with Stripe, so I'm pretty experienced with payments integration.",
//   "expertAvailability" : "Evenings",
//   "expertStatus" : "available",
//   "reply" : {
//     "time" : ISODate("2015-01-23T03:53:50.081Z")
//   },
//   "expert" : {
//     "_id" : ObjectId("5314dbd30599c7020000000c"),
//     "rate" : 110,
//     "email" : "tbrooks@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "54b4107a7b1047516695d4d7"
//   },
//   "_id" : ObjectId("54c11bc738eedd0a00a3e8fa"),
//   "suggestedRate" : {
//     "expert" : 120,
//     "total" : 150
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("5310e78f575e73020000000b"),
//     "rate" : 160,
//     "email" : "alex@zealoushacker.com"
//   }
// },
// {
//   "matchedBy" : {
//     "userId" : "54b4107a7b1047516695d4d7",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54c11bd2a5f6300a00831ad4"),
//   "suggestedRate" : {
//     "total" : 146,
//     "expert" : 113
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("534edfc00f33e7020000000c"),
//     "rate" : 110,
//     "email" : "nmeans@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "54b4107a7b1047516695d4d7"
//   },
//   "_id" : ObjectId("54c11bfea5f6300a00831ae4"),
//   "suggestedRate" : {
//     "expert" : 113,
//     "total" : 146
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("524f29d36069c2020000001d"),
//     "rate" : 110,
//     "email" : "drogus@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "userId" : "54b4107a7b1047516695d4d7",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54c11c3c988ccd0a00ffb4d4"),
//   "suggestedRate" : {
//     "total" : 118,
//     "expert" : 64
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("5241c121c20d3f020000000e"),
//     "rate" : 40,
//     "email" : "goldcpufish@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "54b4107a7b1047516695d4d7"
//   },
//   "_id" : ObjectId("54c11cb6988ccd0a00ffb50f"),
//   "suggestedRate" : {
//     "expert" : 120,
//     "total" : 150
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("5376e4324806a60200edf54a"),
//     "rate" : 160,
//     "email" : "alex@alexspeller.com"
//   }
// },
// {
//   "matchedBy" : {
//     "userId" : "5175efbfa3802cc4d5a5e6ed",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54c128fb1469460900c45be0"),
//   "suggestedRate" : {
//     "total" : 150,
//     "expert" : 120
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("531a90bd268b35020000001a"),
//     "rate" : 160,
//     "email" : "ajsharp@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "5175efbfa3802cc4d5a5e6ed"
//   },
//   "_id" : ObjectId("54c129021469460900c45bea"),
//   "suggestedRate" : {
//     "expert" : 113,
//     "total" : 146
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("52f3c1de9c247f0200000032"),
//     "rate" : 110,
//     "email" : "lalitkapoor@gmail.com"
//   }
// }
// ],
// "tags" : [
// { "_id" : ObjectId("51cb57e266a6f999a465f3ff"),
// "sort" : 0
// },
// { "_id" : ObjectId("514825fa2a26ea020000002f"),
// "sort" : 1
// },
// { "_id" : ObjectId("5181d0aa66a6f999a465eceb"),
// "sort" : 2
// }
// ],
//   "lastTouch" : {
//     "action" : "replyByExpert:available",
//     "utc" : ISODate("2015-01-23T03:53:50.084Z"),
//     "by" : {
//       "_id" : ObjectId("5314d1821c67d1a4859d262a"),
//       "name" : "Taylor Brooks"
//     }
//   },
//   "adm" : {
//       "submitted" : ISODate("2015-01-22T15:43:16.098Z"),
//       "owner" : "rp",
//       "lastTouch" : {
//         "action" : "closed:complete",
//         "utc" : ISODate("2015-01-23T15:32:50.458Z"),
//         "by" : {  ObjectId("54b4107a7b1047516695d4d7"),
//         "name" : "Ramon Porter"
//       }
//     },
//     "received" : ISODate("2015-01-22T15:47:33.793Z"),
//     "farmed" : ISODate("2015-01-22T15:47:49.279Z"),
//     "reviewable" : ISODate("2015-01-22T18:07:45.227Z"),
//     "closed" : ISODate("2015-01-23T15:32:50.458Z")
//   },
//   "experience" : "proficient",
//   "brief" : "We are an invoicing platform and are integrating with Balanced Payments to process ACH payments between our users and their customers. It'd be hugely useful to get expert help on the right data architecture setup, the payments flow and best practices on debits, credits, and tracking through the \"order\" concept in Balanced. Looking for an expert who can be a sounding board who we can consult as we develop our ACH payments feature.",
//   "hours" : "10",
//   "time" : "regular",
//   "budget" : 150
// },



{
  "_id" : ObjectId("54c11bc938eedd0a00a3e8fb"),
  "type" : "mentoring",
  "experience" : "proficient",
  "brief" : "We are trying to set up an Rails Opsworks stack in a private subnet of a VPC with HA NAT instance",
  "hours" : "2",
  "time" : "rush",
  "budget" : 100,
  "by" : {
    "name" : "Elie Toubiana",
    "email" : "elie@cardflight.com",
    "avatar" : "//0.gravatar.com/avatar/f8e1acfb39bfb0c73d34292dd59dfaaf"
  },
  "userId" : ObjectId("54c0905b38eedd0a00a3b8d2"),
  "status" : "booked",
  "messages" : [
    {
      "toId" : ObjectId("54c0905b38eedd0a00a3b8d2"),
      "fromId" : ObjectId("54b4107a7b1047516695d4d7"),
      "body" : "Hi Elie,\n\nMy name is Ramon, I'm your personal AirPair Matchmaker assigned to help find you the perfect pci-compliance and aws expert. I'm also available to answer questions and to make sure your experience is smooth from now through to getting your challenges solved. \n\nDo you have more detail about what you need help with? You can update your request here:\n\nhttps://www.airpair.com/help/request/54c11bc938eedd0a00a3e8fb\n\nWhen you get a sec, please add your credit card to our billing system and let me know if you need anything else:\n\nhttps://www.airpair.com/billing\n\nBest,\n\nRamon\n\n--\nRamon Porter\ntwitter.com/airpair",
      "subject" : "2 hour pci-compliance and aws mentoring\n",
      "_id" : ObjectId("54c11bc938eedd0a00a3e8fb"),
      "type" : "received"
    },
    {
      "toId" : ObjectId("54c0905b38eedd0a00a3b8d2"),
      "fromId" : ObjectId("5367fd6d1c67d1a4859d30e7"),
      "body" : "Hi again Elie,\n\nOur first expert just reviewed your request for mentoring with pci-compliance. Please use this link to book Ryan.\n\nhttps://www.airpair.com/review/54c11bc938eedd0a00a3e8fb\n\nP.S. You can buy AirPairing credit in bulk ahead of time and get as much as 20% extra. Once you have credit the cost of each session gets deducted from your balance.\n\nhttps://www.airpair.com/billing/top-up\n\nBest,\n\nPrateek",
      "subject" : "Ready for some pci-compliance and aws AirPairing?\n",
      "_id" : ObjectId("54c11bc938eedd0a00a3e8fb"),
      "type" : "review"
    }
  ],
  "suggested" : [
    {
      "suggestedRate" : {
        "total" : 100,
        "expert" : 70
      },
      "_id" : ObjectId("54c11dda988ccd0a00ffb5a8"),
      "matchedBy" : {
        "userId" : "54b4107a7b1047516695d4d7",
        "initials" : "pg"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("539ffbb2bdc5cb02004bf4fa"),
        "rate" : 110,
        "email" : "shai.coleman@gmail.com",
        "tags" : []
      }
    },
    {
      "suggestedRate" : {
        "total" : 100,
        "expert" : 70
      },
      "_id" : ObjectId("54c151430c0fa0090070c565"),
      "matchedBy" : {
        "userId" : "5367fd6d1c67d1a4859d30e7",
        "initials" : "pg"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("535f16705325190200000024"),
        "rate" : 160,
        "email" : "barry.allard@gmail.com",
        "tags" : []
      }
    },
    {
      "suggestedRate" : {
        "expert" : 70,
        "total" : 100
      },
      "_id" : ObjectId("54c1514f96c4930a00990571"),
      "matchedBy" : {
        "initials" : "pg",
        "userId" : "5367fd6d1c67d1a4859d30e7"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("53d9878c27c35e0200c74839"),
        "rate" : 110,
        "email" : "dw.chow@gmail.com",
        "tags" : []
      }
    }
  ],
  "tags" : [
    { "_id" : ObjectId("531184ff1c67d1a4859d25f2"), "sort" : 0 },
    { "_id" : ObjectId("514825fa2a26ea0200000007"), "sort" : 1 }
  ],
  "lastTouch" : {
    "by" : {
      "name" : "Elie Toubiana",
      "_id" : ObjectId("54c0905b38eedd0a00a3b8d2")
    },
    "utc" : ISODate("2015-03-12T15:35:39.816Z"),
    "action" : "booked"
  },
  "adm" : {
    "booked" : ISODate("2015-01-30T19:56:35.011Z"),
    "submitted" : ISODate("2015-01-30T19:56:25.567Z"),
    "closed" : ISODate("2015-02-02T23:24:52.481Z"),
    "reviewable" : ISODate("2015-01-22T22:46:06.174Z"),
    "received" : ISODate("2015-01-22T15:53:05.217Z"),
    "lastTouch" : {
      "by" : { name : "Prateek Gupta",
      "_id" : ObjectId("5367fd6d1c67d1a4859d30e7")
    },
    "utc" : ISODate("2015-02-02T23:24:52.481Z"),
    "action" : "closed:complete"
    },
    "owner" : "rp"
  },
  "meta" : {},
  "title" : "Help with fixing a production with Firewall and VPC ... need help asap"
},




// {
//   "_id" : ObjectId("54e2714e24d2860a003a8a94"),
//   "type" : "troubleshooting",
//   "by" : {
//     "avatar" : "//0.gravatar.com/avatar/5a6be874053e8d02d527ec17ab3b76f0",
//     "email" : "framallo@gmail.com",
//     "name" : "Federico Ramallo"
//   },
//   "userId" : ObjectId("54db7aa0a375ba0a00f6d5da"),
//   "status" : "canceled",
//   "messages" : [
//     {
//       "type" : "received",
//       "_id" : ObjectId("54e2714e24d2860a003a8a94"),
//       "subject" : "1 hour voip troubleshooting\n",
//       "body" : "Hi Federico,\n\nMy name is David, I'm your personal AirPair Matchmaker assigned to help find you the perfect voip expert. I'm also available to answer questions and to make sure your experience is smooth from now through to getting your challenges solved. \n\nDo you have more detail about what you need help with? Could you tell us more about what stack you are using? You can update your request here:\n\nhttps://www.airpair.com/help/request/54e2714e24d2860a003a8a94\n\nWhen you get a sec, please add your credit card to our billing system and let me know if you need anything else:\n\nhttps://www.airpair.com/billing\n\nBest,\n\nDavid\n\n--\nDavid Anderton\ntwitter.com/airpair",
//       "fromId" : ObjectId("54de72d1bb6e680a0011c65c"),
//       "toId" : ObjectId("54db7aa0a375ba0a00f6d5da")
//     },
//     {
//       "type" : "generic",
//       "_id" : ObjectId("54e2714e24d2860a003a8a94"),
//       "subject" : "1 hour voip troubleshooting\n",
//       "body" : "Hi Federico,\n\nCould you add a few more details regarding the technologies you are using then we can find you a match within 4-6 hours to assist with the VOIP calls and forwarding.\n\nBest,\n\nDavid\n\n--\nDavid Anderton\ntwitter.com/airpair",
//       "fromId" : ObjectId("54de72d1bb6e680a0011c65c"),
//       "toId" : ObjectId("54db7aa0a375ba0a00f6d5da")
//     },
//     {
//       "type" : "review",
//       "_id" : ObjectId("54e2714e24d2860a003a8a94"),
//       "subject" : "Ready for some voip AirPairing?\n",
//       "body" : "Hi again Federico,\n\nOne of our top Ruby on Rails experts has made availability to pair with you! I have worked with Evan many times before, both on personal projects and with AirPair and he has great reviews from our customers.  His suggestion to use Twilio's platform to tackle handling of VOIP calls seems like a great way forward here.\n\nPlease use this link to review & book him.\n\nhttps://www.airpair.com/review/54e2714e24d2860a003a8a94\n\nBest,\n\nDavid",
//       "fromId" : ObjectId("54de72d1bb6e680a0011c65c"),
//       "toId" : ObjectId("54db7aa0a375ba0a00f6d5da")
//     }
//   ],
//   "suggested" : [
// {
//   "matchedBy" : {
//     "userId" : "54de72d1bb6e680a0011c65c",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54e4fc20106a5d0c00c53802"),
//   "suggestedRate" : {
//     "total" : 146,
//     "expert" : 113
//   },
//   "expertComment" : "It's a very interesting problem to solve and my guess is that there are several options. I'm not sure you need WebRTC because you are using physical phones but I need more details about the hardware in order to give you the right advice.",
//   "expertAvailability" : "I'm available Sunday afternoon, I'm in NY time zone.",
//   "expertStatus" : "available",
//   "reply" : {
//     "time" : ISODate("2015-02-19T12:37:29.799Z")
//   },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "54de72d1bb6e680a0011c65c"
//   },
//   "_id" : ObjectId("54e3aaefec7cf70a0082a67d"),
//   "suggestedRate" : {
//     "expert" : 85,
//     "total" : 130
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("53598b0ac558c20200000028"),
//     "rate" : 70,
//     "email" : "rjayroach@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "userId" : "54de72d1bb6e680a0011c65c",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54e3ab15ec7cf70a0082a680"),
//   "suggestedRate" : {
//     "total" : 146,
//     "expert" : 113
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("534edfc00f33e7020000000c"),
//     "rate" : 110,
//     "email" : "nmeans@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "54de72d1bb6e680a0011c65c"
//   },
//   "_id" : ObjectId("54e3ab1978c9700a00439c39"),
//   "suggestedRate" : {
//     "expert" : 85,
//     "total" : 130
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("52b228b5a76ad20200000037"),
//     "rate" : 70,
//     "email" : "marothstein@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "userId" : "54de72d1bb6e680a0011c65c",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54e3ab1eec7cf70a0082a682"),
//   "suggestedRate" : {
//     "total" : 150,
//     "expert" : 120
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("5376e4324806a60200edf54a"),
//     "rate" : 160,
//     "email" : "alex@alexspeller.com"
//   }
// },
// {
//   "matchedBy" : {
//     "userId" : "5367fd6d1c67d1a4859d30e7",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54e4f8d2106a5d0c00c53788"),
//   "suggestedRate" : {
//     "total" : 130,
//     "expert" : 85
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("53c2e12bce214c020042b775"),
//     "rate" : 70,
//     "email" : "mitcheloc@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "5367fd6d1c67d1a4859d30e7"
//   },
//   "_id" : ObjectId("54e4fa1c0990de0c00815784"),
//   "suggestedRate" : {
//     "expert" : 113,
//     "total" : 146
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("52a8fa98cf342e0200000045"),
//     "rate" : 110,
//     "email" : "airydragon@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "54de72d1bb6e680a0011c65c"
//   },
//   "_id" : ObjectId("54e4fc46106a5d0c00c5381c"),
//   "suggestedRate" : {
//     "expert" : 85,
//     "total" : 130
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("51ca3e063fdb0b0200000005"),
//     "rate" : 70,
//     "email" : "stuart@testtrack4.com"
//   }
// },
// {
//   "matchedBy" : {
//     "userId" : "54de72d1bb6e680a0011c65c",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54e4fc500990de0c008157d2"),
//   "suggestedRate" : {
//     "total" : 130,
//     "expert" : 85
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("525655b8e9b5050200000021"),
//     "rate" : 70,
//     "email" : "tarunc92@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "initials" : "pg",
//     "userId" : "54de72d1bb6e680a0011c65c"
//   },
//   "_id" : ObjectId("54e4fc5d106a5d0c00c53821"),
//   "suggestedRate" : {
//     "expert" : 120,
//     "total" : 150
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("540df41ed2be6002004d8c77"),
//     "rate" : 230,
//     "email" : "dperilla@gmail.com"
//   }
// },
// {
//   "matchedBy" : {
//     "userId" : "54de72d1bb6e680a0011c65c",
//     "initials" : "pg"
//   },
//   "_id" : ObjectId("54e4fc80106a5d0c00c5382d"),
//   "suggestedRate" : {
//     "total" : 130,
//     "expert" : 85
//   },
//   "expertStatus" : "waiting",
//   "expert" : {
//     "_id" : ObjectId("53b27c01aa3b220200b918b6"),
//     "rate" : 70,
//     "email" : "thelostone.om@gmail.com"
//   }
// }
//   ],
//   "tags" : [
//     { "_id" : ObjectId("51d6b4db66a6f999a465f42a"), "sort" : 0 },
//     { "_id" : ObjectId("53c2e1988f8c80299bcc396e"), "sort" : 1 },
//     { "_id" : ObjectId("5216526a66a6f999a465f698"), "sort" : 2 }
//   ],
//   "lastTouch" : {
//     "action" : "replyByExpert:available",
//     "utc" : ISODate("2015-02-19T12:37:29.804Z"),
//     "by" : {
//       "_id" : ObjectId("5283d1bb66a6f999a465fb6d"),
//       "name" : "Giorgio Natili"
//     }
//   },
//   "experience" : "advanced",
//   "adm" : {
//     "submitted" : ISODate("2015-02-16T22:40:08.674Z"),
//     "owner" : "da",
//     "lastTouch" : {
//       "action" : "closed:canceled",
//       "utc" : ISODate("2015-02-22T19:10:20.242Z"),
//       "by" : {  ObjectId("54de72d1bb6e680a0011c65c"),
//       "name" : "David Anderton"
//       }
//     },
//     "received" : ISODate("2015-02-16T22:42:03.747Z"),
//     "farmed" : ISODate("2015-02-17T20:10:56.559Z"),
//     "reviewable" : ISODate("2015-02-17T20:11:45.574Z"),
//     "closed" : ISODate("2015-02-22T19:10:20.242Z")
//   },
//   "brief" : "I'm trying to make multiple calls and forward each when a human pick up.\n\nI'm trying to build an autodialer for mobile (ios and android).\nThe server stack is not defined yet, although I have experience with ruby.\nI found http://www.adhearsion.com/\n\nBut I need to understand how I can make those calls.\n\nSo For instance one user provides a list of 20 phones that we'll need to call each and forward to the user when a human picks up.\nWhat are the options to do this?",
//   "time" : "regular",
//   "hours" : "1",
//   "budget" : 150,
//   "title" : "1 hour voip troubleshooting"
// },



{
  "_id" : ObjectId("556604069ce83b11003f2248"),
  "type" : "advice",
  "by" : {
    "name" : "angel brown",
    "email" : "angelkbrown@gmail.com",
    "avatar" : "//0.gravatar.com/avatar/f61762e717450aa5429a644dc14c128d"
  },
  "userId" : ObjectId("549a207f8f8c80299bcc57f8"),
  "status" : "canceled",
  "messages" : [
    {
      "toId" : ObjectId("549a207f8f8c80299bcc57f8"),
      "fromId" : ObjectId("5175efbfa3802cc4d5a5e6ed"),
      "body" : "Hi angel,\n\nI'm Jonathon, I'll be finding you your perfect rails / knockout expert. I'm not that familiar with faye, would you say it is more important or least important or the technologies you've specified? Also You've mentioned ember and Redis. The more tags you want the less likely we'll find someone with experience across everything. Would it be worth breaking your specification down into conversations you can have with different experts, if not - please let me know what is most important so I can start there.\n\nBest,\n\nJonathon\n\n--\nJonathon Kresner\ntwitter.com/airpair",
      "subject" : "2 hour ruby-on-rails, knockout and faye advice\n",
      "_id" : ObjectId("556609013adc721100b6ee7a"),
      "type" : "received"
    }
  ],
  "suggested" : [
    {
      "suggestedRate" : {
        "expert" : 120,
        "total" : 150
      },
      "_id" : ObjectId("5566364492bc7d1100e39c24"),
      "matchedBy" : {
        "_id" : "5566364492bc7d1100e39c23",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertComment" : "happy to help. glad to hear you're thinking of using ember, it's definitely gonna be an improvement over hybrid rails+knockout.  I've built a lot of heroku+rails apps over the years using pretty much every combination of job queuing system + front end framework. These days I'm using ember+rails4+rabbitmq but have had good experience with Sidekiq and resque as well. Delayed job is ok just easy to outgrow. Anyway I can talk you thru the pros/cons and figure out what makes sense for your app.",
      "expertAvailability" : "NYC, EST, pretty flexible. How's tomorrow (thursday) late-morning/early-afternoon?",
      "expertStatus" : "available",
      "reply" : {
        "time" : ISODate("2015-05-27T23:26:04.614Z")
      },
      "expert" : {
        "_id" : ObjectId("52267f2a7087f90200000008"),
        "rate" : 350,
        "timezone" : "Eastern Daylight Time",
        "location" : "New York, NY, USA",
        "email" : "mgrassotti@gmail.com",
        "tags" : [
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000001f", "sort" : 1 },
        { "_id" : "51db00fc66a6f999a465f440", "sort" : 2 },
        { "_id" : "514825fa2a26ea0200000031", "sort" : 3 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 4 },
        { "_id" : "514825fa2a26ea0200000028", "sort" : 5 }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : "556612233adc721100b6f060",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("556612233adc721100b6f061"),
      "suggestedRate" : {
        "expert" : 113,
        "total" : 146
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("524f29d36069c2020000001d"),
        "rate" : 110,
        "timezone" : "GMT+0200 (CEST)",
        "email" : "drogus@gmail.com",
        "tags" : [
        { "_id" : "514825fa2a26ea020000002f", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000001f", "sort" : 1 },
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 2 },
        { "_id" : "5181d0ad66a6f999a465f144", "sort" : 3 }
        ]
      }
    },
    {
      "suggestedRate" : {
        "expert" : 113,
        "total" : 146
      },
      "_id" : ObjectId("5566123e3adc721100b6f07b"),
      "matchedBy" : {
        "_id" : "5566123e3adc721100b6f07a",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("53349fc2640a150200000027"),
        "rate" : 110,
        "timezone" : "GMT-0500 (CDT)",
        "email" : "msull92@gmail.com",
        "tags" : [
        { "_id" : "514825fa2a26ea0200000031", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000001f", "sort" : 1 },
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 2 },
        { "_id" : "514825fa2a26ea0200000028", "sort" : 3 },
        { "_id" : "514825fa2a26ea0200000032", "sort" : 4 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 5 },
        { "_id" : "514825fa2a26ea0200000016", "sort" : 6 },
        { "_id" : "514825fa2a26ea0200000030", "sort" : 7 },
        { "_id" : "5181d0aa66a6f999a465ed8e", "sort" : 8 },
        { "_id" : "5181d0a966a6f999a465ec4a", "sort" : 9 },
        { "_id" : "522670fb66a6f999a465f74d", "sort" : 10  }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : "5566363d446daf1100c85054",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("5566363d446daf1100c85055"),
      "suggestedRate" : {
        "expert" : 120,
        "total" : 150
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("5376e4324806a60200edf54a"),
        "rate" : 190,
        "timezone" : "British Summer Time",
        "location" : "London, UK",
        "email" : "alex@alexspeller.com",
        "tags" : [
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
        { "_id" : "514825fa2a26ea0200000031", "sort" : 2 },
        { "_id" : "51ec2de966a6f999a465f47a", "sort" : 3 },
        { "_id" : "514825fa2a26ea020000001f", "sort" : 4 },
        { "_id" : "514825fa2a26ea0200000011", "sort" : 5 },
        { "_id" : "514825fa2a26ea0200000021", "sort" : 6 },
        { "_id" : "515b73a3eb85470200000041", "sort" : 7 },
        { "_id" : "5261bc5566a6f999a465fa0b", "sort" : 8 },
        { "_id" : "522670fb66a6f999a465f74d", "sort" : 9 },
        { "_id" : "515206c4eecddf0200000012", "sort" : 10  },
        { "_id" : "521656e266a6f999a465f69f", "sort" : 11  },
        { "_id" : "5181d0aa66a6f999a465ed67", "sort" : 12  },
        { "_id" : "530790cf1c67d1a4859d2446", "sort" : 13  },
        { "_id" : "536214401c67d1a4859d3053", "sort" : 14  },
        { "_id" : "514825fa2a26ea0200000019", "sort" : 15  },
        { "_id" : "535ee2951c67d1a4859d2fec", "sort" : 16  }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : "5566364a446daf1100c85064",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("5566364a446daf1100c85065"),
      "suggestedRate" : {
        "expert" : 113,
        "total" : 146
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("534edfc00f33e7020000000c"),
        "rate" : 110,
        "timezone" : "GMT-0500 (CDT)",
        "email" : "nmeans@gmail.com",
        "tags" : [
        { "_id" : "514825fa2a26ea0200000031", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
        { "_id" : "515206c4eecddf0200000012", "sort" : 2 },
        { "_id" : "51cb57e266a6f999a465f3ff", "sort" : 3 },
        { "_id" : "531184ff1c67d1a4859d25f2", "sort" : 4 },
        { "_id" : "514825fa2a26ea020000002e", "sort" : 5 },
        { "_id" : "5181d0aa66a6f999a465ed67", "sort" : 6 },
        { "_id" : "530790cf1c67d1a4859d2446", "sort" : 7 },
        { "_id" : "51a81be566a6f999a465f31a", "sort" : 8 }
        ]
      }
    },
    {
      "suggestedRate" : {
        "expert" : 120,
        "total" : 150
      },
      "_id" : ObjectId("5566365392bc7d1100e39c31"),
      "matchedBy" : {
        "_id" : "5566365392bc7d1100e39c30",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("53a8b657c91ac30200d3735d"),
        "rate" : 160,
        "timezone" : "GMT-0400 (EDT)",
        "email" : "ahabeel@gmail.com",
        "tags" : [
        { "_id" : "5239db7466a6f999a465f82e", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
        { "_id" : "5149d9d37bc6da020000000a", "sort" : 2 },
        { "_id" : "5181d0aa66a6f999a465ed67", "sort" : 3 },
        { "_id" : "530790cf1c67d1a4859d2446", "sort" : 4 },
        { "_id" : "514825fa2a26ea0200000022", "sort" : 5 },
        { "_id" : "514825fa2a26ea020000000e", "sort" : 6 },
        { "_id" : "514a3f2ebf82130200000030", "sort" : 7 }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : "5566366b446daf1100c85077",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("5566366b446daf1100c85078"),
      "suggestedRate" : {
        "expert" : 120,
        "total" : 150
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("5440f9789a818902003715d7"),
        "rate" : 150,
        "timezone" : "Central European Summer Time",
        "location" : "Liège, Belgium",
        "email" : "sandro@munda.me",
        "tags" : [
        { "_id" : "5149dccb5fc6390200000013", "sort" : 0 },
        { "_id" : "52f15e421c67d1a4859d1eee", "sort" : 1 },
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 2 },
        { "_id" : "535ee2951c67d1a4859d2fec", "sort" : 3 },
        { "_id" : "514825fa2a26ea0200000028", "sort" : 4 },
        { "_id" : "514825fa2a26ea0200000025", "sort" : 5 },
        { "_id" : "515499dcd96db10200000049", "sort" : 6 },
        { "_id" : "514825fa2a26ea0200000016", "sort" : 7 },
        { "_id" : "514825fa2a26ea0200000031", "sort" : 8 },
        { "_id" : "514825fa2a26ea020000001f", "sort" : 9 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 10  }
        ]
      }
    },
    {
      "suggestedRate" : {
        "expert" : 113,
        "total" : 146
      },
      "_id" : ObjectId("5566367392bc7d1100e39c43"),
      "matchedBy" : {
        "_id" : "5566367392bc7d1100e39c42",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("53d2f577ed9e250200122a10"),
        "rate" : 110,
        "timezone" : "GMT-0500 (CDT)",
        "email" : "manuel.vidaurre@gmail.com",
        "tags" : [
        { "_id" : "514825fa2a26ea0200000031", "sort" : 0 },
        { "_id" : "527ced4a66a6f999a465fb19", "sort" : 1 },
        { "_id" : "5181d0a966a6f999a465ec4a", "sort" : 2 },
        { "_id" : "5181d0ab66a6f999a465ef32", "sort" : 3 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 4 },
        { "_id" : "5149de4b5fc6390200000017", "sort" : 5 },
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 6 },
        { "_id" : "5181d0a966a6f999a465eb65", "sort" : 7 },
        { "_id" : "514825fa2a26ea020000000a", "sort" : 8 },
        { "_id" : "5181d0aa66a6f999a465edc0", "sort" : 9 },
        { "_id" : "53d2fa1c8f8c80299bcc3b85", "sort" : 10  },
        { "_id" : "51d6ab3866a6f999a465f420", "sort" : 11  },
        { "_id" : "5181d0aa66a6f999a465ed5d", "sort" : 12  },
        { "_id" : "52f510461c67d1a4859d21d6", "sort" : 13  },
        { "_id" : "514825fa2a26ea020000001f", "sort" : 14  },
        { "_id" : "51efc5a166a6f999a465f48a", "sort" : 15  }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : "5566367b446daf1100c8508f",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("5566367b446daf1100c85090"),
      "suggestedRate" : {
        "expert" : 85,
        "total" : 130
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("5304b0a0a9a3330200000034"),
        "rate" : 70,
        "timezone" : "GMT+0200 (EET)",
        "email" : "ugis.ozolss@gmail.com",
        "tags" : [
        { "_id" : "514825fa2a26ea0200000031", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
        { "_id" : "5181d0a966a6f999a465eb3d", "sort" : 2 },
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 3 },
        { "_id" : "529731d066a6f999a465fca7", "sort" : 4 }
        ]
      }
    },
    {
      "suggestedRate" : {
        "expert" : 113,
        "total" : 146
      },
      "_id" : ObjectId("5566368a92bc7d1100e39c50"),
      "matchedBy" : {
        "_id" : "5566368a92bc7d1100e39c4f",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("52040c764af6ba0200000014"),
        "rate" : 110,
        "timezone" : "GMT-0400 (EDT)",
        "email" : "tal@talsafran.com",
        "tags" : [
        { "_id" : "514825fa2a26ea0200000031", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
        { "_id" : "514825fa2a26ea020000001f", "sort" : 2 },
        { "_id" : "5181d0a966a6f999a465eb40", "sort" : 3 },
        { "_id" : "5181d0a966a6f999a465ebe5", "sort" : 4 },
        { "_id" : "5181d0a966a6f999a465eb3d", "sort" : 5 },
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 6 },
        { "_id" : "514825fa2a26ea0200000019", "sort" : 7 },
        { "_id" : "514825fa2a26ea0200000013", "sort" : 8 },
        { "_id" : "5181d0ad66a6f999a465f1af", "sort" : 9 },
        { "_id" : "5181d0ab66a6f999a465ef51", "sort" : 10  },
        { "_id" : "5181d0aa66a6f999a465ed8e", "sort" : 11  },
        { "_id" : "5181d0ab66a6f999a465eeee", "sort" : 12  },
        { "_id" : "5181d0ab66a6f999a465efa1", "sort" : 13  },
        { "_id" : "5181d0a966a6f999a465eb61", "sort" : 14  }
        ]
      }
    },
    {
      "matchedBy" : {
        "_id" : "55663692446daf1100c8509b",
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "_id" : ObjectId("55663692446daf1100c8509c"),
      "suggestedRate" : {
        "expert" : 113,
        "total" : 146
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("5204378b4af6ba020000003b"),
        "rate" : 110,
        "timezone" : "GMT-0400 (EDT)",
        "email" : "iambpentameter@gmail.com",
        "tags" : [
        { "_id" : "514825fa2a26ea0200000007", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
        { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 2 },
        { "_id" : "5149d9d37bc6da020000000a", "sort" : 3 },
        { "_id" : "514825fa2a26ea0200000021", "sort" : 4 },
        { "_id" : "514825fa2a26ea020000000f", "sort" : 5 },
        { "_id" : "5181d0ad66a6f999a465f19f", "sort" : 6 },
        { "_id" : "5181d0a966a6f999a465ec4a", "sort" : 7 },
        { "_id" : "5181d0a966a6f999a465ebaa", "sort" : 8 },
        { "_id" : "514825fa2a26ea0200000027", "sort" : 9 },
        { "_id" : "5181d0aa66a6f999a465ecf8", "sort" : 10  },
        { "_id" : "5181d0aa66a6f999a465eda3", "sort" : 11  },
        { "_id" : "5181d0aa66a6f999a465ecfe", "sort" : 12  },
        { "_id" : "5181d0a966a6f999a465ec8a", "sort" : 13  }
        ]
      }
    },
    {
      "suggestedRate" : {
        "expert" : 113,
        "total" : 146
      },
      "_id" : ObjectId("556668cbd4f5f41100f1747d"),
      "matchedBy" : {
        "_id" : ObjectId("556668cbd4f5f41100f1747c"),
        "type" : "staff",
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "initials" : "jk"
      },
      "expertStatus" : "waiting",
      "expert" : {
        "_id" : ObjectId("54925a851bb36e0200be00fc"),
        "rate" : 110,
        "timezone" : "GMT-0800 (PST)",
        "email" : "ghempton@gmail.com",
        "tags" : [
          { "_id" : "537d4ef51c67d1a4859d32a0", "sort" : 0 },
          { "_id" : "5181d0aa66a6f999a465eceb", "sort" : 1 },
          { "_id" : "535ee2951c67d1a4859d2fec", "sort" : 2 },
          { "_id" : "514825fa2a26ea020000002f", "sort" : 3 },
          { "_id" : "5192296b66a6f999a465f2ce", "sort" : 4 },
          { "_id" : "514825fa2a26ea020000001f", "sort" : 5 },
          { "_id" : "52f70d271c67d1a4859d221e", "sort" : 6 }
        ]
      }
    }
  ],
  "tags" : [
    { "_id" : ObjectId("514825fa2a26ea020000002f"), "sort" : 0 },
    { "_id" : ObjectId("530790cf1c67d1a4859d2446"), "sort" : 1 },
    { "_id" : ObjectId("5181d0aa66a6f999a465eceb"), "sort" : 2 }
  ],
  "adm" : {
    "closed" : ISODate("2015-05-29T20:31:52.560Z"),
    "lastTouch" : {
      "by" : {
        name: "Jonathon Kresner",
        "_id" : ObjectId("5175efbfa3802cc4d5a5e6ed")
      },
      "utc" : ISODate("2015-05-29T20:31:52.560Z"),
      "action" : "closed:canceled"
    },
    "received" : ISODate("2015-05-27T18:12:17.822Z"),
    "owner" : "jk",
    "submitted" : ISODate("2015-05-27T18:01:27.464Z"),
    "reviewable" : ISODate("2015-05-27T23:26:04.618Z")
  },
  "lastTouch" : {
    "by" : {
      "name" : "angel brown",
      "_id" : ObjectId("549a207f8f8c80299bcc57f8")
    },
    "utc" : ISODate("2015-05-28T00:34:17.987Z"),
    "action" : "updateByCustomer"
  },
  "experience" : "proficient",
  "brief" : "The app is currently Rails 3.2.18 with a mess of a hybrid of knockout.js and rails views on the front-end, along with some pub/sub action using the private_pub gem and a faye server running on heroku that I'm surprised hasn't broken yet. Also - delayed_job. I'd like some advice on updating the whole application to Rails 4 and possibly moving the entire front-end to use ember.js with Rails just as an api. I also think there must be much better tools for pub/sub and job queuing these days, but I'm not quite sure what to do. I've tried Redis and Resque, but found myself unsure about how to manage worker pools, and other config stuff on Heroku and felt it wasn't worth the risk to try it in production since the current solution does work.",
  "time" : "regular",
  "hours" : "2",
  "budget" : 150,
  "title" : "2 hour advice on upgrading Rails 3 app to 4, updating old knockout/rails hybrid views, pub/sub advice"
}
]


module.exports = {user,expert,requests}
