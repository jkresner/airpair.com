ok = 0

testRedirect = (status, from, to, all) =>
  PAGE from, {status}, (res) =>
    txt = "#{if status is 301 then 'Moved Permanently' else 'Found'}. Redirecting to #{to}"
    expect(res, "[#{status}] #{from} => #{to}").to.equal(txt)
    DONE() if all.length is ++ok

perm_to = (map) => testRedirect(301, rule[0], rule[1], map) for rule in map
temp_to = (map) => testRedirect(302, rule[0], rule[1], map) for rule in map


beforeEach ->
  ok = 0
  config.middleware.throttle = limit: 1000



DESCRIBE "[301] Rewrites", ->

  # Need to hit the live site to actually test these
  # SKIP 'Cloudflare PageRules', -> perm_to [
  #   ['node.js/learn-nodejs-', '/node.js/learn-nodejs']
  #   ['/js/javascript-framework-comparison/?utm_campaign=js-twit', '/js/javascript-framework-comparison?utm_campaign=js-twit']
  #   ['/js/', '/js']
#      ['/ionic-framework/posts/%5C','/ionic-framework/posts/']
#      ['/ionic-framework/posts.','/ionic-framework/posts']
  # ]

  # it 'Tagged landing pages'
    # ['/problem-solving','/pair-programming']

  IT 'IMGs on static sub-domain', -> perm_to [
    ['/static/img/pages/postscomp/prize-android.png','https://static.airpair.com/img/software/android.png']
    ['/img/software/android.png','https://static.airpair.com/img/software/android.png']
    ['/static/img/pages/postscomp/logo-keen-io.png','https://static.airpair.com/img/software/keen-io.png']
    ['/img/software/keen-io.png','https://static.airpair.com/img/software/keen-io.png']
    ['/static/img/icons/so-white.png','https://static.airpair.com/img/icons/so-white.png']
    ['/static/img/icons/tw-white.png','https://static.airpair.com/img/icons/tw-white.png']
  ]

  IT 'IMGs on external-domain', -> perm_to [
    ['/i.imgur.com/CmVIByr.png','https://i.imgur.com/CmVIByr.png']
    ['/imgur.com/bgLW1vi.jpg','https://i.imgur.com/bgLW1vi.jpg']
    ['/i.stack.imgur.com/JnpBV.png','https://i.imgur.com/JnpBV.png']
  ]


  IT 'Tags', -> perm_to [
    ['/android/posts', '/android']
    ['/android/workshops', '/android']
    ['/android/workshops?utm_campaign=wilder', '/android?utm_campaign=wilder']
    ['/javascript/posts', '/javascript']
    ['/js', '/javascript']
    ['/posts/tag/angularjs', '/angularjs/posts']
    ['/posts/tag/javascript', '/javascript']
    ['/posts/tag/redis', '/redis']
    ['/posts/tag/sqlserver','/posts/tag/sql-server', '/sql-server']
    ['/reactjs/workshops', '/reactjs']
    ['/ruby/workshops/refactoring-large-rails-code','/ruby']
    ['/sqlserver','/sql-server']
  ]



  IT '... DOTS', -> perm_to [
    ['/ruby-on-rails-4/posts/how-to-set-up-authentication-with-angularjs-and-ruby-on-rails...', '/ruby-on-rails-4/posts/how-to-set-up-authentication-with-angularjs-and-ruby-on-rails']
  ]

  IT 'WEIRD URL Suffixes', -> perm_to [
    ['/ionic-framework/posts/ionic-firebase-password-manager&q=Create_a_Password_Management_App_Using_Ionic_Framework_%E2%80%A6','/ionic-framework/posts/ionic-firebase-password-manager&q=Create_a_Password_Management_App_Using_Ionic_Framework_']
    ['/python/posts/top-mistakes-python-big-data-analytics&quot;', '/python/posts/top-mistakes-python-big-data-analytics']
    ['/android/android-camera-development"','/android/android-camera-development']
    ['/ruby-on-rails/posts/building-a-restful-api-in-a-rails-application]','/ruby-on-rails/posts/building-a-restful-api-in-a-rails-application']
  ]



