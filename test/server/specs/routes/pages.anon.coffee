html =
  login: /<li class="lg"><a href="\/login" target="_self" rel="nofollow"><b>Login<\/b><\/a><\/li>/
  faq: /class="blogpost faq">/
  landing: /<body class="landing">/
  post: /<article class="blogpost">/
  postinreview: /Community Review/
js =
  index: /javascript" src="https:\/\/static\.airpair\.com\/js\/index/


describe ' NOINDEX'.subspec, ->

  IT '/tos', -> HTML @, [/<h1 class="entry-title" itemprop="headline">AirPair Terms of Service/,html.faq,html.login]
  IT '/privacy', -> HTML @, [/<h1 class="entry-title" itemprop="headline">AirPair Privacy Policy/,html.faq]
  IT '/refund-policy', -> HTML @, [/<h1 class="entry-title" itemprop="headline">Refund Policy/,html.faq]
  IT '/login', -> HTML @, [js.index]
  IT '/hangout/index.html', -> HTML @, [/<img src="https:\/\/static.airpair.com\/img\/brand\/logo.png" \/>/], no: [js.index]

  IT '/posts/review/551174c103d42a11002da48b', -> HTML @, [html.postinreview,
    /<h1 class="entry-title" itemprop="headline">Moving Images on Open Stack<\/h1>/
  ]

