import {serve} from './_api2'
import * as Svc from '../services/posts'

function list(req, cb) {
  Svc.getAll(cb)
}

function detail(req, cb) {
  Svc.getById.call(this, req.params.id, cb)
}

function toc(req, cb) {
  Svc.getTableOfContents.call(this, req.body.md, cb)
}

export default class {

  constructor(app) {
    app.get('/posts/', serve(list))
    app.get('/posts/:id', serve(detail))  
    app.post('/posts-toc', serve(toc)) 
  }

}