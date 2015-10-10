

// var fields = {
//   listSelect: { title:1,slug:1,time:1,tags:1,'speakers.name':1,'speakers.gravatar':1 },
//   rssSelect: { title:1,description:1,slug:1,time:1,tags:1,'speakers.name':1 }
// }

var workshops = {

  getAll(cb) {
    var options = {sort: {'time' : -1 } }
    // svc.searchMany({},{ fields: fields.listSelect, options }, (e, r) => {
      // console.log(JSON.stringify(r))
    for (var w of ALL)
    {
      w.url = `${w.tags[0]}/workshops/${w.slug}`
      w.speaker = w.speakers[0]
    }
    cb(null, ALL)
    // })
  },

  getAllForCache(cb) {
    workshops.getAll(cb)
  },

  getAllForRss(cb) {
    cb(V2DeprecatedError('Workshops.getAllForRss'))
    // var options = {sort: {'time': -1}, limit: 9}
    // svc.searchMany({},{ fields: fields.rssSelect, options }, (e, r) => {
    //   for (var w of r) {
    //     w.url = `https://www.airpair.com/${w.tags[0]}/workshops/${w.slug}`
    //     var betterTags = []
    //     for (var t of w.tags) betterTags.push({name:t})
    //     w.tags = betterTags
    //   }
    //   cb(e, r)
    // })
  },

  getBySlug(slug, cb) {
    var r = _.find(ALL,w => w.slug == slug)
    // svc.searchOne({slug:slug},null, (e, r) => {
    if (r) { r.url = `${r.tags[0]}/workshops/${r.slug}`; }
    cb(null, r)
    // })
  },

  getByTag(tagSlug, cb) {
    // throw new Error('Workshops.getByTag deprecated in v2 migration. Please let us know how the UX got you here!')
    // svc.searchMany({'tags': new RegExp(tagSlug, "i") },{fields:fields.listSelect}, (e, r) => {
    var regEx = new RegExp(tagSlug, "i")
    var r = _.filter(ALL, w => _.find(w.tags, t=>t.match(regEx)) )
    for (var w of r)
    {
      w.url = `${w.tags[0]}/workshops/${w.slug}`
      w.speaker = w.speakers[0]
    }
    cb(null, r)

    // })
  }
}

module.exports = workshops