describe ' INDEX'.subspec, ->

  IT '/', -> HTML @, [/<title>airpair | Coding help/,html.login], no: [js.index,html.faq]
  IT '/ionic', -> HTML @, [/<title>Ionic Programming Guides and Tutorials from Top ionic Developers/,html.landing], no: [js.index,html.faq]
  IT '/angularjs', -> HTML @, [/<title>AngularJS Tutorial: a comprehensive 10,000 word guide/,/rel="canonical" href="http:\/\/www.airpair.com\/angularjs"/,html.post,html.login]
  IT '/javascript', -> HTML @, [/<title>JavaScript Programming Guides and Tutorials from Top JS Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/javascript"/,html.landing]
  IT '/ios', -> HTML @, [/<title>iOS Programming Guides and Tutorials from Top ios Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/ios"/,html.landing]
  IT '/100k-writing-competition', ->  HTML @, [/<title>Fork Up! AirPair/,/Git-Powered Developer Writing Competition/,/rel="canonical" href="https:\/\/www.airpair.com\/100k-writing-competition"/,html.landing]

  IT '/software-experts', -> HTML @, [
    /<title>Software Programming Guides and Tutorials from Top Software Experts and Consultants/,
    /rel="canonical" href="https:\/\/www.airpair.com\/software-experts"/,
    html.landing]

  IT '/posts', -> HTML @, [
    /<title>Software Programming Guides and Tutorials from Top Software Experts and Consultants/,
    /rel="canonical" href="https:\/\/www.airpair.com\/software-experts"/,
    html.landing]

  IT '/c++/posts/preparing-for-cpp-interview', -> HTML @, [html.post,js.index]

  IT '/js/javascript-framework-comparison', -> HTML @, [html.post,js.index,
    /<title>AngularJS vs. Backbone.js vs. Ember.js/,
    /<meta property="og:title" content="AngularJS vs. Backbone.js vs. Ember.js"/,
    /<h1 class="entry-title" itemprop="headline">AngularJS vs. Backbone.js vs. Ember.js/,  #
    /meta name="description" content="Angular, Backbone and Ember all have the concept of views, events, data models and routing. We will compare their differences and outline ideal use cases/,
    /meta property="og:image" content="https:\/\/airpair-blog.s3.amazonaws.com\/wp-content\/uploads\/2014\/08\/urishaked-jscompare-2.png"/,
    /meta property="og:url" content="http:\/\/www.airpair.com\/js\/javascript-framework-comparison"/,
    /link rel="canonical" href="http:\/\/www.airpair.com\/js\/javascript-framework-comparison"/,
    /<li><a href="#2-meet-the-frameworks">2  Meet The Frameworks/,
    /<li><a href="\/javascript" target="_self" title="JavaScript tutorials & JS guides">javascript/]


  IT '/angularjs/posts/transclusion-template-scope-in-angular-directives', -> HTML @, [html.post,js.index,
    /<title>Transclusion and Template Scope in Angular Directives Demystified/,
    /<meta property="og:title" content="Transclusion and Template Scope in Angular Directives Demystified"/,
    /<h1 class="entry-title" itemprop="headline">Transclusion and Template Scope in Angular Directives Demystified/,  #
    /meta name="description" content="This post delves into the different types of scope available in directives and their effects./,
    /meta property="og:image" content="https:\/\/i.imgur.com\/jrjtJSH.png"/,
    /meta property="og:url" content="https:\/\/www.airpair.com\/angularjs\/posts\/transclusion-template-scope-in-angular-directives"/,
    /link rel="canonical" href="https:\/\/www.airpair.com\/angularjs\/posts\/transclusion-template-scope-in-angular-directives"/,
    /<li><a href="#brief-intro-to-transclusion">Brief intro to transclusion/,
    /<ul class="posttags"><li><a href="\/angularjs\/posts" target="_self" title="AngularJS tutorials & Angular guides">angularjs<\/a><\/li><\/ul>/]

  IT '/android', ->
    HTML @, [/<title>Android Programming Guides/, html.landing], no: [js.index]

  IT '/android?utm_source=newsletter-airpair&utm_medium=email&utm_term=android-code-review&utm_content=google-apps-deployment&utm_campaign=news-14', ->
    HTML @, [/<title>Android Programming Guides/, html.landing], no: [js.index]

  IT '/workshops', -> HTML @, [
    /<title>Software Workshops, Webinars & Screencasts/,
    /rel="canonical" href="https:\/\/www.airpair.com\/workshops"/,
    html.landing]


  # IT 'index meta /hire-developers through airpair (partial)', ->


describe ' Session + Views'.subspec, ->


  IT 'Does not exec analytics but stores session on 404', ->
    # trackSpy = STUB.spy(analytics, 'event')
    PAGE '/user/register', {status:404,ua:FIXTURE.http.UA.Firefox}, (resp) ->
      GET '/auth/session', (s) ->
        DB.docsByQuery 'View', { sId:s.sessionID }, (views) ->
          expect(views.length).to.equal(0)
          DB.expectSession s, DONE


  IT '/ (unauthenticated) Persists session for uaFireFox', ->
    # viewSpy1 = STUB.spy(analytics, 'view')
    PAGE '/', {status:200,ua:FIXTURE.http.UA.Firefox}, (resp) ->
      GET '/auth/session', (s) ->
        # expect(viewSpy1.callCount).to.equal(1)
        expect(s.authenticated).to.equal(false)
        DB.expectSession s, DONE

  IT '/100k-writing-competition (unauthenticated) Persists session for uaFireFox', ->
    # viewSpy = STUB.spy(analytics, 'view')
    PAGE '/100k-writing-competition', {status:200,ua:FIXTURE.http.UA.Firefox}, (resp) ->
      GET '/auth/session', (s) ->
        # expect(viewSpy.calledOnce).to.be.true
        expect(s.authenticated).to.equal(false)
        DB.expectSession s, ->
          DB.docsByQuery 'View', { sId:s.sessionID }, (views) ->
            expect(views.length).to.equal(1)
            expect(views[0].sId).to.equal(s.sessionID)
            expect(views[0].type).to.equal('landing')
            expect(views[0].url).to.equal('/100k-writing-competition')
            expect(views[0].utm).to.be.undefined
            expect(views[0].uId).to.be.undefined
            DONE()

  IT '/ionic (uaUser) Persists utms and referer', ->
    # viewSpy = STUB.spy(analytics, 'view')
    referer = 'https://www.airpair.com/'
    utms = 'utm_source=team-email&utm_medium=email&utm_term=angular-workshops&utm_content=nov14-workshops-ty&utm_campaign=wks14-4'
    PAGE "/ionic?#{utms}", {status:200,ua:FIXTURE.http.UA.Firefox,referer}, (resp) ->
      # expect(viewSpy.calledOnce).to.be.true
      GET '/auth/session', (s) ->
        expect(s.authenticated).to.equal(false)
        DB.expectSession  s, ->
          DB.docsByQuery 'View', { sId:s.sessionID }, (views) ->
            expect(views.length).to.equal(1)
            expect(views[0].url).to.equal('/ionic')
            expect(views[0].type).to.equal('landing')
            expect(views[0].utm).to.exist
            expect(views[0].ref).to.equal(referer)
            expect(views[0].utm.source).to.equal('team-email')
            expect(views[0].utm.medium).to.equal('email')
            expect(views[0].utm.term).to.equal('angular-workshops')
            expect(views[0].utm.content).to.equal('nov14-workshops-ty')
            expect(views[0].utm.campaign).to.equal('wks14-4')
            DONE()
