module.exports = function(app, mw) {


  if (config.middleware.livereload)
    app.use(mw.res.livereload(config.middleware.livereload))


  var landing = mw.$$('badBot session reqFirst')
  var keyed = key => (req, res, next) => next(null, req.landing = {key})
  var landed = mw.$$('trackLanding landingPage')


  app.get('/', landing, keyed('home'), mw.res.forbid('authd',
    usr => usr, { redirect: r => '/dashboard' }), landed)


  app.get('/100k-writing-competition', landing,
    (req, res, next) => {
      API.Posts.svc.get2015CompWinners((e,r) => {
        req.locals.r = {
          key: 'postsComp',
          _id: '54c937cc85e52c93f2c72bf4',
          title: 'AirPair Writing Contest',
          url: '/100k-writing-competition',
          launched: 'Mon Feb 2 2015 11:00:00 GMT-0800 (PST)',
          htmlHead: { title: 'Fork Up! AirPair\'s $100,000.00 Git-Powered Developer Writing Competition',
            description: 'AirPair has released a set of new Github API powered publishing tools. To celebrate, AirPair is distributing over $100k in cash prizes to the best posts submitted before May 30th, 2015.',
            canonical: 'https://www.airpair.com/100k-writing-competition',
            ogType: 'Article',
            ogTitle: 'Fork Up! AirPair\'s $100,000.00 Git-Powered Developer Writing Competition',
            ogDescription: 'AirPair has released a set of new Github API powered publishing tools. To celebrate, AirPair is distributing over $100k in cash prizes to the best posts submitted before May 30th, 2015.',
            ogImage: 'https://www.airpair.com/static/img/pages/postscomp/og.png',
          },
          prizes: {
            sponsor: _.filter(r, p=>p.prize.sponsor!='airpair'),
            category: _.filter(r, p=>p.prize.sponsor=='airpair')
          }
        }
        req.landing = req.locals.r
        next()
      })
    }, landed)


  app.get(['/airconf','airconf2014','/workshops'],
    landing, keyed('workshops'), mw.$.cachedAds,
      (req, res, next) => next(null, assign(req.locals, { r: _.values(cache.workshops),
        htmlHead: { title: "Software Workshops, Webinars & Screencasts" }
      })), landed)




  // app.Route('get', '/2016-marketplace-survey', preMW, [
  //   (req, res, next) => next(null, req.landing = {key:'marketplaceSurvey'}),
  //   mw.$.authd ], postMW)

}
