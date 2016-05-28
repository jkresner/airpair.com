var opts = { select: '_id previous current type', sort: { 'current': -1 } }

module.exports = {

  getForCache(cb) {
    var cfg = _.get(config,'routes.httpRules')
    var r = {}

    for (var type of DAL.ENUM.REDIRECT.TYPE) r[type] = []
    if (!cfg) return cb(null, r)

    DAL.Redirect.getAll(opts, (e,all) => {
      if (e) return cb(e)

      all = all.concat(
       ['/.well-known/dnt-policy.txt',
        '/rules.abe'                            ].map( previous => ({type:'501',previous}) ),

       [//'*airconf-promo',
        '/static/img/icons/gh-white.png',
        '/images/landing/airconf*'              ].map( previous => ({type:'410',previous,current:'/'}) ),

        // { match: '%E2%80%A6', to: '' },
        // { match: '%20%e2%80%a6', to: '' },
        // { match: /%20\.\.\./i, to: '%20...' }  //?
        // { match: /\.\.\./, to: '' },
       [{ type:'rewrite', previous: '^/static/img/pages/postscomp/(prize|logo)-', current: '/img/software/' },
        // { type:'rewrite', previous: '\\.\\.\\.', current: '' }
        ],

       config.routes.landing.tags.top.split('|').map(t => ({
          type:'301', previous:`/${t}/posts`, current:`/${t}` })),

       [{ type:'301', previous: '/dashboard', current: '/home'},
        { type:'301', previous: '/logout', current: '/auth/logout'},
        { type:'301', previous: '/author/*', current: '/software-experts'},
        { type:'301', previous: '/c\\+\\+', current: '/posts/tag/c++'},
        { type:'301', previous: '*/workshops', current: '/workshops'}],

       ['/images/pages/marketing*',
        '/images/landing/airconf*',
        '*fontawesome*',
        '*phpMyAdmin*',
        '*htaccess.txt',
        '*readme.txt',
        '*readme.html',
        '*license.txt',
        '/so19*'                               ].map( previous => ({type:'bait',previous}) ))


      for (var {type,previous,current} of all)
        r[type].push({to: current,
          match: `${previous}` })  //${type.match('canonical')?'':'$'}`.replace('*$','*')

      if (!cfg.posts) return cb(null, r)

      DAL.Post.getManyByQuery({'history.published':{$exists:true, $lt: new Date}},
        { select:'_id slug title htmlHead.canonical htmlHead.ogImage' },
        (e, posts) => {
          // console.log('before\n'.white, r['canonical-post'].map(p=>p.to.gray).sort().join('\n'))
          //-- used for post/thumb/{_id}
          cache.posts = {}
          posts.forEach(p => cache.posts[p._id] = { slug: p.slug, ogImg: p.htmlHead.ogImage, url: p.htmlHead.canonical })
          r['canonical-post'] = posts.map(p => ({
            slug: p.slug,
            url: p.htmlHead.canonical.replace(/^(https|http)/,'')
                                     .replace('://www.airpair.com','')
                                     .replace('++','\\+\\+') }))
          // console.log('after\n'.green + r['canonical-post'].map(p=>p.to.white).sort().join('\n'))
          cb(null, r)
        })
    })
  },

  getAllRedirects(cb) {
    DAL.Redirect.getAll(opts, cb)
  },

  createRedirect(o, cb) {
    o.created = new Date()
    DAL.Redirect.create(o, cb)
  },

  deleteRedirectById(_id, cb) {
    DAL.Redirect.delete({_id}, cb)
  }

}
