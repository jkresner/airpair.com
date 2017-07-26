module.exports = ({Post}, {Project,Opts,Query}, DRY) => ({


  validate(user) {},

  exec(cb) {

    var feat = [
      'the-tipping-point-of-clientside-performance',
      'optimizing-python-code',
      'getting-started-with-neo4j-and-cypher',
      'understand-javascript-array-reduce-in-1-minute',
      'angular-vs-react-the-tie-breaker']
    var pop = [
      'the-mind-boggling-universe-of-javascript-modules',
      'angularjs-tutorial',
      'the-definitive-ionic-starter-guide',
      'python-tips-and-traps',
      'comprehensive-guide-to-building-scalable-web-app-on-amazon-web-services--part-1',
      'swift-tutorial-building-an-ios-applicationpart-1',
      'the-legend-of-canvas',
      'top-10-mistakes-nodejs-developers-make']
    var com = [
      'transclusion-template-scope-in-angular-directives',
      'hybrid-apps-ionic-famous-f7-onsen',
      'switching-from-ios-to-ionic',
      'typescript-development-with-gulp-and-sublime-text',
      'ntiered-aws-docker-terraform-guide',
      'unit-testing-angularjs-applications',
      'mongodb-advanced-administration-mon-and-backup',
      'ionic-firebase-password-manager',
      'moving-from-sql-to-rethinkdb']
    var hot = [
      'creating-a-photo-gallery-in-android-studio-with-list-fragments',
      'using-rethinkdb-with-expressjs',
      'node-js-tutorial-step-by-step-guide-for-getting-started',
      'getting-started-with-docker-for-the-nodejs-dev',
      'nodejs-framework-comparison-express-koa-hapi',
      'expressjs-and-passportjs-sessions-deep-dive'
    ]

    Post.getManyByQuery(Query.latest, Opts.latest, (e,r) => {
      if (e) return cb(e)

      for (var p of r)
        p.url = p.history.published ? p.htmlHead.canonical : `/posts/review/${p._id}`

      var popular = r.filter(p => pop.indexOf(p.slug) > -1)
      var featured = r.filter(p => feat.indexOf(p.slug) > -1)
      r = _.difference(r, featured)
      var latest = r.splice(0,6)
      var top = _.take(_.sortBy(r, p => (!p.stats) ? 0
        :  -1*(p.stats.rating-2)*(p.stats.reviews+2) ), 8)
      r = _.difference(r, top)
      var comp = r.filter(p => com.indexOf(p.slug) > -1)
      var hottag = r.filter(p => hot.indexOf(p.slug) > -1)
      var archive = _.difference(r, _.union(popular,comp,hottag))



      cb(null, { latest, featured, top, popular, comp, archive, hottag })
    })


  },


  project: Project.latest


})