DESCRIBE "[301] Redirects", ->

  IT 'ARCHIVED', -> perm_to [
    ['/agile/workshops/crash-course-managing-software-people-and-teams','/agile']
    ['/leanstartup/workshops/effective-experiments-for-product-development','/software-experts']
  ]
    # /python/posts/python-code-mentoring-web-scraping-1
    # /reactjs/posts/reactjs-a-guide-for-rails-developers%EF%BC%89
    # /graph-database/graph-database-expert-wes-freeman
    #

  IT 'EXACT', -> perm_to [
    ['/android-camera/posts/the-ultimate-android-camera-development-guide','/android/android-camera-development']
    ['/angularjs/web-scraping-phantomjs-session','/node.js']
    ['/code-mentoring/ios', '/ios']
    ['/dashboard', '/home']
    ['/evernote/posts/evernote-support-api-integration-help','/evernote']
    ['/firebase/posts/firebase-support-and-api-integration-help', '/firebase']
    ['/javascript/javascript-performance-yehuda-katz','/javascript']
    ['/javascript/syncify-tutorial','/javascript']
    ['/javascript/javascript-code-review','/javascript']
    ['/me', '/account']
    ['/node_js','/node.js']
    ['/node','/node.js']
    ['/node.js/expert-ryan-schmukler','/node.js']
    ['/posts/tag/node','/node.js']
    ['/railsconf2014', '/ruby-on-rails']
    ['/seo/node.js-nginx-wordpress-seo','/nginx']
    ['/workshops', '/software-experts']
  ]

  IT '*RegExp*', -> perm_to [
    ['/airconf', '/software-experts']
    ['/airconf2014', '/software-experts']
    ['/airconf-promo/jescalan?utm_source=meetup&utm_medium=email&utm_term=expert&utm_content=jescalan&utm_campaign=airconf', '/software-experts?utm_source=meetup&utm_medium=email&utm_term=expert&utm_content=jescalan&utm_campaign=airconf']
    ['/jobs/07-14/airconf2014-volunteers', '/software-experts']
  ]


  IT '(RegExp)|()|()', -> perm_to [
    ['/analytics/consultant-keen-io-api-integration-seb-insua?utm_source=twitter&utm_medium=social&utm_term=analytics-consultant&utm_content=seb-insua&utm_campaign=social-blast-mar','/keen-io?utm_source=twitter&utm_medium=social&utm_term=analytics-consultant&utm_content=seb-insua&utm_campaign=social-blast-mar']
    ['/mobile-checkout/mobile-checkout-expert-radu-spineanu?utm_source=twitter&utm_medium=social&utm_term=mobile-checkout-expert','/software-experts?utm_source=twitter&utm_medium=social&utm_term=mobile-checkout-expert']
    ['/email-optimization/email-optimization-expert-james-lamont?utm_source=twitter','/software-experts?utm_source=twitter']
  ]

  IT 'Retired API Pages', -> perm_to [
    ['/bit.ly', '/software-experts']
    ['/blossom', '/software-experts']
    ['/spotify', '/software-experts']
    ['/echo-nest', '/software-experts']
    ['/tokbox', '/software-experts']
    ['/hellosign', '/software-experts']
    ['/vero/posts/vero-support-and-api-integration-help', '/software-experts']
    ['/vero', '/software-experts']
    ['/flydata', '/software-experts']
    ['/tokbox/posts/tokbox-support-and-api-integration-help', '/api']
    ['/twotap', '/software-experts']
    ['/sinch', '/software-experts']
    ['/human-api', '/software-experts']
    ['/human-api/posts/human-api-support-integration-help', '/software-experts']
    ['/heroku/posts/heroku-support-integration-help', '/heroku']
    ['/mailjet', '/software-experts']
    ['/mailjet/SMTP-expert-florian-le-goff', '/software-experts']
    ['/paypal/posts/paypal-support-and-api-integration-help', '/salesforce/expert-daniel-ballinger']
  ]

  IT 'Retired Wordpress', -> perm_to [
    ['/ruby-on-rails-problem-solving/page/2', '/ruby-on-rails']
  ]

  IT 'BugFixed post slugs', -> perm_to [
    # ['/ember.js/posts/expert-stefan-penner-1', '/ember.js/expert-stefan-penner']
    ['/python/python-expert-alexandre-gravier', '/python/machine-learning-expert-alexandre-gravier']
  ]

  IT 'Fuzzy leniences', -> perm_to [
    ['/js/integrating-stripe-into', '/javascript/integrating-stripe-into-angular-app']
    ['/node.js/posts/top-10-mistakes-node-d49', '/node.js/posts/top-10-mistakes-node-developers-make']
    ['/node.js/posts/top-10-mistakes-node-d85', '/node.js/posts/top-10-mistakes-node-developers-make']
    ['/ruby-on-rails/posts/ruby-problem-solving-for-sendwithus-1', '/ruby']
  ]

