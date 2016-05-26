html =
  faq: /class="blogpost faq">/
  landing: /<body class="landing">/
  post: /<article class="blogpost">/
js =
  index: /javascript" src="https:\/\/static\.airpair\.com\/js\/index/


DESCRIBE 'Anon', ->

  describe ' NOINDEX'.subspec, ->

    IT '/tos', -> HTML @, [/<h1 class="entry-title" itemprop="headline">AirPair Terms of Service/,html.faq]
    IT '/privacy', -> HTML @, [/<h1 class="entry-title" itemprop="headline">AirPair Privacy Policy/,html.faq]
    IT '/refund-policy', -> HTML @, [/<h1 class="entry-title" itemprop="headline">Refund Policy/,html.faq]
    IT '/login', -> HTML @, [js.index]
    IT '/hangout/index.html', -> HTML @, [/<img src="https:\/\/static.airpair.com\/img\/brand\/logo.png" \/>/], no: [js.index]

  describe ' INDEX'.subspec, ->

    IT '/', -> HTML @, [/<title>airpair | Coding help/], no: [js.index,html.faq]
    IT '/ionic', -> HTML @, [/<title>Ionic Programming Guides and Tutorials from Top ionic Developers/,html.landing], no: [js.index,html.faq]
    IT '/angularjs', -> HTML @, [/<title>AngularJS Tutorial: a comprehensive 10,000 word guide/,/rel="canonical" href="http:\/\/www.airpair.com\/angularjs"/,html.post]
    IT '/posts/tag/angularjs', -> HTML @, [/<title>AngularJS Programming Guides and Tutorials from Top Angular Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/posts\/tag\/angularjs"/,html.landing]
    IT '/javascript', -> HTML @, [/<title>JavaScript Programming Guides and Tutorials from Top JS Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/javascript"/,html.landing]
    IT '/posts/tag/javascript', -> HTML @, [/<title>JavaScript Programming Guides and Tutorials from Top JS Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/javascript"/,html.landing]
    IT '/posts/tag/redis', -> HTML @, [/<title>Redis Programming Guides and Tutorials from Top redis Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/posts\/tag\/redis"/,html.landing]
    IT '/ios', -> HTML @, [/<title>iOS Programming Guides and Tutorials from Top ios Developers/,/rel="canonical" href="https:\/\/www.airpair.com\/ios"/,html.landing]
    IT '/100k-writing-competition', ->  HTML @, [/<title>Fork Up! AirPair/,/Git-Powered Developer Writing Competition/,/rel="canonical" href="https:\/\/www.airpair.com\/100k-writing-competition"/,html.landing]
    IT '/software-experts', -> HTML @, [/<title>Software Programming Guides and Tutorials from Top Software Experts and Consultants/,/rel="canonical" href="https:\/\/www.airpair.com\/software-experts"/,html.landing]
    IT '/js/javascript-framework-comparison', -> HTML @, [html.post,js.index,
      /<title>AngularJS vs. Backbone.js vs. Ember.js/,
      /<meta property="og:title" content="AngularJS vs. Backbone.js vs. Ember.js"/,
      /<h1 class="entry-title" itemprop="headline">AngularJS vs. Backbone.js vs. Ember.js/,  #
      /meta name="description" content="Angular, Backbone and Ember all have the concept of views, events, data models and routing. We will compare their differences and outline ideal use cases/,
      /meta property="og:image" content="https:\/\/airpair-blog.s3.amazonaws.com\/wp-content\/uploads\/2014\/08\/urishaked-jscompare-2.png"/,
      /meta property="og:url" content="http:\/\/www.airpair.com\/js\/javascript-framework-comparison"/,
      /link rel="canonical" href="http:\/\/www.airpair.com\/js\/javascript-framework-comparison"/,
      /<li><a href="#2-meet-the-frameworks">2  Meet The Frameworks/,
      /<li><a href="\/posts\/tag\/javascript" target="_self" title="JavaScript tutorials & JS guides">javascript/]
    IT '/js/javascript-framework-comparison?utm_campaign=js-twit', -> HTML @, [html.post,js.index,
      /<title>AngularJS vs. Backbone.js vs. Ember.js/]
    IT '/angularjs/posts/transclusion-template-scope-in-angular-directives', -> HTML @, [html.post,js.index,
      /<title>Transclusion and Template Scope in Angular Directives Demystified/,
      /<meta property="og:title" content="Transclusion and Template Scope in Angular Directives Demystified"/,
      /<h1 class="entry-title" itemprop="headline">Transclusion and Template Scope in Angular Directives Demystified/,  #
      /meta name="description" content="This post delves into the different types of scope available in directives and their effects./,
      /meta property="og:image" content="https:\/\/i.imgur.com\/jrjtJSH.png"/,
      /meta property="og:url" content="https:\/\/www.airpair.com\/angularjs\/posts\/transclusion-template-scope-in-angular-directives"/,
      /link rel="canonical" href="https:\/\/www.airpair.com\/angularjs\/posts\/transclusion-template-scope-in-angular-directives"/,
      /<li><a href="#brief-intro-to-transclusion">Brief intro to transclusion/,
      /<ul class="posttags"><li><a href="\/posts\/tag\/angularjs" target="_self" title="AngularJS tutorials & Angular guides">angularjs<\/a><\/li><\/ul>/]