var ALL = [
{
    "_id" : "53dc048a6a45650200845f17",
    "description" : "Django 1.7 is shaping up to be one of the biggest releases for years. Alongside the headline feature, db migrations, there's a whole range of enhancements to app loading, queries and forms, all of which can significantly improve your code. Daniel Roseman, top StackOverflow answerer for Django, will take you through the new features and show how to use them in your apps.\n",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "new-in-django-1.7",
    "speakers" : [
        {
            "name" : "Daniel Roseman",
            "shortBio" : "All-time Django #1 Answerer",
            "fullBio" : "Daniel Roseman has been developing websites in Django for eight years, since the early days of the framework. Until recently he was a web developer at Google, and he has also worked for Global Radio, the UK’s biggest commercial radio company. He’s best known as the #1 answerer for Django on StackOverflow, where he’s helped thousands of developers with their coding problems. He blogs on Django, Python and other programming subjects at blog.roseman.org.uk.",
            "username" : "danielroseman",
            "gravatar" : "0f4cefeedec5163556751d61625eedd0",
            "bb" : null,
            "so" : "104349/daniel-roseman",
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "django",
        "python"
    ],
    "time" : moment("2014-08-04T18:00:00.000Z"),
    "title" : "What's new in Django 1.7",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "SX-rp2y36mA"
},{
    "_id" : "53dc048a6a45650200845f1e",
    "description" : "Reduce coupling, expunge repetition, and effectively increase your reusable codebase through the creation and use of Composer packages in PHP and Laravel applications.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "laravel-apps-and-composer-packages",
    "speakers" : [
        {
            "name" : "Antonio Carlos Ribeiro",
            "shortBio" : "All-time Laravel #1 Answerer",
            "fullBio" : "Antonio Carlos Ribeiro, software architect and photographer living in Rio de Janeiro. Since 1987 has been involved with application development, software architecture and information technology consulting. Co-founder of CyS, a brazilian web hosting company retired after 12 years, is also an expert in Linux systems and Windows enterprise network, and, in the meantime, also do landscape, portrait and concert photography, all around the world.\n\nHe is currently focused in web architecture and application development using PHP, Laravel, a development framework, and the whole ecosystem around them.",
            "username" : "antonioribeiro",
            "gravatar" : "ce2a78842d9de0c9ab48e4ed3c473b3e",
            "bb" : null,
            "so" : "1959747/antonio-carlos-ribeiro",
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "php",
        "laravel",
        "composer"
    ],
    "time" : moment("2014-10-06T20:00:00.000Z"),
    "title" : "Creating a SDK package in Laravel",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "kOlIxHzebxs"
},{
    "_id" : "5405ea4ea570a602009c59a1",
    "description" : "introduction to apache-maven\n\n- what ?\n- why ?\n- CI\n- how it is being used\n- how to write plugins \n- maven repository setup\n- q&a",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "apache-maven",
    "speakers" : [
        {
            "name" : "Jigar Joshi",
            "shortBio" : "developer",
            "fullBio" : "developer",
            "username" : "jigarjoshi",
            "gravatar" : "39acb52ff074bc477f0325f4b1960c90",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "maven",
        "build",
        "java"
    ],
    "time" : moment("2014-09-18T05:00:00.000Z"),
    "title" : "Apache Maven",
    "updatedAt" : moment("2014-09-02T16:03:26.000Z"),
    "youtube" : ""
},{
    "_id" : "53dc048a6a45650200845f19",
    "description" : "One of the main reasons my company created Leanpub was to help software developers write books. Specifically, programming books, published in-progress, using the Lean Publishing principles. But why should they? That's what I'll discuss.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "why-publish-developer-books",
    "speakers" : [
        {
            "name" : "Peter Armstrong",
            "shortBio" : "Founder: Dashcube, Leanpub",
            "fullBio" : "Founder: Dashcube, Leanpub, Ruboss. Author: Programming for Kids, Lean Publishing, Flexible Rails, etc. Lousy at: snowboarding, paddleboarding, StarCraft 2.",
            "username" : "peterarmstrong",
            "gravatar" : "f1217c714da50e49f1640aeff622c9b5",
            "bb" : null,
            "so" : null,
            "tw" : "peterarmstrong",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "publishing"
    ],
    "time" : moment("2014-08-11T21:00:00.000Z"),
    "title" : "Why Developers Should Write Books",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "crRJfQzUSxw"
},{
    "_id" : "53dc048a6a45650200845f1a",
    "description" : "Google's Panda algorithm was designed to rewards sites that consistently deliver high quality experiences to users. But in SEO circles, Panda is often caricatured as a great and mysterious taker away of traffic. The truth is, search rankings are a zero sum game. You can win at Panda. Learn how the Panda algorithm works and how you can get Panda to work in your favor.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "panda-user-experience-and-seo",
    "speakers" : [
        {
            "name" : "Ehren Reilly",
            "shortBio" : "SEO Product Strategist",
            "fullBio" : "I am an experienced leader in SEO, growth, and product management. My passion is creating useful and engaging products, and building them in a way that makes it easy for people to find them, enjoy them and share them. I believe great products need sustainable growth strategies, and growth vehicles such as SEO, social media, and email CRM don't work without a great product to drive them. I have repeatedly succeeded leading SEO initiatives within organizations that recognize search as integral to their product development.",
            "username" : "ehrenreilly",
            "gravatar" : "31e630fa1f4c36ebb986812309f09acb",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "/sy5n2q8o2i49/HEeMIzWKij",
            "gh" : null
        }
    ],
    "tags" : [
        "seo",
        "panda",
        "ux"
    ],
    "time" : moment("2014-08-14T01:00:00.000Z"),
    "title" : "What does UX have to do with SEO?",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "Iw1_eMNHWrQ"
},{
    "_id" : "53dc048a6a45650200845f1b",
    "description" : "Metrics and decisions in going from zero to product market fit.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "zero-to-product-market-fit",
    "speakers" : [
        {
            "name" : "Andrew Chen",
            "shortBio" : "Entrepreneur, ex-VC/adtech",
            "fullBio" : "Andrew Chen is a writer and entrepreneur focused on mobile products, metrics, and user growth.\n\nHe is an advisor/angel for early-stage startups including AngelList, AppSumo, Barkbox, Cardpool (acq. by Safeway), Frankly (an SK Planet co), Gravity (acq. by AOL), Grovo, Kiva, Mocospace, Qualaroo, Qik (acq. by Skype), Secret, Wanelo, ZenPayroll, and is also a 500 Startups mentor. Previously, he was an Entrepreneur-in-Residence at Mohr Davidow Ventures, a Silicon Valley-based firm with $2B under management.",
            "username" : "andrewchen",
            "gravatar" : "2c9c63e72bc96de12e6acd7ba07d6f02",
            "bb" : null,
            "so" : null,
            "tw" : "andrewchen",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "marketing",
        "growth",
        "startups"
    ],
    "time" : moment("2014-08-15T21:00:00.000Z"),
    "title" : "Zero to Product Market Fit",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "nDuGvO0-7Vc"
},{
    "_id" : "53dc048a6a45650200845f1c",
    "description" : "Don’t you hate when testing takes 3x as long because your specs are hard to understand? Or when testing conditional permutation leads to a ton of duplication? Following a few simple patterns, you can easily take a bloated spec and make it readable, DRY and simple to extend. This workshop is a refactor kata. We will take a bloated sample spec and refactor it to something manageable, readable and concise.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "taming-chaotic-specs-rspec",
    "speakers" : [
        {
            "name" : "Adam Cuppy",
            "shortBio" : "Ruby on Rails & RSpec Ninja",
            "fullBio" : "Adam Cuppy is a Partner and the Chief Operating Officer of the Ruby on Rails, Node.js, AngularJS consultancy Coding ZEAL. Since 2007, Adam and his partners have been deeply involved in open-sourced web technologies that support rapid development, enterprise-class scalability and community driven security.",
            "username" : "acuppy",
            "gravatar" : "35e0dbc9533ce3d90527eeec998d9725",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/OfJ8u7KW5E",
            "gh" : null
        }
    ],
    "tags" : [
        "ruby",
        "rspec",
        "testing",
        "tdd"
    ],
    "time" : moment("2014-08-20T17:00:00.000Z"),
    "title" : "Taming Chaotic Spec:  RSpec Patterns",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "gAvYDAcY3ls"
},{
    "_id" : "53dc048a6a45650200845f1d",
    "description" : "No part of JavaScript is more misunderstood than its Prototypal inheritance. This presentation explains the behavior and usefulness of `this`  and continues on to simplify Prototypal inheritance for the masses.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "javascript-prototypal-inheritance",
    "speakers" : [
        {
            "name" : "Basarat Ali",
            "shortBio" : "Typescript All-time #1 Answerer",
            "fullBio" : "BAS, is a member of the DefinitelyTyped core team. He is a senior software developer and the go-to guy for front-end work at Picnic Software. He has been working with TypeScript since it was first announced in October 2012. He has an active StackOverflow profile and one of the top answerers for TypeScript questions.",
            "username" : "basarat",
            "gravatar" : "1400be56ff17549b926dd3260da4a494",
            "bb" : null,
            "so" : "390330/basarat",
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "javascript"
    ],
    "time" : moment("2014-10-03T22:00:00.000Z"),
    "title" : "Prototypal Inheritance in JavaScript",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "5b5tNYOliwk"
},{
    "_id" : "53dc048a6a45650200845f20",
    "description" : "Turning a set of numbers into a simple graph can instantly tell us a story about data, but there are times when a standard graph isn't enough. Sometimes we need to search for untradtional and creative ways to visualize our data to express our story. In this talk, we'll explore less common and unique ways of visualizing data sets on the web using D3.js, a flexible way to manipulate DOM elements using data. We'll discuss the reasoning behind the graphics we create, and talk about the benefits and pitfalls of working with D3.js from design and technical viewpoints.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "visualization-with-d3js",
    "speakers" : [
        {
            "name" : "Joanne Cheng",
            "shortBio" : "web developer at thoughtbot",
            "fullBio" : "Joanne is an experienced developer who thinks a lot about data visualization, best practices, and web standards. When she's not happily writing code at thoughtbot, she can be found exploring the mountains of Colorado or experimenting with creative programming projects.",
            "username" : "joannecheng",
            "gravatar" : "0b0184b815c54a6f03f6e5ada4d4b69a",
            "bb" : null,
            "so" : null,
            "tw" : "joannecheng",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "d3.js"
    ],
    "time" : moment("2014-08-28T20:00:00.000Z"),
    "title" : "Creative Visualization with D3.js",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "ukYfDkI24s4"
},{
    "_id" : "53dc048a6a45650200845f21",
    "description" : "Spree had a problem: the adjustments system was slow and difficult to understand. Over a period of some months, we refactored the code to be much faster and cleaner. The talk will cover the unique challenges that faced Spree and how we overcome them.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "refactoring-large-rails-code",
    "speakers" : [
        {
            "name" : "Ryan Bigg",
            "shortBio" : "Rails book author",
            "fullBio" : "Ryan Bigg has been working as a Rails expert for over 8 years. He is a technical writer for Ruby and Rails. Ryan is co-author of a book with Yehuda Katz and Steve Klabnik called Rails 4 in Action as well as self author of two other books, Multitenancy With Rails and Debugging Ruby. In 2011 Ryan won a Ruby Hero Award for his contributions to Rails’ documentation. He is also all time top #3 answerer for Ruby on Rails on StackOverflow and full-time developer and Community Manager for Spree Commerce.",
            "username" : "ryanbigg",
            "gravatar" : "9a2a53db8e9b4476038c94a64b32833f",
            "bb" : null,
            "so" : "15245/ryan-bigg",
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "ruby",
        "spree",
        "refactoring"
    ],
    "time" : moment("2014-08-04T22:00:00.000Z"),
    "title" : "Refactoring Big Features in Large Codebases",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "h_C2o8Kh7Nw"
},{
    "_id" : "53dc048a6a45650200845f22",
    "description" : "In recent years we have seen Agile, Lean and recently Lean Startup accepted as proven techniques for best-practice product/solution development. Pivotal to Lean Startup is the concept of experimentation and our ability to learn from it. However, teams transitioning to using Lean Startup often get lost in the detail as they start to implement experiments and gather data. This talk will present new concepts to visually portray the ‘build-measure-learn’ Lean Startup feedback cycle so that teams, stakeholders and executive management can make better and faster decisions.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "lean-visual-strategy",
    "speakers" : [
        {
            "name" : "Cheryl Quirion",
            "shortBio" : "leanstartup visualization",
            "fullBio" : "Cheryl has worked around the globe - Europe, Australia, USA and currently South America - in various roles including engineer, architect and Operations/Innovation Manager. In recent years, she has focused on Agile / Lean coaching. \n\n“I like helping teams realise their potential while making sure we all enjoy ourselves along the way. As such, I have devised several visual tools to facilitate conversations and push us into action when implementing lean startup methods.” \n\nCheryl is currently working on a book that covers these tools in detail.",
            "username" : "cherylquirion",
            "gravatar" : "a37be5f2fdf2ba324da655204e872c65",
            "bb" : null,
            "so" : null,
            "tw" : "cherylquirion",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "leanstartup",
        "visualisation",
        ""
    ],
    "time" : moment("2014-08-08T16:00:00.000Z"),
    "title" : "Lean Visual Strategy",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "ivTcY_lwpng"
},{
    "_id" : "53dc048a6a45650200845f23",
    "description" : "Ever feel like you're writing tests to make somebody else happy?\n\nMany developers grow to hate testing over time. As excitement about testing fades and published best-practices about testing diverge, most programmers feel besieged by the numerous styles and motivations others claim to be Best Practices. What many of us have found is that when a test tries to serve several purposes, its clarity and purpose are completely lost; nobody knows why each test exists or the \"Right Way\" in which to write the next one.\n\nBut there is a way to avoid this trap while managing to write clear, obvious, and useful tests!\n\nI'll detail an approach that prioritizes clarity and consistency by calling for a separate test suite for each of the benefits we hope to gain from testing. To illustrate, we'll break up a traditional monolithic test suite into 5 entirely new types of tests designed to serve a specific team's needs. Attendees will be equipped to reclaim clarity of purpose for their projects by designing custom test suites to fit their particular goals. ",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "simplifying-rails-tests",
    "speakers" : [
        {
            "name" : "Justin Searls",
            "shortBio" : "Programmer at Test Double",
            "fullBio" : "Justin Searls has two professional passions: writing great software and sharing what he’s learned in order to help others write even greater software. \n\nHe and his team at Test Double have the pleasure of living out both passions every day, working closely with clients to find simple solutions to complex problems. \n\nHis community efforts are focused on improving the more painful aspects of writing software, which is why you see him talking so much about testing and JavaScript.",
            "username" : "searls",
            "gravatar" : "e6c6e133e74c3b83f04d2861deaa1c20",
            "bb" : null,
            "so" : null,
            "tw" : "searls",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "rails",
        "testing",
        "teams"
    ],
    "time" : moment("2014-08-12T15:00:00.000Z"),
    "title" : "",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "eWthxP4MZXE"
},{
    "_id" : "53dc048a6a45650200845f24",
    "description" : "Spreadsheets are graphs. This is what Felienne Hermans, professor at Delft University of Technology found out when she wanted to replace the SQL backend of her spreadsheet analysis tool with another database. After attending a talk about Neo4J, she thought it would be fun and efficient to replace the backend with Neo4J, because, despite their tably appearance, the dependencies between formulas, cells and worksheets within a spreadsheet are very graph like. In this talk Felienne will explain what hurdles she faced and how the replacement impacted speed and ease of use of the Excel analysis toolkit she is building.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "spreadsheets-graph-databases",
    "speakers" : [
        {
            "name" : "Felienne Hermans",
            "shortBio" : "PhD & Spreadsheets Professor",
            "fullBio" : "Felienne Hermans is a researcher and entrepreneur in the field of spreadsheets. Her PhD thesis, finished in early 2013, centers around techniques to transfer software engineering methods like smell detection, refactoring and testing to spreadsheets.\nIn 2010 Felienne co-founded Infotron, a start up that uses the algorithms developed during the PhD project to analyze spreadsheet quality for large companies. In her spare time, Felienne volunteers as a referee for the First Lego League, a world wide technology competition for kids.",
            "username" : "felienne",
            "gravatar" : "f524745bb9975ba777b5c4a9922eb614",
            "bb" : null,
            "so" : null,
            "tw" : "felienne",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "neo4j",
        "sql"
    ],
    "time" : moment("2014-08-13T20:00:00.000Z"),
    "title" : "Spreadsheets & Graph Databases",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "opmCUpvot4o"
},{
    "_id" : "53dc048a6a45650200845f25",
    "description" : "A quick introduction to Sass, then discussing what the W3C has been up to with new CSS features and how preprocessors like Sass should fit into a future with a more capable CSS standard. Then, taking any questions people have!",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "css-vs-sass",
    "speakers" : [
        {
            "name" : "Hampton Catlin",
            "shortBio" : "Creator of Sass and Haml",
            "fullBio" : "Creator of Sass, Haml, Tritium, and Wikipedia Mobile. CTO of Moovweb.",
            "username" : "hcatlin",
            "gravatar" : "a77873df3a9766b208e009248a2a9a56",
            "bb" : null,
            "so" : null,
            "tw" : "hcatlin",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "css",
        "sass",
        "w3c"
    ],
    "time" : moment("2014-08-18T15:00:00.000Z"),
    "title" : "CSS vs Sass",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "oJufUd6uWqg"
},{
    "_id" : "53dc048a6a45650200845f26",
    "description" : "Josh designed and built the distributed event data backend that powers Keen IO's real-time analytics API. The system, based on Storm and Cassandra, is capable of running ad-hoc queries over billions of JSON events in seconds. In this talk, Josh will describe the data model that makes this possible and contrast it with a few that didn't work out. The talk will conclude with a few lessons learned from running Storm and Cassandra in production for over 9 months. ",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "store-json-in-cassandra",
    "speakers" : [
        {
            "name" : "Josh Dzielak",
            "shortBio" : "Open Sourceror",
            "fullBio" : "Josh Dzielak is a passionate engineer & entrepreneur. At Keen IO Josh hacks on distributed systems, open source libraries, company building, and everything in between. Before Keen, Josh was a Principal Engineer at Disney and helped create the company that got him there. Outside of work Josh enjoys writing, speaking, and finding great new beer and music spots in San Francisco. ",
            "username" : "dzello",
            "gravatar" : "ea8bf3f4b04a91c0b5b279c99c048028",
            "bb" : null,
            "so" : null,
            "tw" : "dzello",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "cassandra",
        "analytics",
        "keen.io"
    ],
    "time" : moment("2014-08-20T21:00:00.000Z"),
    "title" : "Store JSON in Cassandra The Hard Way",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "ayk6QWmOohk"
},{
    "_id" : "53dc048a6a45650200845f27",
    "description" : "Swift is a whole new world of possibilities. Be shown through how Swift makes a difference, whether it's production ready or not, and what some of the game changing features are.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "is-swift-that-swift",
    "speakers" : [
        {
            "name" : "Jack Watson-Hamblin",
            "shortBio" : "iOS and Ruby Trainer",
            "fullBio" : "Ruby and iOS developer, teacher, blogger, and screencaster. Always mastering new languages. Currently teaching through MotionInMotion and the upcoming RailsInMotion.",
            "username" : "fluffyjack",
            "gravatar" : "7a26ff0ae0b5e31a737ab8e4c887f0cf",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/oNxzjUMtdW",
            "gh" : null
        }
    ],
    "tags" : [
        "swift"
    ],
    "time" : moment("2014-08-19T22:00:00.000Z"),
    "title" : "Is Apple's Swift That swift?",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "L4BMMaiUg78"
},{
    "_id" : "53dc048a6a45650200845f28",
    "description" : "The advent of new Linux container technology is changing the landscape of deployment and improving scalability and performance. The increasing accessibility of these technologies  allows developers to containerize and improve application management, resource sharing, and scaling. This presentation will explain how to implement the right architecture and deployment workflow, which is crucial to fully realizing the benefits of containers",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "containerizing-production-app",
    "speakers" : [
        {
            "name" : "Greg Osuri",
            "shortBio" : "DevOps Engineer",
            "fullBio" : "Greg Osuri has been writing software for over 17 years. He is the co-founder of Overclock and works with a team of experienced DevOps engineers that help you set up and manage scalable application infrastructure.  Previously, Greg worked at IBM, WebMD, and Verizon Wireless, exclusively on infrastructure and DevOps",
            "username" : "kn0tch",
            "gravatar" : "9c6165b107059ea5dfa2e81985fe8272",
            "bb" : null,
            "so" : null,
            "tw" : "kn0tch",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "devops",
        "lxc"
    ],
    "time" : moment("2014-11-24T22:00:00.000Z"),
    "title" : "Modern Infrastructure using Containers",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "SyasjC29GGo"
},{
    "_id" : "53dc048a6a45650200845f2b",
    "description" : "It's 2014 and our security controls should start acting like it. We\nmaintain static controls on security because we lack the intelligence\nto adapt them to the situation at hand. Join Aaron as he walks you\nthrough creating dynamic security controls using the Repsheet\nthreat intelligence and reputation framework.",
    "difficulty" : "Advanced",
    "duration" : "1 hour",
    "slug" : "repsheet-dynamic-security-controls",
    "speakers" : [
        {
            "name" : "Aaron Bedra",
            "shortBio" : "Human",
            "fullBio" : "Aaron is a Senior Fellow at Groupon. He is the creator of Repsheet, an open source threat intelligence and attack prevention framework. Aaron is a co-author of Programming Clojure, 2nd Edition and a former member of Clojure/core",
            "username" : "abedra",
            "gravatar" : "24659470071279a42020d5b87411598e",
            "bb" : null,
            "so" : null,
            "tw" : "abedra",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "security"
    ],
    "time" : moment("2014-08-05T16:00:00.000Z"),
    "title" : "Creating Dynamic Security Controls With Repsheet",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "43wrkYLmHaE"
},{
    "_id" : "53ff93e9c1fce802005da9a5",
    "description" : "Write performant hybrid mobile apps using web standards that follow the most relevant practices such as modules, logic less templating, tdd, etc. Be ready to deploy an app for approval in less than one hour. ",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "hybrid-mobile-development",
    "speakers" : [
        {
            "name" : "Giorgio Natili",
            "shortBio" : "Mobile.wearable.testable",
            "fullBio" : "Giorgio Natili is an author, educator, community leader and an engineering mentor and technical leader in Cengage Learning a publisher of print and digital information services for the academic, professional and library markets.",
            "username" : "giorgionatili",
            "gravatar" : "bcd87d28723196faab32e66a961080fc",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "mobile"
    ],
    "time" : moment("2014-10-21T18:00:00.000Z"),
    "title" : "Hybrid Mobile Development",
    "updatedAt" : moment("2014-08-28T20:41:13.000Z"),
    "youtube" : ""
},{
    "_id" : "53dc048a6a45650200845f2c",
    "description" : "Many developers who commute to an office and spend their day working for someone else have dreamed of the ability to control their own schedule, work, and environment. This talk will provide insight and options specifically for developers for transitioning from a full-time job to working for yourself.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "transitioning-to-consulting-for-developers",
    "speakers" : [
        {
            "name" : "Ann Eliese Grey",
            "shortBio" : "Development Consultant",
            "fullBio" : "Front end and PHP developer with over 15 years of experience, specializing in team management, consulting, and the advertising business. Lead developer behind the Game of Thrones Viewer's Guide.",
            "username" : "annisgrey",
            "gravatar" : "81fd87db6a6cde7314acca4878fbe9db",
            "bb" : null,
            "so" : null,
            "tw" : "annisgrey",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "consulting",
        "freelance"
    ],
    "time" : moment("2014-08-08T19:00:00.000Z"),
    "title" : "Transitioning from full-time to consulting",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "igWgrk_Mh78"
},{
    "_id" : "53dc048a6a45650200845f2d",
    "description" : "You spend big money on servers or Heroku dynos? Your app exceeds hosting's memory limit? Your background processes can't keep up with the work? Your cache invalidation code is too complex? Then it's time to optimize the code.\n\nWe'll talk about memory optimization (the #1 thing you should optimize in any Ruby application), effect of Ruby 2.1 upgrade, slow parts of Ruby/Rails and much more. \n\nThis session is a perfect time to ask your questions. I want it to be a two-way discussion of performance optimization techniques rather than a one-way talk you might get at a regular conference.\n",
    "difficulty" : "Advanced",
    "duration" : "1 hour",
    "slug" : "rails-performance-optimization-q-and-a",
    "speakers" : [
        {
            "name" : "Alexander Dymo",
            "shortBio" : "YC Alum, entrepreneur/developer",
            "fullBio" : "Entrepreneur, Y Combinator alum, project manager, free software developer, book author, passionate about programming and engineering. Hardcore Linuxoid.\n\nRegularly attend and present at KDE, Ruby and Postgres conferences.\n\nMost recently enjoy the startup scene, work on Eligo Energy - the retail electricity supplier and Acunote - the online project management and Scrum software.\n\nAreas of expertise: Entrepreneurship, software project management, software development, free and open source software, performance optimization, KDE, Linux, C++, Ruby on Rails",
            "username" : "adymo",
            "gravatar" : "990f1e2f3c6871d4305d3a316902b1bf",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/1KB9BDtDYm",
            "gh" : null
        }
    ],
    "tags" : [
        "rails",
        "performance"
    ],
    "time" : moment("2014-08-12T23:00:00.000Z"),
    "title" : "Ruby on Rails Performance Q & A",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "5dgjeCdVEPs"
},{
    "_id" : "53dc048a6a45650200845f2e",
    "description" : "In today's global economy, marine container terminals play a critical role in the international supply chain.  To improve efficiency and reliability operators are turning to automation.  Operating an automated container terminal requires the integration of multiple sophisticated hardware and software systems.  Take a peak behind the scenes and learn about the combination of systems used to manage these facilities.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "automating-marine-container-terminals",
    "speakers" : [
        {
            "name" : "John Scattergood",
            "shortBio" : "Principal Engineer, Navis LLC",
            "fullBio" : "John Scattergood has over 15 years of experience in managing and developing software systems for the maritime industry. At Navis, John designs innovative software solutions and systems that meet evolving customer and product requirements. John writes and speaks about marine terminal automation, technology trends and best practices. ",
            "username" : "johnscattergood",
            "gravatar" : "35563a86a2ed3a8f79da77fcf2f25d7b",
            "bb" : null,
            "so" : null,
            "tw" : "johnscattergood",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "enterprise-software",
        "robotics"
    ],
    "time" : moment("2014-08-22T17:00:00.000Z"),
    "title" : "Automating Marine Container Terminals",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "wcIx-Ucifk0"
},{
    "_id" : "53dc048a6a45650200845f2f",
    "description" : "Learn the strengths and weaknesses of Meteor.js from Josh Owens, who has been using it full time since April 2013. The talk goes over things like the core principles, packaging system, hosting, the great community, testing, and much more. Get the inside scoop on why you should give Meteor.js a look.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "learn-meteorjs-1.0",
    "speakers" : [
        {
            "name" : "Josh Owens",
            "shortBio" : "Javascript connoisseur",
            "fullBio" : "In 1987 Josh’s love story with technology began with his Atari 800XL and his dual 5.25 inch floppy drives. He has come a long way since those days filled with acne cream and 8-bit video games. Josh has been cultivating his Rails skills since 2004, and was a Rails Core Contributor. He led his development team to win the 2007 Rails Rumble competition for the development of TastyPlanner. He now spends his days working full time in the Meteor.js framework and trying to build an open sourced empire for it.  Josh is a also a podcaster and producer of past shows like Web 2.0 Show, WebPulp.tv and presently producing the Meteor Podcast and Startup Heroes.",
            "username" : "joshowens",
            "gravatar" : "089ddf30c09022b92363dd0d8ce2bdfd",
            "bb" : null,
            "so" : null,
            "tw" : "joshowens",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "meteor",
        "javascript",
        "testing"
    ],
    "time" : moment("2014-08-18T19:00:00.000Z"),
    "title" : "What I learned from a year with Meteor.js",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "sHVIq3g4Mtw"
},{
    "_id" : "53dc048a6a45650200845f30",
    "description" : "The forth major release of the web framework Ruby on Rails introduced a ton of new features, such as cache digests, strong parameters, and mailer previews. Kevin Faustino, co-author of The Rails 4 Way, will walk you through what's new in Rails 4 and how to use these features in your day-to-day development.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "introduction-to-rails-4",
    "speakers" : [
        {
            "name" : "Kevin Faustino",
            "shortBio" : "Rails 4 Way co-author",
            "fullBio" : "Kevin is Founder and Chief Craftsman of Remarkable Labs, based in Toronto, Canada. He believes that software should not just work, but be well-crafted. He founded Remarkable Labs because he wanted to build a company that he would be proud to work for and that other companies would love to work with.\n\nFollowing his passion for sharing knowledge, Kevin also founded the Toronto Ruby Brigade which hosts tech talks, hack nights, and book clubs. Kevin has been specializing in Ruby since 2008, and been professionally developing since 2005.",
            "username" : "kfaustino",
            "gravatar" : "940bf3b2a8eef6d175ffc2ca243e0ea2",
            "bb" : null,
            "so" : null,
            "tw" : "kfaustino",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "rails",
        "ruby-on-rail-4"
    ],
    "time" : moment("2014-08-21T19:00:00.000Z"),
    "title" : "Introduction to Rails 4",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "Wce7O_tOyKk"
},{
    "_id" : "53dc048a6a45650200845f31",
    "description" : "I will give a brief introduction to D3.js and pointers to useful resources. I will then dive into some of the issues even experienced programmers may struggle with when starting with D3. Time permitting, I will answer questions and may go into more advanced D3 concepts.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "quickstart-to-d3js",
    "speakers" : [
        {
            "name" : "Lars Kotthoff",
            "shortBio" : "AI researcher, d3.js #2 Answerer",
            "fullBio" : "I'm an artificial intelligence researcher and have been playing around with D3.js for a few years. I'm one of the top answerer for D3-related questions on Stackoverflow.",
            "username" : "larskotthoff",
            "gravatar" : "262e07f53f9f636a5816f3128c6517a7",
            "bb" : null,
            "so" : "1172002/lars-kotthoff",
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "d3.js"
    ],
    "time" : moment("2014-08-24T17:00:00.000Z"),
    "title" : "Getting started with D3.js",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "4WGPFEOpgs8"
},{
    "_id" : "53dc048a6a45650200845f33",
    "description" : "You've heard about Go. You might even have played with it a little bit. But you're still not sure when, where, and why you would use it for your next project. Let's look at some of Go's more practical features along with real world examples that demostrate those features. By the time we're through you won't be a Go expert, but you might just be a Go advocate. ",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "why-consider-go",
    "speakers" : [
        {
            "name" : "Mark Bates",
            "shortBio" : "Mild Salsa Connoisseur ",
            "fullBio" : "Mark Bates is the founder and chief architect of the Boston, MA based consulting company, Meta42 Labs. Mark spends his days focusing on new application development and consulting for his clients. At night he writes books, raises kids, and occasionally he forms a band and “tries to make it”. Mark is the author of three books, “Distributed Programming with Ruby” (2009), “Programming in CoffeeScript” (2012), and “Conquering the Command Line” (2014). He also runs the weekly Golang screencast site, www.metacasts.tv.",
            "username" : "markbates",
            "gravatar" : "c6f2229ca2c8dcf0176f036508ec2c3b",
            "bb" : null,
            "so" : null,
            "tw" : "markbates",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "golang"
    ],
    "time" : moment("2014-09-27T19:00:00.000Z"),
    "title" : "Why You Should Consider Go",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : ""
},{
    "_id" : "53dc048a6a45650200845f34",
    "description" : "Software is swallowing the world and search is swallowing the software. Searching the internet, mail, books, appointments, GitHub repositories or LinkedIn connections looks very different. Yet, underneath it all, the search engines do the work. And they can do the same work for you and your project. \n\nThis workshop will introduce capabilities of a modern Open Source search engine (Apache Solr) and the best way to start using one in your own project. \n\nIt will also touch on other search engines, such as ElasticSearch as a way of comparison.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "discovering-your-inner-search-engine",
    "speakers" : [
        {
            "name" : "Alexandre Rafalovitch",
            "shortBio" : "Solr popularizer",
            "fullBio" : "Alexandre is a full-stack IT specialist with focus on the\nserver-side. He has close to 20 years of industry and non-profit\nexperience.  He develops projects on Windows, Mac and Linux.\nAlexandre's recent focus is on popularizing Apache Solr. He has\nwritten one book on this topic already (Apache Solr for Indexing Data\nHow-to) and is working on more.",
            "username" : "arafalov",
            "gravatar" : "eef617ace0ce62813b7443956e02ac39",
            "bb" : null,
            "so" : null,
            "tw" : "arafalov",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "solr",
        "search-engine"
    ],
    "time" : moment("2014-11-25T23:00:00.000Z"),
    "title" : "Discovering Your Inner Search Engine",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "TDcu-5FCwqo"
},{
    "_id" : "53dc048a6a45650200845f35",
    "description" : "How do we prioritize our time when developing new products? How do we know if we should invest time in building out that new feature?\n\nEvery product decision is an experiment. If we can reframe our thinking from building features to challenging assumptions and running experiments, then we can increase our productivity and get better results with less effort.\n\nIn this talk, Grace shares a structured process for designing effective experiments, and reveals a few ways to overcome the common pitfalls and challenges teams face when running experiments in their companies. ",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "effective-experiments-for-product-development",
    "speakers" : [
        {
            "name" : "Grace Ng",
            "shortBio" : "Entrepreneur and Designer",
            "fullBio" : "Grace Ng is the Co-Founder of Javelin, an enterprise software and services company for implementing Lean Startup. She has trained thousands of entrepreneurs around the world, and coached executives from companies like GE, American Express, and ESPN, to help them explore, validate, and launch new product ideas. Her work has been featured in national media outlets including Forbes, PandoDaily and Smashing Magazine. \n\nGrace is a frequent speaker on Lean UX and actively works with universities and female leadership programs to change the way entrepreneurship is taught. ",
            "username" : "uxceo",
            "gravatar" : "fa960d968148c7cefda46b1e9bf62d1a",
            "bb" : null,
            "so" : null,
            "tw" : "uxceo",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "leanstartup",
        "ux",
        "product"
    ],
    "time" : moment("2014-08-05T21:00:00.000Z"),
    "title" : "Designing Experiments for Product Development",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "BJUY_RVpPSo"
},{
    "_id" : "53dc048a6a45650200845f36",
    "description" : "Git and Github are essential tools for sharing and collaborating with code. And sharing and collaborating are essential to becoming a better developer. By understanding how to best use git and github, you can be a better contributor to the open source projects you love and care about, and a better maintainer for your own. You can also learn quite a lot from other developers by talking about architecture and comparing tools and coding style. This talk will cover some of the more advanced aspects of git and github that will help you to become a pro at managing and helping with popular open source projects -- an essential piece of every developer's toolkit and an excellent boost to your resume.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "learn-git-and-github",
    "speakers" : [
        {
            "name" : "Jeff Escalante",
            "shortBio" : "Engineer at Carrot",
            "fullBio" : "Jeff is a full stack developer at Carrot/VICE in NYC. He spends his days working on open source projects to make himself and his coworkers more efficient, and contributing to and researching other peoples' awesome projects.",
            "username" : "jenius",
            "gravatar" : "4fecd666b6e9fe0b043570f4d964d917",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : "jenius"
        }
    ],
    "tags" : [
        "git",
        "github",
        "open-source"
    ],
    "time" : moment("2014-08-09T17:00:00.000Z"),
    "title" : "Becoming an Open Source Star with Git & Github",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "C4pMS3vXgxU"
},{
    "_id" : "53dc048a6a45650200845f37",
    "description" : "Learn how to apply animations to your Angular app from start to finish. With the recent changes in AngularJS 1.3, there have been rapid improvements in ngAnimate. With the new features in place let's learn how to make some crazy animations and how to really improve the look, feel and quality of our web application.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "animations-with-angularjs",
    "speakers" : [
        {
            "name" : "Matias Niemela",
            "shortBio" : "Core dev on AngularJS",
            "fullBio" : "Matias is a fullstack web developer who blogs at yearofmoo.com. For the past two years he has been a full-time AngularJS core developer working on ngAnimate, Dart, Material Design and AngularJS forms. He has a passion teaching and for building complex web applications.",
            "username" : "matsko",
            "gravatar" : "3c0ca2c60c5cc418c6b3dbed47b23b69",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : "matsko"
        }
    ],
    "tags" : [
        "angularjs",
        "ngAnimate"
    ],
    "time" : moment("2014-08-13T16:00:00.000Z"),
    "title" : "Professional Animations in AngularJS 1.3",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "\nA17NMUUDDog"
},{
    "_id" : "53dc048a6a45650200845f38",
    "description" : "Python 3.4 was released recently, and Martijn is going to take us on a tour of what is new in this release. We'll take a look at the new libraries added, and what changes you may want to know about.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "python-3.4",
    "speakers" : [
        {
            "name" : "Martijn Pieters",
            "shortBio" : "Invisible Framework Coding Ninja",
            "fullBio" : "Martijn is a long time Python web wizard, with nearly 20 years of experience in full-stack deployments, and a long-time Open Source software contributor. He currently the #1 Python question answerer on Stack Overflow.\n",
            "username" : "zopatista",
            "gravatar" : "09c1bb74564cba5aa5e1005e869499d4",
            "bb" : null,
            "so" : "100297/martijn-pieters",
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "python",
        "python-3.4"
    ],
    "time" : moment("2014-08-15T14:00:00.000Z"),
    "title" : "What's new in Python 3.4",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "CajYv3F2p6k"
},{
    "_id" : "53dc048a6a45650200845f39",
    "description" : "Programmers have been test driving software design for a while, but the infrastructure that runs that software is still often manually configured and maintained. Now that every second company is using Puppet or Chef, the infrastructure is finally automated by using software, and the natural next step is test driving this software as well.\n\nLearn the reasons why tests for infrastructure code and tests in general are a good idea, and the various ways of writing tests for your infrastructure automation.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "test-driven-infrastructure",
    "speakers" : [
        {
            "name" : "Evgeny Zislis",
            "shortBio" : "DevOps.co.il Founder",
            "fullBio" : "Evgeny is a leading figure in Israeli's DevOps community. He has been helping developers and companies configure their servers for over a dozen of years. He is the co-founder of Devops Israel, a consulting and services boutique for startups, small businesses and large enterprises. Specialising in a range of fields, such as cloud computing, linux administration, configuration management, issue tracking, version control systems and all things DevOps.",
            "username" : "evgenyz",
            "gravatar" : "35d78874c6ba5c64db3256f6868515dc",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/9ZPSg_JcCY",
            "gh" : null
        }
    ],
    "tags" : [
        "chef",
        "tdd",
        "infrastructure"
    ],
    "time" : moment("2014-08-19T17:00:00.000Z"),
    "title" : "Test Driven Infrastructure",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "hK3-2ItIoPA"
},{
    "_id" : "53dc048a6a45650200845f3b",
    "description" : "I'm going to discuss techniques to use the very popular and well maintained open source ActiveRecord rubygem, while avoiding the active record pattern due to common pitfalls it creates for larger projects.\n\nWe'll use some different techniques to refactor a simple application with the ultimate goal to remove the usage of the active record pattern where possible.\n",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "activerecord-without-active-record",
    "speakers" : [
        {
            "name" : "Mario Visic",
            "shortBio" : "Australian rails developer",
            "fullBio" : "Mario is a Ruby on Rails developer from Perth Australia, he currently works at Envato in Melbourne. As well as being a Co-Founder of Desktoppr he has also worked on some cool projects such as iMeducate and Airtasker\n\nIn his spare time he enjoys eating different types of cheeses.",
            "username" : "mariovisic",
            "gravatar" : "db58858a009745e96871e04ef497269a",
            "bb" : null,
            "so" : null,
            "tw" : "mariovisic",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "rails",
        "activerecord"
    ],
    "time" : moment("2014-10-25T23:00:00.000Z"),
    "title" : "ActiveRecord without active record",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : ""
},{
    "_id" : "53dc048a6a45650200845f3e",
    "description" : "As mobile apps developers, we some times tend not to take our designers' extremely detailed graphical and UX requirements too seriously. We think that the users might not even notice that extra detail which will take you two whole days to implement, so why put in the effort. In this talk, I'm going to try to emphasise the importance of great UX for your mobile apps and why we, as developers, should put all the time needed (and more) to make an awesome looking app.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "mobile-ux",
    "speakers" : [
        {
            "name" : "Rony Rozen",
            "shortBio" : "Founder & CEO @ poccaDot",
            "fullBio" : "Rony is the CEO of poccaDot - a mobile software development company, specialising in iOS and Android app development, which she established in 2010. The company has already developed and released dozens of mobile apps for various clients in all fields of the industry.",
            "username" : "poccadot",
            "gravatar" : "892cdc57a3a64ea0ad59827bc6d1ddf7",
            "bb" : null,
            "so" : null,
            "tw" : "poccadot",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "ux",
        "mobile",
        "ios"
    ],
    "time" : moment("2014-09-30T17:00:00.000Z"),
    "title" : "UX for Mobile",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : ""
},{
    "_id" : "53dc048a6a45650200845f3f",
    "description" : "We'll cover the basics of using Twilio for interactive voice and SMS from web applications. This is a session for web developers who haven't used Twilio before, but are curious to see what it can do for their projects. ",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "twilio-voice-sms-integration",
    "speakers" : [
        {
            "name" : "Jeff Linwood",
            "shortBio" : "Mobile App & Twilio Expert",
            "fullBio" : "Jeff develops software in sunny Austin, Texas. He made the move out of enterprise Java into the way more fun world of mobile apps for Android and iOS. Jeff's built web applications and mobile apps that use Twilio for voice and SMS in several different programming languages, and thinks that everyone should consider using voice or text messaging in their projects.",
            "username" : "jefflinwood",
            "gravatar" : "088bce2168389e26b6d4a8592a950299",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/MI4rhSkAQM",
            "gh" : null
        }
    ],
    "tags" : [
        "twilio"
    ],
    "time" : moment("2014-08-06T17:00:00.000Z"),
    "title" : "Voice & SMS for Your Apps",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "sbJdvdLdT1w"
},{
    "_id" : "53dc048a6a45650200845f40",
    "description" : "Debugging client side errors in production is a nightmare. Most of the time, you don't know there was an error until someone reported that.\n\nYou can start with capturing window.onerror and dumping that. But that's just the baby step. So, I will show you how to capture client-side errors with useful stack information and events. ",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "client-side-javascript-error-tracking",
    "speakers" : [
        {
            "name" : "Arunoda Susiripala",
            "shortBio" : "MeteorHacks Author",
            "fullBio" : "Arunoda Susiripala is the one of the active community contributor in the Meteor community.  He is building Kadira, a performance monitoring service for Meteor and publishes the MeteorHacks website.",
            "username" : "arunoda",
            "gravatar" : "ab13df38843556b57f7d2f6fe78003cf",
            "bb" : null,
            "so" : null,
            "tw" : "arunoda",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "javascript",
        "errors",
        "meteor"
    ],
    "time" : moment("2014-08-11T16:00:00.000Z"),
    "title" : "Client Side Error Tracking",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "vvEtRD0lrEk"
},{
    "_id" : "53dc048a6a45650200845f42",
    "description" : "In this interactive session, we will explore the use of Pandas, Numpy, Luigi and other tools to manipulate data, prototype data pipelines, and perform exploratory data analysis in Python 2. This is a beginner-level course that only requires prior knowledge of programming (not necessarily in Python).",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "data-processing-with-python",
    "speakers" : [
        {
            "name" : "Alexandre Gravier",
            "shortBio" : "Data Scientist, Teralytics",
            "fullBio" : "Alexandre has worked at Google, Nanyang Technological University, and LAAS-CNRS, going back and forth between professional software development and scientific research. He has a MSc in artificial intelligence and recently submitted his PhD thesis in computational neuroscience. Currently, Alexandre is working at Teralytics, designing platforms that extract valuable insights from massive datasets. He has been using Python in many contexts, including neural simulation, high-level robot control, image processing and machine learning.",
            "username" : "agravier",
            "gravatar" : "34cf13e391e35fe59fdc095759263eb3",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/UFhmGZ-ZyR",
            "gh" : null
        }
    ],
    "tags" : [
        "python",
        "data-processing"
    ],
    "time" : moment("2014-08-15T18:00:00.000Z"),
    "title" : "Crash course in data processing with Python",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "Z6UKQWY6C1Y"
},{
    "_id" : "53dc048a6a45650200845f43",
    "description" : "This talk discusses Softcover, an open-source Ruby-based system for typesetting and publishing technical ebooks. We discuss the design of the core publishing system, which connects together a mix of Ruby gems, custom Ruby, and an underlying C++ parser to output high-quality ebooks. After a live demo of the ebook production system, we deploy the results to an integrated sales platform with a single command. We end with a discussion of how to use Softcover to build a product business based on the Ruby on Rails Tutorial model.",
    "difficulty" : "Advanced",
    "duration" : "1 hour",
    "slug" : "publishing-at-the-speed-of-ruby",
    "speakers" : [
        {
            "name" : "Michael Hartl",
            "shortBio" : "Rails Tutorial, Softcover founder",
            "fullBio" : "Michael Hartl is a founder of the Softcover self-publishing system and the author of the Ruby on Rails Tutorial. In 2011, he received a Ruby Hero Award for his contributions to the Ruby community. Michael is a graduate of Harvard College, has a Ph.D. in Physics from Caltech, and is an alumnus of the Y Combinator program.",
            "username" : "mhartl",
            "gravatar" : "ffda7d145b83c4b118f982401f962ca6",
            "bb" : null,
            "so" : null,
            "tw" : "mhartl",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "ruby",
        "ebooks",
        "marketing"
    ],
    "time" : moment("2014-08-19T20:00:00.000Z"),
    "title" : "Publishing at the Speed of Ruby",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "eFS6qA2LMY0"
},{
    "_id" : "53dc048a6a45650200845f44",
    "description" : "What does it take to climb your way to the top spot in the App Store? What kind of revenue can you expect from building for-pay iOS apps? How does news coverage and social media affect download rates? Amir Rajan, creator of the A Dark Room iOS, will share the wisdom he's gained from climbing to the #1 spot. He'll share revenue and provide insight into the ranking system. He'll talk about pricing strategies, combating clones, dealing with negative reviews, and what control you have (and don't have) if your app goes viral.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "make-it-to-number-1-in-the-app-store",
    "speakers" : [
        {
            "name" : "Amir Rajan",
            "shortBio" : "Coder. Mentor. Craftsman.",
            "fullBio" : "Amir Rajan is a jack of all trades. He has expertise in a number languages (C#, F#, Ruby, Scala, JavaScript, and Objective C). He is also the creator of A Dark Room iOS. This minimalist text based RPG conquered the world and took the #1 spot in the App Store across 5 countries. This chart topping iOS game and its unprecedented rise to the top has received critical acclaim from Paste Magazine, Giant Bomb, Forbes, The Huffington Post, Cult of Mac, and The New Yorker.",
            "username" : "amirrajan",
            "gravatar" : "433d6daba7a9f7e563b793c0890ef906",
            "bb" : null,
            "so" : null,
            "tw" : "ADarkRoomiOS",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "app-store"
    ],
    "time" : moment("2014-08-22T15:00:00.000Z"),
    "title" : "Making it to #1 in the App Store",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "bLfbbVSPm0M"
},{
    "_id" : "53dc048a6a45650200845f45",
    "description" : "The things I wish someone told me when I started developing with Angular.JS. We will explore the Best practices as well Anti-Patterns every Angular.JS developer should be aware of.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "angularjs-performance-pitfalls",
    "speakers" : [
        {
            "name" : "Uri Shaked",
            "shortBio" : "AngularJS Google Developer Expert",
            "fullBio" : "Uri loves the web. Started developing software at the age of 12, he has since been pursuing his passion for technology, both professionally and through notable side projects and community activities. He is a Lean Startup enthusiast, the lead of Tel Aviv’s Google Developer Group and is an Angular.JS expert who lectures in an advanced web development code lab at the Technion, Israel’s Institute of Technology.\n\nAmong his interests are reverse engineering, hardware hacking, and mobile development. Uri is also an avid Salsa dancer and a musician; he often likes to bring his passions together in projects such as the SalsaBeatMachine.org.\n",
            "username" : "urish",
            "gravatar" : "11696d5a1b7da83ebdf9c54a5dbd8f7a",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/H_-Va_zs6e",
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs",
        "performance"
    ],
    "time" : moment("2014-08-25T17:00:00.000Z"),
    "title" : "Avoiding Common Pitfalls in AngularJS",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : "fAPazNCLAn8"
},{
    "_id" : "53dc048a6a45650200845f46",
    "description" : "You have those that STILL use FTP and work off a production server (really?), you have those that have figured out how to run their *AMP stack locally and using localhost as a hostname, then you have the savvy that have figured out how to run a staging server with virtualization software like VirtualBox or VMWare Fusion/Workstation. Of the latter, there's Vagrant which makes creating, configuring, running, connecting and sharing a virtual server as easy as putting your pants on. We'll talk about how to get vagrant running with LAMP, CentoOS, and any of your other favorite packages.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "emulate-staging-servers-with-vagrant",
    "speakers" : [
        {
            "name" : "Jorge Colon",
            "shortBio" : "PHP Certified Superhero",
            "fullBio" : "George is a \"PHP superhero\" consultant. He has been solving business problems and creating opportunities with custom software for over 8 years and does work for both startups and enterprise.",
            "username" : "2upmedia",
            "gravatar" : "b93914137ae67057880798210dc80e20",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/cPXFL7mBie",
            "gh" : null
        }
    ],
    "tags" : [
        "vagrant",
        "centos",
        "lamp"
    ],
    "time" : moment("2014-09-23T18:00:00.000Z"),
    "title" : "Emulate Staging Servers w Vagrant, CentOS & LAMP",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : ""
},{
    "_id" : "53dc048a6a45650200845f48",
    "description" : "Join me for a crash course in PowerShell and its configuration management capabilities. In this session, you'll learn how PowerShell can be used to create consistent, Windows and Linux based development environments. We'll also explore some of the fundamentals of the popular application distribution system known as Docker and how we can use PowerShell to provision and manage our Docker hosts.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "configuration-with-powershell",
    "speakers" : [
        {
            "name" : "Andrew Weiss",
            "shortBio" : "Consultant at Microsoft",
            "fullBio" : "Andrew is a consultant at Microsoft with experience in developing various cross-platform tools for a variety of customers across different industries. Much of his work revolves around educating enterprise IT organizations on the importance of DevOps, helping them enhance existing processes and leverage new toolsets along the way.",
            "username" : "andrew_weiss",
            "gravatar" : "487151c85bfb33f3249c5668874719d2",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/KhUQbZLqfq",
            "gh" : null
        }
    ],
    "tags" : [
        "powershell",
        "linux",
        "windows"
    ],
    "time" : moment("2014-09-19T20:00:00.000Z"),
    "title" : "Cross-Platform Configuration w PowerShell",
    "updatedAt" : moment("2014-08-01T21:20:10.000Z"),
    "youtube" : ""
},{
    "_id" : "53dc048b6a45650200845f49",
    "description" : "A common misconception about agile is that self-organizing teams make managers unnecessary. \n \nThis misconception can be a problem all around: A frequently cited barrier to agile adoption is managers who don't know what to do when their teams become self-managing. Managers bent on command-and-control are clearly a barrier to agile adoption. But managers who take a hands-off approach or just tread water stymie adoption, as well.\n\nRon Lichty believes (and so do a lot of the early agile thought leaders) that managers have critical roles to play in enabling agile success. This session is about those roles.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "crash-course-managing-software-people-and-teams",
    "speakers" : [
        {
            "name" : "Ron Lichty",
            "shortBio" : "Software engineering management",
            "fullBio" : "Ron Lichty has been living Agile Methodology for almost 15 years. He is author of Managing the Unmanageable and a regular speaker at events such as Silicon Valley Code Camp on topics like Becoming an Agile Manager; Rules, Tools, and Insights for Managing Software People and Teams; and How Leaders Can Empower High Performance Teams. Ron has worked as an Agile Software Coach and Management Mentor training companies such as Engine Yard, Axcient, Merced Systems, Fuze, Amdocs, HP, and others.  Ron is available for one-on-one mentoring sessions over video chat and screen sharing through the AirPair expert network.\n",
            "username" : "ronlichty",
            "gravatar" : "4974bd42e635147b1fee8323f122acc9",
            "bb" : null,
            "so" : null,
            "tw" : "ronlichty",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "agile",
        "management"
    ],
    "time" : moment("2014-08-13T18:00:00.000Z"),
    "title" : "If We’re Agile, Why Do We Need Managers?",
    "updatedAt" : moment("2014-08-01T21:20:11.000Z"),
    "youtube" : "z8YQbsas6yQ"
},{
    "_id" : "53dc208003850a020003abd6",
    "description" : "In my talk, I would describe:\n\n- Why cross-platform development is hard.\n- Core Audio quirks.\n- What’s missing from Android.\n-Hacks and tricks to achieve low latency audio\n",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "audio-development-for-ios-and-android",
    "speakers" : [
        {
            "name" : "Gabor Szanto",
            "shortBio" : "Low-latency Mobile Audio Expert",
            "fullBio" : "As the CTO of Superpowered, and an expert in computational signal processing for low-power processor architectures for mobile devices, Gabor brings innovative DSP optimization methods to developers of iOS, Android and wearables in the form of a high-performance and extremely efficient audio SDK. His iOS app, DJ Player, has more than 1m downloads.\n\nGábor is an expert in designing ‘standalone’ DSP solutions, wherein the components have no third-party dependencies. His work is not simply code optimization of high-performance Assembly and real-time programming, but the development of novel algorithms from scratch to solve difficult and highly constrained computational problems. An example of his approach is found in the Superpowered Time Stretching unit, which enables high quality, high FFT size, transient-aware frequency-domain time stretching and pitch shifting on single core ARM devices with record-low CPU usage.\n",
            "username" : "szantog",
            "gravatar" : "36f576fd257c50c5afe5caf3eb0d9fef",
            "bb" : null,
            "so" : null,
            "tw" : "djplayerapp",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "android",
        "ios",
        "audio"
    ],
    "time" : moment("2014-09-25T14:00:00.000Z"),
    "title" : "Cross-platform audio for iOS & Android",
    "updatedAt" : moment("2014-08-01T23:19:28.000Z"),
    "youtube" : ""
},{
    "_id" : "53deb39d1d385c0200806a67",
    "description" : "With Heroku opening up their platform to PHP as an officially supported language, we can now start to do things in a new way. Not only can we host production code in the cloud just based off of Git pushes, but we can even get away from traditional LAMP/WAMP/MAMP local setups thanks to Heroku's composer distributed buildpack binaries.\n\nCatch up on the Ruby and Python crew, with this new workflow.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "breaking-up-with-lamp",
    "speakers" : [
        {
            "name" : "Phil Sturgeon",
            "shortBio" : "PHP Town Crier",
            "fullBio" : "I've been programming since I was about 12, writing awful messes in spaghetti PHP. 14 years later and I have learned how to a) program in languages other than PHP and b) make PHP be a better place to be. I code, I train, I teach, I write and I speak, all about the random technical things I have been up to recently with PHP, API development and more recently a whole boat-load of devops.",
            "username" : "philsturgeon",
            "gravatar" : "14df293d6c5cd6f05996dfc606a6a951",
            "bb" : null,
            "so" : null,
            "tw" : "philsturgeon",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "php",
        "heroku"
    ],
    "time" : moment("2014-08-07T21:00:00.000Z"),
    "title" : "Breaking Up with LAMP",
    "updatedAt" : moment("2014-08-03T22:11:41.000Z"),
    "youtube" : "NYlEM32tPqA"
},{
    "_id" : "53deb39d1d385c0200806a68",
    "description" : "Knockout is a Javascript library that you can use to bind HTML markup to Javascript though a pub/sub system. The binding system is bidirectional, so user events can update Javascript variables, and updates to Javascript variables are reflected in the DOM. In this talk I will cover the basics of the pub/sub, its dependency tracking, custom bindings, a couple great plugins, and the latest update with web components.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "dynamic-html-with-knockout",
    "speakers" : [
        {
            "name" : "Brian Hunt",
            "shortBio" : "Knockout aficionado",
            "fullBio" : "Brian is a founder of a SaaS company called NetPleadings, which provides a way for lawyers to effectively convey their thoughts as formal legal documents.",
            "username" : "brianmhunt",
            "gravatar" : "3aefe160da30caa0d7ea0f922f94c257",
            "bb" : null,
            "so" : "19212/brian-m-hunt",
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "knockout"
    ],
    "time" : moment("2014-08-14T14:00:00.000Z"),
    "title" : "Dynamic HTML with Knockout",
    "updatedAt" : moment("2014-08-03T22:11:41.000Z"),
    "youtube" : "9CuBdLCfPLI"
},{
    "_id" : "53e117a5b5ef2d0200016d19",
    "description" : "The Bitcoin blockchain is an amazing tool for trustless payments; the next step in the evolution of the decentralized database technology known as the the Blockchain is using it for other types of data, in an equally trustless/cryptographically secure way. \n\nDecentralized Exchange for Asset Ownership and Smart Contracts for self-verifying and self-executing legal agreements are the next steps in this evolution. \n\nThis discussion will focus on Blockchain 2.0 technologies and how they are being used to make trustless/trustworthy web applications.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "using-the-blockchain",
    "speakers" : [
        {
            "name" : "Sergey Nazarov",
            "shortBio" : "Decentralizing key Social Systems",
            "fullBio" : "Working with cryptocurrency since 2011, currently building on next-generation Blockchain 2.0 cryptocurrencies like NXT.\n\nLaunched the largest web-accessible Decentralized Exchange; https://trade.secureae.com/, where you can buy/sell/transfer 200+ assets that exist entirely on a decentralized exchange infrastructure which we as a company do not control and therefore others can come to trust.\n\nPreviously launched the first decentralized email for the web to utilize a blockchain for secure messaging; http://www.cryptamail.com/\n\nMost recently released the first working version of web-based Smart Contracts that allow autonomous/self-executing fulfillment of contractual obligations. ",
            "username" : "sergeynazarov",
            "gravatar" : "cb2b0076739fe953c04adbbf8dd92839",
            "bb" : null,
            "so" : null,
            "tw" : "sergeynazarov",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "cryptocurrency",
        "bitcoin"
    ],
    "time" : moment("2014-08-07T17:00:00.000Z"),
    "title" : "Using the Blockchain",
    "updatedAt" : moment("2014-08-05T17:43:01.000Z"),
    "youtube" : "Jm9UnC8dd_A"
},{
    "_id" : "53e17a8a0479580200e2a177",
    "description" : "One of Node.js's most important features is its package manager, npm. It's widely lauded for its successful model of local dependencies, small and focused packages, and the ecosystem it has encouraged. But what about the browser? What about packages for your web apps? It turns out npm is perfect for those too!\n\nGiven Node.js's focus on small packages, it's no wonder that many packages in npm work equally well on the web. This talk discusses how npm's standardized format, with a package.json and CommonJS modules, is actually perfect for browser use, and how I and others have used it successfully on several large enterprise-scale projects.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "reusable-pieces-with-npm",
    "speakers" : [
        {
            "name" : "Domenic Denicola",
            "shortBio" : "Google Chrome team",
            "fullBio" : "Node.js expert Domenic Denicola is highly active in the JavaScript community. He is famous for publishing over 30 npm modules, maintaining many open-source libraries. Domenic contributes to Node itself, and is a core contributor on the npm team. He is passionate about software craftsmanship and the future of the web. One of his side passions is contributing to the web, JavaScript and ECMA standards process. He often blogs at domenic.me.",
            "username" : "domenic",
            "gravatar" : "c6d819207a3010b39d13e1f59f2c0029",
            "bb" : null,
            "so" : null,
            "tw" : "domenic",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "npm",
        "nodejs",
        "browserify"
    ],
    "time" : moment("2014-08-12T00:00:00.000Z"),
    "title" : "Building web apps from reusable pieces with npm",
    "updatedAt" : moment("2014-08-06T00:44:58.000Z"),
    "youtube" : "NM2Bu4Ue-mk"
},{
    "_id" : "53e17a8a0479580200e2a178",
    "description" : "Learn 5 proven ways to improve your email marketing conversions with tips from the founder of email marketing software Vero.\n\nBased on real experience from hundreds of customers and thousands of campignsb- these tips are practical and WORK!",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "dominate-email-conversion",
    "speakers" : [
        {
            "name" : "Chris Hexton",
            "shortBio" : "Co-Founder of Vero",
            "fullBio" : "Co-Founder and CEO of Vero, Chris writes the Vero blog and helps SaaS and other online businesses improve their email campaigns.",
            "username" : "chexton",
            "gravatar" : "08b57e29f0a32ffd162fa4cd78a14c49",
            "bb" : null,
            "so" : null,
            "tw" : "chexton",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "email",
        "marketing"
    ],
    "time" : moment("2014-08-12T20:00:00.000Z"),
    "title" : "5 Ways to Dominate Email Conversions",
    "updatedAt" : moment("2014-08-06T00:44:58.000Z"),
    "youtube" : "YfWwMqmX1Mg"
},{
    "_id" : "53e190dcc327e402003465df",
    "description" : "Most startups are built by engineers, and thus most of the focus is on the underlying technology, and now how to get that technology into the right people's hands. I'll be discussing ways that you can write code that ends up putting more money in your pocket.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "small-wins-big-results",
    "speakers" : [
        {
            "name" : "Brennan Dunn",
            "shortBio" : "Business owner",
            "fullBio" : "Founder of Planscope, a SaaS product for consultants, author of two best-selling books on consulting, and host of the Business of Freelancing podcast.",
            "username" : "brennandunn",
            "gravatar" : "06c6fcf31eca8e953379f42c40299371",
            "bb" : null,
            "so" : null,
            "tw" : "brennandunn",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "marketing"
    ],
    "time" : moment("2014-08-21T16:00:00.000Z"),
    "title" : "Small Wins, Big Results",
    "updatedAt" : moment("2014-08-06T02:20:12.000Z"),
    "youtube" : "J9OOVux9wac"
},{
    "_id" : "53e3f8be81cef3020009642c",
    "description" : "Don’t you hate when testing takes 3x as long because your specs are hard to understand? Or when testing conditional permutation leads to a ton of duplication? Following a few simple patterns, you can easily take a bloated spec and make it readable, DRY and simple to extend. This workshop is a refactor kata. We will take a bloated sample spec and refactor it to something manageable, readable and concise.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "taming-chaotic-specs-rspec-2",
    "speakers" : [
        {
            "name" : "Adam Cuppy",
            "shortBio" : "Ruby on Rails & RSpec Ninja",
            "fullBio" : "Adam Cuppy is a Partner and the Chief Operating Officer of the Ruby on Rails, Node.js, AngularJS consultancy Coding ZEAL. Since 2007, Adam and his partners have been deeply involved in open-sourced web technologies that support rapid development, enterprise-class scalability and community driven security.",
            "username" : "acuppy",
            "gravatar" : "35e0dbc9533ce3d90527eeec998d9725",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : "sy5n2q8o2i49/OfJ8u7KW5E",
            "gh" : null
        }
    ],
    "tags" : [
        "ruby",
        "rspec",
        "testing",
        "tdd"
    ],
    "time" : moment("2014-08-27T17:00:00.000Z"),
    "title" : "Taming Chaotic Spec:  RSpec Patterns",
    "updatedAt" : moment("2014-08-07T22:07:58.000Z"),
    "youtube" : ""
},{
    "_id" : "53e41096cb71b60200308343",
    "description" : "When you think of hiring, do you think of paperwork, endless interviews, and wondering if that new hire is going to work out? The cost of hiring can be high. The cost of not hiring can be worse. What if you applied agile approaches to your hiring, iterating on everything, getting feedback as you proceed, and involving the entire team? Just as agile is a cross-functional and team approach to developing great products, you can use agile hire the people who fit your culture, without fear.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "hiring-developers",
    "speakers" : [
        {
            "name" : "Johanna Rothman",
            "shortBio" : "Author of Hiring Geeks That Fit",
            "fullBio" : "Johanna Rothman, known as the “Pragmatic Manager,” provides frank advice for your tough problems. She’s the author of eight books about management and project management. Her most recent book is Manage Your Job Search. Her upcoming book is Agile and Lean Program Management: Collaborating Across the Organization. Read more of her writing on www.jrothman.com and www.createadaptablelife.com.",
            "username" : "johannarothman",
            "gravatar" : "3117188173fedd77cd2179652ca1d302",
            "bb" : null,
            "so" : null,
            "tw" : "johannarothman",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "agile",
        "culture"
    ],
    "time" : moment("2014-08-26T15:00:00.000Z"),
    "title" : "Hiring Developers Without Fear",
    "updatedAt" : moment("2014-08-07T23:49:42.000Z"),
    "youtube" : ""
},{
    "_id" : "53e42aada053850200321d08",
    "description" : "Unit Testing has moved from fringe to mainstream, which is great. Unfortunately, developers are creating mountains of unmaintainable tests as a side effect. I've been fighting the maintenance battle pretty aggressively for years, and this presentation captures the what I believe is the most effective way to test.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "effective-unit-tests",
    "speakers" : [
        {
            "name" : "Jay Fields",
            "shortBio" : "Productivity Obsessed Enginner",
            "fullBio" : "I have a passion for discovering and maturing innovative solutions. I've worked as both a full-time employee and as a consultant for many years. The two environments are very different; however, a constant in my career has been my focus on how I can deliver more with less.",
            "username" : "jayfields",
            "gravatar" : "749ce037ffa00da29b95fd480946984e",
            "bb" : null,
            "so" : null,
            "tw" : "thejayfields",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "unit-testing",
        "maintainability"
    ],
    "time" : moment("2014-09-27T21:00:00.000Z"),
    "title" : "Working Effectively with Unit Tests",
    "updatedAt" : moment("2014-08-08T01:41:01.000Z"),
    "youtube" : ""
},{
    "_id" : "53e582699771050200e67b25",
    "description" : "Taking payments has never been easier with Braintree's new v.zero SDKs. Developer Evangelist Cristiano Betta  shows how to take PayPal and Credit Cards on the web, iOS and Android, and highlights the opportunities of Marketplaces and Plans.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "braintree-and-paypal-payments",
    "speakers" : [
        {
            "name" : "Cristiano Betta",
            "shortBio" : "Developer Evangelist at PayPal",
            "fullBio" : "Developer Evangelist at PayPal, event organiser at Geeks of London. Board certified geek.\n\nLoves to code in Ruby, Rails & JS. Appreciates web standards, continuous integration, distributed version control systems, test driven development, and coffee.",
            "username" : "cbetta",
            "gravatar" : "fcff4657d7569f605976d2cab3813890",
            "bb" : null,
            "so" : null,
            "tw" : "cbetta",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "payments",
        "paypal",
        "braintree"
    ],
    "time" : moment("2014-08-29T15:00:00.000Z"),
    "title" : "Taking payments with Braintree and PayPal",
    "updatedAt" : moment("2014-08-09T02:07:37.000Z"),
    "youtube" : ""
},{
    "_id" : "53f4d7e5febd9b02005ee0b9",
    "description" : "A no holds barred Q&A. Is lean startup just agile? Is it just hype? What parts are real and what parts are just masking a lack of vision and capital?",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "lean-startup-deep-dive",
    "speakers" : [
        {
            "name" : "Tristan Kromer",
            "shortBio" : "Lean Startup Product Guy",
            "fullBio" : "I help product teams go fast.\n\nAs a lean startup coach, I apply lean startup principles with product teams and innovation ecosystems.\n\nI have worked with companies ranging from early stage startups with zero revenue to established business with >$10M USD revenue (Kiva, StumbleUpon, Pearl) to enterprise companies with >$1B USD revenue (Swisscom, Pitney Bowes).\n\nWith my remaining hours, I volunteer with Lean Startup Circle, a non-profit grassroots organization helping to develop innovation ecosystems with meetups in over 80 cities around the world.",
            "username" : "trikro",
            "gravatar" : "748850bc48f421d8214fe7d1dfed0980",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "lean-startup",
        "agile"
    ],
    "time" : moment("2014-09-24T17:00:00.000Z"),
    "title" : "Beyond the Buzzwords: Lean Startup",
    "updatedAt" : moment("2014-08-20T17:16:21.000Z"),
    "youtube" : ""
},{
    "_id" : "53fcf32688b04602008451e6",
    "description" : "We'll go over the essentials on how to integrate Mailjet into your application as an email service provider.  We'll cover the different use cases for email APIs -- sending transactional and marketing, parsing emails, detecting open and click rates for emails sent -- and how each can benefit your app/business.  This talk is for developers who don't have much experience with using email APIs, but want to become an emailing ninja.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "getting-email-into-your-app",
    "speakers" : [
        {
            "name" : "Tyler Nappy",
            "shortBio" : "Ruby developer; developer evangelist",
            "fullBio" : "Tyler began his technical career studying aerospace engineering at Boston University where he found his passion for software, hardware, and web development. These passions collided professionally when he joined Hammerhead, a graduate of the Techstars R/GA connected devices accelerator, as a member of their software engineering team.  Since then, Tyler has transitioned to his role  as the developer evangelist for Mailjet here in the United States.  When he's not coding or prototyping, you can find him running, swimming, or cycling.",
            "username" : "tylernappy",
            "gravatar" : "521a4ef9c369d51e5f7baa664cc08d11",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "esp",
        "mailjet"
    ],
    "time" : moment("2014-09-05T21:00:00.000Z"),
    "title" : "Getting Emailing into Your App",
    "updatedAt" : moment("2014-08-26T20:50:46.000Z"),
    "youtube" : ""
},{
    "_id" : "53fcf32688b04602008451e7",
    "description" : "Creating a user experience for Android can give a hard time when you are not familiar to this system and all its specificities. \n\nDuring this talk we will see how to design user interfaces and workflows that totally fit the system's spirit while featuring your service and brand as much as possible.\n\nBy giving you a real example, we will build in live a UX starting from a simple specification.\n\nHere are the slides: http://bit.ly/and-nav",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "build-ux-for-android",
    "speakers" : [
        {
            "name" : "Eyal Lezmy",
            "shortBio" : "Developer on Genymotion & Android GDE",
            "fullBio" : "- Software Engineer at Genymobile, working on Genymotion\n- Treasurer at Paris Android User Group\n- Google Developer Expert Android\n\nWorking with Android since 2009. After several R&D projects at french internet providers, at Samsung in the Android B2B team and then has an Android Set-top Box developer for an hotel chain, I'm now working on Genymotion an Android emulator.",
            "username" : "eyal-lezmy",
            "gravatar" : "84803fc83d5a1e1dbebe301f985b2b4c",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "android",
        "ux",
        "ui"
    ],
    "time" : moment("2014-10-15T13:00:00.000Z"),
    "title" : "Build a User Experience for Android",
    "updatedAt" : moment("2014-08-26T20:50:46.000Z"),
    "youtube" : ""
},{
    "_id" : "53fcf32688b04602008451e8",
    "description" : "Learn about Chrome Apps. You will learn how they work, what they can be used for,  and how to get started building one.\n\nAdditionally learn how Chrome Apps can be used to build mobile applications using Google's new CCA tool.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "building-chrome-apps",
    "speakers" : [
        {
            "name" : "Stephen Fluin",
            "shortBio" : "IT Executive / Wizard",
            "fullBio" : "Stephen Fluin is an enthusiastic Minnesota-based Executive Technologist, Entrepreneur, and Mobile Expert. Acting as an advisor and consultant to hundreds of startup, mid-sized, and Fortune 500 companies, he combines a deep understanding of modern technology and business practices to build great software products, strategies, and experiences.\n\nStephen applies deep technical knowledge and lean methodologies to accelerate software development. He is a recognized Google Developer Expert in Chrome. As an avid fan of wearables and the Internet of Things, he frequently collaborates with businesses and developers in the community.",
            "username" : "stephenfluin",
            "gravatar" : "55ae19c9c0cd94a14b2d439878f830d1",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "chrome",
        "javascript",
        "html5"
    ],
    "time" : moment("2014-09-22T18:00:00.000Z"),
    "title" : "Build Chrome Apps",
    "updatedAt" : moment("2014-08-26T20:50:46.000Z"),
    "youtube" : "bTdrHVUFN28"
},{
    "_id" : "53fcf32688b04602008451eb",
    "description" : "This talk aims to introduce the upcoming ServiceWorker technology, its basic functionalities, its lifecycle and its most common use cases. Then it moves to analyse in detail a less obvious implementation of this technology: how to create a wiki engine using ServiceWorker and IndexedDB.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "experimenting-with-serviceworker",
    "speakers" : [
        {
            "name" : "Sandro Paganotti",
            "shortBio" : "Front End Engineer, GDE and Author",
            "fullBio" : "Sandro Paganotti (1983) is co-founder and Front End engineer at Comparto Web. He loves developing web interfaces that showcase the full power of HTML5 and CSS3. He's author of \"Designing next generation web Projects with CSS3\" for Packt Publishing, technical writer for html.it, Google Developer Expert in HTML5, speaker at various technical events and co-teacher at the workshop \"CodeJam\" for Avanscoperta.",
            "username" : "sandropaganotti",
            "gravatar" : "0df4a6c75caf1bd9b01d2dcbfb085ee4",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "serviceworker",
        "html5"
    ],
    "time" : moment("2014-09-15T15:00:00.000Z"),
    "title" : "Experimenting with ServiceWorker ",
    "updatedAt" : moment("2014-08-26T20:50:46.000Z"),
    "youtube" : "Ve7Yy4nD4oY"
},{
    "_id" : "53fcf32688b04602008451ec",
    "description" : "We will be covering the mysterious tech that is NodeJS and what makes it so fast for certain types of apps. \n\nWe'll be answering:\n-> What NodeJS is \n-> What makes NodeJS fast \n-> How NodeJS works under the hood to see what types of apps would work well with the platform \n-> Demo of writing a basic tcp server socket \n-> Common libraries to get you started \n-> Demo of writing a quick app using a popular framework - express \n-> Q&A\n\nEveryone should be able to get something out of this be. Be it those who want to go over the foundational concepts or anyone totally new to NodeJS and just interested.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "resolving-your-problems-with-nodejs",
    "speakers" : [
        {
            "name" : "Johann du Toit",
            "shortBio" : "lead devops and noder",
            "fullBio" : "I'm currently one of the leading experts on Google products based in Cape Town. Recognised by Google as a expert in Cloud technologies and to act as a local resource for developers. The first GDE in Africa.\n\nI've recently been voted as one of the top 20 innovators in Africa using the web to change lives by Google. \n\nWhile acting as the lead devops to manage and host most of the magazine publications in South-Africa.\n\nSee my website for a list of some of the interesting projects I've been a part of / previous talks and my profiles - johanndutoit.net \n\nCurrently bootstrapping a few cool new startups in Africa.",
            "username" : "johanndutoit",
            "gravatar" : "46b656be55256ced0695c9f6af82c7d4",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "nodejs"
    ],
    "time" : moment("2014-09-29T14:00:00.000Z"),
    "title" : "Resolving your intimacy problems with NodeJS",
    "updatedAt" : moment("2014-08-26T20:50:46.000Z"),
    "youtube" : ""
},{
    "_id" : "53ff93e9c1fce802005da9a2",
    "description" : "Microsoft, Facebook, Yahoo... They are all known for their software engineering and are also big Android editors. Despite that, they sometimes do not fully encountered the success on the PlayStore.\n\nDuring this class, we will discover together the stories of big companies that published apps on the PlayStore and failed to satisfy the users or the Android guidelines. We will try to learn from their mistakes to avoid reproducing them.\n\nHere are the slides : http://bit.ly/andbigfails\n\n",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "android-fails-on-the-playstore",
    "speakers" : [
        {
            "name" : "Eyal Lezmy",
            "shortBio" : "Developer on Genymotion & Android GDE",
            "fullBio" : "- Software Engineer at Genymobile, working on Genymotion\n- Treasurer at Paris Android User Group\n- Google Developer Expert Android\n\nWorking with Android since 2009. After several R&D projects at french internet providers, at Samsung in the Android B2B team and then has an Android Set-top Box developer for an hotel chain, I'm now working on Genymotion an Android emulator.",
            "username" : "eyal-lezmy",
            "gravatar" : "84803fc83d5a1e1dbebe301f985b2b4c",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "android",
        "ux",
        "security"
    ],
    "time" : moment("2014-06-25T13:00:00.000Z"),
    "title" : "Biggests fails on the PlayStore",
    "updatedAt" : moment("2014-08-28T20:41:13.000Z"),
    "youtube" : ""
},{
    "_id" : "53ff93e9c1fce802005da9a8",
    "description" : "You've just shipped your product, and you now want to figure out how people are using your application, as well as how you can quantitatively improve it. This talk is a high-level approach to properly instrumenting your application, determining KPIs to track, the difference between data analytics and data science, and how you can apply machine learning techniques to event data now that you're instrumenting your application!",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "data-analytics-101",
    "speakers" : [
        {
            "name" : "Thomson Nguyen",
            "shortBio" : "Founder/CEO of Framed Data",
            "fullBio" : "Thomson Nguyen is the Founder and CEO of Framed Data, a predictive analytics company that helps you determine when and why your users will churn. He is a visiting scholar at the Courant Institute for Mathematical Sciences at NYU. He enjoys reuben sandwiches, city bike share services, and stand-up comedy.",
            "username" : "",
            "gravatar" : "039ea0930c2c634154747fcb65d574de",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "visualization,",
        "analytics,",
        "machine-learning"
    ],
    "time" : moment("2014-10-09T02:00:00.000Z"),
    "title" : "Data Analytics 101",
    "updatedAt" : moment("2014-08-28T20:41:13.000Z"),
    "youtube" : "dWOuxCcN-YI"
},{
    "_id" : "5405ea4ea570a602009c59a2",
    "description" : "The talk will be based on Vagrant introduction, the problems solved by Vagrant, the advantages of using Vagrant for development, a demo of Vagrant machine setup and automating the vagrant box provisioning using provisioners like Ansible or Chef.\n\nMihir, who loves staying technically updated, enjoys working towards setting up fast feedback systems for development & likes working with loosely coupled systems.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "slug" : "vagrant-vms-provisioning",
    "speakers" : [
        {
            "name" : "Mihir Khatwani",
            "shortBio" : "Random Stuff",
            "fullBio" : "Mihir has been working with a lot of random stuff. He prefers to solve problems using Python and then Rosetta Stone in random languages. He has a fair bit of interest in DevOps, and keeps up to date on anything new DevOps. He prefers to stay on the backend side of things, which goes right from assembling computers to exposing an API end-point.",
            "username" : "mihirk",
            "gravatar" : "6445060cdb3806a7e29acb26409b6b82",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "vagrant",
        "ansible",
        "devops"
    ],
    "time" : moment("2014-09-26T15:00:00.000Z"),
    "title" : "Vagrant VMs & Provisioning: For Efficient Scaling Teams",
    "updatedAt" : moment("2014-09-02T16:03:26.000Z"),
    "youtube" : ""
},{
    "_id" : "540e31e6881c3402007bc377",
    "description" : "Many people crave more freedom. Striking out on your own is both appealing and challenging. It's scary to change and to have everything fall on your shoulders.\n\nThis talk will explore why you should (or shouldn't) go freelance, what some of the challenges and common questions are about freelancing, and give sound advice for anyone who is or is considering going freelance.",
    "difficulty" : "All levels",
    "duration" : "1 hour",
    "slug" : "introduction-to-freelancing",
    "speakers" : [
        {
            "name" : "Charles Wood",
            "shortBio" : "Podcaster, freelancer, programmer, dad",
            "fullBio" : "Host of the Freelancers' Show, Ruby Rogues, Javascript Jabber, and iPhreaks podcasts. Long time Ruby programmer. Lover of soccer, family, podcasting, programming and people.",
            "username" : "cmaxw",
            "gravatar" : "b249f348e11fbc90a07456ce5b033d32",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "Freelancing"
    ],
    "time" : moment("2014-10-09T21:00:00.000Z"),
    "title" : "Introduction to Freelancing",
    "updatedAt" : moment("2014-09-08T22:47:02.000Z"),
    "youtube" : "q4E1tdwN3Gw"
},{
    "_id" : "540e31e6881c3402007bc378",
    "description" : "Learn how to use Nexmo's powerful APIs while Tim builds an application that uses just about every API Nexmo offers. See how sending and receiving SMS messages are as easy as sending - and receiving - HTTP requests. Building a voice enabled application? That's surprising similar to HTML.\nAnd along the way you'll also learn about the various use cases for telecommunications in this API driven world.\n\nDiscover how Nexmo powers world-wide SMS and Voice solutions to solve problems like 2nd factor authentication, proxied chats, instant feedback and more.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "sms-an-voice-api",
    "speakers" : [
        {
            "name" : "Tim Lytle",
            "shortBio" : "Developer Evangelist at Nexmo",
            "fullBio" : "Tim is Nexmo's developer evangelist. He's also a lover of fine APIs, hates the top reply, and tweets sporadically from @tjlytle.\n\nAs a seasoned contract developer he's built applications utilizing numerous APIs, created custom APIs for internal consumption, and now helps other developers energize their projects with Nexmo's powerful global communications API.",
            "username" : "tjlytle",
            "gravatar" : "9eda118f83eeffce85f39b7c030e407a",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "sms",
        "voice",
        "api",
        "nexmo"
    ],
    "time" : moment("2014-11-06T20:00:00.000Z"),
    "title" : "Solve Real-World Problems with SMS & Voice",
    "updatedAt" : moment("2014-09-08T22:47:02.000Z"),
    "youtube" : "Y8zQtN1cnSg"
},{
    "_id" : "5435a14fb632d70200c044d5",
    "description" : "React is a new javascript library from the great team at Instagram and Facebook. Its also a bit of a departure from classic style of \"unobtrusive javascript\" by re-interpreting \"separation of concerns\" to mean more than just \"separation of technologies\". In this talk I'll discuss component design patterns which you might use when implementing components the \"react way.\" ",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "react-design-patterns",
    "speakers" : [
        {
            "name" : "Arian Solberg",
            "shortBio" : "Full-stack Software Engineer",
            "fullBio" : "Arian is a full-stack software developer working on building the HelloSign eSignature and eFax platform used by customers around the world. His recent work includes building new features for our fast-growing API, solving database scaling challenges, and re-writing out front-end code using cool new technologies like SCSS and React. When not coding, Arian enjoys running, bike-riding, and pretending to be a capable table-tennis player.",
            "username" : "",
            "gravatar" : "1dcc30f2d1ee73b95ced06c99f62b7a1",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "javascript",
        "node",
        "react"
    ],
    "time" : moment("2013-12-07T17:00:00.000Z"),
    "title" : "React Design Patterns",
    "updatedAt" : moment("2014-10-08T20:40:47.000Z"),
    "youtube" : ""
},{
    "_id" : "5446774e3dc34e0200bca4cf",
    "description" : "Quickly integrate the signing and management of documents into your\nwebapp with HelloSign's eSignature platform and REST-based API. In\nthis developer-focused seminar, HelloSign engineer Arian Solberg\ndemonstrates how to enable your webapp users to sign documents, create\nand use templates and manage teams without ever leaving your website.\nHelloSign provides official, open-source SDKs for a variety of\nlanguages and dedicated support channels for developers by developers.\nThis demo will walk you through embedded workflows, handling event\ncallbacks, and managing customer notifications using Ruby on Rails.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "hellosign-api",
    "speakers" : [
        {
            "name" : "Arian Solberg",
            "shortBio" : "Full-stack Software Engineer",
            "fullBio" : "Arian Solberg is a fullstack engineer helping build the HelloSign\neSignature and eFax platform used by customers around the world.\nRecent projects include building new features for our fast-growing\nAPI, devising concurrent DB migration strategies, and re-writing the\nfront-end codebase using cool new technologies like SCSS and React.\nWhen not coding, Arian enjoys running, bike-riding, and pretending to\nbe a capable ping-pong player.",
            "username" : "",
            "gravatar" : "1dcc30f2d1ee73b95ced06c99f62b7a1",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "api"
    ],
    "time" : moment("2014-11-07T18:00:00.000Z"),
    "title" : "eSignatures in Rails with the HelloSign API",
    "updatedAt" : moment("2014-10-21T15:10:06.000Z"),
    "youtube" : ""
},{
    "_id" : "54493cde6c198c0200035b5f",
    "description" : "Ram is a hands-on architect and a full stack web engineer experienced in designing, developing, and deploying scalable architectures for web products. In this Workshop, Ram will complement his tutorial with an overview of ElasticSearch, it's value proposition and best practices along with a Q&A.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "elasticsearch-robust-search-functionality",
    "speakers" : [
        {
            "name" : "Ram Viswanadha",
            "shortBio" : "",
            "fullBio" : "Ram Viswanadha is a hands-on architect and a full stack web engineer experienced in designing, developing, deploying and maintaining scalable architectures for web products. His products include AdSavvy, Savvy1, Twyxt and AdTouch Suite.",
            "username" : "",
            "gravatar" : "16d45c03c7e437b3715dfba4aea40a8e",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "elasticsearch"
    ],
    "time" : moment("2014-10-24T18:00:00.000Z"),
    "title" : "Building out ElasticSearch",
    "updatedAt" : moment("2014-10-23T17:37:34.000Z"),
    "youtube" : "zbNej4QgPhU"
},{
    "_id" : "54502e8c58956202006075ed",
    "description" : "AngularJS is one of the most popular Javascript frameworks available \ntoday, but with wide adoption comes many common pitfalls. This workshop \nwill go over common AngularJS mistakes, especially when scaling an app.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "top-10-mistakes-angularjs-developers-make",
    "speakers" : [
        {
            "name" : "Mark Meyer",
            "shortBio" : "Mark Meyer is a full stack software developer with over a year of production angular.js experience. Mark is a polyglot with experience ranging from building server apps in C to web applications in Rails to iOS applications in Swift.",
            "fullBio" : "Mark Meyer is a full stack software developer with over a year of production angular.js experience. Mark is a polyglot with experience ranging from building server apps in C to web applications in Rails to iOS applications in Swift.",
            "username" : "",
            "gravatar" : "6c2f0695e0ca4445a223ce325c7fb970",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs"
    ],
    "time" : moment("2014-11-11T16:30:00.000Z"),
    "title" : "The Top 10 Mistakes AngularJS Developers Make",
    "updatedAt" : moment("2014-10-29T00:02:20.000Z"),
    "youtube" : "xXgJMw6zlD8"
},{
    "_id" : "5457b653d4102402002c83ee",
    "description" : "Learn what’s in store for the future of the web and how AngularJS is \nmaking huge strides to bringing it to us today. We’ll look at ES6, two \nway data-binding, upcoming Web Components, including ShadomDOM, Custom \nElements, differences from Polymer, and how Angular fits in the picture.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "angularjs-bridge-today-tomorrow",
    "speakers" : [
        {
            "name" : "Todd Motto",
            "shortBio" : "Front-end engineer",
            "fullBio" : "I'm lead front-end engineer at Appsbroker, a conference speaker and open source evangelist. I'm part of a software engineering team at Appsbroker where we build custom web applications for large organisations. I'm focused on making web development easier for others by blogging and making code freely available via open source and on my blog, which hits around 70,000+ visitors per month.",
            "username" : "toddmotto",
            "gravatar" : "b56bb22b3a4b83c6b534b4c114671380",
            "bb" : null,
            "so" : null,
            "tw" : "toddmotto",
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs"
    ],
    "time" : moment("2014-11-13T19:00:00.000Z"),
    "title" : "AngularJS: The Bridge Between Today and Tomorrow's Web",
    "updatedAt" : moment("2014-11-03T17:07:31.000Z"),
    "youtube" : "OJ12jGY709k"
},{
    "_id" : "5457c553d4102402002c83f9",
    "description" : "Jasmine is a behavior-driven development framework for testing JavaScript code. Michael will show us how to use it for Angular-specific use cases.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "unit-testing-angularjs",
    "speakers" : [
        {
            "name" : "Michael Perrenoud",
            "shortBio" : "Michael Perrenoud is a software engineer who's been building enterprise applications for small businesses and Fortune 500 companies alike for the past 15 years. He's spent the majority of that time on the .NET platform, but has recently switched his focus to the MEAN stack.",
            "fullBio" : "Michael Perrenoud is a software engineer who's been building enterprise applications for small businesses and Fortune 500 companies alike for the past 15 years. He's spent the majority of that time on the .NET platform, but has recently switched his focus to the MEAN stack.",
            "username" : "",
            "gravatar" : "1fe14bf08188abd443168eefb0349ec1",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs"
    ],
    "time" : moment("2014-11-12T18:00:00.000Z"),
    "title" : "Unit Testing in AngularJS with Jasmine",
    "updatedAt" : moment("2014-11-03T18:11:31.000Z"),
    "youtube" : "JHzMx8lqgmA"
},{
    "_id" : "5457c6f31c8c4102008701d0",
    "description" : "Learn how to use restangular to make simple models automatically and how to replace all your $http calls with smart objects.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "angular-restangular",
    "speakers" : [
        {
            "name" : "Jason Katzer",
            "shortBio" : "Serial Entrepreneur, Hustler and Hacker. Director of Engineering at Vital.co Web/iPhone/Android hacker with a Marketing Degree. Dangerous.",
            "fullBio" : "Serial Entrepreneur, Hustler and Hacker. Director of Engineering at Vital.co Web/iPhone/Android hacker with a Marketing Degree. Dangerous.",
            "username" : "",
            "gravatar" : "a5641976875a99dee789daa8cd0d96c0",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs"
    ],
    "time" : moment("2014-11-14T17:00:00.000Z"),
    "title" : "AngularJS Data Models: Replacing $http with Restangular",
    "updatedAt" : moment("2014-11-03T18:18:27.000Z"),
    "youtube" : "7I_2EOwUXqY"
},{
    "_id" : "5459299d55a72702000dc7c4",
    "description" : "One of the reasons for AngularJS’ success is its outstanding ability to be tested. It’s strongly supported by Karma and its multiple plugins. Karma, combined with its fellows Mocha, Chai and Sinon, offers a complete toolset to produce quality code that is easy to maintain, bug-free and well documented.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "testing-angular-apps-karma",
    "speakers" : [
        {
            "name" : "Ben Drucker",
            "shortBio" : "Ben is the founder of Valet.io where he uses JavaScript and Firebase to help nonprofits raise money. In this walkthrough, he introduces some of Firebase's core concepts and shows a quick way of putting them into practice by creating a realtime analytics app.",
            "fullBio" : "Ben is the founder of Valet.io where he uses JavaScript and Firebase to help nonprofits raise money. In this walkthrough, he introduces some of Firebase's core concepts and shows a quick way of putting them into practice by creating a realtime analytics app.",
            "username" : "",
            "gravatar" : "9ce90975ecd6c34593771a4c0b0e789b",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs"
    ],
    "time" : moment("2014-11-19T17:00:00.000Z"),
    "title" : "Testing Angular Apps with Karma",
    "updatedAt" : moment("2014-11-04T19:31:41.000Z"),
    "youtube" : "sHVMCH_QCGM"
},{
    "_id" : "5459299d55a72702000dc7c6",
    "description" : "AngularDart and Angular 2.0 are shifting themselves to better embrace use of directives instead of standalone controllers. This means that component-based directives are the way to go, but how exactly can we build our app purely using directives in AngularJS 1.3? Let’s explode how we craft together reusable, portable and well-tested directives that embrace HTML while empowering us to make the most of our Angular applications.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "component-based-directives-angularjs",
    "speakers" : [
        {
            "name" : "Matias Niemela",
            "shortBio" : "Matias Niemelä is a member of the AngularJS Core Team and authored AngularJS animation API NgAnimate. He has been building web applications for close to ten years across the full spectrum of front-end, backend, server ops, design, UX, content and database design. He has worked primarily as a freelancer, most recently for Google on the AngularJS project. Matias writes regularly at yearofmoo.com where he posts in-depth articles on AngularJS and other web technologies.",
            "fullBio" : "Matias Niemelä is a member of the AngularJS Core Team and authored AngularJS animation API NgAnimate. He has been building web applications for close to ten years across the full spectrum of front-end, backend, server ops, design, UX, content and database design. He has worked primarily as a freelancer, most recently for Google on the AngularJS project. Matias writes regularly at yearofmoo.com where he posts in-depth articles on AngularJS and other web technologies.",
            "username" : "",
            "gravatar" : "3c0ca2c60c5cc418c6b3dbed47b23b69",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs"
    ],
    "time" : moment("2014-11-26T20:00:00.000Z"),
    "title" : "Component-based Directives in Angular",
    "updatedAt" : moment("2014-11-04T19:31:41.000Z"),
    "youtube" : "gE4hyIfUD-A"
},{
    "_id" : "5459299d55a72702000dc7c7",
    "description" : "Nick will cover the philosophy behind contemporary front-end construction, specifically separating out concerns of a \"model\" entirely, relying for our data models entirely on a JSON API.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "using-http-service-angularjs",
    "speakers" : [
        {
            "name" : "Nick Kaye",
            "shortBio" : "Nick has more than 20 years of experience building web applications for companies like Chase, Nintendo, and General Electric.",
            "fullBio" : "Nick has more than 20 years of experience building web applications for companies like Chase, Nintendo, and General Electric.",
            "username" : "",
            "gravatar" : "8ef3e73105c63fcac882115c9ad346f2",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs"
    ],
    "time" : moment("2014-11-21T17:00:00.000Z"),
    "title" : "Using the $http Service in AngularJS",
    "updatedAt" : moment("2014-11-04T19:31:41.000Z"),
    "youtube" : "Q_likQsH65U"
},{
    "_id" : "5459299d55a72702000dc7c8",
    "description" : "Learn about the new features in AngularJS 1.3, how to take advantage of them to improve your app performance, and avoid common pitfalls when migrating your application from AngularJS 1.2.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "slug" : "angular-practical-migration-guide",
    "speakers" : [
        {
            "name" : "Uri Shaked",
            "shortBio" : "Uri loves the web. Started developing software at the age of 12, he has since been pursuing his passion for technology, both professionally and through notable side projects and community activities. He is a Lean Startup enthusiast, the lead of Tel Aviv’s Google Developer Group and is an Angular.JS expert who lectures in an advanced web development code lab at the Technion, Israel’s Institute of Technology. Among his interests are reverse engineering, hardware hacking, and mobile development. Uri is also an avid Salsa dancer and a musician; he often likes to bring his passions together in projects such as the SalsaBeatMachine.org.",
            "fullBio" : "Uri loves the web. Started developing software at the age of 12, he has since been pursuing his passion for technology, both professionally and through notable side projects and community activities. He is a Lean Startup enthusiast, the lead of Tel Aviv’s Google Developer Group and is an Angular.JS expert who lectures in an advanced web development code lab at the Technion, Israel’s Institute of Technology. Among his interests are reverse engineering, hardware hacking, and mobile development. Uri is also an avid Salsa dancer and a musician; he often likes to bring his passions together in projects such as the SalsaBeatMachine.org.",
            "username" : "",
            "gravatar" : "fbf41c66afb1e3807b7b330c2d8fcc28",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : null
        }
    ],
    "tags" : [
        "angularjs"
    ],
    "time" : moment("2014-11-24T17:00:00.000Z"),
    "title" : "Angular 1.3: Practical Migration Guide",
    "updatedAt" : moment("2014-11-04T19:31:41.000Z"),
    "youtube" : "cc0Q5f1xYjo"
}

]