#   # IT 'Published post', -> perm_to [
#   #   ['/posts/review/545ac3ec2826860b007801c4', 'http://www.airpair.com/js/javascript-framework-comparison']
#   # ]


#   # IT '/posts/edit/54afe4c7a9dc630b00b8685d', ->
#   #  perm_to [
#   #   ['/posts/edit/54afe4c7a9dc630b00b8685d', '/author/editor/54afe4c7a9dc630b00b8685d']
#   #   ['/posts/fork/54afe4c7a9dc630b00b8685d', '/author/fork/54afe4c7a9dc630b00b8685d']
#   # ]

#   # SKIP '/posts/contributors/55e3705b0fa2cd11000e0cc5', -> # perm_to [
#   #   # ['/posts/contributors/55e3705b0fa2cd11000e0cc5, 'stay on airpair.com?'

#   # SKIP '/posts/preview/5514559c5955b711004d652e', ->
#   #   # ['/posts/preview/5514559c5955b711004d652e', 'https://author.airpair.com/?submitted=55386de99778e11100f6d9e0']

#   # SKIP '/posts/me?submitted=55386de99778e11100f6d9e0', ->
#   #   # ['/posts/me?submitted=55386de99778e11100f6d9e0', 'https://author.airpair.com/?submitted=55386de99778e11100f6d9e0']


#   # IT.skip 'AUTHOR WILDCARD', -> perm_to [
#   #   # ['/author/jk', '/software-experts']
#   # ]

#   # IT 'Alternate options', -> perm_to [
#   #   ['/node.js/learn-node.js', '/node.js/learn-nodejs']
#   #   ['/node.js/posts/learn-node.js', '/node.js/learn-nodejs']
#   #   ['/node.js/posts/learn-nodejs', '/node.js/learn-nodejs']
#   # ]

#   # IT 'GOOGLE keywords malformed', -> perm_to [
#   #   ['/c++/posts/preparing-for-cpp-interview&sa=U&ved=0ahUKEwiywpW7__WGF5oKHaf&usg=AFQjCNG', '/c++/posts/preparing-for-cpp-interview?sa=U&ved=0ahUKEwiywpW7__WGF5oKHaf&usg=AFQjCNG']
#   # ]

#   # SKIP 'CAPS', -> perm_to [
#   #   ['/Ruby', '/ruby']
#   # ]

#   # IT 'WEIRD Trailing CHARS', -> perm_to [
#   #   ['/selenium/posts/selenium-tutorial-with-java).', '/selenium/posts/selenium-tutorial-with-java']
#   # ]

#   # IT 'Strange tags', -> perm_to [
#   #   ['/c%2B%2B', '/c++']
#   #   ['/f', '/f#']
#   # ]

#   # IT 'Tags retired', ->  perm_to [
#   #   ['/selenium-2', '/selenium']
#   #   ['/python-2.7', '/python']
#   #   ['/report', '/reporting']
#   # ]

