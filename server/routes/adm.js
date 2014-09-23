import {adm} from '../identity/auth/middleware'

//-- Temporary, will do everything in the client
import * as Posts from '../services/posts'
var vd = {
  admposts: function(req, cb) {
    Posts.getAllAdmin((e,posts) => cb(e, {posts:posts}))
  }
}


export default function(app) {
  
  var router = require('express').Router()

    .use(adm)

    .get( ['/*'], app.renderHbsViewData('adm/admin', vd.admposts) )  

  return router

}