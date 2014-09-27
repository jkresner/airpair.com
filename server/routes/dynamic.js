import * as Workshops from '../services/workshops'
import * as Posts from '../services/posts'
import {trackView} from '../identity/analytics/middleware'

var vd = {
  post: (req, cb) => Posts.getBySlug(req.params.slug, (e,p) => cb(e, p)), 
  workshop: (req, cb) => Workshops.getBySlug(req.params.slug, (e,w) => cb(e, w))
}


export default function(app) {
  
  var router = require('express').Router()

    .get('/:tag/posts/:slug', trackView('post'), app.renderHbsViewData('post', vd.post))

    .get('/:tag/workshops/:slug', trackView('workshop'), app.renderHbsViewData('workshop', vd.workshop))

    .get('/workshops-slide/:slug', app.renderHbsViewData('workshopsslide', vd.workshop))
     
  return router

}