var bots = {
  bing: /((157.55.39)|(40.77.167))\./,   // http://www.bing.com/toolbox/verify-bingbot-verdict
  // yandex: '', // https://yandex.com/support/webmaster/robot-workings/check-yandex-robots.xml
}


var concatExperimental = all =>
  all.concat(

   [
    { type:'501', url: '/browserconfig.xml' },
    { type:'501', url: '/apple-app-site-association' }
   ],

   [
    '/page-sitemap.xml',
    '/our-customers',
    '/preferences',
    '/((customer)|(expert))-faq',
    '/account/signup',
    '/android/UX-RX.com',
    '/backbone-js/backbone-js-experts*',
    '/find-an-expert/request',
    '/graph-database/posts/graph-database-expert-wes-freeman-1',
    '/jobs/((08-10/editorial-manager)|(full-stack-product-developer))',
    '/((lxc)|(cryptocurrency))/workshops',
    '/mean-stack/posts/2014-10-job-post-mean-stack-developer',
    '/mean-stack/90-days-of-airpairing-on-airpair',
    '/me/((dzello)|(mksm)|(ehrenreilly)|(shivangdoshi))',
    '/python/posts/python-code-mentoring-web-scraping-1',
    '/tag/spreadsheets',
    '/testing/posts/airpair-v1-beta-testing',
    '/todo-tech',
    '/sem',
    '/seo/seo-focused-blogging-strategy',
    '*rubykoans*',
    '/((wordpress)|(ruby-on-rails)|(android)|(python)|(devops))/rss',
    '/img/((in)|(tw)|(airpair)).png',
    '/images/logo4.png',
    '/images/avatars/nathan_ward.png',
    '/images/pages/marketing*',
    '/images/homepage/step1brief.png',
    '/images/landing/airconf*',
    '/static/fonts/k3k702ZOKiLJc3WVjuplzKRDOzjiPcYnFooOUGCOsRk.woff',
    '/static/img/css/sort-arrows.png',
    '/static/img/css/blog/example2.jpg',
    '/static/img/css/bookmark.png',
    '/static/img/css/sidenav/sprite.png',
    '/static/img/pages/postscomp/banner.jpg',
    '/static/img/ra1-icoset.png',
    '/static/js/index-*',
    '/v1/img/css/bookmark.png',
    '/v1/img/css/sidenav/bookmark.png',
    '/v1/img/css/tags/angularjs-og.png',
    '/v1/auth/login',
    '/v1/posts/quick-guide-to-the-airpair-expert-cms',

    ].map( url => ({type:'410',url,to:'/'}) ), [

    // { match: '%20%e2%80%a6', to: '' },
    //((so)|(gh)|(gp)|(al)|(bb)|(in)|(sl)|(tw))+-
    { type:'rewrite', url: '%E2%80%A6', to: '' },
    { type:'rewrite', url: '\\]$', to: '' },
    { type:'rewrite', url: '%22$', to: '' },
    { type:'rewrite', url: '&quot;$', to: '' },
    { type:'rewrite', url: '\\.\\.\\.', to: '' },
    { type:'rewrite', url: '^/posts/((edit|fork))', to: 'https://author.airpair.com/edit' },
    { type:'rewrite', url: '^/posts/contributors', to: 'https://author.airpair.com/activity' },
    { type:'rewrite', url: '/sqlserver$', to: '/sql-server' },
    { type:'rewrite', url: '/posts/tag/angularjs', to: '/angularjs/posts' },
    { type:'rewrite', url: '/posts/tag/node', to: '/node.js' },
    { type:'rewrite', url: '/posts/tag/', to: '/' },
    { type:'rewrite', url: '/images/icons/', to: 'https://static.airpair.com/img/icons/' },
    { type:'rewrite', url: '/static/img/icons/', to: 'https://static.airpair.com/img/icons/' },
    { type:'rewrite', url: '^((/i.stack.)|(/i.)|(/))imgur.com/*', to: 'https://i.imgur.com/' }
    ],

   [
    { type:'301', url: '/posts/new', to: 'https://author.airpair.com/new' },
    { type:'301', url: '/posts/submit', to: 'https://author.airpair.com/submit' },
    { type:'301', url: '/posts/me', to: 'https://author.airpair.com/write' },
    { type:'301', url: '*expert-guide*', to: 'https://consult.airpair.com/'},
    { type:'301', url: '/posts/review/5664fc66760815e9036b9c43',  to: '/mean-stack' }, //(meanair docs)
    { type:'301', url: '/posts/review/55635b0ce7480311007471ee', to: '/neo4j' },
    { type:'301', url: '/posts/review/551c28bbe97183110061a0b8None', to: '/posts/review/551c28bbe97183110061a0b8' },
    { type:'301', url: '/((tag/screenhero)|(pair-programmers/post))', to: '/pair-programing' },
    { type:'301', url: '/be-an-expert/info', to: 'https://consult.airpair.com/'},
    { type:'301', url: '^/c%2B%2B', to: '/c++'},
    { type:'301', url: '/c%20%20/posts/preparing-for-cpp-interview', to: '/c++/posts/preparing-for-cpp-interview' },
    { type:'301', url: '^/f$', to: '/f#' },
    { type:'301', url: '/airconf',  to: '/workshops' },
    { type:'301', url: '^/airconf-promo/*', to: '/software-experts'},
    { type:'301', url: '^/airconf2014/keynote*', to: '/software-experts'},
    { type:'301', url: '/railsconf2014', to: '/ruby-on-rails' },
    { type:'301', url: '/agile/guide-to-implementing-agile', to: '/agile/posts/guide-to-implementing-agile' },
    { type:'301', url: '/ruby-on-rails-tutoring', to: '/ruby-on-rails' },
    { type:'301', url: '/ruby-on-rails-4/posts/building-faster-with-rails-code-mentors-1', to: '/ruby-on-rails' },
    { type:'301', url: '/((ruby)|(ruby-on-rails/posts))/ruby-problem-solving-for-sendwith*',  to: '/ruby' },
    { type:'301', url: '/performance-testing/performance-testing-expert', to: '/performance' },
    { type:'301', url: '/code-mentoring/ruby-on-rails', to: '/ruby-on-rails' },
    { type:'301', url: '/code-mentoring/.net', to: '/.net' },
    { type:'301', url: '/code-mentoring/ios', to: '/ios' },
    { type:'301', url: '/ios/posts/ios-training-for-couch-1', to: '/ios' },
    { type:'301', url: '/php/((posts/php-code-mentoring-1)|(troubleshooting-chris-christoff))', to: '/php' },
    { type:'301', url: '/angularjs/posts/expert-training-author-ari-lerner-1', to: 'angularjs/expert-training-author-ari-lerner' },
    { type:'301', url: '/angularjs/posts/creating-container-components-part-((1-angular-1)|(3-angular-1)|(2-angular-2))-directive*', to: '/angularjs/posts' },
    { type:'301', url: '/angularjs/posts/creating-components-p((1-angular2))-directives', to: '/angularjs/posts' },
    { type:'301', url: '/angularjs/post$', to: '/angularjs/posts' },
    { type:'301', url: '/images/logos/oauth-logo.png', to: 'https://static.airpair.com/img/brand/oauth.png' },
    { type:'301', url: '/static/img/pages/posts/((social-authoring)|(authoring-flow)).png', to:'https://static.airpair.com/img/author/authoring-flow.png' },
    { type:'301', url: '/static/img/css/tags/angularjs-og.png', to: '/img/software/angularjs.png' },
    { type:'301', url: '/static/img/external/ap-oauth-google-120x60.png', to:'https://static.airpair.com/img/brand/ap-oauth-google-120x60.png' },
    { type:'301', url: '/v1/img/css/header/logo.png', to:'https://static.airpair.com/img/header/logo.png' },
    { type:'301', url: '*wLgquTL*', to: 'https://i.imgur.com/wLgquTL.png' },
    { type:'301', url: '*uRjl961*', to: 'https://i.imgur.com/uRjl961.png' },
    { type:'301', url: '*5hBaFmd*', to: 'https://i.imgur.com/5hBaFmd.png' },
    { type:'301', url: '*hXd3SP8*', to: 'https://i.imgur.com/hXd3SP8.png' },
    { type:'301', url: '*yl1ojjt*', to: 'https://i.imgur.com/yl1ojjt.png' },
    { type:'301', url: '*ldB4y2w*', to: 'https://i.imgur.com/ldB4y2w.jpg' },
    { type:'301', url: '/(((nodejs)|(node_js)/posts)|(node_js)|(node))', to:'/node.js' },
    { type:'301', url: '/knockout/posts/top-10-mistakes*', to:'/knockout/posts/top-10-mistakes-knockoutjs' },
    { type:'301', url: '/knockout/posts', to:'/knockout.js' },
    { type:'301', url: '/backbone.js/posts/expert-training-jonathon-kresner-1', to: '/backbone.js' },
    { type:'301', url: '/javascript/javascript-code-review', to: '/javascript' },
    { type:'301', url: '/jquery/jquery-((code-review)|(problem-solving))', to: '/javascript' },
    { type:'301', url: '/javascript/posts/which-async-javascript-libraries-should-i-use', to: '/javascript/async-javascript-libraries' },
    { type:'301', url: '/ember.js/posts/ember.js-tutorial-using-ember-cli', to: '/javascript/emberjs-using-ember-cli' },
    { type:'301', url: '/javascript/((emberjs-vs-angularjs-opinions-contributors-video-chat)|(syncify-tutorial))', to:'/javascript' },
    { type:'301', url: '/javascript/((posts/javascript-teacher-aldo-bucchi-1)|(javascript-performance-yehuda-katz))', to:'/javascript' },
    { type:'301', url: '/angularjs/posts/expert-matias-niemela-1', to:'/angularjs/posts/component-based-angularjs-directives' },
    { type:'301', url: '/seo/node.js-nginx-wordpress-seo', to: '/nginx' },
    { type:'301', url: '/ruby-on-rails/posts/authentication-with-angularjs-and-ruby-on-railshttp://jes.al/2013/08/authentication-with-rails-devise-and-angularjs/', to: '/ruby-on-rails/posts/authentication-with-angularjs-and-ruby-on-rails'},
    { type:'301', url: '/paypal/posts/paypal-support-and-api-integration-help', to: '/salesforce/expert-daniel-ballinger' },
    { type:'301', url: '/laravel/posts/automating-laravel-deploy', to: '/laravel/posts/automating-laravel-deployments-using-capistrano' },
    { type:'301', url: '/salesforce/posts/expert-daniel-ballinger-1', to: '/salesforce/expert-daniel-ballinger' },
    { type:'301', url: '/excel/expert-training-phd-felienne-hermans', to: '/excel/expert-training-professor-felienne-hermans' },
    { type:'301', url: '^/js/integrating-stripe-into*', to: '/javascript/integrating-stripe-into-angular-app' },
    { type:'301', url: '/javascript/integrating-stripe-into-angular-app>', to: '/javascript/integrating-stripe-into-angular-app' },
    { type:'301', url: '*android-code-((review|mentoring))*', to: '/android' },
    { type:'301', url: '/code-mentoring/posts/airpairs-been-turning-into-my-iphone-1', to: '/code-review' },
    { type:'301', url: '/ionic-framework/((posts/i)|(i))onic-socketio-chat-application-tutorial', to: '/ionic' },
    { type:'301', url: '/posts/tag/creating-a-photo-gallery-in-android-studio-with-list-fragments', to: '/android' },
    { type:'301', url: '/android/((android-problem-solving)|(button-fragment-android-studio))', to: '/android' },
    { type:'301', url: '/android-camera/posts/the-ultimate-android-camera-development-guide', to: '/android/android-camera-development' },
    { type:'301', url: '/android/andriod-studio-vs-eclipse', to: '/android/android-studio-vs-eclipse' },
    { type:'301', url: '/machine-learning/posts/machine-learning-expert-alexandre-gravier-1', to: '/android/android-studio-vs-eclipse' },
    // '/node.js/getting-started-with-docker-for-nodejs-dev'
    // '/node.js/posts/getting-started-with-docker-for-the-nodeis-dev'
    // '/node.js/post/getting-started-with-docker-for-the-node-dev',
    // '/node_js/posts/getting-started-withdocker-for-the-nodejs-dev'
    // '/node.js/posta/getting-started-with-docker-for-the-nodejs-dev',
    { type:'301', url: '/node.js/((posts/learn-node((js)|(.js)))|(learn-node.js)|(node.js-code-mentoring))', to: '/node.js/learn-nodejs' },
    { type:'301', url: '/node.js/posts/top-10-mistakes-node-d((49|85))', to:'/node.js/posts/top-10-mistakes-node-developers-make' },
    { type:'301', url: '/javascript/node', to: '/node.js' },
    { type:'301', url: '/swift/posts/swift-tutorial-building-an-ios-application-part-3', to: '/swift/building-swift-app-tutorial-3' },
    { type:'301', url: '/angularjs/((buidling-angularjs-app-tutorial)|(posts/angularjs-tutorial-building-a-web-app-in-5-minutes))', to: '/angularjs/building-angularjs-app-tutorial' },
    { type:'301', url: '/haskell/posts/haskell*', to: '/haskell-tutorial/intro-to-haskell-web-apps' },
    { type:'301', url: '/java/java-problem-solving', to: '/java' },
    { type:'301', url: '/selenium/posts/selenium-tutorial-with-java\\).', to: '/selenium/posts/selenium-tutorial-with-java' },
    { type:'301', url: '/firebase/posts/firebase-support-and-api-integration-help', to: '/firebase' },
    { type:'301', url: '/heroku/posts/heroku-support-integration-help', to: '/heroku' },
    { type:'301', url: '/meteor/posts/meteor-support-expert-help', to: '/meteor' },
    { type:'301', url: '/api/survey-results/q1-tools', to: '/api' },
    { type:'301', url: '/api-survey/posts/api-ification-of-the-web-2014-q1-1', to: '/api' },
    { type:'301', url: '/sendgrid/posts/sendgrid-salesforce-apex-library-1',  to: '/email' },
    { type:'301', url: '/salesforce/posts/support-and-api-integration-help-with-salesforce',  to: '/software-experts' },
    { type:'301', url: '/evernote/posts/evernote-support-api-integration-help', to: '/api' },
    { type:'301', url: '/tokbox/posts/tokbox-support-and-api-integration-help', to: '/api' },
    { type:'301', url: '/twitter/posts/support-and-api-integration-help-with-twitter', to: '/twitter-api' },
    { type:'301', url: '/mixpanel/posts/mixpanel-support-api-integration-help', to: '/analytics' },
    { type:'301', url: '*((paul-sobocinski)|(harry-zhang))*', to: '/php' },
    { type:'301', url: '*((ran-nachmany))*', to: '/android' },
    { type:'301', url: '*((tim-koopmans))*', to: '/devops' },
    { type:'301', url: '*((jason-sturges)|(vasco-pedro))*', to: '/javascript' },
    { type:'301', url: '*((ashish-awaghad)|(jason-adam)|(josh-kuhn)|(jason-adam))*', to: '/swift' },
    { type:'301', url: '*((david-kay)|(nevan-king)|(reynaldo-gonzales))*', to: '/ios' },
    { type:'301', url: '*((ye-liu)|(dana-de-alasei)|(tony-child)|(tobias-talltorp))*', to: '/angularjs/posts' },
    { type:'301', url: '*web-scraping-phantomjs-session*',  to: '/node.js' },
    { type:'301', url: '*((ryan-schmukler)|(peter-lyon)|(tim-caswell)|(philip-thomas))*', to: '/node.js' },
    { type:'301', url: '*((justin-gordon)|(fernando-villalobos))*', to: '/ruby' },
    { type:'301', url: '*((seb-insua)|(jordan-feldstein)|(thomson-nguyen))*', to: '/keen-io' },
    { type:'301', url: '/((framed-data)|(/www.framed.io)|(vero)|(blossom)|(venmo)|(human-api)|(sendswithus))*', to: '/software-experts' },
    { type:'301', url: '^/((echonest)|(bit.ly)|(echo-nest)|(tokbox)|(twotap)|(hellosign)|(flydata)|(sinch)|(spotify)|(mailjet)|(unbabel))', to: '/software-experts' },
    { type:'301', url: '^/((knockout)|(knockoutjs)|(unity)|(unity3d)|(magento)|(gamedev)|(unity3d)|(backbone))$', to: '/software-experts' },
    { type:'301', url: '/angularjs2', to: '/angular2' },
    { type:'301', url: '/bitly', to: '/api' },
    { type:'301', url: '/mean', to: '/mean-stack' },
    { type:'301', url: '/selenium-2', to: '/selenium' },
    { type:'301', url: '/report', to: '/reporting' },
    { type:'301', url: '/python-2.7', to: '/python' },
    { type:'301', url: '/codeigniter-2', to: '/php' },
    { type:'301', url: '/ab-testing', to: '/analytics' },
    { type:'301', url: '/((sendwithus)|(email-ab-testing))', to: '/email' },
    { type:'301', url: '/google-app-engine', to: '/python' },
    { type:'301', url: '/rubymotion', to: '/ruby' },
    { type:'301', url: '/hapi', to: '/hapijs' },
    { type:'301', url: '/phantomjs',  to: '/node.js' },
    { type:'301', url: '/java8',  to: '/java' },
    { type:'301', url: '/((xamarin)|(core-location))',  to: '/ios' },
    { type:'301', url: '/ember-cli',  to: '/ember.js' },
    { type:'301', url: '/.net-4.0',  to: '/.net' },
    { type:'301', url: '/socketio',  to: '/node.js' },
    { type:'301', url: '/((amazon-r)|(r))edshift',  to: '/aws' },
   ],

   [
    { type:'302', url: '/hire-developers', to: '/' },
    { type:'302', url: '/settings', to: '/account' },
    { type:'302', url: '/aws/posts/building-a-scalable-web-app-on-amazon-web-services-p2', to: '/aws' },
    { type:'302', url: '^/c$', to: '/c#' },
    { type:'302', url: '/((support)|(contact))', to: 'https://github.com/airpair/airpair-com-issues/issues' },
    { type:'302', url: '^/experts', to: '/software-experts' },
    { type:'302', url: '^/experts/page/*', to: '/software-experts' },
    { type:'301', url: '/jobs', to: '/software-experts' },
    { type:'302', url: '^/training', to: '/software-experts' },
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
    { type:'302', url: '/me/brianmhunt', to: '/knockout/workshops/dynamic-html-with-knockout' },
    { type:'302', url: '/me/ronlichty', to: '/agile-software/coach-and-trainer-ron-lichty' },
    { type:'302', url: '/me/elfoslav', to: '/meteor' },
    { type:'302', url: '/me/gnomeontherun', to: '/ionic-framework/posts/the-definitive-ionic-starter-guide' },
   ],

  [
    '*900x90.1.lob.png*',
    '^/900x90.q2-1.*',
    '^/220x250.q2-1.*',
    '/misc/((ajax)|(drupal)|(tableheader)).js',
    '/media/((com_finder)|(editors)|(jui))/*',
    '/admin',
    '*/admin/*',
    '*/skins/*',
    '/CHANGELOG',
    '/INSTALL',
    '/MAINTAINERS',
    '/addon.css',
    '*data:image/png;base64*',
    '*impressum*',
    '*editor/filemanage*',
    '*.editorconfig*',
    '/media/com_joomla*',
    '/wp-((content)|(includes)|(config)|(admin))*',
    '*khpcanbeojalbkpgpmjpdkjnkfcgfkhb*',
    '*cpstyles/vBulletin*',
    '*index.action*',
    '*document.lastModified*',
    '*.parentNode*',
    '*.git((attributes)|(ignore)|())',
    '*.((svn)|(bzr)|(hg)|(pub)|(nano_history))$',
    '*phpMyAdmin*',
    '*htaccess.txt',
    '*license.txt',
    '*bitrix/*',
    '*.php*',
    '*.xml$',
    '*.txt$',
    '^/((administrator)|(manager))*',
    '/_vti_bin/*',
    '/NewsType.asp',
    '/js/registration_rules.asp',
    '/includes/showdebuginfo/serverDetails.as*`',
    '^/core/*',
    '^/feeds/*',
    '^/advanced_search$',
    '^/language_tools*',
    '^/installation*',                               ].map( url => ({type:'ban',url}) ),

  [
    '*readme.((txt)|(html)|(htm)|(md))', // malformed post could blocks folks ...
    '^/book$',
    '^/blog/*',
    '^/gen204*',
    '^/hqdefault*',
    '^/feeds/*',
    '^/null/*',
    '^/a/*',
    '^/l/*',
    '^/so1*',
    '^/so2*',
    '^/search$',
    '^/undefined',
    '/angula',
    '/node.js.js',
    '/register',
    '/static/img/static/img/*',
    '/1\\+*',
    '/s3.amazonaws.com/kennyonetime/blo*',
    '/firebase/posts/firebase-building-realtime-app.json',
    '*fckeditor*',
    '*fontawesome*',
    '*/plugins/*',
    // '*/Magneto*',
    '*/register$',
  ].map( url => ({type:'bait',url}) ))

