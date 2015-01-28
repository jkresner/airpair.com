var API = require('../api/_all')
var {trackView} = require('../middleware/analytics')

export default function(app) {

  var router = require('express').Router()
    .param('tag', API.Tags.paramFns.getBySlug)
    .param('landing', (req, res, next) => {
      req.landing = { _id: 'so-welcome' }
      req.landing.tag = req.tag
      req.landing.tags = [req.tag]
      next()
    })

    .get('/:tag/:landing',
      trackView('landing'),
      app.renderHbsViewData('sowelcome', null, (req, cb) => {
        cb(null, req.landing) })
    )

  return router
}
