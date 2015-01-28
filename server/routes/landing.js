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

  return router
}
