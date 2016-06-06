var concatExperimental = all =>
  all.concat(

   [
    { type:'501', url: '/apple-app-site-association' }
   ],

   ['/v1/auth/login',
    '/find-an-expert/request',
    '/testing/posts/airpair-v1-beta-testing',
    '/jobs/08-10/editorial-manager',
    '/our-customers',
    '/android/UX-RX.com', //bing?
    '/((wordpress)|(ruby-on-rails)|(android))/rss',
    '/static/img/pages/postscomp/banner.jpg',
    '/v1/img/css/sidenav/bookmark.png',
    '/static/img/css/sidenav/sprite.png',
    '/static/js/index-*',
    '/mean-stack/posts/2014-10-job-post-mean-stack-developer',
    '/graph-database/posts/graph-database-expert-wes-freeman-1',
    '^/preferences',
    '/me/ehrenreilly',
    '/me/shivangdoshi',
    '/images/landing/airconf*'              ].map( url => ({type:'410',url,to:'/'}) ),

    // { match: '%20%e2%80%a6', to: '' },
    //((so)|(gh)|(gp)|(al)|(bb)|(in)|(sl)|(tw))+-
   [{ type:'rewrite', url: '%E2%80%A6', to: '' },
    { type:'rewrite', url: '%22$', to: '' },
    { type:'rewrite', url: '&quot;$', to: '' },
    { type:'rewrite', url: '\\.\\.\\.', to: '' },
    { type:'rewrite', url: '/sqlserver$', to: '/sql-server' },
    { type:'rewrite', url: '/posts/tag/angularjs', to: '/angularjs/posts' },
    { type:'rewrite', url: '/posts/tag/node', to: '/node.js' },
    { type:'rewrite', url: '/posts/tag/', to: '/' },
    { type:'rewrite', url: '/static/img/icons/', to: 'https://static.airpair.com/img/icons/' },
    { type:'rewrite', url: '^((/i.stack.)|(/i.)|(/))imgur.com/*', to: 'https://i.imgur.com/' },
    ],

   [
    // /ember.js/posts/expert-stefan-penner-1
    // { type: '301', url: '/Ruby', to: '/ruby' },
    { type:'301', url: '^/c%2B%2B', to: '/c++'},
    { type:'301', url: '^/f$', to: '/f#' },
    { type:'301', url: '^/airconf-promo/*', to: '/software-experts'},
    { type:'301', url: '/railsconf2014', to: '/ruby-on-rails' },
    { type:'301', url: '/angularjs/post$', to: '/angularjs/posts' },
    { type:'301', url: '/v1/img/css/header/logo.png', to:'https://static.airpair.com/img/header/logo.png' },
    { type:'301', url: '/((/nodejs/posts)|(node_js)|(node))', to:'/node.js' },
    // { type:'301', url: '^/posts/me$', to: 'https://author.airpair.com/' },
    { type:'301', url: '/knockout/posts', to:'/knockout.js' },
    { type:'301', url: '/backbone.js/posts/expert-training-jonathon-kresner-1', to: '/backbone.js' },
    { type:'301', url: '/javascript/emberjs-vs-angularjs-opinions-contributors-video-chat', to:'/javascript' },
    { type:'301', url: '/javascript/javascript-performance-yehuda-katz', to:'/javascript' },
    { type:'301', url: '/seo/node.js-nginx-wordpress-seo', to: '/nginx' },
    { type:'301', url: '/paypal/posts/paypal-support-and-api-integration-help', to: '/salesforce/expert-daniel-ballinger' },
    { type:'301', url: '/salesforce/posts/expert-daniel-ballinger-1', to: '/salesforce/expert-daniel-ballinger' },
    { type:'301', url: '/swift/posts/swift-tutorial-building-an-ios-application-part-3', to: '/swift/building-swift-app-tutorial-3' },
    { type:'301', url: '^/javascript/integrating-stripe-into*', to: '/javascript/integrating-stripe-into-angular-app' },
    { type:'301', url: '/android-camera/posts/the-ultimate-android-camera-development-guide', to: '/android/android-camera-development' },
    { type:'301', url: '/node.js/((posts/learn-node((js)|(.js)))|(learn-node.js))', to: '/node.js/learn-nodejs' },
    { type:'301', url: '/android/andriod-studio-vs-eclipse', to: '/android/android-studio-vs-eclipse' },
    { type:'301', url: '/selenium/posts/selenium-tutorial-with-java\\).', to: '/selenium/posts/selenium-tutorial-with-java' },
    { type:'301', url: '/angularjs/web-scraping-phantomjs-session',  to: '/angularjs' },
    { type:'301', url: '/firebase/posts/firebase-support-and-api-integration-help', to: '/firebase' },
    { type:'301', url: '/heroku/posts/heroku-support-integration-help', to: '/heroku' },
    { type:'301', url: '/meteor/posts/meteor-support-expert-help', to: '/meteor' },
    { type:'301', url: '/twitter/posts/support-and-api-integration-help-with-twitter', to: '/twitter-api' },
    { type:'301', url: '*tim-koopmans*', to: '/devops' },
    { type:'301', url: '*((josh-kuhn)|(jason-adam))*', to: '/swift' },
    { type:'301', url: '*((ashish-awaghad)|(jason-adam))*', to: '/swift' },
    { type:'301', url: '*((ye-liu)|(dana-de-alasei)|(tony-child)|(tobias-talltorp))*', to: '/angularjs/posts' },
    { type:'301', url: '*((ryan-schmukler)|(peter-lyon))*', to: '/node.js' },
    { type:'301', url: '*((seb-insua)|(jordan-feldstein)|(thomson-nguyen))*', to: '/keen-io' },
    { type:'301', url: '/((vero)|(blossom)|(venmo)|(human-api)|(sendswithus))*', to: '/software-experts' },
    { type:'301', url: '^/((bit.ly)|(echo-nest)|(tokbox)|(twotap)|(hellosign)|(flydata)|(sinch)|(spotify)|(mailjet)|(unbabel))', to: '/software-experts' },
    { type:'301', url: '^/((knockout)|(knockoutjs)|(unity)|(unity3d)|(magento)|(gamedev)|(unity3d)|(backbone))$', to: '/software-experts' },
    { type:'301', url: '/selenium-2', to: '/selenium' },
    { type:'301', url: '/report', to: '/reporting' },
    { type:'301', url: '/python-2.7', to: '/python' },
    { type:'301', url: '/codeigniter-2', to: '/php' },
    { type:'301', url: '/email-ab-testing', to: '/email' },
    { type:'301', url: '/google-app-engine', to: '/python' },
    { type:'301', url: '/rubymotion', to: '/ruby' },
   ],

   [
    { type:'302', url: '^/c$', to: '/c#' },
    { type:'302', url: '/((support)|(contact))', to: 'https://github.com/airpair/airpair-com-issues/issues' },
    { type:'302', url: '/meet-experts', to: '/software-experts' },
    { type:'302', url: '/me/andrewchen', to: '/software-experts' },
    { type:'302', url: '/me/ddavison', to: '/selenium/posts/selenium-tutorial-with-java' },
    { type:'302', url: '/me/joefiorini', to: '/javascript/emberjs-using-ember-cli' },
    { type:'302', url: '/me/tiagorg', to: '/javascript/posts/the-mind-boggling-universe-of-javascript-modules' },
    { type:'302', url: '/me/gsans', to: '/jasmine/posts/javascriptintegrating-jasmine-with-requirejs-amd' },
    { type:'302', url: '/me/arunr', to: '/angularjs/posts/travel-app-in-2-hours' },
    { type:'302', url: '/me/marko', to: '/java/posts/spring-streams-memory-efficiency' },
    { type:'302', url: '/me/hackerpreneur', to: '/express/posts/expressjs-and-passportjs-sessions-deep-dive' },
    { type:'302', url: '/me/basarat', to: '/typescript/expert-basarat' },
    { type:'302', url: '/me/ryansb', to: '/python/posts/django-flask-pyramid' },
    { type:'302', url: '/me/mappmechanic', to: '/angularjs/posts/build-a-real-time-hybrid-app-with-ionic-firebase' },
    { type:'302', url: '/me/larskotthoff', to: '/javascript/posts/d3-force-layout-internals' },
    { type:'302', url: '/me/urish', to: '/js/javascript-framework-comparison' },
    { type:'302', url: '/me/kn0tch', to: '/aws/posts/ntiered-aws-docker-terraform-guide' },
    { type:'302', url: '/me/glockjt', to: '/node.js/posts/nodejs-framework-comparison-express-koa-hapi' },
    { type:'302', url: '/me/toddmotto', to: '/angularjs' },
    { type:'302', url: '/me/nevanking', to: '/ios' },
    { type:'302', url: '/me/brianmhunt', to: '/knockout/workshops/dynamic-html-with-knockout' },
    { type:'302', url: '/me/ronlichty', to: '/agile-software/coach-and-trainer-ron-lichty' },
   ],

  [ '/wp-((content)|(includes)|(config)|(admin))*',
    '/node.js.js',
    '/angula',
    '/images/pages/marketing*',
    '/images/landing/airconf*',
    '/skin/*',
    '/s3.amazonaws.com/kennyonetime/blob*',
    '/s3.amazonaws.com/kennyonetime/blob',
    '/node.js/post/getting-started-with-docker-for-the-node-dev',
    '/node.js/posta/getting-started-with-docker-for-the-nodejs-dev',
    '/firebase/posts/firebase-building-realtime-app.json',
    '*.editorconfig*',
    '*fckeditor*',
    '*fontawesome*',
    '*.git((attributes)|(ignore)|())',
    '*.((svn)|(bzr)|(hg)|(pub)|(nano_history))$',
    '*phpMyAdmin*',
    '*htaccess.txt',
    '*readme.((txt)|(html)|(htm)|(md))',
    '*license.txt',
    '*bitrix/*',
    '*.php*',
    '*.xml$',
    '*.txt$',
    '*/plugins/*',
    '^/gen204*',
    '^/register*',
    '^/((administrator)|(manager))*',
    '^/book$',
    '^/blog/*',
    '^/undefined',
    '^/core/*',
    '^/feeds/*',
    '^/search$',
    '^/advanced_search$',
    '^/language_tools*',
    '^/installation*',
    '^/l/*',
    '^/so1*'                               ].map( url => ({type:'bait',url}) ))

