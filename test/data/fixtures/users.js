signups = require("./users/signups")
authors = require("./users/authors")

module.exports = assign(signups, authors, {

  jkg: {
    "_id" : ObjectId("549342348f8c80299bcc56c2"),
    "emails" : [ { _id:ObjectId("56131305a094059aa7070c6e"), value: "jk@gmail.com", verified: true, primary: true } ],
    "name" : "Jonathon Kresner",
    "initials" : "jk",
    "auth" : {
      "gh" : {
        "login" : "jkresner",
        "id" : 979542,
        "avatar_url" : "https://avatars.githubusercontent.com/u/979542?v=3",
        "gravatar_id" : "",
        "name" : "Jonathon Kresner",
        "company" : "airpair, inc.",
        "blog" : "http://www.hackerpreneurialism.com",
        "location" : "San Francisco",
        "emails" : [
          { email: "jk@gmail.com", verified: true, primary: false },
          { email: "jk@airpair.com", verified: true, primary: true }
        ],
        "hireable" : false,
        "bio" : null,
        "public_repos" : 1,
        "public_gists" : 1,
        "followers" : 401,
        "following" : 1,
        "created_at" : "2011-08-14T17:14:37Z",
        "updated_at" : "2015-02-20T19:36:09Z",
        "private_gists" : 1,
        "total_private_repos" : 1,
        "owned_private_repos" : 1,
        "disk_usage" : 102347,
        "collaborators" : 1,
        "plan" : {
          "name" : "micro",
          "space" : 614400,
          "collaborators" : 0,
          "private_repos" : 0
        },
      }
    },
    "username" : "jkres",
    "roles": [],
    "log": { last: {}, history: [] }
  },





  jkap: { _id:ObjectId("5175efbfa3802cc4d5a5e6ed"),
          name:"Jonathon Kresner",
          email:"jk@airpair.com"
  },

  tst1: {
    "_id" : ObjectId("5649cf5beb1811be02f0ec39"),
    "name" : "Air PairOne",
    "roles" : [],
    "cohort" : {
      "firstRequest" : { "url" : "/" },
      "aliases" : [ "xjeWG5rLVFdZZcroUIBrLo0NTyWJTgB5" ],
      "engagement" : {
        "visit_first" : ISODate("2015-11-16T12:43:00.635Z"),
        "visit_signup" : ISODate("2015-11-16T12:43:07.858Z"),
        "visit_last" : ISODate("2015-11-16T12:43:07.858Z"),
        "visits" : [ ISODate("2015-11-15T13:00:00.000Z") ]
      }
    },
    "auth" : {
      "gh" : {
        "login" : "airpairtest1",
        "id" : 11261012,
        "avatar_url" : "https://avatars.githubusercontent.com/u/11261012?v=3",
        "gravatar_id" : "",
        "name" : "Air PairOne",
        "company" : null,
        "blog" : null,
        "location" : null,
        "email" : null,
        "hireable" : null,
        "bio" : null,
        "public_repos" : 2,
        "public_gists" : 0,
        "followers" : 11,
        "following" : 0,
        "created_at" : "2015-03-01T21:12:29Z",
        "updated_at" : "2015-11-15T11:24:52Z",
        "emails" : [{ "verified" : true, "primary" : true, "email" : "airpairtest1@gmail.com" } ],
      }
    },
    "photos" : [{"value" : "https://avatars.githubusercontent.com/u/11261012?v=3",
            "type" : "github", "primary" : true, "_id" : ObjectId("5649cf5beb1811be02f0ec3a")}
    ],
    "emails" : [{
      "_id" : ObjectId("5649cf5beb1811be02f0ec38"),
      "primary" : true,
      "value" : "airpairtest1@gmail.com",
      "verified" : true,
      "origin" : "oauth:github",
      "lists" : ["AirPair Developer Digest"]}
    ],
    "username" : "airpairtest1",
    "initials": 't1',
    log: { last: {}, history: [] }
  },


  tst5: {
    _id : ObjectId("54551be15f221efa17111115"),
    name : "Expert Five",
    emails: [{ _id:ObjectId("56131305a094059aa7070c6d"), value: "airpairtest5@gmail.com", verified: true, primary: true, origin: 'oauth:github' }],
    auth: {
      gh: {
        login: 'airpairtest5',
        id: 11262470,
        avatar_url: 'https://avatars.githubusercontent.com/u/11262470?v=3',
        gravatar_id: '5a086460c6db9145493b9192faa4b0bc',
        name: "Fiver",
        company: null,
        blog: null,
        location: null,
        emails: [{ "verified" : true, "primary" : true, "email" : "airpairtest5@gmail.com" } ],
        hireable: null,
        bio: null,
        public_repos: 182,
        public_gists: 0,
        followers: 121,
        following: 0,
        created_at: '2015-03-02T00:14:27Z',
        updated_at: '2015-09-07T07:16:41Z',
        private_gists: 0,
        total_private_repos: 0,
        owned_private_repos: 0,
        disk_usage: 0,
        collaborators: 0,
        plan: { name: 'free',
           space: 976562499,
           collaborators: 0,
           private_repos: 0 },
        "tokens" : {
          "apcom" : { "token" : "testteststeszets" },
          "athr" : { "token" : "testteststeszets" },
        }
      }
    },
    "username": 'tst5',
    "initials": 't5',
    "roles": []
  },


  tst8: {
    _id : ObjectId("54551be15f221efa17222215"),
    name : "Author Eight",
    emails: [{ _id:ObjectId("56131305a094059aa7070c6d"), value: "airpairtest8@gmail.com", verified: true, primary: true, origin: 'oauth:github' }],
    initials: "a8",
    username: "ap-test8",
    location: {
      name: "Melbourne VIC, Australia",
      short: "Melbourne",
      timeZoneId: "Australia/Hobart"
    },
    auth: {
      gh: { "login":"ap-test8",
            "name":"ap test8",
            "emails": [{ "verified" : true, "primary" : true, "email" : "airpairtest8@gmail.com" } ],
            "id":15865024,"avatar_url":"https://avatars.githubusercontent.com/u/15865024?v=3","gravatar_id":"","url":"https://api.github.com/users/ap-test8",
            "html_url":"https://github.com/ap-test8","followers_url":"https://api.github.com/users/ap-test8/followers","following_url":"https://api.github.com/users/ap-test8/following{/other_user}","gists_url":"https://api.github.com/users/ap-test8/gists{/gist_id}","starred_url":"https://api.github.com/users/ap-test8/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/ap-test8/subscriptions","organizations_url":"https://api.github.com/users/ap-test8/orgs",
            "repos_url":"https://api.github.com/users/ap-test8/repos","events_url":"https://api.github.com/users/ap-test8/events{/privacy}","received_events_url":"https://api.github.com/users/ap-test8/received_events","type":"User","site_admin":false,
            "company":null,"blog":null,"location":null,"email":null,"hireable":null,"bio":null,"public_repos":6,"public_gists":0,
            "followers":1020,"following":30,"created_at":"2015-11-16T04:29:58Z","updated_at":"2015-11-16T04:30:17Z",
            "tokens": { "apcom": { "token": "asdfasdfads" } } },
      gp: { "kind":"plus#person","etag":"\"MrhFVuKLF7zHXL6gE2l7cEdzuiA/QPNy80hAw0yGQvEvruXkfh7MZDg\"","gender":"male","emails":[{"value":"airpairtest8@gmail.com","type":"account"}],"objectType":"person","id":"108650916776619527819","displayName":"Air Tair","name":{"familyName":"Tair","givenName":"Air"},"url":"https://plus.google.com/108650916776619527819","image":{"url":"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50","isDefault":true},"isPlusUser":true,"language":"en","circledByCount":0,"verified":false}
    }
  },


  jky: {
    "_id" : ObjectId("549342348f8c80333cccc6c2"),
    "emails" : [ { _id:ObjectId("56131305a094059aa7070c61"), value: "jkresner@yahoo.com.au", verified: true, primary: true, origin: 'manual:input' } ],
    "photos": [{ value: "2aefff5ada0d266491e9fd7a15b91941", type: "gravatar", primary: true }],
    "email" : "jkresner@yahoo.com.au",
    "name" : "Jonathon Yahoo",
    "auth" : {
      "password" : "asdfasdfasdfasdgfgsdfas",
      "gh": {
        login: 'jkyahoo',
        id: 11258947,
        avatar_url: 'https://avatars.githubusercontent.com/u/11258947?v=3',
        gravatar_id: '',
        name: "Jonathon Yahoo",
        company: null,
        blog: null,
        location: null,
        emails: [{ "verified" : true, "primary" : true, "email" : "jkresner@yahoo.com.au" } ],
        hireable: null,
        bio: null,
        public_repos: 12,
        public_gists: 0,
        followers: 51,
        following: 0,
        created_at: '2015-03-01T17:30:48Z',
        updated_at: '2015-10-05T16:05:32Z',
        private_gists: 0,
        total_private_repos: 0,
        owned_private_repos: 0,
        disk_usage: 0,
        collaborators: 0,
        plan:
         { name: 'free',
           space: 976562499,
           collaborators: 0,
           private_repos: 0 },
        token: 'babababababababa'
      }
    },
    "username": "jkresnerau",
    "initials": "jy",
    "roles": [],
    "log": {
      "history" : [
          {
              "action" : "signup",
              "_id" : ObjectId("5612a3cbb533e44fa42ce276"),
              "utc" : ISODate("2015-10-05T16:22:35.510Z"),
              "by" : {
                  "_id" : ObjectId("549342348f8c80333cccc6c2"),
                  "name" : "Jonathon Yahoo"
              }
          }
      ],
      "last" : {
          "action" : "signup",
          "_id" : ObjectId("5612a3cbb533e44fa42ce276"),
          "utc" : ISODate("2015-10-05T16:22:35.510Z"),
          "by" : {
              "_id" : ObjectId("549342348f8c80333cccc6c2"),
              "name" : "Jonathon Yahoo"
          }
      }
    }
  },


  jkx: {
    "_id" : ObjectId("549342348f8c80333cccc6dd"),
    "emails" : [ { _id:ObjectId("56131305a094059aa7070c22"), value: "jkresner@hotmail.com", verified: true, primary: true, origin: 'manual:input' } ],
    "photos": [{ value: "2aefff5ada0d266491e9fd7a15b91941", type: "gravatar", primary: true }],
    "name" : "Jon Hotter",
    "location": {
      "timeZoneId" : "America/Los_Angeles",
      "shortName" : "San Francisco",
      "name" : "San Francisco, CA, USA"
    },
    "username" : "jkhot",
    "initials": "jh",
    "auth" : {
      "gh": {
        login: 'jonhot',
        id: 111258947,
        avatar_url: 'https://avatars.githubusercontent.com/u/11258947?v=3',
        gravatar_id: '',
        name: "Jon Hotter",
        company: null,
        blog: null,
        location: null,
        emails: [{ email:'jkresner@hotmail.com', verified: true , primary: true }],
        hireable: null,
        bio: null,
        public_repos: 1,
        public_gists: 0,
        followers: 110,
        following: 54,
        created_at: '2015-03-01T17:30:48Z',
        updated_at: '2015-10-05T16:05:32Z',
        private_gists: 0,
        total_private_repos: 0,
        owned_private_repos: 0,
        disk_usage: 0,
        collaborators: 0,
        plan:
         { name: 'free',
           space: 976562499,
           collaborators: 0,
           private_repos: 0 },
        token: 'babababababababa'
      },
      "in": {
        "firstName":"Jon",
        "id":"OPszq1BgB3",
        "lastName":"Pairing"
      }
    },
    "roles": [],
  },

  tbel: {
    "_id" : ObjectId("54c7d549be0e440a00df49d4"),
    "emails" : [{ value: "tmbei@test.com", verified:true, primary:true }],
    "name" : "Thomas Beih",
    "cohort" : {
        "firstRequest" : {
            "ref" : "http://t.co/g2mhpvSFVX",
            "url" : "/review/54c6f3738137280900a3bc0c?utm_medium=farm-link&utm_campaign=farm-jan15&utm_term=javascript,%20nosql%20and%20elasticsearch"
        },
        "aliases" : [
            "DIrL4vmL5X_EhNqQqgBP41JqJ7yuY8OS",
            "gOKFDOVvGiw7h6urXfrXdoWEKjpn43nZ",
            "TkeM0UA8t_shIKjpo3wlNYSaw2UqdR25"
        ],
        "engagement" : {
            "visit_first" : ISODate("2015-01-27T18:13:24.244Z"),
            "visit_signup" : ISODate("2015-01-27T18:13:29.603Z"),
            "visit_last" : ISODate("2015-10-18T19:26:06.368Z"),
            "visits" : [
                ISODate("2015-10-18T00:00:00.000Z")
            ]
        }
    },
    "bio" : "Hello there,\n\nMy name is Thomas, I am a freelance web developer from Chattanooga,TN I have been loving Ruby on Rails for the past five years, before that I was a PHP developer.",
    "username" : "tml",
    "initials" : "tmb",
    "location" : {
        "timeZoneId" : "America/New_York",
        "name" : "Chattanooga, TN, USA",
        "shortName" : "Chattanooga"
    },
    "auth" : {
      "gp" : {
        "email" : "tmbeihl@test.com",
        "verified" : false,
        "image" : {},
        "url" : "https://plus.google.com/102621330858612527290",
        "name" : {
          "familyName" : "Beihl",
          "givenName" : "Thomas"
        },
        "displayName" : "Thomas Beihl",
        "id" : "102621330858612527290",
        "gender" : "male",
      },
      "gh" : {
        "login" : "tmbeihl",
        "id" : 982144,
        "avatar_url" : "https://avatars.githubusercontent.com/u/982144?v=3",
        "gravatar_id" : "",
        "name" : "Thomas Beihl",
        "company" : null,
        "blog" : null,
        "location" : null,
        "email" : null,
        "hireable" : true,
        "bio" : null,
        "public_repos" : 35,
        "public_gists" : 1,
        "followers" : 81,
        "following" : 8,
        "created_at" : "2011-08-15T22:42:38Z",
        "updated_at" : "2015-11-15T23:25:01Z",
        "emails" : [ { "email" : "tmbeihl@test.com", "primary" : true, "verified" : true } ],
      },
      "tw" : {
        "follow_request_sent" : false,
        "default_profile_image" : false,
        "default_profile" : false,
        "has_extended_profile" : false,
        "profile_use_background_image" : true,
        "profile_text_color" : "333333",
        "profile_sidebar_fill_color" : "C0DFEC",
        "profile_sidebar_border_color" : "A8C7F7",
        "profile_link_color" : "0084B4",
        "profile_image_url_https" : "https://pbs.twimg.com/profile_images/1809050393/8319_1176944798016_1659998419_448466_355651_n_normal.jpg",
        "profile_background_tile" : false,
        "profile_background_image_url_https" : "https://abs.twimg.com/images/themes/theme15/bg.png",
        "profile_background_image_url" : "http://abs.twimg.com/images/themes/theme15/bg.png",
        "profile_background_color" : "022330",
        "is_translation_enabled" : false,
        "is_translator" : false,
        "contributors_enabled" : false,
        "lang" : "en",
        "verified" : false,
        "geo_enabled" : false,
        "time_zone" : "Quito",
        "utc_offset" : -18000,
        "favourites_count" : 2201,
        "created_at" : "Sun Mar 28 21:39:32 +0000 2010",
        "listed_count" : 4,
        "friends_count" : 210,
        "followers_count" : 228,
        "protected" : false,
        "url" : "http://t.co/c03qdu6TN6",
        "description" : "",
        "profile_location" : null,
        "location" : "",
        "screen_name" : "tmbeihl",
        "name" : "Thomas Beihl",
        "id" : 127334983,
      }
    },
  },

  jrenaux: {
    _id: ObjectId("5524440217321011003de448"),
    "emailVerified" : true,
    "name" : "julien renaux",
    "email" : "julien@gpair.com",
    "username" : "shprink",
    "bio" : "Front End Engineer. #angularjs, #Ionicframework, #webpack, #polymer, #gulpjs. Founder @MateProfiler",
    "location" : {
      "timeZoneId" : "America/Mexico_City",
      "name" : "Mexico City, Federal District, Mexico",
      "shortName" : "Mexico City"
    },
    "initials": "jr",
    "auth": {
      "gh" : {
        "tokens" : { "apcom" : { "token" : "tstsasasfdasdfastsatrast" } },
        "emails" : [ { "verified" : true, "primary" : true, "email" : "julien@gpair.com" }],
        "updated_at" : "2016-04-07T21:23:26Z",
        "created_at" : "2012-01-29T07:31:07Z",
        "following" : 114,
        "followers" : 144,
        "public_gists" : 8,
        "public_repos" : 71,
        "bio" : null,
        "hireable" : true,
        "email" : "julien@gpair.com",
        "location" : "Toulouse, France",
        "blog" : "http://julienrenaux.fr",
        "company" : "Toptal",
        "name" : "Julien Renaux",
        "gravatar_id" : "",
        "avatar_url" : "https://avatars.githubusercontent.com/u/1388706?v=3",
        "id" : 1388706,
        "login" : "shprink"
      }
    },
    "photos" : [{ "_id" : ObjectId("5712528f4cbb411200a67ac3"), "value" : "https://avatars.githubusercontent.com/u/1388706?v=3", "type" : "github", "primary" : true }],
    "emails" : [
      { "origin" : "oauth:github", "verified" : true, "value" : "julien@gpair.com", "primary" : true, "_id" : ObjectId("571253487d0c8f1100dcd3a3") }]
  },

  matias: {
    "_id" : ObjectId("524301cc66a6f999a465f86d"),
    "bio" : "Matias is a core developer on AngularJS at Google working out of Mountain View California. He blogs at yearofmoo.com.",
    "email" : "matias.n@airpair.com",
    "emailVerified" : true,
    "name" : "Matias Niemelä",
    "username" : "matsko",
    "roles" : [],
    "initials" : "MN",
    "location" : {
      "timeZoneId" : "America/Los_Angeles",
      "name" : "San Francisco, CA, USA",
      "shortName" : "San Francisco"
    },
    "auth" : {
      "gh" : {
        "updated_at" : "2015-03-05T23:08:23Z",
        "created_at" : "2009-06-08T05:35:05Z",
        "following" : 50,
        "followers" : 617,
        "public_gists" : 34,
        "public_repos" : 13,
        "bio" : null,
        "hireable" : true,
        "emails": [{ email:'matias@airpair.com', verified: true , primary: true }],
        "location" : "Toronto",
        "blog" : "http://www.yearofmoo.com",
        "company" : "yearofmoo",
        "name" : "Matias Niemelä",
        "gravatar_id" : "",
        "avatar_url" : "https://avatars.githubusercontent.com/u/93018?v=3",
        "id" : 93018,
        "login" : "matsko",
        "tokens" : { "apcom" : { "token" : "token" } }
      }
    }
  },


  admin: {
    "_id" : ObjectId("54551be15f221efa174238d1"),
    "auth":{
      "gp": {
        "id" : "199992380360999999999",
        "email" : "admin@airpair.com",
        "verified_email" : true,
        "name" : "Admin Daemon",
        "given_name" : "Admin",
        "family_name" : "Daemon",
        "link" : "https://plus.google.com/117132380360243205600",
        "picture" : "https://lh3.googleusercontent.com/-NKYL9eK5Gis/AAAAAAAAAAI/AAAAAAAABKU/25K0BTOoa8c/photo.jpg",
        "gender" : "male",
        "locale" : "en",
        "hd" : "airpair.com"
      },
      "gh" : {
        "login" : "airpairadm",
        "id" : 11262312,
        "emails": [{ email: "admin@airpair.com", verified: true, primary: true }],
        "avatar_url" : "https://avatars.githubusercontent.com/u/11261012?v=3",
        "html_url" : "https://github.com/airpairadm",
        "gists_url" : "https://api.github.com/users/airpairadm/gists{/gist_id}",
        "starred_url" : "https://api.github.com/users/airpairadm/starred{/owner}{/repo}",
        "subscriptions_url" : "https://api.github.com/users/airpairadm/subscriptions",
        "organizations_url" : "https://api.github.com/users/airpairadm/orgs",
        "repos_url" : "https://api.github.com/users/airpairadm/repos",
        "public_repos" : 0,
        "public_gists" : 0,
        "followers" : 0,
        "following" : 0,
        "created_at" : "2015-03-01T21:12:29Z",
        "updated_at" : "2015-03-01T22:22:16Z",
        "private_gists" : 0,
        "total_private_repos" : 0,
        "owned_private_repos" : 0,
        "disk_usage" : 0,
        "collaborators" : 0,
        "tokens" : {
          'consult': { "token" : "835b520ebd5710972d421cf8c190c59adccf39e7" }
        }
      }
    },
    "emails" : [{value:"ad@airpair.com"}],
    "name" : "Admin Daemon",
    "roles" : [ "admin" ]
  },

  dros: {
    "_id" : ObjectId("52cd929666a6f999a465fee8"),
    "cohort" : {
        "engagement" : {
            "visit_first" : ISODate("2014-01-08T18:01:58.000Z"),
            "visit_signup" : ISODate("2014-01-08T18:01:58.000Z")
        },
        "aliases" : [
            "7mh_UKwcimI3n5ROjBU3Zn6eFNwQN558",
            "o4_4heNIDBN1p1J8ak2sogIZyeBCp-nj",
            "84E6YbB5Gi2CNjNN3vwL1mfTv4YZk9u6",
            "LctJ4NvzMPx7QNZx6aHstX_oKuXsXScw",
            "ZrfFojUld0ca-bil8C1HqIIGAkjeO0-t",
            "1q4qvnVgVerF1kfzeTv6B7Ah2XEypLbr",
            "JqkwROS0-G0voOaNHxTEmk27OEJVBaXh"
        ],
        "firstRequest" : {
            "url" : "/review/549fa337a21c7e0b00f5c035"
        }
    },
    "emails" : [{value:"daniel@roseman.org.uk",verified:true,primary:true}],
    "name" : "Daniel Roseman",
    "tags" : [
        { "sort" : 0,
            "tagId" : ObjectId("514830f257e7aa0200000014"),
            "_id" : ObjectId("54b5a5656741740900e9a439")
        },
        { "sort" : 0,
            "tagId" : ObjectId("514825fa2a26ea020000002d"),
            "_id" : ObjectId("54b5a56e6741740900e9a43c")
        }
    ],
    "initials" : "DR",
    "username" : "danielroseman",
    "bio" : "Highly experienced web developer, focusing on Django and Python. Top answerer for Django on StackOverflow.",
    "location" : {
        "timeZoneId" : "Europe/London",
        "name" : "London, UK",
        "shortName" : "London"
    },
    "auth" : {
      "so" : {
        "badge_counts" : {
            "bronze" : 377,
            "silver" : 299,
            "gold" : 17
        },
        "account_id" : 36572,
        "last_modified_date" : 1439401045,
        "last_access_date" : 1439408584,
        "age" : 42,
        "reputation_change_year" : 34576,
        "reputation_change_quarter" : 7399,
        "reputation_change_month" : 1990,
        "reputation_change_week" : 672,
        "reputation_change_day" : 135,
        "reputation" : 254273,
        "creation_date" : 1241958973,
        "user_type" : "registered",
        "user_id" : 104349,
        "accept_rate" : 86,
        "location" : "London, United Kingdom",
        "website_url" : "http://blog.roseman.org.uk",
        "link" : "http://stackoverflow.com/users/104349/daniel-roseman",
        "profile_image" : "https://www.gravatar.com/avatar/0f4cefeedec5163556751d61625eedd0?s=128&d=identicon&r=PG",
        "display_name" : "Daniel Roseman",
        tokens: {}
      },
      "gp" : {
        "email" : "daniel@roseman.org.uk",
        "domain" : "roseman.org.uk",
        "verified" : false,
        "circledByCount" : 64,
        "language" : "en_GB",
        "isPlusUser" : true,
        "organizations" : [
            { "primary" : false, "endDate" : "2014",
                "type" : "work", "title" : "Web developer", "name" : "Google" }
        ],
        "image" : {
            "isDefault" : false,
            "url" : "https://lh5.googleusercontent.com/-1R1aMkFsXWM/AAAAAAAAAAI/AAAAAAAABgo/PKlxamXUklE/photo.jpg?sz=50"
        },
        "url" : "https://plus.google.com/103602126141908605207",
        "name" : "Daniel Roseman",
        "id" : "103602126141908605207",
        "objectType" : "person",
        "emails" : [{ "type" : "account", "value" : "daniel@roseman.org.uk" }],
        "gender" : "male",
        "etag" : "\"i9aZP8TD8jXVPIxD0T0PWsMRx6s/FIn7xrqWhsmal8A8Bg-sJkG6AN0\"",
        "kind" : "plus#person",
        tokens: {}
      },
      "gh" : {
        "updated_at" : "2014-01-03T07:30:41Z",
        "created_at" : "2009-09-25T20:24:32Z",
        "following" : 0,
        "followers" : 23,
        "public_gists" : 6,
        "public_repos" : 11,
        "gravatar_id" : "0f4cefeedec5163556751d61625eedd0",
        "avatar_url" : "https://gravatar.com/avatar/0f4cefeedec5163556751d61625eedd0?d=https%3A%2F%2Fidenticons.github.com%2F098e1fe65009e1827566072fb4db0173.png&r=x",
        "id" : 131395,
        "login" : "danielroseman",
        "emails": [{ email: "drosey@airpair.com", verified: true, primary: true }],
        "name" : "Daniel Roseman",
        tokens: {}
      },
      "sl" : {
        "slackUrl" : "https://airpair.slack.com/",
        "team" : "AirPair",
        "teamId" : "T02ATFDPL",
        "username" : "danielroseman",
        "id" : "U0914P0LT",
        tokens: {}
      }
    }
  }

})
