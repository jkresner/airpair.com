var concatExperimental = all =>
  all.concat(

   [
    { type:'501', url: '/apple-app-site-association' }
   ],

   ['/v1/auth/login',
    '/testing/posts/airpair-v1-beta-testing',
    '/jobs/08-10/editorial-manager',
    '/android/UX-RX.com', //bing?
    '/((wordpress)|(ruby-on-rails)|(android))/rss',
    '/static/js/index-*',
    '/me/ehrenreilly',
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
    // { type: '301', url: '/Ruby', to: '/ruby' },
    { type:'301', url: '^/f$', to: '/f%23' },
    { type:'301', url: '^/airconf-promo/*', to: '/software-experts'},
    { type:'301', url: '/railsconf2014', to: '/ruby-on-rails' },
    { type:'301', url: '/angularjs/post$', to: '/angularjs/posts' },
    { type:'301', url: '/v1/img/css/header/logo.png', to:'https://static.airpair.com/img/header/logo.png' },
    { type:'301', url: '/((node_js)|(node))', to:'/node.js' },
    // { type:'301', url: '^/posts/me$', to: 'https://author.airpair.com/' },
    { type:'301', url: '/knockout/posts', to:'/knockout.js' },
    { type:'301', url: '/backbone.js/posts/expert-training-jonathon-kresner-1', to: '/backbone.js' },
    { type:'301', url: '/android-camera/posts/the-ultimate-android-camera-development-guide', to: '/android/android-camera-development' },
    { type:'301', url: '/javascript/emberjs-vs-angularjs-opinions-contributors-video-chat', to:'/javascript' },
    { type:'301', url: '/javascript/javascript-performance-yehuda-katz', to:'/javascript' },
    { type:'301', url: '/seo/node.js-nginx-wordpress-seo', to: '/nginx' },
    { type:'301', url: '/node.js/((posts/learn-node((js)|(.js)))|(learn-node.js))', to: '/node.js/learn-nodejs' },
    { type:'301', url: '/android/andriod-studio-vs-eclipse', to: '/android/android-studio-vs-eclipse' },
    { type:'301', url : "/selenium/posts/selenium-tutorial-with-java\\).", to: "/selenium/posts/selenium-tutorial-with-java" },
    { type:'301', url: '*ashish-awaghad*', to: '/swift' },
    { type:'301', url: '/firebase/posts/firebase-support-and-api-integration-help', to: '/firebase' },
    { type:'301', url: '/meteor/posts/meteor-support-expert-help', to: '/meteor' },
    { type:'301', url: '*((seb-insua)|(jordan-feldstein))*', to: '/keen-io' },
    { type:'301', url: '*((nicholas-rempel)|(leore-avidar)|(justin-keller)|(trey-swann)|(radu-spineanu)|(james-lamont)|(julien-lemoine)|(christian-jensen)|(orlando-kalossakas)|(glen-de-cauwsemaecker)|(greg-schier))*', to: '/software-experts' },
    { type:'301', url: '/((vero)|(venmo)|(human-api))*', to: '/software-experts' },
    { type:'301', url: '^/((bit.ly)|(echo-nest)|(tokbox)|(twotap)|(hellosign)|(flydata)|(sinch)|(spotify)|(mailjet))', to: '/software-experts' },
    { type:'301', url: '^/((knockout)|(knockoutjs)|(unity)|(unity3d)|(magento)|(gamedev)|(unity3d)|(backbone))$', to: '/software-experts' },
   ],

   [
    { type:'302', url: '^/c$', to: '/c%23' },
    { type:'302', url: '/support', to: 'https://github.com/airpair/airpair-com-issues/issues' },
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
   ],

  [ '/wp-((content)|(includes)|(config)|(admin))*',
    '/images/pages/marketing*',
    '/images/landing/airconf*',
    '/s3.amazonaws.com/kennyonetime/blob*',
    '/s3.amazonaws.com/kennyonetime/blob',
    '*.editorconfig*',
    '*fckeditor*',
    '*fontawesome*',
    '*.git((attributes)|(ignore))',
    '*phpMyAdmin*',
    '*htaccess.txt',
    '*readme.((txt)|(html)|(htm)|(md))',
    '*license.txt',
    '*bitrix/*',
    '*.php*',
    '*.xml$',
    '*.txt$',
    '*/plugins/*',
    '^/administrator*',
    '^/blog/*',
    '^/undefined',
    '^/core/*',
    '^/feeds/*',
    '^/search$',
    '^/advanced_search$',
    '^/language_tools*',
    '^/preferences',
    '^/installation*',
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
                                     .replace('++','\\+\\+') }))

          var tagpages = {}
          for (var tags of _.pluck(posts, 'tags'))
            for (var {_id} of tags)
              tagpages[_id] = tagpages[_id] ? tagpages[_id]+1 : 1

          // $log('tags', tagpages)
          DAL.Tag.getManyById(Object.keys(tagpages), (ee, tags) => {
            r['canonical-tag'] = tags.map(t => {
              var url = `/${t.slug}`.replace('++','\\+\\+')
              t.slug == 'angularjs' ? url = `/${t.slug}/posts`
                : r['301'].push({url:`${url}/posts`,to:url})

              return { id: t._id, count: tagpages[t._id], url }
            })
            cb(null, r)
          })
        })
      // --}
    })
  }

})
