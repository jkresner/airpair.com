// import BaseService from './_service'
import {Workshop} from '../models/workshop'

var logging = false

class WorkshopsService {

  constructor(user) {
    this.model = Workshop
    super(user)
  }

  getAll(cb) {
    Workshop.find({},{title:1,slug:1,time:1,tags:1},null)
      .lean()
      .exec( (e, r) => {
        if (e && logging) 
          $log('svc.getAll.err', e)

        cb(e, r)
      })
  }

  getBySlug(slug, cb) {
    Workshop.findOne({slug:slug},null,null)
      .lean()
      .exec( (e, r) => {
        if (e && logging) 
          $log('svc.getBySlug.err', e)

        cb(e, r)
      })
  }  
}

export default WorkshopsService