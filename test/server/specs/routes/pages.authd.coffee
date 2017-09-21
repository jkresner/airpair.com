html =
  login: /<li class="lg"><a href="\/login" target="_self" rel="nofollow"><b>Login<\/b><\/a><\/li>/
  faq: /class="blogpost faq">/
  landing: /<body class="landing">/
  post: /<article class="blogpost">/
  postinreview: /Community Review/
js =
  index: /javascript" src="https:\/\/static\.airpair\.com\/js\/app/




  # IT "Redirect on review link for published post", ->


  # IT "Authd view a published post", ->

userKey = null
session = null

before (done) ->
  LOGIN 'gnic', (s) ->
    userKey = s.username
    session = global.COOKIE
    done()

beforeEach ->
  global.COOKIE = session


DESCRIBE 'NOINDEX', ->

  IT '/tos', -> HTML @, [/<h1 class="entry-title" itemprop="headline">AirPair Terms of Service/,html.faq], no: [html.login]
  IT '/privacy', -> HTML @, [/<h1 class="entry-title" itemprop="headline">AirPair Privacy Policy/,html.faq], no: [html.login]
  IT '/refund-policy', -> HTML @, [/<h1 class="entry-title" itemprop="headline">Refund Policy/,html.faq], no: [html.login]

  IT '/posts/review/551174c103d42a11002da48b', -> HTML @, [html.postinreview,
    /<h1 class="entry-title" itemprop="headline">Moving Images on Open Stack<\/h1>/
  ]

DESCRIBE 'INDEX', ->

  IT '/ionic', -> HTML @, [/<title>Ionic Programming Guides and Tutorials from Top ionic Developers/,html.landing], no: [js.index,html.faq,html.login]
  IT '/angularjs', -> HTML @, [/<title>AngularJS Tutorial: a comprehensive 10,000 word guide/,/rel="canonical" href="http:\/\/www.airpair.com\/angularjs"/,html.post], no: [html.login]
  IT '/javascript', -> HTML @, [/<title>JavaScript Programming Guides and Tutorials from Top JS Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/javascript"/,html.landing]
  IT '/javascript', -> HTML @, [/<title>JavaScript Programming Guides and Tutorials from Top JS Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/javascript"/,html.landing]
  IT '/ios', -> HTML @, [/<title>iOS Programming Guides and Tutorials from Top ios Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/ios"/,html.landing]
  IT '/100k-writing-competition', ->  HTML @, [/<title>Fork Up! AirPair/,/Git-Powered Developer Writing Competition/,/rel="canonical" href="https:\/\/www.airpair.com\/100k-writing-competition"/,html.landing]
  IT '/software-experts', -> HTML @, [/<title>Software Programming Guides and Tutorials from Top Software Experts and Consultants/,/rel="canonical" href="https:\/\/www.airpair.com\/software-experts"/,html.landing]

  IT '/angularjs/posts', -> HTML @, [/<title>AngularJS Programming Guides and Tutorials from Top Angular Developers/,
    /rel="canonical" href="https:\/\/www.airpair.com\/angularjs\/posts"/,
    html.landing]

  IT '/js/javascript-framework-comparison', -> HTML @, [html.post,js.index,
      /<title>AngularJS vs. Backbone.js vs. Ember.js/,
      /<meta property="og:title" content="AngularJS vs. Backbone.js vs. Ember.js"/,
      /<h1 class="entry-title" itemprop="headline">AngularJS vs. Backbone.js vs. Ember.js/,  #
      /meta name="description" content="Angular, Backbone and Ember all have the concept of views, events, data models and routing. We will compare their differences and outline ideal use cases/,
      /meta property="og:image" content="https:\/\/airpair-blog.s3.amazonaws.com\/wp-content\/uploads\/2014\/08\/urishaked-jscompare-2.png"/,
      /meta property="og:url" content="http:\/\/www.airpair.com\/js\/javascript-framework-comparison"/,
      /link rel="canonical" href="http:\/\/www.airpair.com\/js\/javascript-framework-comparison"/,
      /<li><a href="#2-meet-the-frameworks">2  Meet The Frameworks/,
      /<li><a href="\/javascript" target="_self" title="JavaScript tutorials & JS guides">javascript/
    ]
  IT '/angularjs/posts/transclusion-template-scope-in-angular-directives', -> HTML @, [html.post,js.index,
    /<title>Transclusion and Template Scope in Angular Directives Demystified/,
    /<meta property="og:title" content="Transclusion and Template Scope in Angular Directives Demystified"/,
    /<h1 class="entry-title" itemprop="headline">Transclusion and Template Scope in Angular Directives Demystified/,  #
    /meta name="description" content="This post delves into the different types of scope available in directives and their effects./,
    /meta property="og:image" content="https:\/\/i.imgur.com\/jrjtJSH.png"/,
    /meta property="og:url" content="https:\/\/www.airpair.com\/angularjs\/posts\/transclusion-template-scope-in-angular-directives"/,
    /link rel="canonical" href="https:\/\/www.airpair.com\/angularjs\/posts\/transclusion-template-scope-in-angular-directives"/,
    /<li><a href="#brief-intro-to-transclusion">Brief intro to transclusion/,
    /<ul class="tags"><li><a href="\/angularjs\/posts" target="_self" title="AngularJS tutorials & Angular guides">angularjs<\/a><\/li><\/ul>/]


DESCRIBE 'CLIENT (authed APP)', ->

  IT '/', -> PAGE '/', {status:302}, (txt) ->
    expect(txt).to.equal('Found. Redirecting to /home')
    DONE()

  IT '/home OK', ->
    PAGE '/home', {}, (html) =>
      expect(html).to.inc ['ng-view',
              'window.pageData = { session: {"_id":"51ba69f466a6f999a465f3b5","name":"gregorynicholas"']
      DONE()
