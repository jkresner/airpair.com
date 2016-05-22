var opts = { select: '_id previous current type', sort: { 'current': -1 } }

module.exports = {

  getForCache(cb) {
    var r = {}
    for (var type of DAL.ENUM.REDIRECT.TYPE) r[type] = []
    if (_.get(config,'routes.redirects.on') !== true) return cb(null, r)

    DAL.Redirect.getAll(opts, (e,all) => {
      if (e) return cb(e)

      all = all.concat(
       ['/.well-known/dnt-policy.txt',
        '/rules.abe'                            ].map( previous => ({type:'501',previous}) ),

       ['^/images/landing/airconf',
        '^/static/img/icons/gh-white.png',
        'airconf-promo'                         ].map( previous => ({type:'410',previous}) ),

       [//{ type: '301', previous: '^/logout', current: '/auth/logout'},
        //{ type: '301', previous: '/c\\+\\+', current: '/posts/tag/c++'},
        { type: '301', previous: '/author/*', current: '/software-experts'},
        { type: '301', previous: 'workshops', current: '/workshops'}
        ],

       ['images/pages/marketing',
        'images/landing/airconf',
        'fontawesome',
        'phpMyAdmin',
        'htaccess.txt',
        'readme.txt',
        'readme.html',
        'license.txt',
        '^/so19'                                ].map( previous => ({type:'bait',previous}) ))


      for (var {type,previous,current} of all)
        r[type].push({match:(previous+'$').replace('*$','*'),to:current})

      cb(null, r)
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
