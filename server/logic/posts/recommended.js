module.exports = ({Post}, {Project,Opts,Query}, Shared, Lib) => ({


  validate(user) {},

  exec(cb) {
  // exec(query, cb) {
  //  $log('recommend'.yellow, query, cb)

    var feat = ['the-tipping-point-of-clientside-performance',
                    'the-definitive-ionic-starter-guide',
                    'optimizing-python-code',
                    'getting-started-with-neo4j-and-cypher',
                    'angular-vs-react-the-tie-breaker']
    var pop = ['angularjs-tutorial',
                // 'node-js-tutorial-step-by-step-guide-for-getting-started',
                'transclusion-template-scope-in-angular-directives',
                    'hybrid-apps-ionic-famous-f7-onsen',
                    'python-tips-and-traps',
                    'typescript-development-with-gulp-and-sublime-text',
                    'top-10-mistakes-nodejs-developers-make',
                    'comprehensive-guide-to-building-scalable-web-app-on-amazon-web-services--part-1',
                    'swift-tutorial-building-an-ios-applicationpart-1',
                    'understand-javascript-array-reduce-in-1-minute',
                    'creating-a-photo-gallery-in-android-studio-with-list-fragments']
    var com = [ 'the-mind-boggling-universe-of-javascript-modules',
                'switching-from-ios-to-ionic',
                'ntiered-aws-docker-terraform-guide',
                'unit-testing-angularjs-applications',
                'the-legend-of-canvas',
                'mongodb-advanced-administration-mon-and-backup',
                'ionic-firebase-password-manager',
                'moving-from-sql-to-rethinkdb']
    var hot = [
      'getting-started-with-docker-for-the-nodejs-dev',
      'complete-expressjs-nodejs-mongodb-crud-skeleton',
      'nodejs-framework-comparison-express-koa-hapi',
      'expressjs-and-passportjs-sessions-deep-dive'
    ]

    console.log('Post.getManyByQuery.pre'.yellow)
    Post.getManyByQuery(Query.latest, Opts.latest, (e,r) => {
      if (e) return cb(e)
      for (var p of r) p.url = p.history.published ? p.htmlHead.canonical : `/posts/review/${p._id}`

      var featured = _.filter(r, p => _.contains(feat,p.slug))
      r = _.difference(r, featured)
      var latest = r.splice(0,6)
      var top = _.take(_.sortBy(r, p => (!p.stats) ? 0
        :  -1*(p.stats.rating-2)*(p.stats.reviews+2) ), 8)
      r = _.difference(r, top)
      var popular = _.filter(r, p => _.contains(pop,p.slug))
      var comp = _.filter(r, p => _.contains(com,p.slug))
      var hottag = _.filter(r, p => _.contains(hot,p.slug))
      var archive = _.difference(r, _.union(popular,comp,hottag))

      cb(null, { latest, featured, top, popular, comp, archive, hottag })
    })


  },


  project: Project.latest


})