module.exports = (DAL, Data, Shared, Lib) => ({

  exec(cb) {
    var r = {}
    for (var type of DAL.ENUM.REDIRECT.TYPE) r[type] = []

    var cfg = _.get(config,'routes.rules')
    if (!cfg) return cb(null, r)

    DAL.Redirect.getAll({ sort: { to: -1 }}, (e, all) => {
      if (e) return cb(e)

      // Collect rules by type
      for (var {type,url,to} of concatExperimental(all)) {
        if (/410|501|bait/.test(type))
          r[type].push(url)
        else
          r[type].push(assign({ url }, to === undefined ? {} : { to: `${to}` }))
      }



      // {-- TODO cleanup + move to more appropriate place
      if (!cfg.posts) return cb(null, r)

      DAL.Post.getManyByQuery({'history.published':{$exists:true, $lt: new Date}},
        { select:'_id slug title tags htmlHead.canonical htmlHead.ogImage' },
        (e, posts) => {
          //-- used for post/thumb/{_id}
          cache.posts = {}
          posts.forEach(p => cache.posts[p._id] = { slug: p.slug, ogImg: p.htmlHead.ogImage, url: p.htmlHead.canonical })
          r['canonical-post'] = posts.map(p => ({
            id: p.slug,
            url: p.htmlHead.canonical.replace(/^(https|http)/,'')
                                     .replace('://www.airpair.com','')
                                     .replace('++','\\+\\+')
                                   }))

          var tagpages = {}
          for (var tags of _.pluck(posts, 'tags'))
            for (var {_id} of tags)
              tagpages[_id] = tagpages[_id] ? tagpages[_id]+1 : 1

          // $log('tags', tagpages)
          DAL.Tag.getManyById(Object.keys(tagpages), (ee, tags) => {
            r['canonical-tag'] = tags.map(t => {

              var url = `/${t.slug}`.replace('++','\\+\\+')

              if (t.slug == 'angularjs')
                url = `/${t.slug}/posts`
              else
                r['301'].push({url:`^${url}/((post)|(workshop))s$`, to: url })

              return { id: t._id, count: tagpages[t._id], url }
            })
            cb(null, r)
          })
        })
      // --}
    })
  }

})
