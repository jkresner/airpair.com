// '13.10'
var user = {
  "_id" : ObjectId("5256d46566a6f999a465f9c3"),
  "cohort" : {
    "engagement" : {
      "visit_first" : ISODate("2013-10-10T16:23:01.000Z"),
      "visit_signup" : ISODate("2013-10-10T16:23:01.000Z")
    },
    "aliases" : []
  },
  "linked" : {
    "gp" : {
      "id" : "110699533354232406384",
      "email" : "johnny@totalitee.nl",
      "verified_email" : true,
      "name" : "John Simons",
      "given_name" : "John",
      "family_name" : "Simons",
      "link" : "https://plus.google.com/110699533354232406384",
      "gender" : "male",
      "locale" : "nl",
      "hd" : "totalitee.nl",
      "token" : {
        "token" : "ya29.AHES6ZT1IBFNceCbNCNK9ThZWUaFdzru0yjD6dgUjH8gd8JwQdq2-w",
        "attributes" : {
          "refreshToken" : null
        }
      }
    },
    "gh" : {
      "login" : "Johnsel",
      "id" : 537075,
      "avatar_url" : "https://0.gravatar.com/avatar/8fce27f0e08a7b49aedc309a5c6e502f?d=https%3A%2F%2Fidenticons.github.com%2Fb61624b38decb15e71abf388de8e91e8.png",
      "gravatar_id" : "8fce27f0e08a7b49aedc309a5c6e502f",
      "name" : "Johnny Simons",
      "company" : "http://www.totalitee.nl",
      "blog" : "http://",
      "location" : "Maastricht, Netherlands",
      "email" : "j.simons@compl-ict.nl",
      "hireable" : true,
      "bio" : "",
      "public_repos" : 7,
      "followers" : 2,
      "following" : 4,
      "created_at" : "2010-12-26T18:29:13Z",
      "updated_at" : "2013-10-10T16:23:51Z",
      "public_gists" : 0,
      "token" : {
        "token" : "3f3b28961b49c8f8f4a568da671a1534b903b3c2",
        "attributes" : {
          "refreshToken" : null
        }
      }
    }
  }
}

var expert = {
  "_id" : ObjectId("5256d4a4e9b5050200000028"),
  "availability" : {
    "hours" : "2",
    "minRate" : 10,
    "status" : "ready"
  },
  "brief" : "I'd like to help some beginners with their questions about basic concepts and the utilization of them.",
  "rate" : 10,
  "tags" : [
    { "_id" : "5181d0a966a6f999a465ec69", "sort" : 0 },
    { "_id" : "514825fa2a26ea0200000022", "sort" : 1 },
    { "_id" : "5181d0a966a6f999a465ec06", "sort" : 2 },
    { "_id" : "5181d0a966a6f999a465eb5c", "sort" : 3 },
    { "_id" : "5181d0ac66a6f999a465f0bf", "sort" : 4 },
    { "_id" : "514825fa2a26ea020000002b", "sort" : 5 },
    { "_id" : "514825fa2a26ea0200000027", "sort" : 6 },
    { "_id" : "5181d0a966a6f999a465eb9e", "sort" : 7 },
    { "_id" : "5181d0aa66a6f999a465ee7b", "sort" : 8 }
  ],
  "userId" : ObjectId("5256d46566a6f999a465f9c3")
}

module.exports = { user, expert }
