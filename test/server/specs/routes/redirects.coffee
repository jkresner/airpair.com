rules   = []
ok      = 0
perm_to = (to) -> (res) ->
  fail = res.indexOf("Moved Permanently. Redirecting to #{to}") isnt 0
  if fail then $log "Fail 301 => #{to}\n#{'Got:'.gray}#{res}".red
  DONE() if rules.length is ++ok
temp_to = (to) -> (res) ->
  fail = res.indexOf("Found. Redirecting to #{to}") isnt 0
  if fail then $log "Fail 302 => #{to}\nGot #{res}".red
  DONE() if rules.length is ++ok



rewrite = ->


  IT 'Locally', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/static/img/pages/postscomp/prize-keen-io.png','/img/software/keen-io.png']
      ['/static/img/pages/postscomp/logo-android.png','/img/software/android.png']
    ]


  SKIP 'DOTS', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/ruby-on-rails-4/posts/how-to-set-up-authentication-with-angularjs-and-ruby-on-rails...', '/ruby-on-rails-4/posts/how-to-set-up-authentication-with-angularjs-and-ruby-on-rails']
    ]


moved301 = ->


  IT 'EXACT', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/airconf2014', '/workshops']
      ['/android/posts', '/android']
      ['/author/jk', '/software-experts']
      ['/c++', '/posts/tag/c++']
      ['/javascript/posts', '/javascript']
      ['/logout', '/auth/logout']
      ['/dashboard', '/home']
    ]


  IT 'WILDCARD', ->
    PAGE(rule[0], {status:301}, perm_to(rule[1])) for rule in [
      ['/author/jk', '/software-experts']
      ['/java/workshops', '/workshops']
      ['/android/workshops?utm_campaign=wilder', '/workshops?utm_campaign=wilder']
    ]


moved302 = ->

  IT 'EXACT', ->
    PAGE(rule[0], {status:302}, temp_to(rule[1])) for rule in [
      ['/about', '/']
    ]


  IT 'ANON', ->
    PAGE(rule[0], {status:302}, temp_to(rule[1])) for rule in [
      ['/account', '/login?returnTo=/account']
      ['/home', '/login?returnTo=/home']
      ['/requests', '/login?returnTo=/requests']
      ['/billing', '/login?returnTo=/billing']
      ['/bookings/12334', '/login?returnTo=/bookings/12334']
    ]


beforeEach ->
  rules = ['1']
  ok = 0

DESCRIBE("Rewrite", rewrite)
DESCRIBE("301", moved301)
DESCRIBE("302", moved302)



