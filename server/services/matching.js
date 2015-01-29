var logging               = false
// var Data                  = require('./tags.data')
// var Tag                   = require('../models/tag')
// import BaseSvc            from '../services/_service'
// var svc                   = new BaseSvc(Tag, logging)
import * as WorkshopsSvc  from './workshops'
import * as PostsSvc      from './posts'
var ExpertsSvc            = require('./workshops')
var UsersSvc              = require('./users')


var get = {

  getDashboard(cb) {
    // svc.searchMany({}, { fields: Data.select.listCache }, cb)
    // PostsSvc.getByTag(tag, (ee,posts)=> {
    //   WorkshopsSvc.getByTag(tag.slug, (e,workshops)=> {
    //     var d = Data.data.angularPage(tag,posts,workshops)
    //     cb(null, d)
    //   })
    // })
  }

}

var save = {}

module.exports = _.extend(get,save)


