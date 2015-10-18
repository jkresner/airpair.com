module.exports = {

  gnic: {
    "_id" : ObjectId("52a7729e2320fe0200000064"),
    "availability" : { "hours" : "5-10", "minRate" : 40, "status" : "ready" },
    "brief" : "software engineer + startup founder. enjoy teaching and helping people of all skill levels. from basics of http requests, to rest api design, to advanced data aggregation + visualization, to advanced package management + packaging techniques.",
    "gmail" : "faction.gregory@gmail.com",
    "email" : "faction.gregory@gmail.com",
    "rate" : 100,
    "tags" : [
        { "_id" : ObjectId("514825fa2a26ea020000002d"), "sort" : 0 },
        { "_id" : ObjectId("51828a7b66a6f999a465f293"), "sort" : 1 }
    ],
    "userId" : ObjectId("51ba69f466a6f999a465f3b5")
  },

  dros: {
    "_id" : ObjectId("52cd93103237b10200000013"),
    "availability" : {
        "hours" : "2",
        "minRate" : 70,
        "status" : "ready"
    },
    "rate" : 110,
    "tags" : [
        {"sort" : 0, "_id" : "514830f257e7aa0200000014" },
        {"sort" : 1, "_id" : "514825fa2a26ea020000002d" },
        {"sort" : 2, "_id" : "5148337257e7aa020000001e" }
    ],
    "userId" : ObjectId("52cd929666a6f999a465fee8"),
    "minRate" : 110
  },

  snug: {
    "_id" : ObjectId("52127d5fc6a5870200000007"),
    "brief" : "Due to health reasons I have to keep moving at all times. This allows me to be remote and take my workouts every couple hours while helping in between. ",
    "gmail" : "rashaunstovall@gmail.com",
    "rate": 110,
    "tags" : [
      { "_id" : ObjectId("514825fa2a26ea020000001f"), "sort" : 0 },
      { "_id" : ObjectId("5181d0aa66a6f999a465ee2e"), "sort" : 1 },
      { "_id" : ObjectId("5149de4b5fc6390200000017"), "sort" : 2 },
      { "_id" : ObjectId("51520638eecddf020000000f"), "sort" : 3 },
      { "_id" : ObjectId("5181d0aa66a6f999a465eceb"), "sort" : 4 }
    ],
    "userId" : ObjectId("52127d4066a6f999a465f637"),
  },


  dlim: {
    "_id" : ObjectId("551427845955b711004d5e90"),
    "rate" : 40,
    "brief" : "I want to offer my skills to those who need it despite our physical locations. What matters is deliverables quality of and a solid understanding of the chosen technologies.",
    "userId" : ObjectId("5514147a022cc2110006605c"),
    "mojo" : 0,
    "updatedAt" : ISODate("2015-03-26T15:36:36.000Z"),
    "busyUntil" : ISODate("2015-03-26T15:36:36.000Z"),
    "user": "TAKEN FROM data.users.dlim",
    "tags" : [  {  "_id" : ObjectId("514825fa2a26ea020000002d"),  "sort" : 0 } ],
    "activity" : [],
    "lastTouch" : {
      "action" : "create",
      "utc" : ISODate("2015-03-26T15:36:36.781Z"),
      "by" : {
          "_id" : ObjectId("5514147a022cc2110006605c"),
          "name" : "Davi Lima"
      }
    },
  },


  louf: {
    "_id" : ObjectId("52f3e3d34b04b30200000019"),
    "availability" : {
      "minRate" : 70,
      "status" : "ready",
      "hours" : "2",
    },
    "brief" : "I am the author of \"Hello! iOS Development\" and built a tutorial site for mobile programming. I can help at any level from beginner to expert.",
    "gmail" : "loumfranco@gmail.com",
    "pic" : "https://secure.gravatar.com/avatar/e27f554e9ed800bca61642acaba29452",
    "rate" : 110,
    "tags" : [
        {"_id" : ObjectId("514825fa2a26ea020000001b"), "sort" : 0 },
        {"_id" : ObjectId("514825fa2a26ea0200000029"),"sort" : 1},
        {"_id" : ObjectId("5181d0a966a6f999a465eb9f"),"sort" : 2},
        {"_id" : ObjectId("5181d0ab66a6f999a465eed6"),"sort" : 3},
        {"_id" : ObjectId("514825fa2a26ea020000000c"),"sort" : 4},
        {"_id" : ObjectId("514825fa2a26ea020000000d"),"sort" : 5},
        {"_id" : ObjectId("514825fa2a26ea020000001e"),"sort" : 6},
        {"_id" : ObjectId("514deb95ca38eb0200000019"),"sort" : 7},
        {"_id" : ObjectId("5181d0a966a6f999a465ebd0"),"sort" : 8},
        {"_id" : ObjectId("514825fa2a26ea020000002d"),"sort" : 9},
        {"_id" : ObjectId("514830f257e7aa0200000014"),"sort" : 10},
        {"_id" : ObjectId("5181d0a966a6f999a465eb4e"),"sort" : 11},
        {"_id" : ObjectId("514825fa2a26ea020000001f"),"sort" : 12},
        {"_id" : ObjectId("52ffea1a1c67d1a4859d2333"),"sort" : 13},
        {"_id" : ObjectId("514825fa2a26ea020000000e"),"sort" : 14},
    ],
    "userId" : ObjectId("52f3e3a71c67d1a4859d215c"),
    "activity" : [
        { "_id" : ObjectId("5508c75e1a2d210c00cef5c1"),     "action" : "update",
            "utc" : ISODate("2015-03-18T00:31:26.870Z"),
            "by" : {
                "_id" : ObjectId("52f3e3a71c67d1a4859d215c"),
                "name" : "Lou Franco"
            }
        }
    ],
    "lastTouch" : {
        "action" : "update",
        "utc" : ISODate("2015-03-18T00:31:26.870Z"),
        "by": {
          "_id" : ObjectId("52f3e3a71c67d1a4859d215c"),
          "name" : "Lou Franco"
        }
    },
  },

  tmot : {
    "_id" : ObjectId("52728efff7f1d4020000001a"),
    "availability" : "",
    "brief" : "Application and website development, AngularJS MVC/MVVM architecture, JavaScript and HTML5 APIs, mixed with CSS3 challenges and responsive media queries.",
    "email" : "todd@toddmotto.com",
    "gmail" : "todd@toddmotto.com",
    "minRate" : 70,
    "name" : "Todd Motto",
    "rate" : 160,
    "tags" : [
        { "_id" : ObjectId("514825fa2a26ea020000001a") },
        { "_id" : ObjectId("514825fa2a26ea020000001f") },
        { "_id" : ObjectId("5149dccb5fc6390200000013") },
        { "_id" : ObjectId("5181d0a966a6f999a465eb66") },
        { "_id" : ObjectId("51494194c28baf020000001a") }
    ],
    "userId" : ObjectId("527280b766a6f999a465fa9e"),
  },

  ronr: {
    "_id" : ObjectId("53f76a7017b29a0200c442a6"),
    "bb" : { "id" : "ronreiter" },
    "brief" : "",
    "email" : "ron.reiter@gmail.com",
    "gmail" : "ron.reiter@gmail.com",
    "name" : "Ron Reiter",
    "pic" : "https://lh4.googleusercontent.com/-N2LkHrxAdPE/AAAAAAAAAAI/AAAAAAAAK-I/DYlZoyOlwb4/photo.jpg",
    "tags" : [
        { "_id" : ObjectId("5181d0aa66a6f999a465ed07"),
      "name" : "operating-system",
            "short" : "operating-system",
            "soId" : "operating-system"
        }
    ],
    "timezone" : "GMT+0300 (IDT)",
    "userId" : ObjectId("53f768a18f8c80299bcc43c0"),
    "username" : "ronreiter"
  },


  phlf: {
    "_id" : ObjectId("527d222f890b070200000030"),
    "brief" : "Depending on the language... would be interested in expert-level challenges or just helping beginners.",
    "email" : "philfreo@gmail.com",
    "minRate" : 70,
    "rate" : 110,
    "tags" : [ { "_id" : ObjectId("5149d9d37bc6da020000000a"), sort: 0 } ],
    "userId" : ObjectId("527d21f266a6f999a465fb1e"),
  },


   dymo: {
    "_id" : ObjectId("534d3e8e4d26f30200000024"),
    "availability" : {
        "hours" : "5-10",
        "minRate" : 70,
        "status" : "ready"
    },
    "rate" : 190,
    "tags" : [
        { "_id" : "514825fa2a26ea0200000031", "sort" : 0 },
        { "_id" : "514825fa2a26ea020000002f", "sort" : 1 },
        { "_id" : "5148ace09820900200000009", "sort" : 2 },
        { "_id" : "5181d0a966a6f999a465ebb1", "sort" : 3 },
        { "_id" : "5181d0aa66a6f999a465edb1", "sort" : 4 }
    ],
    "userId": ObjectId("534d3e5d1c67d1a4859d2d5b")
  },

  dces: {
    "_id" : ObjectId("5359bef3c558c2020000002f"),
    "availability" : {
        "status" : "ready",
        "minRate" : 10,
        "hours" : "3-5"
    },
    "rate" : 230,
    "tags" : [
        { "sort" : 0, "_id" : "514825fa2a26ea020000002f" },
        { "sort" : 1, "_id" : "514825fa2a26ea020000002b" },
        { "sort" : 2, "_id" : "5181d0ab66a6f999a465ee97" },
        { "sort" : 3, "_id" : "514825fa2a26ea0200000029" },
        { "sort" : 4, "_id" : "5181d0ad66a6f999a465f13b" },
        { "sort" : 5, "_id" : "514825fa2a26ea020000001c" },
        { "sort" : 6, "_id" : "514825fa2a26ea0200000023" },
        { "sort" : 7, "_id" : "5153f494d96db10200000011" },
        { "sort" : 8, "_id" : "5181d0a966a6f999a465ec4a" },
        { "sort" : 9, "_id" : "5181d0a966a6f999a465eb37" },
        { "sort" : 10, "_id" : "514825fa2a26ea020000001f" },
        { "sort" : 11, "_id" : "5181d0a966a6f999a465eb76" },
        { "sort" : 12, "_id" : "5181d0a966a6f999a465eb47" },
        { "sort" : 13, "_id" : "514825fa2a26ea0200000006" },
        { "sort" : 14, "_id" : "514825fa2a26ea0200000007" },
        { "sort" : 15, "_id" : "514825fa2a26ea020000001e" },
        { "sort" : 16, "_id" : "5181d0ad66a6f999a465f1d3" }
    ],
    "userId" : ObjectId("5359bd0e1c67d1a4859d2f74"),
  },


  admb: {
    "_id" : ObjectId("51a6cc55960c490200000006"),
    "userId" : ObjectId("51a6c65e66a6f999a465f30b"),
    "brief" : "Equally pleased to help newbies or dig deep on difficult problems.",
    "email" : "abliss@gmail.com",
    "minRate" : 40,
    "name" : "Adam Bliss",
    "pic" : "//0.gravatar.com/avatar/13122bc0c7b33d9720caf821b4165136",
    "rate" : 70,
    "tags" : [
        { "_id" : ObjectId("514825fa2a26ea0200000006") }
    ]
  },

  mkod: {
    "_id" : ObjectId("52f229e990df5e0200000076"),
    "availability" : {
        "hours" : "10-20",
        "minRate" : 40,
        "status" : "ready"
    },
    "rate" : 70,
    "tags" : [
        { "_id" : "5181d0a966a6f999a465ecaf", "sort" : 1 },
        { "_id" : "524c9a5666a6f999a465f925", "sort" : 13 },
        { "_id" : "514825fa2a26ea0200000027", "sort" : 2 },
        { "_id" : "514825fa2a26ea020000002b", "sort" : 3 },
        { "_id" : "5181d0ab66a6f999a465eff0", "sort" : 4 },
        { "_id" : "514825fa2a26ea020000002e", "sort" : 5 },
        { "_id" : "52f22a481c67d1a4859d2066", "sort" : 6 },
        { "_id" : "5181d0aa66a6f999a465edbc", "sort" : 7 },
        { "_id" : "5272931866a6f999a465faa2", "sort" : 8 },
        { "_id" : "514825fa2a26ea0200000007", "sort" : 9 },
        { "_id" : "514825fa2a26ea0200000021", "sort" : 10 },
        { "_id" : "52ec591c1c67d1a4859d1e43", "sort" : 11 },
        { "_id" : "530505bd1c67d1a4859d23eb", "sort" : 12 },
        { "_id" : "5149de6a5fc6390200000019", "sort" : 13 },
        { "_id" : "5149de4b5fc6390200000017", "sort" : 14 },
        { "_id" : "5181d0a966a6f999a465eb35", "sort" : 15 },
        { "_id" : "514825fa2a26ea0200000019", "sort" : 16 },
        { "_id" : "5181d0a966a6f999a465eb3c", "sort" : 17 },
        { "_id" : "5181d0a966a6f999a465eb39", "sort" : 18 },
        { "_id" : "5153f494d96db10200000011", "sort" : 19 },
        { "_id" : "514825fa2a26ea020000001f", "sort" : 20 },
        { "_id" : "521cea5766a6f999a465f708", "sort" : 21 },
        { "_id" : "5181d0ac66a6f999a465f071", "sort" : 22 },
        { "_id" : "5148fe09c28baf0200000006", "sort" : 23 },
        { "_id" : "5181d0a966a6f999a465ec34", "sort" : 24 },
        { "_id" : "515a8cbdeb85470200000029", "sort" : 26 },
        { "_id" : "5318bd681c67d1a4859d26c5", "sort" : 25  }
    ],
    "userId" : ObjectId("52f229b71c67d1a4859d2065")
  },


  mper: {
    "_id" : ObjectId("53cfe315a60ad902009c5954"),
    "brief" : "I just love teaching, simple! I feel that if I can give back to the community by bringing knowledge to others, overall we produce greater solutions to today's complex problems.",
    "email" : "mperren@gmail.com",
    "minRate" : 40,
    "name" : "Michael Perrenoud",
    "rate" : 120,
    "userId" : ObjectId("53cfe2ba8f8c80299bcc3af8"),
    "tags": []
  },

  evan: {
    "_id" : ObjectId("5241c121c20d3f020000000e"),
    "brief" : "While I like solving problems, I enjoy helping people, especially when I can make them more capable of solving problems on their own. It's best when I've taught someone so well that they can start teaching others. ",
    "gmail" : "goldcpufish@gmail.com",
    "rate" : 110,
    "tags" : [
        { "_id" : ObjectId("514825fa2a26ea0200000031"), "sort" : 0 },
        { "_id" : ObjectId("5192296b66a6f999a465f2ce"), "sort" : 16 },
        { "_id" : ObjectId("5181d0aa66a6f999a465ece5"), "sort" : 6 },
        { "_id" : ObjectId("514825fa2a26ea0200000007"), "sort" : 7 },
        { "_id" : ObjectId("514825fa2a26ea0200000018"), "sort" : 1 },
        { "_id" : ObjectId("514825fa2a26ea0200000021"), "sort" : 8 },
        { "_id" : ObjectId("514deb95ca38eb0200000019"), "sort" : 9 },
        { "_id" : ObjectId("5181d0a966a6f999a465eb42"), "sort" : 10 },
        { "_id" : ObjectId("514825fa2a26ea0200000023"), "sort" : 4 },
        { "_id" : ObjectId("514825fa2a26ea020000002c"), "sort" : 12 },
        { "_id" : ObjectId("5181d0a966a6f999a465ec85"), "sort" : 13 },
        { "_id" : ObjectId("5181d0ac66a6f999a465f0ce"), "sort" : 14 },
        { "_id" : ObjectId("514825fa2a26ea020000001f"), "sort" : 2 },
        { "_id" : ObjectId("5181d0a966a6f999a465eb37"), "sort" : 15 },
        { "_id" : ObjectId("5181d0aa66a6f999a465edbf"), "sort" : 5 },
        { "_id" : ObjectId("514825fa2a26ea0200000014"), "sort" : 17 },
        { "_id" : ObjectId("5261bc5566a6f999a465fa0b"), "sort" : 3 },
        { "_id" : ObjectId("51a671ed66a6f999a465f304"), "sort" : 18 },
        { "_id" : ObjectId("5181d0a966a6f999a465eb47"), "sort" : 19 },
        { "_id" : ObjectId("5148330457e7aa020000001d"), "sort" : 20 },
        { "_id" : ObjectId("5181d0a966a6f999a465ec4a"), "sort" : 21 },
        { "_id" : ObjectId("5148adf4982090020000000d"), "sort" : 22 },
        { "_id" : ObjectId("5181d0aa66a6f999a465ed56"), "sort" : 23 },
        { "_id" : ObjectId("5181d0a966a6f999a465ec39"), "sort" : 24 },
        { "_id" : ObjectId("5181d0ab66a6f999a465ef17"), "sort" : 11 },
        { "_id" : ObjectId("5181d0ab66a6f999a465eead"), "sort" : 25 },
        { "_id" : ObjectId("5181d0ac66a6f999a465f0d2"), "sort" : 26 }
    ],
    "userId" : ObjectId("5241c04a66a6f999a465f861"),
  },
}