#   # IT 'img/software/*', ->  perm_to [
#   #   ['/img/software/angular.png', 'https://static.airpair.com/img/software/angular.png']
#   # ]

  IT "[200] all route.to urls", ->
    @timeout 3000
    global.COOKIE = global.AUTHED.session
    uniq = {}
    for perm in cache.rules[301]
      if !uniq[perm.to]? and perm.to.indexOf('http') != 0 and perm.to != "/"
        uniq[perm.to] = 1
    ok = 0
    all = Object.keys(uniq).length
    OK = (url) => PAGE url, {contentType:/(html|rss)/}, (html) =>
      DONE() if all is ++ok
    OK(url) for url in Object.keys(uniq).sort()



DESCRIBE "[302] Redirects", ->

#   IT 'EXACT', -> temp_to [
#     ['/logout', '/auth/logout']
#     ['/about', '/']
#     ['/blog', '/software-experts']
#   ]

#   IT 'Strange tags', -> temp_to [
#     ['/c', '/c#']
#   ]

#   IT 'ANON', -> temp_to [
#     ['/author/new', '/login?returnTo=%2Fauthor%2Fnew']
#     ['/account', '/login?returnTo=%2Faccount']
#     ['/home', '/login?returnTo=%2Fhome']
#     ['/billing', '/login?returnTo=%2Fbilling']
#     # ['/auth/slack?returnTo=/me', '/login?returnTo=/auth/slack%3FreturnTo%3D%2Fme']
#     # ['/auth/slack?returnTo=/me', '/login']
#   ]

#   IT 'Old feature urls', ->  temp_to [
#     # ['/requests', '/login?returnTo=/requests']
#     # ['/bookings/12334', '/login?returnTo=/bookings/12334']
#     ['/settings', '/account']
#   ]

#   IT 'Old urls', -> temp_to [
#     ['/hire-developers', '/']
#   ]

#   IT 'AIRPAIR.me', -> temp_to [
#     ['/me/joefiorini', '/javascript/emberjs-using-ember-cli']
#     ['/me/ddavison','/selenium/posts/selenium-tutorial-with-java']
#     ['/me/joefiorini','/javascript/emberjs-using-ember-cli']
#     ['/me/tiagorg','/javascript/posts/the-mind-boggling-universe-of-javascript-modules']
#     ['/me/gsans','/jasmine/posts/javascriptintegrating-jasmine-with-requirejs-amd']
#     ['/me/arunr','/angularjs/posts/travel-app-in-2-hours']
#     ['/me/marko','/java/posts/spring-streams-memory-efficiency']
#     ['/me/hackerpreneur','/express/posts/expressjs-and-passportjs-sessions-deep-dive']
#     ['/me/basarat','/typescript/expert-basarat']
#     ['/me/ryansb','/python/posts/django-flask-pyramid']
#     ['/me/mappmechanic','/angularjs/posts/build-a-real-time-hybrid-app-with-ionic-firebase']
#     ['/me/larskotthoff','/javascript/posts/d3-force-layout-internals']
#     ['/me/urish','/js/javascript-framework-comparison']
#     ['/me/kn0tch','/aws/posts/ntiered-aws-docker-terraform-guide']
#     ['/me/glockjt', '/node.js/posts/nodejs-framework-comparison-express-koa-hapi']
#   ]

#   IT '/ to /home', ->
#     LOGIN 'gnic', (session) =>
#       expect(session).eqId(FIXTURE.users.gnic)
#       expect(session.name).to.equal('gregorynicholas')
#       PAGE '/', { status: 302 }, (text) =>
#         expect(text).to.equal('Found. Redirecting to /home')
#         DONE()

  IT "[200] all route.to urls", ->
    global.COOKIE = global.AUTHED.session
    uniq = {}
    for temp in cache.rules[302]
      if !uniq[temp.to]? and temp.to.indexOf('http') != 0 and temp.to != "/"
        uniq[temp.to] = 1
    ok = 0
    all = Object.keys(uniq).length
    OK = (url) => PAGE url, {contentType:/(html|rss)/}, (html) =>
      DONE() if all is ++ok
    OK(url) for url in Object.keys(uniq).sort()

