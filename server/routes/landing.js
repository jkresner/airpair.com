var API = require('../api/_all')
var {trackView} = require('../middleware/analytics')

export default function(app) {

  var router = require('express').Router()
    .param('tag', API.Tags.paramFns.getBySlug)
    // .param('landing', )

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
        req.landing = {
          _id: '54c937cc85e52c93f2c72bf4',
          title: 'AirPair Writing Contest',
          slug: '100k-writing-competition',
          launched: 'Mon Feb 2 2015 11:00:00 GMT-0800 (PST)',
          meta:
           { title: 'AirPair.com $100,000.00 Developer Writing Competition',
             description: 'AirPair has released a set of new Github API powered publishing tools. To celebrate, AirPair is distributing over $100k in cash prizes to the highest rated and most shared posts submitted before April 30th, 2015.',
             canonical: 'https://www.airpair.com/100k-writing-competition',
             ogType: 'Article',
             ogTitle: 'AirPair.com $100,000.00 Developer Writing Competition',
             ogDescription: 'AirPair has released a set of new Github API powered publishing tools. To celebrate, AirPair is distributing over $100k in cash prizes to the highest rated and most shared posts submitted before April 30th, 2015.',
             ogImage: 'https://www.airpair.com/static/img/pages/postscomp/og.png',
           },
        }
        // req.landing.tag = req.tag
        // req.landing.tags = [req.tag]
        // $log('landing')
        next()
      },
      trackView('landing'),
      app.renderHbsViewData('postscomp', null, (req, cb) => {
        cb(null, req.landing) })
    )

    .get('/100k-writing-competition/faq', app.renderHbsViewData('postscompfaq',
      null, (req, cb) => cb(null, {})))

  return router
}
