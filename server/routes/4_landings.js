module.exports = function(app, mw) {


  var livereload = mw.$.livereload ? 'livereload ' : ''
  var preMW = mw.$$(livereload+'badBot session onFirstReq')
  var postMW = mw.$$('trackLanding landingPage')


  app.Route('get', '/', preMW, [
    (req, res, next) => next(null, req.landing = {key:'home'}),
    mw.res.forbid('authd', usr => usr, { redirect: req => '/dashboard' })
    ], postMW)


  app.Route('get', '/100k-writing-competition', preMW, [
    (req, res, next) => {
      API.Posts.svc.get2015CompWinners((e,r) => {
        req.landing = {
          key: 'postsComp',
          _id: '54c937cc85e52c93f2c72bf4',
          title: 'AirPair Writing Contest',
          url: '/100k-writing-competition',
          launched: 'Mon Feb 2 2015 11:00:00 GMT-0800 (PST)',
          meta: { title: 'Fork Up! AirPair\'s $100,000.00 Git-Powered Developer Writing Competition',
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
        next()
      })
    }], postMW)


  app.Route('get', '/2016-marketplace-survey', preMW, [
    (req, res, next) => next(null, req.landing = {key:'marketplaceSurvey'}),
    mw.$.authd ], postMW)


}
