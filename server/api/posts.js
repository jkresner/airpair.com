import {serve} from './_api2'
import * as Svc from '../services/posts'
import {authd} from '../identity/auth/middleware'

var auth = authd({isApiRequest:true})


function list(req, cb) {
  Svc.getAll(cb)
}

function me(req, cb) {
  Svc.getUsersPosts.call(this, req.user._id, cb)
}

function detail(req, cb) {
  Svc.getById.call(this, req.params.id, cb)
}

function toc(req, cb) {
  Svc.getTableOfContents.call(this, req.body.md, cb)
}

function create(req, cb) {
  Svc.create.call(this, req.body, cb)
}

function update(req, cb) {
  Svc.update.call(this, req.params.id, req.body, cb)
}

export default class {

  constructor(app) {
    app.get('/posts/', serve(list))
    app.get('/posts/me', auth, serve(me))     
    app.get('/posts/:id', serve(detail))  
    
    app.post('/posts', auth, serve(create))     
    app.post('/posts-toc', auth, serve(toc))     
    app.put('/posts/:id', auth, serve(update))  
  }

}