module.exports = (DAL, Data, Shared, Lib) => ({

  exec(cb) {
    var r = { ban: [] }
    for (var type of DAL.ENUM.REDIRECT.TYPE) r[type] = []

    var cfg = _.get(config,'routes.rules')
    if (!cfg) return cb(null, r)

    DAL.Redirect.getAll({ sort: { to: -1 }}, (e, all) => {
      if (e) return cb(e)

      // Collect rules by type
      for (var {type,url,to} of concatExperimental(all)) {
        if (/410|501|ban|bait/.test(type))
          r[type].push(url)
        else
          r[type].push(assign({ url }, to === undefined ? {} : { to: `${to}` }))
      }

      // {-- TODO cleanup + move to more appropriate place
      if (!cfg.posts) return cb(null, r)

      DAL.Post.getManyByQuery({'history.published':{$exists:true, $lt: new Date}},
        { select:'_id by._id slug title tags htmlHead.canonical htmlHead.ogImage' },
        (e, posts) => {
          //-- used for post/thumb/{_id}
          cache.posts = {}
          posts.forEach(p => cache.posts[p._id] = { slug: p.slug, ogImg: p.htmlHead.ogImage, url: p.htmlHead.canonical, by: p.by._id, title: p.title })
          var tagged = {}, by = {};
          for (var {tags,by} of posts) {
            by[by._id] = by[by._id] ? by[by._id]+1 : 1

            for (var {_id} of tags)
              tagged[_id] = tagged[_id] ? tagged[_id]+1 : 1
          }

          r['canonical'] = { stats: { posts: { published: posts.length, by, tagged } } }
          r['canonical'].post = posts.map(p => ({
            id: p.slug,
            url: p.htmlHead.canonical.replace(/^(https|http)/,'')
                                     .replace('://www.airpair.com','')
                                     .replace('++','\\+\\+')
                                   }))


          r['canonical'].tag = _.sortBy(Object.keys(tagged)
            .map(id => cache.tags[id])
            .map(t => {
              var url = `/${t.slug}`.replace('++','\\+\\+')
              if (t.slug == 'angularjs')
                url = `/${t.slug}/posts`
              else
                r['301'].push({url:`^${url}/((post)|(workshop))s$`, to: url })

              return assign(t, { posts: tagged[t._id], url })
            }), 'name')

          cb(null, r)
        })
    })
  }

})
