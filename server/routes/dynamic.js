import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import {trackView} from '../identity/analytics/middleware'


export default function(app) {
  
  var router = require('express').Router()

    .param('workshop', WorkshopsAPI.paramFns.getBySlug)
    .param('post', PostsAPI.paramFns.getBySlug)    

    .get('/:tag/posts/:post', trackView('post'), app.renderHbsViewData('post', 
      (req, cb) => cb(null,req.post) ))

    .get('/:tag/workshops/:workshop', trackView('workshop'), app.renderHbsViewData('workshop', 
      (req, cb) => cb(null,req.workshop) ))

    .get('/workshops-slide/:workshop', app.renderHbsViewData('workshopsslide', 
      (req, cb) => cb(null,req.workshop) ))

  return router

}