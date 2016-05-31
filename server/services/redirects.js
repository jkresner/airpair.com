var opts = { select: '_id url to type', sort: { 'to': -1 } }

module.exports = {

  getForCache(cb) {
    var cfg = _.get(config,'routes.httpRules')
    var r = {}

    for (var type of DAL.ENUM.REDIRECT.TYPE) r[type] = []
    if (!cfg) return cb(null, r)

    DAL.Redirect.getAll(opts, (e,all) => {
      if (e) return cb(e)

      all = all.concat(
       ['/rules.abe'                            ].map( url => ({type:'501',url}) ),

       ['/android/UX-RX.com', //bing?
        '/static/js/index-*',
        '/images/landing/airconf*'              ].map( url => ({type:'410',url,to:'/'}) ),


        //
        // { match: '%20%e2%80%a6', to: '' },
        //((so)|(gh)|(gp)|(al)|(bb)|(in)|(sl)|(tw))+-
       [{ type:'rewrite', url: '%E2%80%A6', to: '' },
        { type:'rewrite', url: '/static/img/icons/', to: 'https://static.airpair.com/img/icons/' },
        { type:'rewrite', url: '/posts/tag/angularjs', to: '/angularjs/posts' },
        { type:'rewrite', url: '/posts/tag/', to: '/' },
        { type:'rewrite', url: '\\.\\.\\.', to: '' }
        ],

       config.routes.landing.tags.top.split('|').map(t => ({
          type:'301', url:`/${t}/posts`, to:`/${t}` })),

       [
        { type: '301', url: '/seo/node.js-nginx-wordpress-seo', to: '/nginx' },
        { type: '301', url: '/v1/img/css/header/logo.png', to:'https://static.airpair.com/img/header/logo.png' },
        { type: '301', url: '/node_js', to:'/node.js' },
        { type: '301', url: '/javascript/emberjs-vs-angularjs-opinions-contributors-video-chat', to:'/javascript' },
        { type: '301', url: '/javascript/javascript-performance-yehuda-katz', to:'/javascript' },
        { type: '301', url: '^/airconf-promo/*', to: '/software-experts'},
        { type: '301', url: '/android/andriod-studio-vs-eclipse', to: '/android/android-studio-vs-eclipse' },
        { type: '301', url : "/selenium/posts/selenium-tutorial-with-java\\).", to: "/selenium/posts/selenium-tutorial-with-java" },
        { type: '301', url: '*seb-insua*', to: '/keen-io' },
        { type: '301', url: '*(radu-spineanu|james-lamont)*', to: '/software-experts' }
       ],

       [
        { type: '302', url: '/me/joefiorini', to: '/javascript/emberjs-using-ember-cli' },
       ],

       ['/images/pages/marketing*',
        '/images/landing/airconf*',
        '/s3.amazonaws.com/kennyonetime/blob*',
        '/s3.amazonaws.com/kennyonetime/blob',
        '/imgur.com/bgLW1vi.jpg',
        '/i.imgur.com/2BZcKa5.png',
        '/i.imgur.com/4e1rZ1s.jpg',
        '/i.imgur.com/hyPI51H.png',
        '/i.stack.imgur.com/JnpBV.png',
        '/https//imgur.com/wLgquTL.jpg',
        '*fckeditor*',
        '*fontawesome*',
        '*phpMyAdmin*',
        '*htaccess.txt',
        '*readme.txt',
        '*readme.html',
        '*license.txt',
        '*bitrix/*',
        '*.xml$',
        '*/plugins/*',
        '^/administrator*',
        '^/blog/*',
        '^/undefined',
        '^/feeds/*',
        '^/so1*'                               ].map( url => ({type:'bait',url}) ))


      for (var {type,url,to} of all)
        r[type].push({to:`${to}`, url })

      if (!cfg.posts) return cb(null, r)

      DAL.Post.getManyByQuery({'history.published':{$exists:true, $lt: new Date}},
        { select:'_id slug title tags htmlHead.canonical htmlHead.ogImage' },
        (e, posts) => {
          //-- used for post/thumb/{_id}
          cache.posts = {}
          posts.forEach(p => cache.posts[p._id] = { slug: p.slug, ogImg: p.htmlHead.ogImage, url: p.htmlHead.canonical })
          r['canonical-post'] = posts.map(p => ({
            slug: p.slug,
            url: p.htmlHead.canonical.replace(/^(https|http)/,'')
                                     .replace('://www.airpair.com','')
                                     .replace('++','\\+\\+') }))
          // console.log('after\n'.green + r['canonical-post'].map(p=>p.to.white).sort().join('\n'))

          var tagpages = {}
          for (var tags of _.pluck(posts, 'tags'))
            for (var {_id} of tags)
              tagpages[_id] = tagpages[_id] ? tagpages[_id]+1 : 1

          // $log('tags', tagpages)
          DAL.Tag.getManyById(Object.keys(tagpages), (ee, tags) => {
            // $log('tags', tags)
            r['canonical-tag'] = tags.map(t => ({
              url: t.slug == 'angularjs' ? `/${t.slug}/posts` : `/${t.slug}`.replace('++','\\+\\+'),
              id: t._id, count: tagpages[t._id] })
            )
            cb(null, r)
          })
        })
    })
  }

}
