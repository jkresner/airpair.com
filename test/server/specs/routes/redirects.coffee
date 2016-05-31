rules   = []
ok      = 0
perm_to = (to) -> (res) ->
  # fail = res.indexOf("Moved Permanently. Redirecting to #{to}") isnt 0
  # if fail then expect(res.indexOf("Moved Permanently. Redirecting to #{to}"), "Fail 301 => #{to}\n#{'Got:'.gray}#{res}").to.equal(0)
  expect(res).to.equal("Moved Permanently. Redirecting to #{to}")
  DONE() if rules.length is ++ok
temp_to = (to) -> (res) ->
  expect(res).to.equal("Found. Redirecting to #{to}")
  DONE() if rules.length is ++ok



rewrite = ->


  IT 'Locally', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/static/img/pages/postscomp/prize-keen-io.png','/img/software/keen-io.png']
      ['/static/img/pages/postscomp/logo-android.png','/img/software/android.png']
      ['/problem-solving','/pair-programming']
    ]

  IT 'EXTERNAL (sub-domain)', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/static/img/icons/so-white.png','https://static.airpair.com/img/icons/so-white.png']
      ['/static/img/icons/tw-white.png','https://static.airpair.com/img/icons/tw-white.png']
    ]


  IT 'Tags', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/posts/tag/angularjs', '/angularjs/posts']
      ['/posts/tag/javascript', '/javascript']
      ['/posts/tag/redis', '/redis']
    ]


  IT 'DOTS', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/ruby-on-rails-4/posts/how-to-set-up-authentication-with-angularjs-and-ruby-on-rails...', '/ruby-on-rails-4/posts/how-to-set-up-authentication-with-angularjs-and-ruby-on-rails']
    ]

  IT 'WEIRD URLs', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/ionic-framework/posts/ionic-firebase-password-manager&q=Create_a_Password_Management_App_Using_Ionic_Framework_%E2%80%A6','/ionic-framework/posts/ionic-firebase-password-manager&q=Create_a_Password_Management_App_Using_Ionic_Framework_']
      ['/python/posts/top-mistakes-python-big-data-analytics&quot;', '/python/posts/top-mistakes-python-big-data-analytics']
    ]


moved301 = ->


  IT 'EXACT', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/airconf2014', '/workshops']
      ['/android/posts', '/android']
      ['/author/jk', '/software-experts']
      # ['/c++', '/posts/tag/c++']
      ['/javascript/posts', '/javascript']
      ['/logout', '/auth/logout']
      ['/dashboard', '/home']
      ['/me', '/account']
      ['/javascript/javascript-performance-yehuda-katz','/javascript']
      ['/node_js','/node.js']
      ['/seo/node.js-nginx-wordpress-seo','/nginx']
    ]

  IT 'WEIRD CHARS', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/selenium/posts/selenium-tutorial-with-java).', '/selenium/posts/selenium-tutorial-with-java']
    ]

  IT 'WILDCARD', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/author/jk', '/software-experts']
      ['/java/workshops', '/workshops']
      ['/android/workshops?utm_campaign=wilder', '/workshops?utm_campaign=wilder']
      ['/analytics/consultant-keen-io-api-integration-seb-insua?utm_source=twitter&utm_medium=social&utm_term=analytics-consultant&utm_content=seb-insua&utm_campaign=social-blast-mar','/keen-io?utm_source=twitter&utm_medium=social&utm_term=analytics-consultant&utm_content=seb-insua&utm_campaign=social-blast-mar']
      ['/mobile-checkout/mobile-checkout-expert-radu-spineanu?utm_source=twitter&utm_medium=social&utm_term=mobile-checkout-expert','/software-experts?utm_source=twitter&utm_medium=social&utm_term=mobile-checkout-expert']
      ['/email-optimization/email-optimization-expert-james-lamont?utm_source=twitter','/software-experts?utm_source=twitter']
      ['/airconf-promo/jescalan?utm_source=meetup&utm_medium=email&utm_term=expert&utm_content=jescalan&utm_campaign=airconf', '/software-experts?utm_source=meetup&utm_medium=email&utm_term=expert&utm_content=jescalan&utm_campaign=airconf']
    ]


moved302 = ->

  IT 'EXACT', ->
    PAGE(rule[0], {status:302}, temp_to(rule[1])) for rule in [
      ['/about', '/']
      ['/blog', '/software-experts']
    ]


  IT 'ANON', ->
    PAGE(rule[0], {status:302}, temp_to(rule[1])) for rule in [
      ['/account', '/login?returnTo=/account']
      ['/home', '/login?returnTo=/home']
      ['/requests', '/login?returnTo=/requests']
      ['/billing', '/login?returnTo=/billing']
      ['/bookings/12334', '/login?returnTo=/bookings/12334']
    ]

  IT 'AIRPAIR.me', ->
    PAGE(rule[0], {status:302}, temp_to(rule[1])) for rule in [
      ['/me/joefiorini', '/javascript/emberjs-using-ember-cli']
    ]

beforeEach ->
  rules = ['1']
  ok = 0

DESCRIBE("Rewrite", rewrite)
DESCRIBE("301", moved301)
DESCRIBE("302", moved302)



