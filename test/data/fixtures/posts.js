module.exports = {

  v1AirPair: {
    "_id" : "5418ce50cfe1720b004bd08b",
    "assetUrl" : "http://youtu.be/wLzS0YC4TXw",
    "by" : {
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "avatar" : "//0.gravatar.com/avatar/19183084115c4a79d34cdc3110adef37",
        "twitter" : {},
        "stack" : {},
        "name" : "Jonathon Kresner",
        "linkedin" : {},
        "google" : {},
        "github" : {},
        "bitbucket" : {},
        "bio" : "Jonathon Kresner is AirPair's CEO and Founder. He conceived AirPair to help developers build ideas faster and stay un-stuck. He's decided to put AirPair to the test, by rebuilding AirPair.com from scratch in 90 days with daily help from the best AngularJS, NodeJS and MongoDB experts on the web.",
        "username" : "hackerpreneur"
    },
    "created" : "2014-09-16T23:57:04.784Z",
    "md" : "## 1 Why a new AirPair.com?\n\nHi :{} I'm Jonathon, you can follow me on Twitter at [@hackerpreneur](http://twitter.com/hackerpreneur) to keep tabs on my 90-day vision quest to show how powerful AirPairing can be. AirPair is my 3rd startup, and the new AirPair.com code base - which I started today - is the 6th code base I've started from scratch in my startup career. I spent years learning and getting stuck, **so I set out to create a service that would stop people from giving up because of technology** before they could watch their business assumptions play out. We've been lucky to collect a great team, go through YCombinator, and get backing from some amazing Silicon Valley investors. We're excited to be leading our space and to build a next-generation experience that will help us continue as the market leader with the highest quality experts and best customer support.\n\n<br />\n<iframe width=\"640\" height=\"360\" src=\"//www.youtube-nocookie.com/embed/qlOAbrvjMBo\" frameborder=\"0\" allowfullscreen>\n</iframe>\n<br /><br />\nSo far, using AirPair has helped me overcome technology challenges in dribs and drabs. But our ultimate vision of on-demand elastic knowledge has not yet been realized: we see a world where AirPairing makes up as much as 5% of human resources and multiplies software team productivity. \n\nI think the following barriers have gotten in the way of that vision. Now, we're ready to overcome them with a new site and the experience of building it while eating our own dog food.\n\n### 1.1 Cost\n\nI've never had a budget for AirPairing more than 5% of the time. Truth is, AirPair only works when there's a project with a proper development budget. Getting the best people to work with you isn't cheap. You could work with cheaper competitors, but if you are serious about multiplying your productivity, you need to invest in quality help -- like you do with your full-time developers. Now that we have funding, I'm going to use it and show you my spend through the next 90 days.\n\n### 1.2 Friction\n\nThe AirPair experience needs to be 10x faster at getting you help. The current AirPair site is an MVP we built 18 months ago; I'm quite proud of it, and will blog about my philosophy *\"Release Often, Release Dirty\"* another time. But we're ready to give you that order of magnitude improvement on expert response time and matching quality. <a href=\"http://twitter.com/home?status=@hackerprenuer I would love to be a beta tester for the new ap\" target=\"_blank\">Tweet at me</a> if you'd like to be a beta tester. We'll be releasing builds every week for community feedback and bug squashing help.\n\n### 1.3 Dedication\n\nAirPairing is about consuming knowledge at warp speed **while** you see your project come to life. Learning is tiring, and AirPairing properly involves buying in up front with as much dedication as you would when studying a new course. For the last 18 months, I've been context switching between development, marketing, and investor relations. This is the first time I've dedicated 3 straight months of focus to code. I'm switching from Backbone.js and ready to become an AngularJS ninja.\n\n\n## 2 Choosing MEAN Stack \nMean = [`MongoDB, ExpressJS, AngularJS & NodeJS`]\n\n<img src=\"//s3.amazonaws.com/media-p.slid.es/uploads/jbpionnier/images/196683/mean_small_vertical.png\" style=\"margin:40px 40px 30px 0px;float:left\" />\n\nHaving used `MongoDB` for a year, I've grown to like document-driven databases. It's a fast way to develop. I like nesting documents and avoiding joins. It leads to less code, fewer database trips and HTTP requests. There are problems and overhead with replicated data, which may lead us to switch to SQL eventually, but for now Mongo suits our product and development styles really well.\n\nI'm not one for religious debates on which languages to use. I like technologies that `(a)` help you get a lot of shit done quickly and `(b)` lots of people know and are easy to hire for. I came from .NET, where I used to write in c# on the server and various JavaScript on the client side. Full-stack JavaScript with `NodeJS` and `ExpressJS` meant I didn't need to learn a new language and could become doubly proficient in one.\n\nI really love `Backbone.js`, but having tried to teach it to a few people and watch them struggle before grasping `AngularJS` way quicker, I've got a feeling its going to be 3-4 times easier to learn and build on. It's also the most widely adopted and quickly growing front-end framework. I've seen that not only through the notorious graphs of people searching for AngularJS, but first hand with how many requests we get for help with Angular.\n\n## 3 Gulp as an Application Assembler\n\n<img src=\"https://raw2.github.com/gulpjs/artwork/master/gulp-2x.png\" style=\"margin:60px 20px 15% 20px;width:160px;float:right\" />\n\nThe last version of AirPair.com was built using <a href=\"http://brunch.io/\" target=\"_blank\">`brunch.io`</a> as the application assembler to compile, combine, concat and minify JavaScript (coffeescript), CSS (sass) and watch / auto rebuild changes while developing. I really liked it, but a few engineers I worked with didn't. I think the main thing they were annoyed at was needing to restart the brunch server when making server-side changes as it only client-side automatically.\n\nI knew about <a href=\"//gruntjs.com/\" target=\"_blank\">`grunt`</a> as an alternative to brunch, but I'd actually not heard of <a href=\"http://gulpjs.com/\" target=\"_blank\">`gulp`</a> - the latest and greatest. Thanks to a quick chat in my AirPair Angular War Room with my support experts including Matias Nemila (AngularJS Core Team), Uri Shaked (AngularJS Google Developer Expert) and Ari Lerner (Author of ng-book and ng-newsletter), I was quickly pointed in the optimal direction without needing to spend hours on research.\n\nThe main advantages of gulp are code-based configuration vs declarative and streaming (faster) builds. This <a href=\"http://markdalgleish.github.io/presentation-build-wars-gulp-vs-grunt/\" target=\"_blank\">awesome Grunt vs Gulp slide deck</a> by Mark Dalgleish help me appreciate the differences quickly.\n\n### 3.1 nodemon\n`nodemon` is a daemon that watches the JavaScript files in your node app and restarts the node server on any changes. Uri and I installed `gulp-nodemon` in minutes so that the annoyance of manually restarting the node server in my old workflow was gone. I really like that I don't need multiple terminals and multiple commands, everything is taken care of by gulp.\n\n### 3.2 Less\nI ended up opting for Less because you don't need ruby or c++ to compile. With `gulp-less` we got LESS to CSS compilation down relatively quickly, though we got caught on a stylesheet link tag without a `text/css` attribute that held us up for a few minutes.\n\n###3.3 LiveReload\nLiveReload is a mechanism to auto-refresh the browser when a change occurs so you don't have to manually hit refresh. It's particularly nice for CSS editing. I would have fiddled setting this up for quite a while on my own, but Uri knew what he was doing and guided me through setting up both `gulp-livereload` and `connect-livereload` on the node side. I love knocking things out as if I've done it a hundred times before.\n\n##4 Summary\nI'm excited to accomplish a lot in 3 months with the help of AirPair experts on tap. In our first hour of MEAN stack development, Uri and I set up Gulp to wrap nodemon for automatic server-side code reloads, compiling of Less, and browser LiveReload to see client-side changes appear automatically and instantly. This is already a really nice improvement on my previous work flow, and I feel I'm already coding 10% faster for the rest of the project onwards.",
    "meta" : {
        "title" : "Starting a Mean Stack App",
        "canonical" : "http://www.airpair.com/mean-stack/posts/starting-a-mean-stack-app",
        "ogTitle" : "Starting a Mean Stack App",
        "ogImage" : "http://img.youtube.com/vi/wLzS0YC4TXw/hqdefault.jpg",
        "ogVideo" : "https://www.youtube-nocookie.com/v/wLzS0YC4TXw",
        "ogUrl" : "http://www.airpair.com/mean-stack/posts/starting-a-mean-stack-app",
        "description" : "Thoughts and reasons on choosing MEAN stack to rebuild airpair.com with the help of experts."
    },
    "published" : moment("2014-08-27T01:20:18.000Z").toDate(),
    "publishedBy" : "5181d1f666a6f999a465f280",
    "slug" : "starting-a-mean-stack-app",
    "tags" : [
        {
            "_id" : "53c54f5e8f8c80299bcc39bf",
            "name" : "mean-stack",
            "slug" : "mean-stack"
        },
        {
            "_id" : "52d7149c66a6f999a465ff4a",
            "name" : "gulp",
            "slug" : "gulp"
        }
    ],
    "title" : "Starting a Mean Stack App",
    "updated" : "2014-10-15T15:47:55.999Z"
  },

  migrateES6: {
    "_id" : "541a212ddada9a0b009c6356",
    "__v" : 0,
    "assetUrl" : "http://i.huffpost.com/gen/1164240/thumbs/o-GRUMPY-CAT-MOVIE-facebook.jpg",
    "by" : {
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "avatar" : "//0.gravatar.com/avatar/19183084115c4a79d34cdc3110adef37",
        "twitter" : {},
        "stack" : {},
        "name" : "Jonathon Kresner",
        "linkedin" : {},
        "google" : {},
        "github" : {},
        "bitbucket" : {},
        "bio" : "Jonathon Kresner is AirPair's CEO and Founder. He conceived AirPair to help developers build ideas faster and stay un-stuck. He's decided to put AirPair to the test, by rebuilding airpair.com from scratch in 90 days with daily help from the best AngularJS, NodeJS and MongoDB experts on the web.",
        "username" : "hackerpreneur"
    },
    "created" : "2014-09-18T00:02:53.633Z",
    "md" : "## 1 Wasting Coding Time\nIf you're a developer, you're going to empathize with my mood today. I spent 3 hours rewriting the old airpair.com API from CoffeeScript to ES6 JavaScript... and failed.\n\nWe all become Angry Cat every now and then. Its worse if your coding for yourself, rather than on someone else's dime. And more frustrating when you've promised a feature to your users and you know you're going to be late.\n\nToday I was too stubborn to AirPair. I know why, I've had this feeling before. You get to a mind state where you decide, *\"I just need to figure it out ON MY OWN so I don't feel stupid!\"*\n\n3 hours later, I feel stupid for not getting help. I blame it partly on my pride and partly on the limitations of the way AirPair currently works. I'm even more determined now to create the interaction I needed today to make it so easy to AirPair, I will do it every time I even get close to today's mind state.\n\nIn the meantime, here's what I figured out on my own re-writing Coffee Script as Harmony JS.\n\n## 2 Migrating CoffeeScript to ES6\n\nHere's some of the CoffeeScript I was to migrating. I got a lot of mileage from some class inheritance and heavy reliance on CoffeeScript fat arrows `=>`. Fat arrows in Coffee preserve `this` within the different functions of a class. I miss them SO MUCH! \n\n<!--?prettify lang=coffeescript linenums=true?-->    \n\n    class BaseApi\n      \n      logging: off\n      \n      # Constructor for creating business logic service \n      Svc: -> $log \"override in child class\"\n\n      # Read routes handled by this Api instance\n      constructor: (app) ->\n        @routes app\n\n      # Override routers in each child class\n      routes: (app) ->\n\n      # Handle results consistently and DRY\n      cSend: (res, next) ->\n        (e, r) =>\n          if @logging then $log 'cSend', e, r\n          if e && e.status then return res.send(400, e)\n          if e then return next e\n          res.send r\n\n      # AirPair Api middleware\n      ap: (req, res, next) =>\n        # Instantiate business layer service with user context\n        @svc = new @Svc req.user\n\n        # Create the callback to send the response\n        @cbSend = @cSend res, next\n    \n        # dump info about the request if logging is on\n        if @logging\n          console.log req.url, req.body\n\n        # finally, call next callback in the middleware chain\n        next()\n\n      # Default http operations\n      create: (req) => @svc.create req.body, @cbSend\n      list: (req) => @svc.getAll @cbSend\n      detail: (req) => @svc.getById req.params.id, @cbSend\n\n\n\n<!--?prettify lang=coffeescript linenums=true?-->    \n\n    class WorkshopsApi extends require('./_api')\n\n      Svc: require './../services/workshops'\n\n      routes: (app) ->\n        app.post  \"/adm/workshop\", @ap, @create\n        app.get  \"/adm/workshop\", @ap, @list\n        app.get  \"/adm/workshop/:id\", @ap, @detail\n\n\n\n## 3 CoffeeScript to ES6 Tips\n\nThe following lessons are by no means an exhaustive or perfected discussion. Just what I learned mucking around today and where my knowledge is at.\n\n### 3.1 Arrow Functions\n\nES6 JavaScript has no thin arrow function `->`. Essentially, CoffeeScript `->` == ES6 `=>`. There is no equivalent CoffeScript fat arrow function, and if you got lazy like me, you're going to have to change a lot if you're coming back from the dark side.\n\n![Dark Side Cat](//www.starwarscats.com/wp-content/uploads/2013/01/darth-vader-cat.jpg) \n\nThe other gotchas, that you'll get used to in a couple of days are (1) needing braces around multi-line functions (e.g. line 2 and 10 + line 4 and 9), and (2) remembering to use the `return` keyword.\n\n<!--?prettify lang=javascript linenums=true?-->   \n    \n    cbSend(fn) {\n      return (req, res, next) => {\n        $log('inner.req', req)\n        fn( (e , r) => {\n          if (logging) { $log('cbSend', e, r) }\n          if (e && e.status) { return res.send(400, e) }\n          if (e) { return next(e) }\n          res.send(r)\n        })\n      }\n    }\n\nYou also might get initially tripped up on the function syntax in-side of classes.\n\n<!--?prettify lang=javascript linenums=true?-->   \n\n    // normal es6 function\n    cbSend = (fn) => {\n      ...\n    }\n    \n    // function definition in a class\n    cbSend(fn) {\n      ...\n    }\n\n### 3.2 ES6 Destructuring Assignment\n\nES6 Destructuring Assignment has a bit more going on than CoffeeScript Descructuring Assignment. For example you can use it to Destructure arrays. Largely you can use it almost the same. Though I found two Gotchas today. (1) you need to start using the var keyword.\n\n<!--?prettify lang=javascript linenums=true?-->   \n\n    // Doesn't work\n    {body,params} = req\n    \n    // Works\n    var {body,params} = req\n\n(2) ES6 Destructuring Assignment returns `undefined` when attributes on an object don't exist, where CoffeScript Destructuring Assignment returns `null`\n\n\n### 3.3 ES6 Classes\n\nThis is as far as I got with converting my classes. I'm seriously wondering if I need to embrace functional programming and move away from Object inheritance after all these years.\n\nI've gone ahead and commented the differences in-line. But the main limitation is no longer being able to think of everything inside your class sharing the same `this` context. It's a really bit deal, be prepared!\n\n<!--?prettify lang=javascript linenums=true?-->   \n\n    // Put logging on outer scope because 'this' isn't necessarily\n    // available from one class function to the next\n    var logging = false\n\n    class BaseApi {\n      \n      constructor(app) {\n        this.routes(app)\n      }\n\n      routes(app) { $log('override in child class') }\n\n      // A bit more complicated than coffee version because we\n      // Can't cheat with this context\n      cbSend(fn) {\n        return (req, res, next) => {\n          fn( (e , r) => {\n            if (logging) { $log('cbSend', e, r) }\n            if (e && e.status) { return res.send(400, e) }\n            if (e) { return next(e) }\n            res.send(r)\n          })\n        }\n      }\n\n    }\n\n<!--?prettify lang=javascript linenums=true?-->   \n\n    import WorkshopsService from '../services/workshops'\n\n    class WorkshopsApi extends BaseApi {\n\n      // Need to define child constructor and call super because\n      // we don't have class attributes like ln 3 in Coffee Version\n      constructor(app) {\n        var user = null // haven't yet figured out how to get user off req\n        this.Svc = new WorkshopsService(user)\n        super(app)\n      }\n\n      routes(app) {\n        app.get( '/workshops/', this.list(this) )\n        app.get( '/workshops/:slug', this.detail(this) )\n      }\n\n      //-- We have to pass self, as 'this' is taken from middleware chain\n      list(self) {\n        return self.cbSend( self.svc.getAll )\n      }\n\n      //-- Didn't figure this a nice was to do detail yet :{}\n      detail(self) {\n        return (req, res, next) => {\n          var slug = req.params.slug\n          self.svc.getBySlug(slug, (e , r) => {\n            if (e && e.status) { return res.send(400, e) }\n            if (e) { return next(e) }\n            res.send(r)\n          })\n        }    \n      }\n    }\n\n\n### 4 Summary\n\nTo be honest, I don't know if I'm missing a few bits of knowledge to make this awesome, or if what I'm trying to do was a waste of time from the start. I probably should have just build this whole piece with an AirPair and saved my Dark Kat coming out.",
    "meta" : {
        "title" : "Migrating CoffeeScript to ES6 JavaScript",
        "canonical" : "http://www.airpair.com/coffeescript/posts/migrating-coffeescript-to-es6-javascript",
        "ogTitle" : "Migrating CoffeeScript to ES6 JavaScript",
        "ogImage" : "http://img.youtube.com/vi/http://i.huffpost.com/gen/1164240/thumbs/o-GRUMPY-CAT-MOVIE-facebook.jpg/hqdefault.jpg",
        "ogVideo" : "https://www.youtube-nocookie.com/v/http://i.huffpost.com/gen/1164240/thumbs/o-GRUMPY-CAT-MOVIE-facebook.jpg",
        "ogUrl" : "http://www.airpair.com/coffeescript/posts/migrating-coffeescript-to-es6-javascript",
        "description" : "Tips and tricks for moving from CoffeeScript to ES6"
    },
    "published" : moment("2014-09-04T17:20:11.879Z").toDate(),
    "publishedBy" : "5181d1f666a6f999a465f280",
    "slug" : "migrating-coffeescript-to-es6-javascript",
    "tags" : [
        {
            "_id" : "514825fa2a26ea0200000011",
            "name" : "coffeescript",
            "slug" : "coffeescript"
        }
    ],
    "title" : "Migrating CoffeeScript to ES6 JavaScript",
    "updated" : "2014-09-23T19:15:34.035Z"
  },

  mmTopAngMistakes: {
    "_id" : ObjectId("542a10acbd2ea80b00298887"),
    "assetUrl" : "//i.imgur.com/nyJL47d.jpg",
    "by" : {
        "name" : "Mark Meyer",
        "avatar" : "//0.gravatar.com/avatar/6c2f0695e0ca4445a223ce325c7fb970",
        "gh" : "nuclearghost",
        "so" : "/users/693854/nuclearghost",
        "tw" : "NuclearGhost",
        "gp" : "102982205689616896638",
        "bio" : "Mark Meyer is a full stack software developer with over a year of production angular.js experience. Mark is a polyglot with experience ranging from building server apps in C to web applications in Rails to iOS applications in Swift.",
        "userId" : ObjectId("52f161801c67d1a4859d1ef7")
    },
    "created" : ISODate("2014-09-30T02:08:44.303Z"),
    "meta" : {
        "title" : "10 Top Mistakes AngularJS Developers Make",
        "canonical" : "http://www.airpair.com/angularjs/posts/top-10-mistakes-angularjs-developers-make",
        "ogType" : "article",
        "ogTitle" : "10 Top Mistakes AngularJS Developers Make",
        "ogVideo" : null,
        "ogUrl" : "http://www.airpair.com/angularjs/posts/top-10-mistakes-angularjs-developers-make",
        "ogImage" : "https://i.imgur.com/nyJL47d.jpg",
        "description" : "AngularJS expert Mark Meyer runs down the top 10 mistakes made by AngularJS developers, from code organization to bloated controllers."
    },
    "published" : ISODate("2014-10-01T22:02:35.113Z"),
    "publishedBy" : ObjectId("54207c948f8c80299bcc4840"),
    "slug" : "top-10-mistakes-angularjs-developers-make",
    "tags" : [
        {
            "_id" : ObjectId("5149dccb5fc6390200000013"),
            "name" : "AngularJS",
            "slug" : "angularjs"
        }
    ],
    "title" : "The Top 10 Mistakes AngularJS Developers Make",
    "updated" : ISODate("2014-11-19T00:00:37.530Z")
  },

  sessionDeepDive: {
    "_id" : "541a36c3535a850b00b05697",
    "__v" : 0,
    "assetUrl" : "https://airpair.github.io/img/2014/10/passportjs.png",
    "by" : {
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "avatar" : "//0.gravatar.com/avatar/19183084115c4a79d34cdc3110adef37",
        "twitter" : {},
        "stack" : {},
        "name" : "Jonathon Kresner",
        "linkedin" : {},
        "google" : {},
        "github" : {},
        "bitbucket" : {},
        "bio" : "Jonathon Kresner is AirPair's CEO and Founder. He conceived AirPair to help developers build ideas faster and stay un-stuck. He's decided to put AirPair to the test, by rebuilding airpair.com from scratch in 90 days with daily help from the best AngularJS, NodeJS and MongoDB experts on the web.",
        "username" : "hackerpreneur"
    },
    "created" : "2014-09-18T01:34:59.747Z",
    "md" : "## 1 Stuck on ExpressJS Middleware\n\nI'm excited to write this post because I was stuck for 6 hours on middleware issues while settings up PassportJS. I wish I could have accessed the right expert, but AirPair hasn't yet scaled to be quick enough in many niche cases like this one. In an ironically good way, my frustrations reminded me how important our mission is. Thousands like myself get stuck daily. Saving people time is AirPair's mission and one day soon, we'll be able connect you with the right person for ANYTHING in less than half an hour. \n\nUntil then, if you're setting up a new app with PassportJS, I hope this post helps. There's lots of good stuff in here. The main take away is to watch out for is **the order you add ExpressJS Middleware** to your app. As I'll cover more than once below, a tiny swap in middleware order can have HUGE consequences.\n\n## 2 Understanding ExpressJS & PassportJS\n\nThough I've setup ExpressJS and PassportJS before, in the old airpair.com app, I didn't deeply understand each. There are currently some 10,000,000 active session documents in the old app's MongoDB instance, which is obviously not right. Luckily it hasn't effected us in a material way, but I'm sure it would eventually. So I spent some time observing how Express and PassportJS plug into each other, here's what I learned on the way to uncovering what was going wrong.\n\n### 2.1 There is only One Session\n\nAs [per the passport docs](http://passportjs.org/guide/configure/) configuring Passport looks something like this:\n\n<!--?prettify lang=javascript linenums=false?-->\n\n    app.configure(function() {\n      app.use(express.static('public'));\n      app.use(express.cookieParser());\n      app.use(express.bodyParser());\n      app.use(express.session({ secret: 'keyboard cat' }));\n      app.use(passport.initialize());\n      app.use(passport.session());\n      app.use(app.router);\n    });\n\nThe syntax is a bit misleading I think... The first thing to conceptually get your head around is that even though you configure `express.session()` and`passport.session()`, there is really only one session, which is managed by Express. Passport merely piggy backs off the ExpressJS session to store data for authenticated users. Let's take a look.\n\n### 2.2 Express `req.session`\n\n`req.session` is just a json object that gets persisted by the `express-session` middleware, using a store of your choice e.g. Mongo or Redis. Logging to the terminal, you'll see a default session object looks something like:\n\n<!--?prettify lang=javascript linenums=false?-->\n\n    req.session = { cookie: \n      { path: '/',\n        _expires: Thu Nov 07 2014 09:39:45 GMT-0700 (PDT),\n        originalMaxAge: 100000,\n        httpOnly: true } }\n\nIf you open up your persistence store and look at the documents, you'll see the req.session object is an attribute of the the entire document that also comes with an `id` and `expires` attribute.\n\n<!--?prettify lang=javascript linenums=false?-->\n\n    {\n        _id : \"svZGs99EIvDkwW_60PRwlafU9Y_7_m-N\",\n        session : { cookie:{originalMaxAge:100000,expires:\"2014-11-07T02:11:16.320Z\",httpOnly:true,path:\"/\"},\n        expires : ISODate(\"2014-11-07T02:11:16.320Z\")\n    }\n\nExpress stuffs the id of the session object into a cookie on the clients browser, which gets passed back to express in a header on every request. This is how express identifies multiple requests as belonging to a single session even if they're not a logged in user. With the id from the cookie header, express reads the session store and puts all the info onto req.session, available for you on each request.\n\n### 2.3 Harnessing `req.session` yourself\n\nYou can stuff anything you like onto the req.session object and express will persist it automatically back to the session store for a given session (unique id). for example if a user can't access a page because they are not logged in, airpair.com uses a custom made up attribute called `return_to` to direct the user to the right page after login. \n\n<!--?prettify lang=javascript linenums=true?-->\n\n    { cookie: \n      { path: '/',\n        _expires: Thu Oct 09 2014 09:39:45 GMT-0700 (PDT),\n        originalMaxAge: 100000,\n        httpOnly: true },\n        passport: { user: { _id: '5175efbfa3802cc4d5a5e6ed' } },\n        return_to: '/workshops' }\n\nIt's worth noting, if you can conceptualize now that you can put anything you want into an anonymous session, so long as you can correlate an anonymous session to a user in your database on login or signup, you can start persisting info for a user even though you don't know who they are straight away. You will see some cool interactions for anonymous users on airpair.com coming in the next month or two.\n\n### 2.4 Passport also harnesses `req.session`\n\nAs you can see above on line 6 in the code snippet above, using the `passport` attribute, PassportJS also uses the session object to keep track of a logged in user  associated with a given session. \n\nIt then uses the deserializeUser function which receives the req.session.passport.user object as it's first parameter, and as the default behavior suggested in the PassportJS documentation, makes an additional read to your persistence store to retrieve the user object associated with the userId.\n\n<!--?prettify lang=javascript linenums=false?-->\n\n    passport.serializeUser(function(user, done) {\n      done(null, user.id);\n    });\n\n    passport.deserializeUser(function(id, done) {\n      User.findById(id, function(err, user) {\n        done(err, user);\n    });\n\n#### 2.4.1 Passport `req.user`\n\n`req.user` is a PassportJS specific property that is the result of the `deserializeUser` function using the data from `req.session.passport.user`\n\n#### 2.4.2 Optimization 1\n\nI realized that in the old app, we followed the default suggestion and were hitting the database twice on every single API call to populate all the users' information in memory. But in practice, we rarely needed more than the userId in our backend code. So this time round, I've made the decision to stuff the name and email into the session object and avoid making multiple database trips on every single api call. With many pages on the site making 5-10 calls to render a single page, this seemed like a cheap way to significantly reduce database load. Here's what the new app looks like:\n\n<!--?prettify lang=javascript linenums=false?-->\n\n    passport.serializeUser( (user, done) => {\n      var sessionUser = { _id: user._id, name: user.name, email: user.email, roles: user.roles }\n      done(null, sessionUser)\n    })\n\n    passport.deserializeUser( (sessionUser, done) => {\n      // The sessionUser object is different from the user mongoose collection\n      // it's actually req.session.passport.user and comes from the session collection\n      done(null, sessionUser)\n    })\n\n### 2.5 When are sessions created?\n\nExpress will create a new session (and write it to the database), whenever it does not detect a session cookie. Turns out, the order you set the session middleware and tell express where your static directory is, has some pretty dramatic nuances. Here's what the new AirPair index.js looks like:\n\n<!--?prettify lang=javascript linenums=false?-->\n\n    var express = require('express')\n    var app = express()\n\t\n    //-- We don't want to serve sessions for static resources\n    //-- Save database write on every resources\n    app.use(express.static(config.appdir+'/public'))\n\n    mongo.connect()\n    session(app, mongo.initSessionStore)\n\n    //-- Do not move connect-livereload before session middleware\n    if (config.livereload) app.use(require('connect-livereload')({ port: 35729 }))\n\t\n    hbsEngine.init(app)\n    routes.init(app)\t\n    app.listen(config.port, function() {})\n\n#### 2.5.1 Optimization 2\n\nTurns out, if you add the session middleware before your static directory, Express with generate sessions for requests on static files like .css, images and JavaScript. \n\nIf a new visitor without a session loads a page with 10 static files, the clients browser will not yet have a cookie and will send 10 cookieless requests all triggering express to create sessions. Owch! So that's what was happening... If you haven't done something smart to detect bots and scrapers, things can blow out pretty quickly!\n\nSimply put your static files first, or even better on a CDN that has nothing to do with your node app and your session collection should stay much healthier.\n\n### 2.6 ExpressJS 4.0 Middleware Order\n\nThe middleware setup for ExpressJS 4.0 is quite different from ExpressJS 3.0 where everything came baked in. You now need to include each piece manually with it's own NPM package. In case you want to see an up to date version of how each  piece is chained together, because there are many non-working legacy examples floating around, this is what I ended up with.\n\nCouple of gotchas that sunk half an hour or so for me, include that Cookie Parser now requires a secret and Body Parser required and Extend Url.\n\n<!--?prettify lang=javascript linenums=false?-->\n\n    // Passport does not directly manage your session, it only uses the session.\n    // So you configure session attributes (e.g. life of your session) via express\n    var sessionOpts = {\n      saveUninitialized: true, // saved new sessions\n      resave: false, // do not automatically write to the session store\n      store: sessionStore,\n      secret: config.session.secret,\n      cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires\n    }\n\n    app.use(bodyParser.json())\n    app.use(bodyParser.urlencoded({extended: true}))\n    app.use(cookieParser(config.session.secret))\n    app.use(session(sessionOpts))\n\n    app.use(passport.initialize())\n    app.use(passport.session())\n\n\n## 3 The AHA! Damn freaking live-reload\n\nSo it turns out, the problem that held me up was the position of the live-reload middleware. LiveReload injects script into every response to listen for changes emitted from the server. I don't know the exact issue, but having it before the session middleware, broke the session cookie being sent correctly to the client.\n\n## Conclusion\n\nI'm glad I took the time to dive deep with Express and Passport for the new airpair.com site. A few tweaks have lead to significantly less database traffic and my deepening understanding of how to utilize req.session will empower us to build some cool interactions and personalization for anonymous visitors.",
    "meta" : {
        "title" : "ExpressJS and PassportJS Sessions Deep Dive",
        "canonical" : "http://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive",
        "ogType" : "article",
        "ogTitle" : "ExpressJS and PassportJS Sessions Deep Dive",
        "ogVideo" : null,
        "ogUrl" : "http://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive",
        "description" : "Misunderstanding ExpressJS Sessions and how PassportJS works can lead to millions of un-necessary database reads and writes. This deep time will keep you out of trouble.",
        "ogDescription" : "Misunderstanding ExpressJS Sessions and how PassportJS works can lead to millions of un-necessary database reads and writes. This deep time will keep you out of trouble.",
        "ogImage" : "http://airpair.github.io/img/2014/10/passportjs.png"
    },
    "published" : moment("2014-09-23T19:17:23.161Z").toDate(),
    "publishedBy" : "5175efbfa3802cc4d5a5e6ed",
    "slug" : "expressjs-and-passportjs-sessions-deep-dive",
    "tags" : [
        {
            "_id" : "514825fa2a26ea0200000016",
            "name" : "ExpressJS",
            "slug" : "express"
        },
        {
            "_id" : "5181e12e66a6f999a465f282",
            "name" : "passport",
            "slug" : "passport"
        }
    ],
    "title" : "ExpressJS and PassportJS Sessions Deep Dive",
    "updated" : "2014-10-16T14:26:46.408Z"
  },

  sessionDeepDive2: {
    "_id" : "541a36c3535a850b00b05698",
    "assetUrl" : "https://airpair.github.io/img/2014/10/passportjs.png",
    "by" : {
        "userId" : "5175efbfa3802cc4d5a5e6ed",
        "avatar" : "//0.gravatar.com/avatar/19183084115c4a79d34cdc3110adef37",
        "twitter" : {},
        "stack" : {},
        "name" : "Jonathon Kresner",
        "linkedin" : {},
        "google" : {},
        "github" : {},
        "bitbucket" : {},
        "bio" : "Jonathon Kresner is AirPair's CEO and Founder. He conceived AirPair to help developers build ideas faster and stay un-stuck. He's decided to put AirPair to the test, by rebuilding airpair.com from scratch in 90 days with daily help from the best AngularJS, NodeJS and MongoDB experts on the web.",
        "username" : "hackerpreneur"
    },
    "created" : "2014-09-19T01:34:59.747Z",
    "md" : "## Test",
    "meta" : {
        "title" : "ExpressJS and PassportJS Sessions Deep Dive",
        "canonical" : "http://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive",
        "ogType" : "article",
        "ogTitle" : "ExpressJS and PassportJS Sessions Deep Dive",
        "ogVideo" : null,
        "ogUrl" : "http://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive",
        "description" : "Misunderstanding ExpressJS Sessions and how PassportJS works can lead to millions of un-necessary database reads and writes. This deep time will keep you out of trouble.",
        "ogDescription" : "Misunderstanding ExpressJS Sessions and how PassportJS works can lead to millions of un-necessary database reads and writes. This deep time will keep you out of trouble.",
        "ogImage" : "http://airpair.github.io/img/2014/10/passportjs.png"
    },
    "published" : moment("2014-09-24T19:17:23.161Z").toDate(),
    "publishedBy" : "5175efbfa3802cc4d5a5e6ed",
    "slug" : "test-post",
    "tags" : [
        {
            "_id" : "5181e12e66a6f999a465f282",
            "name" : "passport",
            "slug" : "passport"
        }
    ],
    "title" : "PassportJS Sessions Deep Dive",
    "updated" : "2014-10-16T14:26:46.408Z"
  },


  submittedWithGitRepo: {
    "_id" : "54f3a1004da2eed243659cea",
    "title" : "Submit success with connected github 1425252608",
    "md" : "Submit with github stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff ",
    "publishHistory" : [],
    "editHistory" : [
        {
            "action" : "createByAuthor",
            "utc" : "2015-03-01T23:30:08.567Z",
            "_id" : "54f3a1004da2eed243659ceb",
            "by" : {
                "_id" : "54f3a1004da2eed243659ce9",
                "name" : "Robot21425252608"
            }
        },
        {
            "action" : "updateMarkdownByAuthor",
            "utc" : "2015-03-01T23:30:08.581Z",
            "_id" : "54f3a1004da2eed243659cec",
            "by" : {
                "_id" : "54f3a1004da2eed243659ce9",
                "name" : "Robot21425252608"
            }
        },
        {
            "action" : "updateByAuthor",
            "utc" : "2015-03-01T23:30:08.587Z",
            "_id" : "54f3a1004da2eed243659ced",
            "by" : {
                "_id" : "54f3a1004da2eed243659ce9",
                "name" : "Robot21425252608"
            }
        },
        {
            "action" : "submittedForReview",
            "utc" : "2015-03-01T23:30:15.010Z",
            "_id" : "54f3a1074da2eed243659cee",
            "by" : {
                "_id" : "54f3a1004da2eed243659ce9",
                "name" : "Robot21425252608"
            }
        }
    ],
    "tags" : [
        {
            "_id" : "5149dccb5fc6390200000013",
            "name" : "AngularJS",
            "slug" : "angularjs"
        },
        {
            "_id" : "514825fa2a26ea0200000028",
            "name" : "Node.JS",
            "slug" : "node.js"
        }
    ],
    "forkers" : [],
    "reviews" : [],
    "updated" : "2015-03-01T23:30:15.010Z",
    "lastTouch" : {
        "action" : "submittedForReview",
        "utc" : "2015-03-01T23:30:15.010Z",
        "by" : {
            "_id" : "54f3a1004da2eed243659ce9",
            "name" : "Robot21425252608"
        }
    },
    "created" : "2015-03-01T23:30:08.567Z",
    "by" : {
        "userId" : "54f3a1004da2eed243659ce9",
        "name" : "Robot21425252608",
        "avatar" : "//0.gravatar.com/avatar/0ed7c2028f1139e9a9d1a4a5a3187818",
        "bio": "Weird"
    },
    "assetUrl" : "http://youtu.be/qlOAbrvjMBo",
    "submitted" : "2015-03-01T23:30:15.010Z",
    "github" : {
        "repoInfo" : {
            "url" : "https://github.com/JustASimpleTestOrg/submit-success-with-connected-github-1425252608",
            "authorTeamId" : 1332852,
            "authorTeamName" : "submit-success-with-connected-github-1425252608-43659cea-author",
            "author" : "airpairtest1"
        }
    },
    "slug" : "submit-success-with-connected-github-1425252608",
    "meta" : {
        "ogImage" : "http://youtu.be/qlOAbrvjMBo"
    }
  },

  toSync: {
    "_id" : "54f3a2300097ad294530014a",
    "title" : "Submit success with connected github 1425252912",
    "md" : "Submit with github stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff  stuff ",
    "publishHistory" : [],
    "editHistory" : [
        {
            "action" : "createByAuthor",
            "utc" : "2015-03-01T23:35:12.099Z",
            "_id" : "54f3a2300097ad294530014b",
            "by" : {
                "_id" : "54f3a2300097ad2945300149",
                "name" : "Robot21425252912"
            }
        },
        {
            "action" : "updateMarkdownByAuthor",
            "utc" : "2015-03-01T23:35:12.112Z",
            "_id" : "54f3a2300097ad294530014c",
            "by" : {
                "_id" : "54f3a2300097ad2945300149",
                "name" : "Robot21425252912"
            }
        },
        {
            "action" : "updateByAuthor",
            "utc" : "2015-03-01T23:35:12.119Z",
            "_id" : "54f3a2300097ad294530014d",
            "by" : {
                "_id" : "54f3a2300097ad2945300149",
                "name" : "Robot21425252912"
            }
        },
        {
            "action" : "submittedForReview",
            "utc" : "2015-03-01T23:35:16.816Z",
            "_id" : "54f3a2340097ad294530014e",
            "by" : {
                "_id" : "54f3a2300097ad2945300149",
                "name" : "Robot21425252912"
            }
        }
    ],
    "tags" : [
        { "_id" : "5149dccb5fc6390200000013", "name" : "AngularJS", "slug" : "angularjs" }
    ],
    "forkers" : [],
    "reviews" : [],
    "updated" : "2015-03-01T23:35:16.816Z",
    "lastTouch" : {
        "action" : "submittedForReview",
        "utc" : "2015-03-01T23:35:16.816Z",
        "by" : {
            "_id" : "54f3a2300097ad2945300149",
            "name" : "Robot21425252912"
        }
    },
    "created" : "2015-03-01T23:35:12.099Z",
    "by" : {
        "userId" : "54f3a2300097ad2945300149",
        "name" : "Robot21425252912",
        "avatar" : "//0.gravatar.com/avatar/c7f44ac09e4443605c958ebb2be27488",
        "bio": "I wonder"
    },
    "assetUrl" : "http://youtu.be/qlOAbrvjMBo",
    "submitted" : "2015-03-01T23:35:16.816Z",
    "github" : {
        "repoInfo" : {
            "url" : "https://github.com/JustASimpleTestOrg/submit-success-with-connected-github-1425252912",
            "authorTeamId" : 1332858,
            "authorTeamName" : "submit-success-with-connected-github-1425252912-4530014a-author",
            "author" : "airpairtest1"
        }
    },
    "slug" : "submit-success-with-connected-github-1425252912"
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
    "meta" : {
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
