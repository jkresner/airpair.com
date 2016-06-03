rules   = []
ok      = 0

testRedirect = (status, from, to) =>
  PAGE from, {status}, (res) =>
    txt = "#{if status is 301 then 'Moved Permanently' else 'Found'}. Redirecting to #{to}"
    expect(res).to.equal(txt)
    DONE() if rules.length is ++ok

perm_to = (map) =>
  rules = map
  testRedirect(301, rule[0], rule[1]) for rule in rules
temp_to = (map) =>
  rules = map
  testRedirect(302, rule[0], rule[1]) for rule in rules


rewrite = ->

  SKIP 'Cloudflare', -> perm_to [
    ['node.js/learn-nodejs-', '/node.js/learn-nodejs']
  ]


  IT 'Locally', -> perm_to [
    ['/static/img/pages/postscomp/prize-keen-io.png','/img/software/keen-io.png']
    ['/static/img/pages/postscomp/logo-android.png','/img/software/android.png']
    # ['/problem-solving','/pair-programming']
  ]

  IT 'EXTERNAL (sub-domain)', -> perm_to [
    ['/static/img/icons/so-white.png','https://static.airpair.com/img/icons/so-white.png']
    ['/static/img/icons/tw-white.png','https://static.airpair.com/img/icons/tw-white.png']
    ['/i.imgur.com/CmVIByr.png','https://i.imgur.com/CmVIByr.png']
    ['/imgur.com/bgLW1vi.jpg','https://i.imgur.com/bgLW1vi.jpg']
    ['/i.stack.imgur.com/JnpBV.png','https://i.imgur.com/JnpBV.png']
  ]


  IT 'Tags', -> perm_to [
    ['/posts/tag/angularjs', '/angularjs/posts']
    ['/posts/tag/javascript', '/javascript']
    ['/posts/tag/redis', '/redis']
    ['/posts/tag/sqlserver','/posts/tag/sql-server']
    ['/sqlserver','/sql-server']
    ['/firebase/posts/firebase-support-and-api-integration-help', '/firebase']
    ['/android/posts', '/android']
    ['/javascript/posts', '/javascript']
  ]


  IT 'DOTS', -> perm_to [
    ['/ruby-on-rails-4/posts/how-to-set-up-authentication-with-angularjs-and-ruby-on-rails...', '/ruby-on-rails-4/posts/how-to-set-up-authentication-with-angularjs-and-ruby-on-rails']
  ]

  IT 'WEIRD URLs', -> perm_to [
    ['/ionic-framework/posts/ionic-firebase-password-manager&q=Create_a_Password_Management_App_Using_Ionic_Framework_%E2%80%A6','/ionic-framework/posts/ionic-firebase-password-manager&q=Create_a_Password_Management_App_Using_Ionic_Framework_']
    ['/python/posts/top-mistakes-python-big-data-analytics&quot;', '/python/posts/top-mistakes-python-big-data-analytics']
    ['/android/android-camera-development"','/android/android-camera-development']
    # ['/ionic-framework/posts.','/ionic-framework/posts']
    # ['/ionic-framework/posts/%5C','/ionic-framework/posts/']
  ]

  IT 'API Pages', -> perm_to [
    ['/bit.ly', '/software-experts']
    ['/spotify', '/software-experts']
    ['/echo-nest', '/software-experts']
    ['/tokbox', '/software-experts']
    ['/hellosign', '/software-experts']
    ['/vero/posts/vero-support-and-api-integration-help', '/software-experts']
    ['/vero', '/software-experts']
    ['/flydata', '/software-experts']
    ['/twotap', '/software-experts']
    ['/sinch', '/software-experts']
    ['/human-api', '/software-experts']
    ['/human-api/posts/human-api-support-integration-help', '/software-experts']
  ]


