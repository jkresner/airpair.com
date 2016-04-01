module.exports = function(app, mw) {

  var PostsSvc = require('../services/posts')

  app.get('/', mw.$.badBot, mw.$.onFirstReq,
    mw.res.forbid('authd', usr => usr, { redirect: req => '/dashboard' }),
    mw.$.landingPage('home'))


  app.get('/100k-writing-competition',
    mw.$.badBot, mw.$.onFirstReq,
    (req, res, next) => {
      PostsSvc.get2015CompWinners((e,r) => {
        req.landing = {
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
    },
    mw.$.trackLanding,
    mw.$.landingPage('postsComp')
  )


  app.get('/2016-marketplace-survey', mw.$.authd,
    mw.$.landingPage('marketplaceSurvey'))


  app.use(['/billing*',
           '/bookings',
           '/bookings/*',
           '/booking/*',
           '/dashboard',
           '/experts',
           '/me*',
           '/requests*',
           '/settings'],
           mw.$.badBot, mw.$.authd, mw.$.clientPage)


  app.use(['/v1/*',
           '/find-an-expert',
           '/hire-software-developers',
           '/help*',
           '/login',
           '*pair-programming*',
           // '/posts*',
           // '*/posts*',
           '/review*',
           '*/workshops*',], mw.$.clientPage)


  app.use(['^/matchmaking*',
           '^/adm/bookings*',
           '^/adm/pipeline*',
           '^/adm/request*',
           '^/adm/users*',
           '^/adm/orders*',
           '^/adm/experts*',
           '^/adm/posts*',
           '^/adm/redirects*'],
           mw.$.badBot, mw.$.adm, mw.$.adminPage)

}
