module.exports = {

  higherOrder: {
    "_id" : ObjectId("55c02b22d131551100f1f0da"),
    "title" : "Mastering ES6 higher-order functions for Arrays",
    "md" : "Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!",
    "publishHistory" : [
        {
            "touch" : {
                "action" : "publish",
                "utc" : ISODate("2015-09-15T18:39:06.632Z"),
                "by" : {
                    "_id" : ObjectId("538bae591c67d1a4859d3381"),
                    "name" : "Tiago Romero Garcia"
                }
            },
            "commit" : "60f98aa4989c23b4fe06f9d711e77d16ca2f296b",
            "_id" : ObjectId("55f865ca272fbe11004303d7")
        }
    ],
    "editHistory" : [
        {
            "_id" : ObjectId("55c02b22d131551100f1f0db"),
            "utc" : ISODate("2015-08-04T03:01:54.731Z"),
            "action" : "createByAuthor",
            "by" : {
                "name" : "Tiago Romero Garcia",
                "_id" : ObjectId("538bae591c67d1a4859d3381")
            }
        },
        {
            "_id" : ObjectId("55f47468529e2e11008268f5"),
            "action" : "updateHEAD",
            "utc" : ISODate("2015-09-12T18:52:24.805Z"),
            "by" : {
                "_id" : ObjectId("538bae591c67d1a4859d3381"),
                "name" : "Tiago Romero Garcia"
            }
        }
    ],
    "tags" : [
        {
            "_id" : ObjectId("514825fa2a26ea020000001f"),
            "sort" : "0"
        },
        {
            "_id" : ObjectId("5181d0a966a6f999a465ecca"),
            "sort" : "1"
        },
        {
            "_id" : ObjectId("5181d0a966a6f999a465ec0a"),
            "sort" : "2"
        }
    ],
    "forkers" : [
        {
            "email" : "rsmclaug@gmail.com",
            "name" : "Rich McLaughlin",
            "userId" : ObjectId("54f711888438550c00e98aa0"),
            "_id" : ObjectId("55ddc500f8279f110030d88d"),
            "social" : {
                "gh" : {
                    "username" : "RichMcL"
                }
            }
        },
        {
            "email" : "slynch13@gmail.com",
            "name" : "Sean Lynch",
            "userId" : ObjectId("55e90102d2b5001100b0fc79"),
            "_id" : ObjectId("55e90c2ad2b5001100b0fe35"),
            "social" : {
                "gh" : {
                    "username" : "slynch13"
                }
            }
        }
    ],
    "reviews" : [
        {
            "type" : "post-survey-inreview",
            "by" : {
                "_id" : ObjectId("5524440217321011003de445"),
                "name" : "julien renaux",
                "email" : "julien.renaux@gmail.com"
            },
            "_id" : ObjectId("55dcb002c184971100440bbe"),
            "votes" : [
                {
                    "_id" : ObjectId("55dcb057c184971100440bd5"),
                    "val" : 1,
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    }
                }
            ],
            "replies" : [
                {
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    },
                    "comment" : "Thanks Julien for feedback and rating!",
                    "_id" : ObjectId("55dcb061c184971100440bd7")
                }
            ],
            "questions" : [
                {
                    "answer" : "4",
                    "prompt" : "How would you rate the quality of this post?",
                    "key" : "rating",
                    "idx" : 0,
                    "_id" : ObjectId("55dcb002c184971100440bc0")
                },
                {
                    "answer" : "Good stuff!",
                    "prompt" : "Overall comment",
                    "key" : "feedback",
                    "idx" : 1,
                    "_id" : ObjectId("55dcb002c184971100440bbf")
                }
            ]
        },
        {
            "_id" : ObjectId("55dd1e01f8279f110030ae39"),
            "by" : {
                "_id" : ObjectId("527bd05966a6f999a465fb0c"),
                "name" : "Eric Mann",
                "email" : "eric@eam.me"
            },
            "type" : "post-survey-inreview",
            "votes" : [
                {
                    "_id" : ObjectId("55ddedb0f8279f110030e465"),
                    "val" : 1,
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    }
                }
            ],
            "replies" : [
                {
                    "_id" : ObjectId("55ddedc31241ac1100837e2c"),
                    "comment" : "Thanks Eric for your super valuable feedback!",
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    }
                }
            ],
            "questions" : [
                {
                    "_id" : ObjectId("55dd1e01f8279f110030ae3b"),
                    "idx" : 0,
                    "key" : "rating",
                    "prompt" : "How would you rate the quality of this post?",
                    "answer" : "5"
                },
                {
                    "_id" : ObjectId("55dd1e01f8279f110030ae3a"),
                    "idx" : 1,
                    "key" : "feedback",
                    "prompt" : "Overall comment",
                    "answer" : "Higher-order array functions are tricky to grasp, so seeing applicable code examples (particularly the same example re-used in different situations) makes the sophisticated code and syntax much more approachable."
                }
            ]
        },
        {
            "updated" : ISODate("2015-08-26T14:05:35.685Z"),
            "_id" : ObjectId("55ddc784f8279f110030d967"),
            "by" : {
                "_id" : ObjectId("54f711888438550c00e98aa0"),
                "name" : "Rich McLaughlin",
                "email" : "rsmclaug@gmail.com"
            },
            "type" : "post-survey-inreview",
            "votes" : [
                {
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    },
                    "val" : 1,
                    "_id" : ObjectId("55ddedb1f8279f110030e467")
                }
            ],
            "replies" : [
                {
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    },
                    "comment" : "Hey Rich! Thanks so much for your feedback! Great idea, I will add a synopsis :)",
                    "_id" : ObjectId("55ddede01241ac1100837e3b")
                }
            ],
            "questions" : [
                {
                    "answer" : "5",
                    "prompt" : "How would you rate the quality of this post?",
                    "key" : "rating",
                    "idx" : 0,
                    "_id" : ObjectId("55ddc7aff8279f110030d978")
                },
                {
                    "answer" : "Great examples, Tiago.  This is a really strong follow up to your previous post.  Don't forget to add your synopsis section :)  I would add a prominent link to your previous post in the synopsis as well",
                    "prompt" : "Overall comment",
                    "key" : "feedback",
                    "idx" : 1,
                    "_id" : ObjectId("55ddc7aff8279f110030d977")
                }
            ]
        },
        {
            "_id" : ObjectId("55de2919a1d69b110076ffcb"),
            "by" : {
                "_id" : ObjectId("533afd421c67d1a4859d2b28"),
                "name" : "Abraham Polishchuk",
                "email" : "apolishc@gmail.com"
            },
            "type" : "post-survey-inreview",
            "votes" : [
                {
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    },
                    "val" : 1,
                    "_id" : ObjectId("55df43c3a1d69b11007744bd")
                }
            ],
            "replies" : [
                {
                    "_id" : ObjectId("55df43d2a1d69b11007744c5"),
                    "comment" : "That is great to know Abraham! Thanks for your feedback.",
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    }
                }
            ],
            "questions" : [
                {
                    "_id" : ObjectId("55de2919a1d69b110076ffcd"),
                    "idx" : 0,
                    "key" : "rating",
                    "prompt" : "How would you rate the quality of this post?",
                    "answer" : "5"
                },
                {
                    "_id" : ObjectId("55de2919a1d69b110076ffcc"),
                    "idx" : 1,
                    "key" : "feedback",
                    "prompt" : "Overall comment",
                    "answer" : "A great followup to your last article. And I learned some good stuff (I was unaware of .some() for instance). "
                }
            ]
        },
        {
            "type" : "post-survey-inreview",
            "by" : {
                "_id" : ObjectId("52d604b666a6f999a465ff3c"),
                "name" : "Jared Smith",
                "email" : "jared.smith88@me.com"
            },
            "_id" : ObjectId("55df4340d77a1b1100809e9f"),
            "votes" : [
                {
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    },
                    "val" : 1,
                    "_id" : ObjectId("55df43d4a1d69b11007744c7")
                }
            ],
            "replies" : [
                {
                    "_id" : ObjectId("55df43d8a1d69b11007744cb"),
                    "comment" : "Thanks Jared!",
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    }
                }
            ],
            "questions" : [
                {
                    "answer" : "5",
                    "prompt" : "How would you rate the quality of this post?",
                    "key" : "rating",
                    "idx" : 0,
                    "_id" : ObjectId("55df4340d77a1b1100809ea1")
                },
                {
                    "answer" : "Great post!",
                    "prompt" : "Overall comment",
                    "key" : "feedback",
                    "idx" : 1,
                    "_id" : ObjectId("55df4340d77a1b1100809ea0")
                }
            ]
        },
        {
            "_id" : ObjectId("55ea6e2a244a461100582db1"),
            "by" : {
                "_id" : ObjectId("55ea653e244a461100582ccc"),
                "name" : "Alexandr Materukhin",
                "email" : "i.am@artoodetoo.org"
            },
            "type" : "post-survey-inreview",
            "votes" : [
                {
                    "_id" : ObjectId("55ed29a7dd5ac311003773c7"),
                    "val" : 1,
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    }
                }
            ],
            "replies" : [
                {
                    "by" : {
                        "_id" : ObjectId("538bae591c67d1a4859d3381"),
                        "name" : "Tiago Romero Garcia",
                        "email" : "tiagoromerogarcia@gmail.com"
                    },
                    "comment" : "Thanks Alex!!",
                    "_id" : ObjectId("55ed29b0dd5ac311003773cb")
                }
            ],
            "questions" : [
                {
                    "_id" : ObjectId("55ea6e2a244a461100582db3"),
                    "idx" : 0,
                    "key" : "rating",
                    "prompt" : "How would you rate the quality of this post?",
                    "answer" : "5"
                },
                {
                    "_id" : ObjectId("55ea6e2a244a461100582db2"),
                    "idx" : 1,
                    "key" : "feedback",
                    "prompt" : "Overall comment",
                    "answer" : "It's useful and well-timed post."
                }
            ]
        },
        {
            "updated" : ISODate("2015-09-15T17:53:12.664Z"),
            "_id" : ObjectId("55efa1326882141100f368f5"),
            "by" : {
                "_id" : ObjectId("5175efbfa3802cc4d5a5e6ed"),
                "name" : "Jonathon Kresner",
                "email" : "jk@airpair.com"
            },
            "type" : "post-survey-inreview",
            "votes" : [],
            "replies" : [
                {
                    "by" : {
                        "_id" : ObjectId("5175efbfa3802cc4d5a5e6ed"),
                        "name" : "Jonathon Kresner",
                        "email" : "jk@airpair.com"
                    },
                    "comment" : "I think the syntax argument is not as strong as a function that returns a function demonstrating how one can be more DRY and reuse code.",
                    "_id" : ObjectId("55efa4db6882141100f36998")
                }
            ],
            "questions" : [
                {
                    "_id" : ObjectId("55f85b08272fbe110043013d"),
                    "idx" : 0,
                    "key" : "rating",
                    "prompt" : "How would you rate the quality of this post?",
                    "answer" : "4"
                },
                {
                    "_id" : ObjectId("55f85b08272fbe110043013c"),
                    "idx" : 1,
                    "key" : "feedback",
                    "prompt" : "Overall comment",
                    "answer" : "(1) Nice ending to a great ready :p"
                }
            ]
        }
    ],
    "updated" : ISODate("2015-09-15T18:39:06.633Z"),
    "lastTouch" : {
        "by" : {
            "name" : "Tiago Romero Garcia",
            "_id" : ObjectId("538bae591c67d1a4859d3381")
        },
        "utc" : ISODate("2015-09-15T18:39:06.633Z"),
        "action" : "publish"
    },
    "created" : ISODate("2015-08-04T03:01:54.730Z"),
    "by" : {
        "expertId" : ObjectId("538bae8a9768760200ee9e15"),
        "social" : {
            "gh" : {
                "username" : "tiagorg"
            },
            "so" : {
                "link" : "http://stackoverflow.com/users/4438850/tiago-garcia"
            },
            "bb" : {
                "username" : "tiagorg"
            },
            "in" : {
                "id" : "ivQASjTDc7"
            },
            "tw" : {
                "username" : "tiagooo_romero"
            }
        },
        "avatar" : "//0.gravatar.com/avatar/5cac784a074b86d771fe768274f6860c",
        "username" : "tiagorg",
        "bio" : "Technical Manager at @AvenueCode and Technical Leader at @Macys, heavily interested in cutting-edge front-end technologies. http://tiagorg.com",
        "name" : "Tiago Romero Garcia",
        "userId" : ObjectId("538bae591c67d1a4859d3381")
    },
    "assetUrl" : "https://cloud.githubusercontent.com/assets/764487/9474195/82d6a242-4b35-11e5-87a0-43561850b53a.jpg",
    "htmlHead" : {
        "ogUrl" : "https://www.airpair.com/javascript/posts/mastering-es6-higher-order-functions-for-arrays",
        "ogType" : "article",
        "ogTitle" : "Mastering ES6 higher-order functions for Arrays",
        "title" : "Mastering ES6 higher-order functions for Arrays",
        "description" : "Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!",
        "ogDescription" : "Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!",
        "canonical" : "https://www.airpair.com/javascript/posts/mastering-es6-higher-order-functions-for-arrays",
        "ogImage" : "https://cloud.githubusercontent.com/assets/764487/9474195/82d6a242-4b35-11e5-87a0-43561850b53a.jpg"
    },
    "slug" : "mastering-es6-higher-order-functions-for-arrays",
    "github" : {
        "repoInfo" : {
            "author" : "tiagorg",
            "authorTeamName" : "mastering-es6-higher-order-functions-for-arrays-00f1f0da-author",
            "authorTeamId" : 1723144,
            "url" : "https://github.com/airpair/mastering-es6-higher-order-functions-for-arrays"
        }
    },
    "submitted" : ISODate("2015-08-25T17:31:22.008Z"),
    "publishedCommit" : "60f98aa4989c23b4fe06f9d711e77d16ca2f296b",
    "stats" : {
        "rating" : 4.714285714285714,
        "reviews" : 7,
        "comments" : 14,
        "forkers" : 2,
        "openPRs" : 0,
        "closedPRs" : 0,
        "acceptedPRs" : 0,
        "shares" : 0,
        "words" : 2606
    },
    "tmpl" : "default",
    "published" : ISODate("2015-09-15T18:39:06.633Z"),
    "publishedUpdated" : ISODate("2015-09-15T18:39:06.633Z"),
    "publishedBy" : {
        "email" : "tiagoromerogarcia@gmail.com",
        "name" : "Tiago Romero Garcia",
        "_id" : ObjectId("538bae591c67d1a4859d3381")
    }
  },



  pubedArchitec: {
    "_id" : ObjectId("550106c2f1377c0c0051cbef"),
    "title" : "Scalable Architecture DR CoN: Docker, Registrator, Consul, Consul Template and Nginx",
    "md" : "No real MD",
    "publishHistory" : [
        {
            "touch" : {
                "action" : "publish",
                "utc" : "2015-03-16T21:39:54.136Z",
                "by" : {
                    "_id" : ObjectId("5501064cb2620c0c009bae70"),
                    "name" : "Graham Jenson"
                }
            },
            "commit" : "Not yet propagated",
            "_id" : ObjectId("55074daa3c09dd0c009b581f")
        },
        {
            "touch" : {
                "action" : "publish",
                "utc" : "2015-03-16T21:48:35.616Z",
                "by" : {
                    "_id" : ObjectId("5175efbfa3802cc4d5a5e6ed"),
                    "name" : "Jonathon Kresner"
                }
            },
            "commit" : "4321756fa5c0cfeeaab27b73273a577a609913fe",
            "_id" : ObjectId("55074fb38dac8f0c00294a3c")
        }
    ],
    "editHistory" : [],
    "tags" : [
        {
            "slug" : "python",
            "name" : "python",
            "_id" : ObjectId("514825fa2a26ea020000002d")
        },
        {
            "_id" : ObjectId("5249f4d266a6f999a465f897"),
            "name" : "docker",
            "slug" : "docker"
        },
        {
            "_id" : ObjectId("5153f494d96db10200000011"),
            "name" : "NGINX",
            "slug" : "nginx"
        },
        {
            "_id" : ObjectId("5358c8081c67d1a4859d2f18"),
            "name" : "devops",
            "slug" : "devops"
        }
    ],
    "forkers" : [
        {
            "email" : "da@airpair.com",
            "name" : "David Anderton",
            "userId" : ObjectId("54de72d1bb6e680a0011c65c"),
            "_id" : ObjectId("5501c781f1377c0c0051eae1"),
            "social" : {
                "gh" : {
                    "username" : "dwanderton"
                }
            }
        },
        {
            "_id" : ObjectId("55074f993c09dd0c009b5875"),
            "userId" : ObjectId("5175efbfa3802cc4d5a5e6ed"),
            "name" : "Jonathon Kresner",
            "email" : "jk@airpair.com",
            "social" : {
                "gh" : {
                    "username" : "jkresner"
                }
            }
        }
    ],
    "reviews" : [
        {
            "_id" : ObjectId("5502ae9396bc290c00cd048d"),
            "by" : {
                "_id" : "54de72d1bb6e680a0011c65c",
                "name" : "David Anderton",
                "email" : "da@airpair.com"
            },
            "type" : "post-survey-inreview",
            "votes" : [],
            "replies" : [],
            "questions" : [
                {
                    "_id" : ObjectId("5502ae9396bc290c00cd048f"),
                    "idx" : 0,
                    "key" : "rating",
                    "prompt" : "How would you rate the quality of this post?",
                    "answer" : "4"
                },
                {
                    "_id" : ObjectId("5502ae9396bc290c00cd048e"),
                    "idx" : 1,
                    "key" : "feedback",
                    "prompt" : "Overall comment",
                    "answer" : "Hi Graham, thanks for your post! It would be great to hear more about why consul is so important in this pipeline"
                }
            ]
        },
        {
            "_id" : ObjectId("550736f54c39d40c0099424c"),
            "by" : {
                "_id" : "550736924c39d40c00994241",
                "name" : "Fergus Hewson",
                "email" : "dollar10boy@hotmail.com"
            },
            "type" : "post-survey-inreview",
            "votes" : [],
            "replies" : [],
            "questions" : [
                {
                    "_id" : ObjectId("550736f54c39d40c0099424e"),
                    "idx" : 0,
                    "key" : "rating",
                    "prompt" : "How would you rate the quality of this post?",
                    "answer" : "5"
                },
                {
                    "_id" : ObjectId("550736f54c39d40c0099424d"),
                    "idx" : 1,
                    "key" : "feedback",
                    "prompt" : "Overall comment",
                    "answer" : "Great post, looks like a very useful tool!!!"
                }
            ]
        },
        {
            "type" : "post-survey-inreview",
            "by" : {
                "_id" : "5474a0138f8c80299bcc5243",
                "name" : "Rahat Khanna (mappmechanic)",
                "email" : "yehtechnologies@gmail.com"
            },
            "_id" : ObjectId("550738774c39d40c0099427d"),
            "votes" : [],
            "replies" : [],
            "questions" : [
                {
                    "answer" : "4",
                    "prompt" : "How would you rate the quality of this post?",
                    "key" : "rating",
                    "idx" : 0,
                    "_id" : ObjectId("550738774c39d40c0099427f")
                },
                {
                    "answer" : "Nice post. Would try to use Docker.",
                    "prompt" : "Overall comment",
                    "key" : "feedback",
                    "idx" : 1,
                    "_id" : ObjectId("550738774c39d40c0099427e")
                }
            ]
        },
        {
            "_id" : ObjectId("550740e64c39d40c00994413"),
            "by" : {
                "_id" : "550740ad4c39d40c0099440b",
                "name" : "Daniel Walmsley",
                "email" : "daniel.walmsley@gmail.com"
            },
            "type" : "post-survey-inreview",
            "votes" : [
                {
                    "_id" : ObjectId("55074fd88dac8f0c00294a4b"),
                    "val" : 1,
                    "by" : {
                        "_id" : "5175efbfa3802cc4d5a5e6ed",
                        "name" : "Jonathon Kresner",
                        "email" : "jk@airpair.com"
                    }
                }
            ],
            "replies" : [],
            "questions" : [
                {
                    "_id" : ObjectId("550740e64c39d40c00994415"),
                    "idx" : 0,
                    "key" : "rating",
                    "prompt" : "How would you rate the quality of this post?",
                    "answer" : "5"
                },
                {
                    "_id" : ObjectId("550740e64c39d40c00994414"),
                    "idx" : 1,
                    "key" : "feedback",
                    "prompt" : "Overall comment",
                    "answer" : "Looks good, good to hear a Maori perspective on Docker."
                }
            ]
        },
        {
            "type" : "post-survey-inreview",
            "by" : {
                "_id" : "5507428d4c39d40c00994461",
                "name" : "Duncan Tyler",
                "email" : "dunkthetyler@gmail.com"
            },
            "_id" : ObjectId("550742f94c39d40c00994475"),
            "votes" : [],
            "replies" : [],
            "questions" : [
                {
                    "answer" : "5",
                    "prompt" : "How would you rate the quality of this post?",
                    "key" : "rating",
                    "idx" : 0,
                    "_id" : ObjectId("550742f94c39d40c00994477")
                },
                {
                    "answer" : "Docker definitely sounds like a goer, thanks Graham!",
                    "prompt" : "Overall comment",
                    "key" : "feedback",
                    "idx" : 1,
                    "_id" : ObjectId("550742f94c39d40c00994476")
                }
            ]
        }
    ],
    "updated" : "2015-03-16T22:23:33.578Z",
    "lastTouch" : {
        "by" : {
            "name" : "Jonathon Kresner",
            "_id" : "5175efbfa3802cc4d5a5e6ed"
        },
        "utc" : "2015-03-16T22:23:33.578Z",
        "action" : "publish"
    },
    "created" : "2015-03-12T03:23:46.945Z",
    "by" : {
        "userId" : ObjectId("5501064cb2620c0c009bae70"),
        "name" : "Graham Jenson",
        "bio" : "I am a Developer who builds things, I blog over at http://www.maori.geek.nz/",
        "social" : {
            "gh" : "grahamjenson",
            "tw" : "GrahamJenson",
            "gp" : "https://plus.google.com/+GrahamJenson"
        },
        "avatar" : "//0.gravatar.com/avatar/7b9e77978853a15053b169abb710a787"
    },
    "__v" : 0,
    "assetUrl" : "https://maorigeek.s3.amazonaws.com/uploads/docker_whale.png_1411805342.jpg_1421807584.jpg",
    "htmlHead" : {
        "ogUrl" : "https://www.airpair.com/scalable-architecture-with-docker-consul-and-nginx",
        "ogType" : "article",
        "ogTitle" : "Scalable Architecture DR CoN: Docker, Registrator, Consul, Consul Template and Nginx",
        "description" : "In this post I will describe how to use Docker to plug together Consul, Consul Template, Registrator and Nginx into a truly scalable architecture that I am calling DR CoN. Once all plugged together, DR CoN lets you add and remove services from the architecture without having to rewrite any configuration or restart any services, and everything just works!",
        "title" : "Scalable Architecture DR CoN: Docker, Registrator, Consul, Consul Template and Nginx",
        "ogDescription" : "In this post I will describe how to use Docker to plug together Consul, Consul Template, Registrator and Nginx into a truly scalable architecture that I am calling DR CoN. Once all plugged together, DR CoN lets you add and remove services from the architecture without having to rewrite any configuration or restart any services, and everything just works!",
        "canonical" : "https://www.airpair.com/scalable-architecture-with-docker-consul-and-nginx",
        "ogImage" : "https://maorigeek.s3.amazonaws.com/uploads/docker_whale.png_1411805342.jpg_1421807584.jpg"
    },
    "slug" : "scalable-architecture-dr-con-docker-registrator-consul-consul-template-and-nginx",
    "github" : {
        "repoInfo" : {
            "url" : "https://github.com/airpair/scalable-architecture-dr-con-docker-registrator-consul-consul-template-and-nginx",
            "authorTeamId" : 1358851,
            "authorTeamName" : "scalable-architecture-dr-con-docker-registrator-consul-consul-template-and-nginx-0051cbef-author",
            "author" : "grahamjenson"
        }
    },
    "submitted" : "2015-03-12T04:05:46.709Z",
    "stats" : {
        "rating" : 4.6,
        "reviews" : 5,
        "comments" : 5,
        "forkers" : 2,
        "openPRs" : 0,
        "closedPRs" : 0,
        "acceptedPRs" : 0,
        "shares" : 0,
        "words" : 1192
    },
    "tmpl" : "default",
    "published" : "2015-03-16T21:39:54.136Z",
    "publishedUpdated" : "2015-03-16T22:23:33.578Z",
    "publishedBy" : {
        "email" : "jk@airpair.com",
        "name" : "Jonathon Kresner",
        "_id" : ObjectId("5175efbfa3802cc4d5a5e6ed")
    },
    "publishedCommit" : "4321756fa5c0cfeeaab27b73273a577a609913fe"
}

}