moved301 = ->


  IT 'EXACT', -> perm_to [
    ['/airconf2014', '/workshops']
    ['/railsconf2014', '/ruby-on-rails']
    ['/author/jk', '/software-experts']
    ['/logout', '/auth/logout']
    ['/dashboard', '/home']
    ['/me', '/account']
    ['/javascript/javascript-performance-yehuda-katz','/javascript']
    ['/node_js','/node.js']
    ['/node','/node.js']
    ['/posts/tag/node','/node.js']
    ['/seo/node.js-nginx-wordpress-seo','/nginx']
    ['/android-camera/posts/the-ultimate-android-camera-development-guide','/android/android-camera-development']
  ]

  IT 'WILDCARD', -> perm_to [
    ['/author/jk', '/software-experts']
    ['/java/workshops', '/workshops']
    ['/android/workshops?utm_campaign=wilder', '/workshops?utm_campaign=wilder']
    ['/analytics/consultant-keen-io-api-integration-seb-insua?utm_source=twitter&utm_medium=social&utm_term=analytics-consultant&utm_content=seb-insua&utm_campaign=social-blast-mar','/keen-io?utm_source=twitter&utm_medium=social&utm_term=analytics-consultant&utm_content=seb-insua&utm_campaign=social-blast-mar']
    ['/mobile-checkout/mobile-checkout-expert-radu-spineanu?utm_source=twitter&utm_medium=social&utm_term=mobile-checkout-expert','/software-experts?utm_source=twitter&utm_medium=social&utm_term=mobile-checkout-expert']
    ['/email-optimization/email-optimization-expert-james-lamont?utm_source=twitter','/software-experts?utm_source=twitter']
    ['/airconf-promo/jescalan?utm_source=meetup&utm_medium=email&utm_term=expert&utm_content=jescalan&utm_campaign=airconf', '/software-experts?utm_source=meetup&utm_medium=email&utm_term=expert&utm_content=jescalan&utm_campaign=airconf']
  ]

  IT 'Alternate options', -> perm_to [
    ['/node.js/learn-node.js', '/node.js/learn-nodejs']
    ['/node.js/posts/learn-node.js', '/node.js/learn-nodejs']
    ['/node.js/posts/learn-nodejs', '/node.js/learn-nodejs']
  ]


  SKIP 'CAPS', -> perm_to [
    ['/Ruby', '/ruby']
  ]

  IT 'WEIRD CHARS', -> perm_to [
    ['/selenium/posts/selenium-tutorial-with-java).', '/selenium/posts/selenium-tutorial-with-java']
  ]

  SKIP 'Strange tags', -> perm_to [
    ['/c++', '/c++']
    ['/c#', '/c#']
  ]

postsredirects = ->

  IT 'Published post', -> perm_to [
    ['/posts/review/545ac3ec2826860b007801c4', 'http://www.airpair.com/js/javascript-framework-comparison']
  ]

  IT.skip 'Move to author.airpair', -> perm_to [
    # ['/posts/contributors/55e3705b0fa2cd11000e0cc5, 'stay on airpair.com?'
    # ['/posts/preview/5514559c5955b711004d652e', 'https://author.airpair.com/?submitted=55386de99778e11100f6d9e0']
    # ['/posts/me?submitted=55386de99778e11100f6d9e0', 'https://author.airpair.com/?submitted=55386de99778e11100f6d9e0']
  ]

moved302 = ->

  IT 'EXACT', -> temp_to [
    ['/about', '/']
    ['/blog', '/software-experts']
  ]


  IT 'ANON', -> temp_to [
    ['/account', '/login?returnTo=/account']
    ['/home', '/login?returnTo=/home']
    ['/requests', '/login?returnTo=/requests']
    ['/billing', '/login?returnTo=/billing']
    ['/bookings/12334', '/login?returnTo=/bookings/12334']
  ]

  IT 'AIRPAIR.me', -> temp_to [
    ['/me/joefiorini', '/javascript/emberjs-using-ember-cli']
    ['/me/ddavison','/selenium/posts/selenium-tutorial-with-java']
    ['/me/joefiorini','/javascript/emberjs-using-ember-cli']
    ['/me/tiagorg','/javascript/posts/the-mind-boggling-universe-of-javascript-modules']
    ['/me/gsans','/jasmine/posts/javascriptintegrating-jasmine-with-requirejs-amd']
    ['/me/arunr','/angularjs/posts/travel-app-in-2-hours']
    ['/me/marko','/java/posts/spring-streams-memory-efficiency']
    ['/me/hackerpreneur','/express/posts/expressjs-and-passportjs-sessions-deep-dive']
    ['/me/basarat','/typescript/expert-basarat']
    ['/me/ryansb','/python/posts/django-flask-pyramid']
    ['/me/mappmechanic','/angularjs/posts/build-a-real-time-hybrid-app-with-ionic-firebase']
    ['/me/larskotthoff','/javascript/posts/d3-force-layout-internals']
    ['/me/urish','/js/javascript-framework-comparison']
    ['/me/kn0tch','/aws/posts/ntiered-aws-docker-terraform-guide']
    ['/me/glockjt', '/node.js/posts/nodejs-framework-comparison-express-koa-hapi']
  ]


beforeEach ->
  ok = 0

DESCRIBE("Rewrite", rewrite)
DESCRIBE("POSTS", postsredirects)
DESCRIBE("301", moved301)
DESCRIBE("302", moved302)
