var API = require('../api/_all')
var {trackView} = require('../middleware/analytics')

module.exports = function(app) {

  var router = require('express').Router()
    .param('tag', API.Tags.paramFns.getBySlug)
    // .param('landing', )

    .get('/airconf2014', (req,res) => {
      res.status(200).render(`./legacy/airconf2014.hbs`)
    })

    .get('/:tag/so-welcome',
      (req, res, next) => {
        req.landing = {
          _id: '54c937cc85e52c93f2c72bf4',
          title: 'Stackoverflow Welcome Customize',
          slug: 'so-welcome',
          launched: 'Wed Jan 28 2015 11:26:04 GMT-0800 (PST)',
          meta:
           { title: 'Welcome',
             description: null,
             canonical: null,
             ogTitle: 'Welcome',
             ogDescription: 'Welcome'
           },
        }
        req.landing.tag = req.tag
        req.landing.tags = [req.tag]
        // $log('landing')
        next()
      },
      trackView('landing'),
      app.renderHbsViewData('sowelcome', null, (req, cb) => {
        cb(null, req.landing) })
    )


    .get('/100k-writing-competition',
      (req, res, next) => {
        $callSvc(API.Posts.svc.getAll2015CompWinners,req)((e,r)=>{
          req.landing = {
            _id: '54c937cc85e52c93f2c72bf4',
            title: 'AirPair Writing Contest',
            slug: '100k-writing-competition',
            launched: 'Mon Feb 2 2015 11:00:00 GMT-0800 (PST)',
            meta:
             { title: 'Fork Up! AirPair\'s $100,000.00 Git-Powered Developer Writing Competition',
               description: 'AirPair has released a set of new Github API powered publishing tools. To celebrate, AirPair is distributing over $100k in cash prizes to the best posts submitted before May 30th, 2015.',
               canonical: 'https://www.airpair.com/100k-writing-competition',
               ogType: 'Article',
               ogTitle: 'Fork Up! AirPair\'s $100,000.00 Git-Powered Developer Writing Competition',
               ogDescription: 'AirPair has released a set of new Github API powered publishing tools. To celebrate, AirPair is distributing over $100k in cash prizes to the best posts submitted before May 30th, 2015.',
               ogImage: 'https://www.airpair.com/static/img/pages/postscomp/og.png',
             },
            prizes: {
             sponsor: _.filter(r,(p)=>p.prize.sponsor!='airpair'),
             category: _.filter(r,(p)=>p.prize.sponsor=='airpair')
            }
          }
          next()
        })
      },
      trackView('landing'),
      app.renderHbsViewData('postscomp', null, (req, cb) => {
        cb(null, req.landing) })
    )

  return router
}
