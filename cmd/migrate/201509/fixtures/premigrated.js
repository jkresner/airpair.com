module.exports = {

//-- Simple google signin only v0 user
maxAltschuler: {
  "_id" : ObjectId("5181e4d366a6f999a465f283"),
  "google" : {
      "provider" : "google",
      "id" : "105699130570311275819",
      "displayName" : "Max Altschuler",
      "name" : {
          "familyName" : "Altschuler",
          "givenName" : "Max"
      },
      "emails" : [
          {
              "value" : "ma@airpair.com"
          }
      ],
      "_json" : {
          "id" : "105699130570311275819",
          "email" : "ma@airpair.com",
          "verified_email" : true,
          "name" : "Max Altschuler",
          "given_name" : "Max",
          "family_name" : "Altschuler",
          "link" : "https://plus.google.com/105699130570311275819",
          "gender" : "male",
          "birthday" : "0000-03-05",
          "locale" : "en",
          "hd" : "airpair.com"
      },
      "token" : {
          "token" : "",
          "attributes" : {
              "refreshToken" : null
          }
      }
  },
  "googleId" : "105699130570311275819"
},

//-- Early google signin only v0 user who also created an expert
// account and was healed during a previous migration
alyssaRavasio: {
  "_id" : ObjectId("5181f23d66a6f999a465f284"),
  "github" : {
      "provider" : "github",
      "id" : 2508259,
      "displayName" : "Alyssa Ravasio",
      "username" : "alyraz",
      "profileUrl" : "https://github.com/alyraz",
      "emails" : [
          {
              "value" : "alyssaravasio@gmail.com"
          }
      ],
      "_json" : {
          "login" : "alyraz",
          "id" : 2508259,
          "avatar_url" : "https://0.gravatar.com/avatar/1b292b01552fcc2a3e0ff4659051aa67?d=https%3A%2F%2Fidenticons.github.com%2F690cca8704279f8a3afaa658abec83c6.png",
          "gravatar_id" : "1b292b01552fcc2a3e0ff4659051aa67",
          "url" : "https://api.github.com/users/alyraz",
          "html_url" : "https://github.com/alyraz",
          "followers_url" : "https://api.github.com/users/alyraz/followers",
          "following_url" : "https://api.github.com/users/alyraz/following{/other_user}",
          "gists_url" : "https://api.github.com/users/alyraz/gists{/gist_id}",
          "starred_url" : "https://api.github.com/users/alyraz/starred{/owner}{/repo}",
          "subscriptions_url" : "https://api.github.com/users/alyraz/subscriptions",
          "organizations_url" : "https://api.github.com/users/alyraz/orgs",
          "repos_url" : "https://api.github.com/users/alyraz/repos",
          "events_url" : "https://api.github.com/users/alyraz/events{/privacy}",
          "received_events_url" : "https://api.github.com/users/alyraz/received_events",
          "type" : "User",
          "name" : "Alyssa Ravasio",
          "company" : "hipcamp",
          "blog" : "hipcamp.com",
          "location" : "415",
          "email" : "alyssaravasio@gmail.com",
          "hireable" : false,
          "bio" : null,
          "public_repos" : 15,
          "followers" : 24,
          "following" : 15,
          "created_at" : "2012-10-08T01:58:40Z",
          "updated_at" : "2013-08-20T13:47:39Z",
          "public_gists" : 4
      },
      "token" : {
          "token" : "alyssa_gh_token",
          "attributes" : {
              "refreshToken" : "alyssa_gh_refreshtoken"
          }
      }
  },
  "githubId" : 2508259,
  "google" : {
      "provider" : "google",
      "id" : "106913840298422494364",
      "displayName" : "Alyssa Ravasio",
      "name" : {
          "familyName" : "Ravasio",
          "givenName" : "Alyssa"
      },
      "emails" : [
          {
              "value" : "alyssaravasio@gmail.com"
          }
      ],
      "_json" : {
          "id" : "106913840298422494364",
          "email" : "alyssaravasio@gmail.com",
          "verified_email" : true,
          "name" : "Alyssa Ravasio",
          "given_name" : "Alyssa",
          "family_name" : "Ravasio",
          "link" : "https://plus.google.com/106913840298422494364",
          "picture" : "https://lh4.googleusercontent.com/-r9KnRjqx3m8/AAAAAAAAAAI/AAAAAAAAAFo/sfsEbMClM1M/photo.jpg",
          "gender" : "female",
          "birthday" : "0000-08-26",
          "locale" : "en"
      },
      "token" : {
          "token" : "",
          "attributes" : {
              "refreshToken" : null
          }
      }
  },
  "googleId" : "106913840298422494364",
  "linkedin" : {
      "provider" : "linkedin",
      "id" : "brzx9U936w",
      "displayName" : "Alyssa Ravasio",
      "name" : {
          "familyName" : "Ravasio",
          "givenName" : "Alyssa"
      },
      "_json" : {
          "firstName" : "Alyssa",
          "id" : "brzx9U936w",
          "lastName" : "Ravasio"
      },
      "token" : {
          "token" : "",
          "attributes" : {
              "tokenSecret" : ""
          }
      }
  },
  "linkedinId" : "brzx9U936w",
  "cohort" : {
      "engagement" : {
          "visit_first" : ISODate("2013-05-02T04:57:33.000Z"),
          "visit_signup" : ISODate("2013-05-02T04:57:33.000Z"),
          "visit_last" : ISODate("2015-04-09T08:08:48.201Z"),
          "visits" : [
              ISODate("2015-04-08T14:00:00.000Z")
          ]
      },
      "firstRequest" : {
          "url" : "/heal"
      },
      "maillists" : [
          "AirPair Newsletter",
          "AirPair Experts"
      ],
      "aliases" : [],
      "expert" : {
          "_id" : ObjectId("52180649df0e81020000002a"),
          "applied" : ISODate("2013-08-24T01:03:05.000Z")
      }
    }
  },

  steveLuu: {
    "_id" : ObjectId("52f4fc5d1c67d1a4859d21cf"),
    "google" : {
        "provider" : "google",
        "id" : "116727085975011109713",
        "displayName" : "Steve Luu",
        "name" : {
            "familyName" : "Luu",
            "givenName" : "Steve"
        },
        "emails" : [
            {
                "value" : "steveluu1123@gmail.com"
            }
        ],
        "_json" : {
            "id" : "116727085975011109713",
            "email" : "steveluu1123@gmail.com",
            "verified_email" : "true",
            "name" : "Steve Luu",
            "given_name" : "Steve",
            "family_name" : "Luu",
            "link" : "https://plus.google.com/116727085975011109713",
            "picture" : "https://lh6.googleusercontent.com/-o6dZv2IjfaQ/AAAAAAAAAAI/AAAAAAAAAAA/pYNrRLG5pBE/photo.jpg?sz=50",
            "gender" : "male",
            "locale" : "en-GB"
        },
        "token" : {
            "token" : "",
            "attributes" : {
                "refreshToken" : null
            }
        }
    },
    "googleId" : "116727085975011109713"
  },


  //-- Early google signin only v0 user who has continued to
  //-- User airpair over the last couple of years
  katharineVanderDrift: {
    "_id" : ObjectId("5285082e66a6f999a465fb7f"),
    "__v" : 0,
    "cohort" : {
        "engagement" : {
            "visits" : [
                ISODate("2014-10-31T00:00:00.000Z")
            ],
            "visit_first" : ISODate("2013-11-14T17:28:14.000Z"),
            "visit_signup" : ISODate("2013-11-14T17:28:14.000Z"),
            "visit_last" : ISODate("2014-10-31T15:10:00.471Z")
        },
        "maillists" : [
            "AirPair Newsletter"
        ],
        "aliases" : [
            "x4RVLswXI4As682Okktt1tMXFz_SHK2H",
            "uea2dU3rkY3J07uKNGte1JmA1wKLu0QR",
            "fiDv2k2IxS6tShgCWs2KrGfL5BgUAJr5",
            "aZnmJwozZ0gfv_L8K3xGiG5_n-ayP53H"
        ],
        "firstRequest" : {
            "url" : "/"
        }
    },
    "email" : "katievanderdrift@gmail.com",
    "emailVerified" : true,
    "google" : {
        "token" : {
            "attributes" : {
                "refreshToken" : null
            },
            "token" : ""
        },
        "_json" : {
            "email" : "katievanderdrift@gmail.com",
            "verified" : false,
            "circledByCount" : 80,
            "language" : "en",
            "isPlusUser" : true,
            "placesLived" : [
                {
                    "value" : "SF"
                }
            ],
            "organizations" : [
                {
                    "primary" : false,
                    "type" : "school",
                    "name" : "University of California, San Diego"
                }
            ],
            "image" : {
                "isDefault" : false,
                "url" : "https://lh6.googleusercontent.com/-fJ-aWB8em0A/AAAAAAAAAAI/AAAAAAAAAJw/ru6MWP4GAZk/photo.jpg?sz=50"
            },
            "url" : "https://plus.google.com/102278125541010698523",
            "aboutMe" : "Hi, I am Katharine. I grew up in the Bay Area and live in San Francisco. My life mainly consists of building cools stuff, playing with my Cat, going to comedy class (my jokes are slowly becoming funny....) and hanging out with my beautiful family. ",
            "tagline" : "Love to build things....",
            "name" : {
                "givenName" : "Katharine",
                "familyName" : "VanderDrift"
            },
            "displayName" : "Katharine VanderDrift",
            "id" : "102278125541010698523",
            "objectType" : "person",
            "urls" : [
                {
                    "label" : "linkedin.com",
                    "type" : "otherProfile",
                    "value" : "http://www.linkedin.com/in/vanderdrift"
                },
                {
                    "label" : "Personal Blog",
                    "type" : "otherProfile",
                    "value" : "http://katharine.org"
                },
                {
                    "label" : "Personal Profile",
                    "type" : "otherProfile",
                    "value" : "http://about.katharine.org"
                },
                {
                    "label" : "Huffington Post",
                    "type" : "contributor",
                    "value" : "http://www.huffingtonpost.com/katharine-vanderdrift/"
                },
                {
                    "label" : "Huffington Post",
                    "type" : "contributor",
                    "value" : "http://www.huffingtonpost.com/katharine-vanderdrift/holiday-shopping-online_b_2116633.html"
                },
                {
                    "label" : "my blog",
                    "type" : "contributor",
                    "value" : "http://katharine.org"
                },
                {
                    "label" : "about me",
                    "type" : "contributor",
                    "value" : "http://about.katharine.org"
                }
            ],
            "emails" : [
                {
                    "type" : "account",
                    "value" : "katievanderdrift@gmail.com"
                }
            ],
            "gender" : "female",
            "skills" : "Ruby, JavaScript/CoffeeScript, Rails, Sinatra, Active Record, Postgres, Object Oriented, Haml, Sass, Search Engine Optimization(SEO), Information Architecture, Keyword Research, Photoshop, Illustrator, Web Design, Responsive Design, Media Queries, Startups.",
            "etag" : "\"RqKWnRU4WW46-6W3rWhLR9iFZQM/8cIBdASEJ1TSamrNNOIrNUf3WSo\"",
            "kind" : "plus#person"
        },
        "gender" : "female",
        "photos" : [
            {
                "value" : "https://lh6.googleusercontent.com/-fJ-aWB8em0A/AAAAAAAAAAI/AAAAAAAAAJw/ru6MWP4GAZk/photo.jpg?sz=50"
            }
        ],
        "emails" : [
            {
                "type" : "account",
                "value" : "katievanderdrift@gmail.com"
            }
        ],
        "name" : {
            "givenName" : "Katharine",
            "familyName" : "VanderDrift"
        },
        "displayName" : "Katharine VanderDrift",
        "id" : "102278125541010698523",
        "provider" : "google"
    },
    "googleId" : "102278125541010698523",
    "name" : "Katharine VanderDrift",
    "bookmarks" : null,
    "tags" : null,
    "local" : {
        "password" : "$2a$08$dTRi9QJ.YwMhn.jPX7pH7eaDiJzOGkLaCaeTGT2fMPh7rX0Y2cWki",
        "emailHashGenerated" : ISODate("2015-04-23T21:38:58.474Z"),
        "changeEmailHash" : "$2a$08$Rob.v3DpywNV1UQk8Sr9he8bcCWRdEaGjl6exWyGb4SlpGZNbrk9a"
    },
    "primaryPayMethodId" : ObjectId("553967d21e90c21100ab3913"),
    "localization" : {
        "timezoneData" : {
            "timeZoneName" : "Pacific Daylight Time",
            "timeZoneId" : "America/Los_Angeles",
            "status" : "OK",
            "rawOffset" : -28800,
            "dstOffset" : 3600
        },
        "timezone" : "Pacific Daylight Time",
        "locationData" : {
            "name" : "San Francisco",
            "geometry" : {
                "viewport" : {
                    "va" : {
                        "k" : -122.3482,
                        "j" : -122.527
                    },
                    "Da" : {
                        "j" : 37.812,
                        "k" : 37.70339999999999
                    }
                },
                "location" : {
                    "D" : -122.4194155,
                    "k" : 37.7749295
                }
            },
            "address_components" : [
                {
                    "types" : [
                        "locality",
                        "political"
                    ],
                    "short_name" : "SF",
                    "long_name" : "San Francisco"
                },
                {
                    "types" : [
                        "administrative_area_level_2",
                        "political"
                    ],
                    "short_name" : "San Francisco County",
                    "long_name" : "San Francisco County"
                },
                {
                    "types" : [
                        "administrative_area_level_1",
                        "political"
                    ],
                    "short_name" : "CA",
                    "long_name" : "California"
                },
                {
                    "types" : [
                        "country",
                        "political"
                    ],
                    "short_name" : "US",
                    "long_name" : "United States"
                }
            ]
        },
        "location" : "San Francisco, CA, USA"
    }
  },

  johnSimons2: {
    "_id" : ObjectId("53334ae71c67d1a4859d29f8"),
    "bitbucket" : {
        "id" : "johnsel",
        "token" : {
            "attributes" : {
                "tokenSecret" : "bbtokensecret"
            },
            "token" : "bbtoken"
        },
        "_json" : {
            "user" : {
                "is_team" : false,
                "resource_uri" : "/1.0/users/johnsel",
                "avatar" : "https://d3oaxc4q5k2d6q.cloudfront.net/m/069454acc352/img/default_avatar/32/user_blue.png",
                "is_staff" : false,
                "display_name" : "johnsel",
                "last_name" : "",
                "first_name" : "",
                "username" : "johnsel"
            },
            "repositories" : []
        },
        "name" : {
            "givenName" : "",
            "familyName" : ""
        },
        "displayName" : " ",
        "username" : "johnsel",
        "provider" : "bitbucket"
    },
    "bitbucketId" : "johnsel",
    "github" : {
        "token" : {
            "attributes" : {
                "refreshToken" : null
            },
            "token" : "ghtoken"
        },
        "_json" : {
            "updated_at" : "2014-07-24T22:05:17Z",
            "created_at" : "2010-12-26T18:29:13Z",
            "following" : 4,
            "followers" : 2,
            "public_gists" : 0,
            "public_repos" : 7,
            "bio" : null,
            "hireable" : true,
            "email" : "jammsimons@gmail.com",
            "location" : "Maastricht, Netherlands",
            "blog" : "http://",
            "company" : "http://www.totalitee.nl",
            "name" : "Johnny Simons",
            "site_admin" : false,
            "type" : "User",
            "received_events_url" : "https://api.github.com/users/Johnsel/received_events",
            "events_url" : "https://api.github.com/users/Johnsel/events{/privacy}",
            "repos_url" : "https://api.github.com/users/Johnsel/repos",
            "organizations_url" : "https://api.github.com/users/Johnsel/orgs",
            "subscriptions_url" : "https://api.github.com/users/Johnsel/subscriptions",
            "starred_url" : "https://api.github.com/users/Johnsel/starred{/owner}{/repo}",
            "gists_url" : "https://api.github.com/users/Johnsel/gists{/gist_id}",
            "following_url" : "https://api.github.com/users/Johnsel/following{/other_user}",
            "followers_url" : "https://api.github.com/users/Johnsel/followers",
            "html_url" : "https://github.com/Johnsel",
            "url" : "https://api.github.com/users/Johnsel",
            "gravatar_id" : "8fce27f0e08a7b49aedc309a5c6e502f",
            "avatar_url" : "https://avatars.githubusercontent.com/u/537075?",
            "id" : 537075,
            "login" : "Johnsel"
        },
        "emails" : [
            {
                "value" : "jammsimons@gmail.com"
            }
        ],
        "profileUrl" : "https://github.com/Johnsel",
        "username" : "Johnsel",
        "displayName" : "Johnny Simons",
        "id" : 537075,
        "provider" : "github"
    },
    "githubId" : 537075,
    "google" : {
        "token" : {
            "attributes" : {
                "refreshToken" : null
            },
            "token" : "gptoken"
        },
        "_json" : {
            "email" : "jammsimons@gmail.com",
            "verified" : false,
            "circledByCount" : 3,
            "language" : "nl",
            "isPlusUser" : true,
            "image" : {
                "isDefault" : true,
                "url" : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"
            },
            "url" : "https://plus.google.com/110689451950945844895",
            "name" : {
                "givenName" : "John",
                "familyName" : "Simons"
            },
            "displayName" : "John Simons",
            "id" : "110689451950945844895",
            "objectType" : "person",
            "emails" : [
                {
                    "type" : "account",
                    "value" : "jammsimons@gmail.com"
                }
            ],
            "gender" : "male",
            "etag" : "\"gLJf7LwN3wOpLHXk4IeQ9ES9mEc/ri4ru2s0egBzOQ4ablQcjSJqK_k\"",
            "kind" : "plus#person"
        },
        "gender" : "male",
        "photos" : [
            {
                "value" : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"
            }
        ],
        "emails" : [
            {
                "type" : "account",
                "value" : "jammsimons@gmail.com"
            }
        ],
        "name" : {
            "givenName" : "John",
            "familyName" : "Simons"
        },
        "displayName" : "John Simons",
        "id" : "110689451950945844895",
        "provider" : "google"
    },
    "googleId" : "110689451950945844895",
    "linkedin" : {
        "token" : {
            "attributes" : {
                "tokenSecret" : ""
            },
            "token" : "in:token"
        },
        "_json" : {
            "lastName" : "Simons",
            "id" : "S4N_80C_2c",
            "firstName" : "John"
        },
        "name" : {
            "givenName" : "John",
            "familyName" : "Simons"
        },
        "displayName" : "John Simons",
        "id" : "S4N_80C_2c",
        "provider" : "linkedin"
    },
    "linkedinId" : "S4N_80C_2c",
    "stack" : {
        "token" : {
            "attributes" : {
                "refreshToken" : null
            },
            "token" : "stack:token"
        },
        "id" : 3485660,
        "provider" : "stackexchange",
        "profile_image" : "https://www.gravatar.com/avatar/0829e001bec55a93c7354193dbcbc129?s=128&d=identicon&r=PG&f=1",
        "display_name" : "user3485660",
        "link" : "http://stackoverflow.com/users/3485660/user3485660",
        "user_id" : 3485660,
        "user_type" : "registered",
        "creation_date" : 1396364133,
        "reputation" : 1,
        "reputation_change_day" : 0,
        "reputation_change_week" : 0,
        "reputation_change_month" : 0,
        "reputation_change_quarter" : 0,
        "reputation_change_year" : 0,
        "last_access_date" : 1396377643,
        "is_employee" : false,
        "account_id" : 4261378,
        "badge_counts" : {
            "gold" : 0,
            "silver" : 0,
            "bronze" : 0
        }
    },
    "stackId" : 3485660,
    "twitter" : {
        "token" : {
            "attributes" : {
                "tokenSecret" : ""
            },
            "token" : ""
        },
        "_json" : {
            "needs_phone_verification" : false,
            "suspended" : false,
            "notifications" : false,
            "follow_request_sent" : false,
            "following" : false,
            "default_profile_image" : false,
            "default_profile" : true,
            "profile_use_background_image" : true,
            "profile_text_color" : "333333",
            "profile_sidebar_fill_color" : "DDEEF6",
            "profile_sidebar_border_color" : "C0DEED",
            "profile_link_color" : "0084B4",
            "profile_image_url_https" : "https://pbs.twimg.com/profile_images/1201328199/johnny_normal.jpg",
            "profile_image_url" : "http://pbs.twimg.com/profile_images/1201328199/johnny_normal.jpg",
            "profile_background_tile" : false,
            "profile_background_image_url_https" : "https://abs.twimg.com/images/themes/theme1/bg.png",
            "profile_background_image_url" : "http://abs.twimg.com/images/themes/theme1/bg.png",
            "profile_background_color" : "C0DEED",
            "is_translation_enabled" : false,
            "is_translator" : false,
            "contributors_enabled" : false,
            "status" : {
                "lang" : "en",
                "possibly_sensitive" : false,
                "retweeted" : false,
                "favorited" : false,
                "entities" : {
                    "user_mentions" : [
                        {
                            "indices" : [
                                80,
                                92
                            ],
                            "id_str" : "1669620384",
                            "id" : 1669620384,
                            "name" : "Startup MOOC",
                            "screen_name" : "StartupMOOC"
                        }
                    ],
                    "urls" : [
                        {
                            "indices" : [
                                40,
                                62
                            ],
                            "display_url" : "staging.ratemyoutf.it",
                            "expanded_url" : "http://staging.ratemyoutf.it/",
                            "url" : "http://t.co/rDp3fZve5L"
                        }
                    ],
                    "symbols" : [],
                    "hashtags" : [
                        {
                            "indices" : [
                                63,
                                75
                            ],
                            "text" : "StartupMOOC"
                        }
                    ]
                },
                "favorite_count" : 0,
                "retweet_count" : 0,
                "contributors" : null,
                "place" : null,
                "coordinates" : null,
                "geo" : null,
                "in_reply_to_screen_name" : null,
                "in_reply_to_user_id_str" : null,
                "in_reply_to_user_id" : null,
                "in_reply_to_status_id_str" : null,
                "in_reply_to_status_id" : null,
                "truncated" : false,
                "source" : "<a href=\"https://dev.twitter.com/docs/tfw\" rel=\"nofollow\">Twitter for Websites</a>",
                "text" : "This student project looks interesting. http://t.co/rDp3fZve5L #StartupMOOC via @StartupMOOC",
                "id_str" : "376777938894483458",
                "id" : 3.767779388944835e+17,
                "created_at" : "Sun Sep 08 18:43:55 +0000 2013"
            },
            "lang" : "nl",
            "statuses_count" : 10,
            "verified" : false,
            "geo_enabled" : true,
            "time_zone" : "Amsterdam",
            "utc_offset" : 7200,
            "favourites_count" : 1,
            "created_at" : "Tue Mar 23 20:47:49 +0000 2010",
            "listed_count" : 2,
            "friends_count" : 51,
            "followers_count" : 25,
            "protected" : false,
            "entities" : {
                "description" : {
                    "urls" : []
                },
                "url" : {
                    "urls" : [
                        {
                            "indices" : [
                                0,
                                22
                            ],
                            "display_url" : "totalitee.nl",
                            "expanded_url" : "http://www.totalitee.nl",
                            "url" : "http://t.co/uYFyTpffea"
                        }
                    ]
                }
            },
            "url" : "http://t.co/uYFyTpffea",
            "description" : "Founder of Totalitee, an IT service company based in Maastricht, NL.",
            "location" : "Maastricht, The Netherlands",
            "screen_name" : "johnny_simons",
            "name" : "John Simons",
            "id_str" : "125773735",
            "id" : 125773735
        },
        "photos" : [
            {
                "value" : "https://pbs.twimg.com/profile_images/1201328199/johnny_normal.jpg"
            }
        ],
        "displayName" : "John Simons",
        "username" : "johnny_simons",
        "id" : 125773735,
        "provider" : "twitter"
    },
    "twitterId" : 125773735,
    "bookmarks" : null,
    "tags" : null,
    "cohort" : {
        "engagement" : {
            "visits" : [
                ISODate("2015-03-19T00:00:00.000Z")
            ],
            "visit_first" : ISODate("2014-03-26T21:47:19.000Z"),
            "visit_signup" : ISODate("2014-03-26T21:47:19.000Z"),
            "visit_last" : ISODate("2015-03-19T12:24:38.079Z")
        },
        "maillists" : [
            "AirPair Newsletter",
            "AirPair Experts"
        ],
        "expert" : {
            "_id" : ObjectId("53334af4ed538e0200000011"),
            "applied" : ISODate("2015-03-19T14:06:12.976Z")
        },
        "aliases" : [
            "42eE30sLq7rA80OE1VkYJSXIAwMvovDO",
            "LGnvH3Q45_1QAfFTkaNIAfN2neKog_QG",
            "-ENiwagCt6XFna3iOi6quzouSfQ9p-pR",
            "74Bn1yas48yfuYfUycQFkiIm_qYj7Y_o",
            "X-yQBQjwKz8SKu7cxtK6ydbdGvD7tfV7",
            "UuBNvG-kOPN1wYE_lKZevV3_r6h2-ywD",
            "sfLPZAvDaK16x7AG3kBfSFGLiBfNab3L",
            "GQp1khuWAFm564ZYetgtpjXjCDCAb_v-"
        ],
        "firstRequest" : {
            "url" : "/"
        }
    },
    "emailVerified" : true,
    "name" : "John Simons",
    "email" : "jammsimons@gmail.com",
    "__v" : 0,
    "social" : {
        "gh" : {
            "provider" : "github",
            "id" : 537075,
            "displayName" : "Johnny Simons",
            "username" : "Johnsel",
            "profileUrl" : "https://github.com/Johnsel",
            "emails" : [
                {
                    "value" : "jammsimons@gmail.com"
                }
            ],
            "_json" : {
                "login" : "Johnsel",
                "id" : 537075,
                "avatar_url" : "https://avatars.githubusercontent.com/u/537075?v=3",
                "gravatar_id" : "",
                "url" : "https://api.github.com/users/Johnsel",
                "html_url" : "https://github.com/Johnsel",
                "followers_url" : "https://api.github.com/users/Johnsel/followers",
                "following_url" : "https://api.github.com/users/Johnsel/following{/other_user}",
                "gists_url" : "https://api.github.com/users/Johnsel/gists{/gist_id}",
                "starred_url" : "https://api.github.com/users/Johnsel/starred{/owner}{/repo}",
                "subscriptions_url" : "https://api.github.com/users/Johnsel/subscriptions",
                "organizations_url" : "https://api.github.com/users/Johnsel/orgs",
                "repos_url" : "https://api.github.com/users/Johnsel/repos",
                "events_url" : "https://api.github.com/users/Johnsel/events{/privacy}",
                "received_events_url" : "https://api.github.com/users/Johnsel/received_events",
                "type" : "User",
                "site_admin" : false,
                "name" : "Johnny Simons",
                "company" : "http://www.totalitee.nl",
                "blog" : "http://",
                "location" : "Maastricht, Netherlands",
                "email" : "jammsimons@gmail.com",
                "hireable" : true,
                "bio" : null,
                "public_repos" : 8,
                "public_gists" : 0,
                "followers" : 2,
                "following" : 4,
                "created_at" : "2010-12-26T18:29:13Z",
                "updated_at" : "2015-03-04T17:21:21Z",
                "private_gists" : 0,
                "total_private_repos" : 0,
                "owned_private_repos" : 0,
                "disk_usage" : 3561,
                "collaborators" : 0,
                "plan" : {
                    "name" : "free",
                    "space" : 307200,
                    "collaborators" : 0,
                    "private_repos" : 0
                }
            },
            "token" : {
                "token" : "",
                "attributes" : {
                    "refreshToken" : null
                }
            }
        },
        "bb" : {
            "provider" : "bitbucket",
            "username" : "johnsel",
            "displayName" : " ",
            "name" : {
                "familyName" : "",
                "givenName" : ""
            },
            "_json" : {
                "repositories" : [
                    {
                        "scm" : "git",
                        "has_wiki" : false,
                        "last_updated" : "2015-03-19T01:21:37.441",
                        "no_forks" : false,
                        "created_on" : "2015-03-19T01:14:39.814",
                        "owner" : "johnsel",
                        "logo" : "https://d3oaxc4q5k2d6q.cloudfront.net/m/0069dea255f6/img/language-avatars/default_16.png",
                        "email_mailinglist" : "",
                        "is_mq" : false,
                        "size" : 15058501,
                        "read_only" : false,
                        "fork_of" : {
                            "scm" : "git",
                            "has_wiki" : true,
                            "last_updated" : "2015-03-19T02:05:50.646",
                            "no_forks" : false,
                            "created_on" : "2015-03-12T07:54:40.981",
                            "owner" : "ressolver",
                            "logo" : "https://d3oaxc4q5k2d6q.cloudfront.net/m/0069dea255f6/img/language-avatars/default_16.png",
                            "email_mailinglist" : "",
                            "is_mq" : false,
                            "size" : 2355639,
                            "read_only" : false,
                            "creator" : "Futurama56",
                            "state" : "available",
                            "utc_created_on" : "2015-03-12 06:54:40+00:00",
                            "website" : "",
                            "description" : "",
                            "has_issues" : false,
                            "is_fork" : false,
                            "slug" : "framework",
                            "is_private" : true,
                            "name" : "framework",
                            "language" : "",
                            "utc_last_updated" : "2015-03-19 01:05:50+00:00",
                            "email_writers" : true,
                            "no_public_forks" : true,
                            "resource_uri" : "/1.0/repositories/ressolver/framework"
                        },
                        "mq_of" : {
                            "scm" : "git",
                            "has_wiki" : true,
                            "last_updated" : "2015-03-19T02:05:50.646",
                            "no_forks" : false,
                            "created_on" : "2015-03-12T07:54:40.981",
                            "owner" : "ressolver",
                            "logo" : "https://d3oaxc4q5k2d6q.cloudfront.net/m/0069dea255f6/img/language-avatars/default_16.png",
                            "email_mailinglist" : "",
                            "is_mq" : false,
                            "size" : 2355639,
                            "read_only" : false,
                            "creator" : "Futurama56",
                            "state" : "available",
                            "utc_created_on" : "2015-03-12 06:54:40+00:00",
                            "website" : "",
                            "description" : "",
                            "has_issues" : false,
                            "is_fork" : false,
                            "slug" : "framework",
                            "is_private" : true,
                            "name" : "framework",
                            "language" : "",
                            "utc_last_updated" : "2015-03-19 01:05:50+00:00",
                            "email_writers" : true,
                            "no_public_forks" : true,
                            "resource_uri" : "/1.0/repositories/ressolver/framework"
                        },
                        "state" : "available",
                        "utc_created_on" : "2015-03-19 00:14:39+00:00",
                        "website" : null,
                        "description" : "",
                        "has_issues" : false,
                        "is_fork" : true,
                        "slug" : "framework-based-project-2",
                        "is_private" : true,
                        "name" : "framework-based-project-2",
                        "language" : "",
                        "utc_last_updated" : "2015-03-19 00:21:37+00:00",
                        "email_writers" : true,
                        "no_public_forks" : true,
                        "creator" : null,
                        "resource_uri" : "/1.0/repositories/johnsel/framework-based-project-2"
                    }
                ],
                "user" : {
                    "username" : "johnsel",
                    "first_name" : "",
                    "last_name" : "",
                    "display_name" : "johnsel",
                    "is_staff" : false,
                    "avatar" : "https://secure.gravatar.com/avatar/069ac6c9c263b91888e138a0705c1cc4?d=https%3A%2F%2Fd3oaxc4q5k2d6q.cloudfront.net%2Fm%2F0069dea255f6%2Fimg%2Fdefault_avatar%2F32%2Fuser_blue.png&s=32",
                    "resource_uri" : "/1.0/users/johnsel",
                    "is_team" : false
                }
            },
            "token" : {
                "token" : "bb:token2",
                "attributes" : {
                    "refreshToken" : "bb:refresh2"
                }
            }
        },
        "in" : {
            "provider" : "linkedin",
            "id" : "S4N_80C_2c",
            "displayName" : "John Simons",
            "name" : {
                "familyName" : "Simons",
                "givenName" : "John"
            },
            "_json" : {
                "firstName" : "John",
                "id" : "S4N_80C_2c",
                "lastName" : "Simons"
            },
            "token" : {
                "token" : "",
                "attributes" : {
                    "tokenSecret" : ""
                }
            }
        },
        "so" : {
            "badge_counts" : {
                "bronze" : 0,
                "silver" : 0,
                "gold" : 0
            },
            "account_id" : 4261378,
            "is_employee" : false,
            "last_access_date" : 1396377643,
            "reputation_change_year" : 0,
            "reputation_change_quarter" : 0,
            "reputation_change_month" : 0,
            "reputation_change_week" : 0,
            "reputation_change_day" : 0,
            "reputation" : 1,
            "creation_date" : 1396364133,
            "user_type" : "registered",
            "user_id" : 3485660,
            "link" : "http://stackoverflow.com/users/3485660/user3485660",
            "display_name" : "user3485660",
            "profile_image" : "https://www.gravatar.com/avatar/0829e001bec55a93c7354193dbcbc129?s=128&d=identicon&r=PG&f=1",
            "provider" : "stackexchange",
            "id" : 3485660,
            "token" : {
                "token" : "so:token",
                "attributes" : {
                    "refreshToken" : null
                }
            }
        },
        "tw" : {
            "id" : "125773735",
            "username" : "johnny_simons",
            "displayName" : "John Simons",
            "photos" : [
                {
                    "value" : "https://pbs.twimg.com/profile_images/517079439977373697/DNP2ZAjT_normal.jpeg"
                }
            ],
            "provider" : "twitter",
            "_json" : {
                "id" : 125773735,
                "id_str" : "125773735",
                "name" : "John Simons",
                "screen_name" : "johnny_simons",
                "location" : "Maastricht, The Netherlands",
                "profile_location" : null,
                "description" : "Full Stack Developer - loves data things (AI, ML) - Maastricht, NL.",
                "url" : "http://t.co/D9630KmmNr",
                "entities" : {
                    "url" : {
                        "urls" : [
                            {
                                "url" : "http://t.co/D9630KmmNr",
                                "expanded_url" : "http://www.totalitee.nl",
                                "display_url" : "totalitee.nl",
                                "indices" : [
                                    0,
                                    22
                                ]
                            }
                        ]
                    },
                    "description" : {
                        "urls" : []
                    }
                },
                "protected" : false,
                "followers_count" : 31,
                "friends_count" : 39,
                "listed_count" : 3,
                "created_at" : "Tue Mar 23 20:47:49 +0000 2010",
                "favourites_count" : 6,
                "utc_offset" : 3600,
                "time_zone" : "Amsterdam",
                "geo_enabled" : true,
                "verified" : false,
                "statuses_count" : 10,
                "lang" : "nl",
                "contributors_enabled" : false,
                "is_translator" : false,
                "is_translation_enabled" : false,
                "profile_background_color" : "000000",
                "profile_background_image_url" : "http://abs.twimg.com/images/themes/theme1/bg.png",
                "profile_background_image_url_https" : "https://abs.twimg.com/images/themes/theme1/bg.png",
                "profile_background_tile" : false,
                "profile_image_url" : "http://pbs.twimg.com/profile_images/517079439977373697/DNP2ZAjT_normal.jpeg",
                "profile_image_url_https" : "https://pbs.twimg.com/profile_images/517079439977373697/DNP2ZAjT_normal.jpeg",
                "profile_link_color" : "0084B4",
                "profile_sidebar_border_color" : "000000",
                "profile_sidebar_fill_color" : "000000",
                "profile_text_color" : "000000",
                "profile_use_background_image" : false,
                "default_profile" : false,
                "default_profile_image" : false,
                "following" : false,
                "follow_request_sent" : false,
                "notifications" : false,
                "suspended" : false,
                "needs_phone_verification" : false
            },
            "token" : {
                "token" : "tw.token",
                "attributes" : {
                    "refreshToken" : "tw.refreshtoken"
                }
            }
        },
        "sl" : {
            "token" : "sltoken",
            "slackUrl" : "https://airpair.slack.com/",
            "team" : "AirPair",
            "teamId" : "T02ATFDPL",
            "username" : "johnsel",
            "id" : "U04DTJ7GY"
        }
    },
    "username" : "Johnsel",
    "roles" : [],
    "siteNotifications" : [
        {
            "name" : "hello",
            "_id" : ObjectId("550adc4738c8740c0030637b")
        }
    ],
    "local" : {
        "changeEmailHash" : "$2a$08$z7OV9Of3GAacZj/1huAzjecXwOJnvXTA3MZFNuge2ItTg.yfhIauG",
        "emailHashGenerated" : ISODate("2015-03-19T12:25:11.475Z")
    },
    "initials" : "JS",
    "localization" : {
        "location" : "Maastricht, Nederland",
        "locationData" : {
            "address_components" : [
                {
                    "long_name" : "Maastricht",
                    "short_name" : "Maastricht",
                    "types" : [
                        "locality",
                        "political"
                    ]
                },
                {
                    "long_name" : "Maastricht",
                    "short_name" : "Maastricht",
                    "types" : [
                        "administrative_area_level_2",
                        "political"
                    ]
                },
                {
                    "long_name" : "Limburg",
                    "short_name" : "LI",
                    "types" : [
                        "administrative_area_level_1",
                        "political"
                    ]
                },
                {
                    "long_name" : "Nederland",
                    "short_name" : "NL",
                    "types" : [
                        "country",
                        "political"
                    ]
                }
            ],
            "geometry" : {
                "location" : {
                    "k" : 50.8513682,
                    "D" : 5.690972500000044
                },
                "viewport" : {
                    "Ca" : {
                        "k" : 50.8038126,
                        "j" : 50.9117809
                    },
                    "va" : {
                        "j" : 5.638867000000005,
                        "k" : 5.762940399999934
                    }
                }
            },
            "name" : "Maastricht"
        },
        "timezone" : "Central European Summer Time",
        "timezoneData" : {
            "dstOffset" : 3600,
            "rawOffset" : 3600,
            "status" : "OK",
            "timeZoneId" : "Europe/Amsterdam",
            "timeZoneName" : "Central European Summer Time"
        }
    },
    "bio" : "Full Stack Developer - loves data things (AI, ML) - Maastricht, NL.",
    "primaryPayMethodId" : ObjectId("550ad8a138c8740c003062bc")
  },


  jkresnergmail: {
    "_id" : ObjectId("549342348f8c80299bcc56c1"),
    "__v" : 0,
    "cohort" : {
      "engagement" : {
        "visits" : [
        ISODate("2014-12-18T00:00:00.000Z")
        ],
        "visit_first" : ISODate("2014-12-18T21:08:04.112Z"),
        "visit_signup" : ISODate("2014-12-18T21:08:04.668Z"),
        "visit_last" : ISODate("2015-03-16T18:25:30.435Z")
      },
      "maillists" : [],
      "expert" : {
        "_id" : ObjectId("5181d4ccf3dc070200000004"),
        "applied" : ISODate("2015-03-16T19:04:11.217Z")
      },
      "aliases" : [
      "Dcd6-EOxReCCzoAFmchGrO4bYCLsqKYz",
      "JRWmCWMEPr0_9KgAwmRl5c7rRfMqzfxT",
      "-FF-SPAb-LsZGAZd-oAmKQcjthxdl005",
      "-g2eI25O5vAoW3cdctO1cExbFzEbIFtp",
      "u9RbdcLSIQiZUeBr3aBqN5VrPOuvMGGW",
      "Wmf66vLMxpNinjVErHsbkHjplt9R6V6n",
      "Zz0djUuIxAlICmiCDMbN-TFxYLxEW0rS",
      "djKnNbPvPSBb5UYdV42pWEDW4O2LROEs",
      "WXaxAYzc9R1l4E34Y9q6aDKf_JNxbZ1g",
      "RJniE7zWE7o4_euQ70aco8AMEceTZxiN",
      "TtesU5ng8QdDrVu7J6751leW0bf4CcF3",
      "s55JPc4j870pn8j0ETpgt-uQzIitsjYq",
      "RY2c2oQEaUr1u6POv-_HGR6PnP_DI2nq",
      "STOLx6HA1j8dWX5PbSASvQqxoZp-iLJP",
      "Ks1USU9-8427pZdv1n0gjNEYKJ5r8znV",
      "-3-w5hOc1CQAeWL1XtuvXL6I5SJyIjKT",
      "240D1902OfekIG93YiuiuKv8y-MknMWa"
      ],
      "firstRequest" : 1
    },
    "email" : "jkresner@gmail.com",
    "emailVerified" : true,
    "google" : {
      "token" : {
        "attributes" : {},
        "token" : "ya29.6wHP3ZohKtZfj7f72twn6XQZ7iL9sAOTAGpNo02twQK7juISn_s4P0Z8T11V-lY839Nl"
      },
      "_json" : {
        "email" : "jkresner@gmail.com",
        "verified" : false,
        "circledByCount" : 54,
        "language" : "en",
        "isPlusUser" : true,
        "image" : {
          "isDefault" : false,
          "url" : "https://lh3.googleusercontent.com/-daU--wCrRcI/AAAAAAAAAAI/AAAAAAAAAKs/o_lTNF4G8Pk/photo.jpg?sz=50"
        },
        "url" : "https://plus.google.com/111546642302857408422",
        "name" : {
          "givenName" : "Jonathon",
          "familyName" : "Kresner"
        },
        "displayName" : "Jonathon Kresner",
        "id" : "111546642302857408422",
        "objectType" : "person",
        "emails" : [
        {
          "type" : "account",
          "value" : "jkresner@gmail.com"
        }
        ],
        "gender" : "male",
        "etag" : "\"gLJf7LwN3wOpLHXk4IeQ9ES9mEc/TuDMGpjYOpog5H_sxxMJbxfBXPU\"",
        "kind" : "plus#person"
      },
      "gender" : "male",
      "photos" : [
      {
        "value" : "https://lh3.googleusercontent.com/-daU--wCrRcI/AAAAAAAAAAI/AAAAAAAAAKs/o_lTNF4G8Pk/photo.jpg?sz=50"
      }
      ],
      "emails" : [
      {
        "type" : "account",
        "value" : "jkresner@gmail.com"
      }
      ],
      "name" : {
        "givenName" : "Jonathon",
        "familyName" : "Kresner"
      },
      "displayName" : "Jonathon Kresner",
      "id" : "111546642302857408422",
      "provider" : "google"
    },
    "googleId" : "111546642302857408422",
    "name" : "Jonathon Kresner",
    "primaryPayMethodId" : ObjectId("54aaf96686df030b00a200a0"),
    "tags" : [
        {
            "tagId" : ObjectId("53586ccf1c67d1a4859d2f03"),
            "sort" : 0,
            "_id" : ObjectId("53586ccf1c67d1a4859d2f03")
        }
    ],
    "local" : {
      "password" : "$2a$08$9fRG900ttsOjzFmkQPg1R.SeKqOS87qCSPKco4/533y0pjuPiVtHO",
    },
    "bookmarks" : null,
    "social" : {
      "gh" : {
        "provider" : "github",
        "id" : 979542,
        "displayName" : "Jonathon Kresner",
        "username" : "jkresner",
        "profileUrl" : "https://github.com/jkresner",
        "emails" : [{"value" : ""}],
        "_json" : {
          "login" : "jkresner",
          "id" : 979542,
          "avatar_url" : "https://avatars.githubusercontent.com/u/979542?v=3",
          "gravatar_id" : "",
          "url" : "https://api.github.com/users/jkresner",
          "html_url" : "https://github.com/jkresner",
          "followers_url" : "https://api.github.com/users/jkresner/followers",
          "following_url" : "https://api.github.com/users/jkresner/following{/other_user}",
          "gists_url" : "https://api.github.com/users/jkresner/gists{/gist_id}",
          "starred_url" : "https://api.github.com/users/jkresner/starred{/owner}{/repo}",
          "subscriptions_url" : "https://api.github.com/users/jkresner/subscriptions",
          "organizations_url" : "https://api.github.com/users/jkresner/orgs",
          "repos_url" : "https://api.github.com/users/jkresner/repos",
          "events_url" : "https://api.github.com/users/jkresner/events{/privacy}",
          "received_events_url" : "https://api.github.com/users/jkresner/received_events",
          "type" : "User",
          "site_admin" : false,
          "name" : "Jonathon Kresner",
          "company" : "airpair, inc.",
          "blog" : "http://www.hackerpreneurialism.com",
          "location" : "San Francisco",
          "email" : "",
          "hireable" : false,
          "bio" : null,
          "public_repos" : 23,
          "public_gists" : 22,
          "followers" : 41,
          "following" : 40,
          "created_at" : "2011-08-14T17:14:37Z",
          "updated_at" : "2015-02-20T19:36:09Z",
          "private_gists" : 1,
          "total_private_repos" : 9,
          "owned_private_repos" : 4,
          "disk_usage" : 102347,
          "collaborators" : 9,
          "plan" : {
            "name" : "micro",
            "space" : 614400,
            "collaborators" : 0,
            "private_repos" : 5
          }
        },
        "token" : {
          "token" : "ce585795b92af807d3a11bb06340f09ea408a3e5",
          "attributes" : {}
        }
      },
      "al" : {
        "username" : "jkresner",
        "token" : {
          "attributes" : {},
          "token" : "b6b16ac7e0c37ccf817649659c4795934a5b9e958dd589ea"
        },
        "_json" : {
          "scopes" : [
          "message",
          "talent",
          "dealflow",
          "comment",
          "email",
          "invest",
          "accreditation"
          ],
          "investor" : true,
          "skills" : [
          {
            "level" : null,
            "angellist_url" : "https://angel.co/bdd-tdd",
            "display_name" : "BDD/TDD",
            "name" : "bdd/tdd",
            "tag_type" : "SkillTag",
            "id" : 58024
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/web-development-2",
            "display_name" : "Web Development",
            "name" : "web development",
            "tag_type" : "SkillTag",
            "id" : 17236
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/fundraising",
            "display_name" : "Fundraising",
            "name" : "fundraising",
            "tag_type" : "SkillTag",
            "id" : 14770
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/mobile-development",
            "display_name" : "Mobile Development",
            "name" : "mobile development",
            "tag_type" : "SkillTag",
            "id" : 17237
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/user-experience-design-1",
            "display_name" : "User Experience Design",
            "name" : "user experience design",
            "tag_type" : "SkillTag",
            "id" : 15537
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/pitching",
            "display_name" : "Pitching",
            "name" : "pitching",
            "tag_type" : "SkillTag",
            "id" : 22820
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/online-marketing-1",
            "display_name" : "Online Marketing",
            "name" : "online marketing",
            "tag_type" : "SkillTag",
            "id" : 16692
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/sales-and-marketing-2",
            "display_name" : "Sales and Marketing",
            "name" : "sales and marketing",
            "tag_type" : "SkillTag",
            "id" : 23989
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/javascript",
            "display_name" : "Javascript",
            "name" : "javascript",
            "tag_type" : "SkillTag",
            "id" : 14781
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/got-to-market-strategy",
            "display_name" : "Got to Market Strategy",
            "name" : "got to market strategy",
            "tag_type" : "SkillTag",
            "id" : 31099
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/node-js",
            "display_name" : "Node.js",
            "name" : "node.js",
            "tag_type" : "SkillTag",
            "id" : 17000
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/backbone-js",
            "display_name" : "Backbone.js",
            "name" : "backbone.js",
            "tag_type" : "SkillTag",
            "id" : 33096
          },
          {
            "level" : null,
            "angellist_url" : "https://angel.co/sales-1",
            "display_name" : "Sales",
            "name" : "sales",
            "tag_type" : "SkillTag",
            "id" : 16278
          }
          ],
          "roles" : [
          {
            "angellist_url" : "https://angel.co/developer",
            "display_name" : "Developer",
            "name" : "developer",
            "tag_type" : "RoleTag",
            "id" : 14726
          },
          {
            "angellist_url" : "https://angel.co/product_manager",
            "display_name" : "Product Manager",
            "name" : "product_manager",
            "tag_type" : "RoleTag",
            "id" : 80487
          },
          {
            "angellist_url" : "https://angel.co/marketing-2",
            "display_name" : "Marketing",
            "name" : "marketing",
            "tag_type" : "RoleTag",
            "id" : 80489
          },
          {
            "angellist_url" : "https://angel.co/angels",
            "display_name" : "Angel",
            "name" : "angels",
            "tag_type" : "RoleTag",
            "id" : 9300
          }
          ],
          "locations" : [
          {
            "angellist_url" : "https://angel.co/san-francisco",
            "display_name" : "San Francisco",
            "name" : "san francisco",
            "tag_type" : "LocationTag",
            "id" : 1692
          }
          ],
          "criteria" : "Cross discipline hackers psyched about connecting people through technology.",
          "what_i_do" : "I tackle problems normally tackled by teams. I'm more than a generalist technically, I love marketing, pitching, sales, hustling for clients and learning new tricks.",
          "what_ive_built" : "Created climbfind.com which had over 1M visits, a few couples married and forged thousands of friendships in England, Scotland, Canada, United States, Australia and other countries around the world.",
          "resume_url" : null,
          "behance_url" : "",
          "dribbble_url" : "",
          "github_url" : "https://github.com/jkresner",
          "aboutme_url" : "",
          "linkedin_url" : "http://www.linkedin.com/in/jonathonkresner",
          "facebook_url" : "",
          "twitter_url" : "http://twitter.com/#!/hackerpreneur",
          "online_bio_url" : "http://www.hackerpreneurialism.com",
          "blog_url" : "",
          "email" : "jk@airpair.com",
          "image" : "https://d1qb2nb5cznatu.cloudfront.net/users/38089-medium_jpg?1405466353",
          "angellist_url" : "https://angel.co/jkresner",
          "follower_count" : 374,
          "bio" : "Founder at @airpair",
          "id" : 38089,
          "name" : "Jonathon Kresner"
        },
        "displayName" : "Jonathon Kresner",
        "id" : 38089,
        "provider" : "angellist"
      },
      "sl" : {
        "token" : "xoxp-2367523802-2366710101-6062466245-08c388",
        "slackUrl" : "https://airpair.slack.com/",
        "team" : "AirPair",
        "teamId" : "T02ATFDPL",
        "username" : "jk",
        "id" : "U02ASLW2Z",
        "provider" : "slack"
      }
    },
    "initials" : "jk",
    "username" : "jkres",
    "localization" : {
      "timezoneData" : {
        "timeZoneName" : "Pacific Daylight Time",
        "timeZoneId" : "America/Los_Angeles",
        "status" : "OK",
        "rawOffset" : -28800,
        "dstOffset" : 3600
      },
      "timezone" : "Pacific Daylight Time",
      "locationData" : {
        "name" : "San Francisco",
        "geometry" : {
          "viewport" : {
            "va" : {
              "k" : -122.3482,
              "j" : -122.527
            },
            "Ca" : {
              "j" : 37.812,
              "k" : 37.70339999999999
            }
          },
          "location" : {
            "D" : -122.4194155,
            "k" : 37.7749295
          }
        },
        "address_components" : [
        {
          "types" : [
          "locality",
          "political"
          ],
          "short_name" : "SF",
          "long_name" : "San Francisco"
        },
        {
          "types" : [
          "administrative_area_level_2",
          "political"
          ],
          "short_name" : "San Francisco County",
          "long_name" : "San Francisco County"
        },
        {
          "types" : [
          "administrative_area_level_1",
          "political"
          ],
          "short_name" : "CA",
          "long_name" : "California"
        },
        {
          "types" : [
          "country",
          "political"
          ],
          "short_name" : "US",
          "long_name" : "United States"
        }
        ]
      },
      "location" : "San Francisco, CA, USA"
    },
    "bio" : "This is jk's testing expert account that doesn't have god administrator permissions. You should pretend this profile is a ghost."
  }
}
