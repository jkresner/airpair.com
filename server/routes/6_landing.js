module.exports = function(app, mw) {

  if (config.env != 'dev')
    cache.workshops = require('../services/workshops').getAllForCache()

  var Id = DAL.User.toId

  cache.landing = {
    home: {
      _id: Id("5706abc347ba64cb164bec06"),
      key: 'home',
      url: '/',
      htmlHead: {
        title: "airpair | Coding help, Software consultants & Programming resources",
        description: ""
      },
    },
    comp2015: {
      _id: Id('54c937cc85e52c93f2c72bf4'),
      key: 'comp2015',
      url: '/100k-writing-competition',
      title: 'AirPair 2015 Writing Comp',
      launched: 'Mon Feb 2 2015 11:00:00 GMT-0800 (PST)',
      htmlHead: {
        title: 'Fork Up! AirPair\'s $100,000.00 Git-Powered Developer Writing Competition',
        description: 'AirPair has released a set of new Github API powered publishing tools. To celebrate, AirPair is distributing over $100k in cash prizes to the best posts submitted before May 30th, 2015.',
        canonical: 'https://www.airpair.com/100k-writing-competition',
        ogType: 'article',
        ogTitle: 'Fork Up! AirPair\'s $100,000.00 Git-Powered Developer Writing Competition',
        ogDescription: 'AirPair has released a set of new Github API powered publishing tools. To celebrate, AirPair is distributing over $100k in cash prizes to the best posts submitted before May 30th, 2015.',
        ogImage: 'https://www.airpair.com/static/img/pages/postscomp/og.png',
        css: ['2015/css/libs-279957f0b8','2015/comp/app'].map(url => `${config.http.static.host}/${url}.css`),
      },
      prizes: {
        sponsor: [{"title":"How to Create a Complete Express.js + Node.js + MongoDB CRUD and REST Skeleton","url":"/javascript/complete-expressjs-nodejs-mongodb-crud-skeleton","tileImg":"https://imgur.com/hOet7yT.jpg","reviews":21,"rating":4.619047619047619,"prize":"Most popular MongoDB post","logo":"logo-mongodb","sponsor":"mongodb","by":"Kendrick Coleman","avatar":"//0.gravatar.com/avatar/35be3035ef163a6ec0a87136fb622ce8"},{"title":"Guide to automating a multi-tiered application securely on AWS with Docker and Terraform","url":"/aws/posts/ntiered-aws-docker-terraform-guide","tileImg":"https://imgur.com/EQYaw5k.jpg","reviews":20,"rating":4.7,"prize":"Most popular Terraform post","logo":"logo-terraform","sponsor":"hashicorp","by":"Greg Osuri","avatar":"//0.gravatar.com/avatar/9c6165b107059ea5dfa2e81985fe8272"},{"title":"Location Based Content With a MEAN Stack and Contentful","url":"/javascript/posts/location-based-content-with-mean-and-contentful","tileImg":"https://i.imgur.com/vj92vYS.png","reviews":13,"rating":4.615384615384615,"prize":"Most popular Contentful post","logo":"logo-contentful","sponsor":"contentful","by":"Rich Cooper","avatar":"//0.gravatar.com/avatar/f9d6b0e1c032050c2187889edf9c42de"},{"title":"The painful journey of painless deployments","url":"/docker/posts/the-painful-journey-of-painless-deployments","tileImg":"https://s3-us-west-2.amazonaws.com/deployment-article/images/feature_media.png","reviews":12,"rating":4.75,"prize":"Best Show & Tell with Neo4j Production","logo":"logo-neo4j","sponsor":"neo4j","by":"Matthias Sieber","avatar":"//0.gravatar.com/avatar/00f29cbe5cf7c958ef9cea54912f3308"},{"title":"Switching from native iOS to Ionic: Why Hybrid doesn't suck (anymore)","url":"/javascript/posts/switching-from-ios-to-ionic","tileImg":"https://i.imgur.com/ZRmzznn.png?1","reviews":9,"rating":4.333333333333333,"prize":"Most popular Ionic Framework post","logo":"logo-ionic","sponsor":"ionic","by":"Simon Reimler","avatar":"//0.gravatar.com/avatar/5c899b631c8ad629ef9b738de1b101b4"},{"title":"Installing  and Configuring Kubernetes on CoreOS","url":"/docker/posts/installing-and-configuring-kubernetes-on-coreos","tileImg":"https://cloud.githubusercontent.com/assets/93077/8641159/56364884-28dd-11e5-990d-d62e8f6d0f20.jpg","reviews":8,"rating":4.5,"prize":"Best post on etcd","logo":"logo-etcd","sponsor":"coreos","by":"Dale-Kurt Murray","avatar":"//0.gravatar.com/avatar/d8f8c1855ffd0e993975350e8143ade4"},{"title":"Getting Started with Event Data and Keen.io","url":"/keen-io/posts/getting-started-with-event-data-and-keenio","tileImg":"https://raw.githubusercontent.com/markoshust/keen-getting-started/master/images/banner.png","reviews":7,"rating":4.714285714285714,"prize":"Best Getting Started with Keen.io Tutorial","logo":"logo-keen-io","sponsor":"keen-io","by":"Mark Shust","avatar":"//0.gravatar.com/avatar/629e02775edcd45a977043101698818a"},{"title":"Upload Camera Images To Firebase Using Ionic Framework","url":"/ionic-framework/posts/ionic-firebase-camera-app","tileImg":"https://img.youtube.com/vi/uvPlTzZxFcI/hqdefault.jpg","reviews":6,"rating":5,"prize":"Most popular Firebase post","logo":"logo-firebase","sponsor":"firebase","by":"Nic Raboy","avatar":"//0.gravatar.com/avatar/7d55990e9cc9544ca2f435aa3a690490"},{"title":"Making Phil Libin style cohort visualizations available to everyone","url":"/keen-io/posts/making-phil-libin-style-cohort-visualizations-available-to-everyone","tileImg":"//i.imgur.com/blzICNs.png","reviews":6,"rating":4.833333333333333,"prize":"Most popular Keen.io post","logo":"logo-keen-io","sponsor":"keen-io","by":"Ry Walker","avatar":"//0.gravatar.com/avatar/7cf61c7c25b97dd624c7beadfb202153"},{"title":"Scalable Architecture DR CoN: Docker, Registrator, Consul, Consul Template and Nginx","url":"/scalable-architecture-with-docker-consul-and-nginx","tileImg":"https://maorigeek.s3.amazonaws.com/uploads/docker_whale.png_1411805342.jpg_1421807584.jpg","reviews":6,"rating":4.5,"prize":"Most popular Consul post","logo":"logo-consul","sponsor":"hashicorp","by":"Graham Jenson","avatar":"//0.gravatar.com/avatar/7b9e77978853a15053b169abb710a787"},{"title":"Realtime AngularJS Pub/Sub Messaging using PubNub","url":"/pubnub/posts/realtime-angularjs-pubsub-messaging-using-pubnub1","tileImg":"//imgur.com/FwVh4nk.jpg","reviews":6,"rating":4.166666666666667,"prize":"Best Pubnub post","logo":"logo-pubnub","sponsor":"pubnub","by":"Joe Hanson","avatar":"//0.gravatar.com/avatar/8c0cdd0b06b3f4304bea152f266dbd4f"},{"title":"The Definitive Ionic Starter Guide","url":"/ionic-framework/posts/the-definitive-ionic-starter-guide","tileImg":"https://cdn.rawgit.com/ionic-in-action/ionicinaction/gh-pages/images/ionic-guide.png","reviews":5,"rating":4,"prize":"Best Getting Started with Ionic Tutorial","logo":"logo-ionic","sponsor":"ionic","by":"Jeremy Wilken","avatar":"//0.gravatar.com/avatar/1f1edef3d9797ce14e02aaf0d731d579"},{"title":"Making a dashboard with Keen IO + SendGrid's Event Webhook data","url":"/sendgrid/posts/making-a-dashboard-with-keen-io-sendgrid-events","tileImg":"https://dl.dropboxusercontent.com/u/1053748/keen-dashboard-airpair.png","reviews":4,"rating":5,"prize":"Best Show and Tell with SendGrid in Production","logo":"logo-sendgrid","sponsor":"sendgrid","by":"Heitor Tashiro Sergent","avatar":"//0.gravatar.com/avatar/10eef81625284e8299967a73960e860b"},{"title":"Using RethinkDB with ExpressJS","url":"/javascript/posts/using-rethinkdb-with-expressjs","tileImg":"https://img.youtube.com/vi/qKPKsBNw604/hqdefault.jpg","reviews":4,"rating":5,"prize":"Most popular RethinkDB post","logo":"logo-rethinkdb","sponsor":"rethinkdb","by":"Craig Walsh","avatar":"//0.gravatar.com/avatar/614efaac7418b17e7cd6076253bf3a28"},{"title":"The chemical wedding of RethinkDB and Node.js","url":"/javascript/posts/the-chemical-wedding-of-rethinkdb-and-nodejs","tileImg":"https://pbs.twimg.com/media/CBiX5wZUYAE1VXc.png","reviews":4,"rating":4.75,"prize":"Best Getting Started with RethinkDB","logo":"logo-rethinkdb","sponsor":"rethinkdb","by":"Alisson Cavalcante Agiani","avatar":"//0.gravatar.com/avatar/4894d144c853e9f839faa0d8bbcce20c"},{"title":"Using Braintree's v.zero SDK to accept payments","url":"/ruby/posts/using-braintrees-vzero-sdk-to-accept-payments","tileImg":"https://i.imgur.com/XsJeBQl.png","reviews":4,"rating":4.5,"prize":"Best Braintree post","logo":"logo-braintree","sponsor":"braintree","by":"Ryan Bigg","avatar":"//0.gravatar.com/avatar/be66f1ccc28a6a3dfb248454b8513b17"},{"title":"How We Integrated TrackDuck with Pivotal Tracker","url":"/api/posts/how-we-integrated-trackduck-with-pivotal-tracker","tileImg":"https://static.airpair.com/2015/comp/post-tile-pivotal-trackduck.png","reviews":4,"rating":4.5,"prize":"Most popular Tracker post","logo":"logo-pivotaltracker","sponsor":"pivotal","by":"Yauhen Ivashkevich","avatar":"//0.gravatar.com/avatar/e745e1b3f865366524d2794e8ea8d9e4"},{"title":"MongoDB: Advanced Administration, Monitoring and Backup","url":"/mongodb/posts/mongodb-advanced-administration-mon-and-backup","tileImg":"https://i.imgur.com/DlL1vTp.png","reviews":4,"rating":4,"prize":"Best coverage of New Features in MongoDB 3","logo":"logo-mongodb","sponsor":"mongodb","by":"Jeffrey Berger","avatar":"//0.gravatar.com/avatar/87811ab251ada226311e3c2d614f7cb5"},{"title":"Business Review Meetings with Developers ? What's Wrong !","url":"/devops/posts/business-review-meetings-with-developers","tileImg":"https://cloud.githubusercontent.com/assets/4088925/6907069/c2fbbb4a-d750-11e4-9184-f2691b50145e.png","reviews":4,"rating":3.75,"prize":"Best Mingle post","logo":"logo-thoughtworks","sponsor":"thoughtworks","by":"Rahat Khanna (mappmechanic)","avatar":"//0.gravatar.com/avatar/fc32c68209e5ca8e610f12da9ed91f6f"},{"title":"Build a real-time SMS call center with Data McFly and Twilio","url":"/javascript/posts/build-a-realtime-sms-call-center-with-data-mcfly-and-twilio","tileImg":"https://imgur.com/pZ8WqGS.png","reviews":3,"rating":4.333333333333333,"prize":"Most popular Twilio post","logo":"logo-twilio","sponsor":"twilio","by":"Roger Stringer","avatar":"//0.gravatar.com/avatar/9efb83cdb7f5ba4db3ca9c5f8f245956"},{"title":"A guide to design and develop a multi-tenant, secure and real time solution","url":"/firebase/posts/yatodo-guide","tileImg":"https://i.imgur.com/7o4xo9r.png","reviews":1,"rating":5,"prize":"Most popullar IronIO post","logo":"logo-ironio","sponsor":"ironio","by":"Kapil Sachdeva","avatar":"//0.gravatar.com/avatar/88b5f51f4b78e8450137418de26a1209"},{"title":"The essence of Spring Data Neo4j 4","url":"/neo4j/posts/the-essence-of-spring-data-neo4j-4","tileImg":"https://i.imgur.com/6KBXpE5.jpg","reviews":1,"rating":5,"prize":"Most popular Neo4j post","logo":"logo-neo4j","sponsor":"neo4j","by":"Luanne Misquitta","avatar":"//0.gravatar.com/avatar/9fafab68e922fdf068c5c36f823687fe"}],
        category: [{"title":"The mind-boggling universe of JavaScript Module strategies","url":"/javascript/posts/the-mind-boggling-universe-of-javascript-modules","tileImg":"https://openmerchantaccount.com/img/lego-adjusted.jpg","reviews":34,"rating":4.735294117647059,"prize":"Best Node.js post","logo":"node","by":"Tiago Romero Garcia","avatar":"//0.gravatar.com/avatar/5cac784a074b86d771fe768274f6860c"},{"title":"Create a Password Management App Using Ionic Framework and Firebase","url":"/ionic-framework/posts/ionic-firebase-password-manager","tileImg":"https://img.youtube.com/vi/RPR6xBSP85E/0.jpg","reviews":17,"rating":5,"prize":"Best iOS/swift post","logo":"swift","by":"Nic Raboy","avatar":"//0.gravatar.com/avatar/7d55990e9cc9544ca2f435aa3a690490"},{"title":"Efficient development workflow using Git submodules and Docker Compose","url":"/docker/posts/efficiant-development-workfow-using-git-submodules-and-docker-compose","tileImg":"https://i.imgur.com/Gn4wnE2.png","reviews":16,"rating":4.25,"prize":"Best DevOps post","logo":"devops","by":"Amine Mouafik","avatar":"//0.gravatar.com/avatar/acfa8cdc7dc7408f88d72e9c8e33bfe8"},{"title":"30 Days of Answers on Stack Overflow","url":"/stackoverflow/posts/30-days-of-answers-on-stack-overflow","tileImg":"//imgur.com/mcBivAN.png","reviews":15,"rating":4.6,"prize":"Best Community post","logo":"community","by":"Erik Gillespie","avatar":"//0.gravatar.com/avatar/77e0d1571ed8fd1f9249a01e7569db05"},{"title":"The Legend of Canvas","url":"/javascript/posts/the-legend-of-canvas","tileImg":"https://i.imgur.com/tNYYIMz.jpg","reviews":13,"rating":5,"prize":"Best Front-end post","logo":"frontend","by":"Rich McLaughlin","avatar":"//0.gravatar.com/avatar/05432e373cccd968574a630904fa0247"},{"title":"A Comprehensive Guide to moving from SQL to RethinkDB","url":"/rethinkdb/posts/moving-from-sql-to-rethinkdb","tileImg":"https://i.imgur.com/ZbBbpJq.png","reviews":13,"rating":5,"prize":"Best Database post","logo":"databases","by":"Gordon Dent","avatar":"//0.gravatar.com/avatar/d07fa6958eaeb0d98de9be51b219d0db"},{"title":"Animations in Ember.js with liquid-fire","url":"/ember.js/posts/animations-in-emberjs-with-liquidfire","tileImg":"https://i.imgur.com/nBTsPmc.png","reviews":10,"rating":4.7,"prize":"Best EmberJS post","logo":"ember","by":"Balint Erdi","avatar":"//0.gravatar.com/avatar/a4911c2072d2c07e17d79c47559b4767"},{"title":"Ruby on Rails - The Modular Way","url":"/ruby-on-rails/posts/ruby-on-rails-the-modular-way","tileImg":"https://s3-us-west-2.amazonaws.com/samurails-images/introduction-to-modularity-750x410.jpeg","reviews":9,"rating":4.555555555555555,"prize":"Best Ruby/Rails post","logo":"ruby","by":"Thibault Denizet","avatar":"//0.gravatar.com/avatar/a4c7568c667805461cb1cabccc8ababa"},{"title":"Optimizing Python - a Case Study","url":"/python/posts/optimizing-python-code","tileImg":"https://raw.githubusercontent.com/airpair/optimizing-python-code/edit/Speed%20Matters.png","reviews":6,"rating":4.333333333333333,"prize":"Best Python post","logo":"python","by":"Ryan Brown","avatar":"//0.gravatar.com/avatar/aab77cff0c4541b5cb8025d066af9071"},{"title":"React.js - A guide for Rails developers","url":"/reactjs/posts/reactjs-a-guide-for-rails-developers","tileImg":"https://i.imgur.com/UUHYW6o.png","reviews":3,"rating":4.666666666666667,"prize":"Best ReactJS post","logo":"reactjs","by":"Fernando Villalobos","avatar":"//0.gravatar.com/avatar/f3d872377f757084e22ab15b7955a73d"},{"title":"Production ready apps with Ionic Framework","url":"/ionic-framework/posts/production-ready-apps-with-ionic-framework","tileImg":"https://dl.dropboxusercontent.com/u/30873364/airpair/production-ready-apps-with-ionic.png","reviews":3,"rating":3,"prize":"Best Android post","logo":"android","by":"Agustin Haller","avatar":"//0.gravatar.com/avatar/dde0bc4c687c6dbe505ce8035e8ccd38"},{"title":"Unit testing AngularJS applications","url":"/angularjs/posts/unit-testing-angularjs-applications","tileImg":"https://i.imgur.com/YL1oJJt.png","reviews":2,"rating":5,"prize":"Best AngularJS post","logo":"angularjs","by":"Pablo Villoslada Puigcerber","avatar":"//0.gravatar.com/avatar/572f6a6a92530dffed7ecd7979cf261d"}]
      }
    },
    workshops: {
      _id: Id("5706abc347ba64cb164bec10"),
      key: 'workshops',
      url: '/workshops',
      htmlHead: { title: "Software Workshops, Webinars & Screencasts" },
      lineup: cache.workshops
    },
    posts: {
      _id: Id("5706abc347ba64cb164bec08"),
      key: 'posts',
      url: '/software-experts',
      htmlHead: { title: "Software Programming Guides and Tutorials from Top Software Experts and Consultants" }
    },
    tag: {
      _id: Id("5706abc347ba64cb164bec18"),
      key: 'tag',
      url: '/{{tagslug}}',
      htmlHead: {
        title: "$tag Programming Guides and Tutorials from Top $tag Developers and expert consultants",
        ogType: "technology",
      }
    }
  }



  mw.cache('inflateLanding', key => function(req, res, next) { next(null,
    assign(req.locals, { r:cache['landing'][key], htmlHead: cache['landing'][key].htmlHead } ) ) })


  var topTags = 'reactjs python javascript node.js ember.js keen-io rethinkdb ionic swift android ruby'.split(' ')

  function tagPageData(req, res, next) {
    var tag = cache.tagBySlug(req.params.tagslug||req.url.replace('/', ''))
    if (!tag) return next(assign(Error(`Not found ${req.originalUrl}`),{status:404}))
    var {title,canonical} = req.locals.r.htmlHead
    canonical = canonical || `https://www.airpair.com/posts/tag/${tag.slug}`
    req.locals.r.htmlHead = assign({}, req.locals.r.htmlHead, {
      title:title.replace('$tag',tag.name).replace('$tag',`${tag.short}`),
      canonical: topTags.indexOf(tag.slug) == -1 ? canonical : canonical.replace('/posts/tag','')
    })
    API.Posts.svc.getByTag(tag, (e,r) => next(e, assign(req.locals.r,tag,r,{url:req.originalUrl})))
  }


  var router = app.honey.Router('landing')
    .use(mw.$.livereload)
    .use([mw.$.badBot,mw.$.session,mw.$.reqFirst])
    .use([mw.$.trackLanding,mw.$.landingPage],{end:true})

    .get('/', mw.$.inflateLanding('home'),
      mw.res.forbid('home!anon', function({user}) { if (user) return 'authd' }, { redirect: req => '/home' }))

    .get('/software-experts', mw.$.inflateLanding('posts'),
      mw.$.cachedPublished, mw.$.inflateAds,
      (req, res, next) => next(null, assign(req.locals.r, cache.published)) )

    .get('/100k-writing-competition', mw.$.inflateLanding('comp2015'))

    .get(['/airconf','airconf2014','/workshops'],
      mw.$.inflateLanding('workshops'),
      mw.$.inflateAds)

    .get(`/posts/tag/:tagslug`, mw.$.cachedTags, mw.$.inflateLanding('tag'), tagPageData)

  topTags.forEach(slug => router.get(`/${slug}`, mw.$.cachedTags, mw.$.inflateLanding('tag'), tagPageData))



}

