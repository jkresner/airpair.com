import {serve, initAPI} from './_api2'
import * as Svc from '../services/posts'
import {authd} from '../identity/auth/middleware'

var API = initAPI(Svc)

function me(req, cb) {
  Svc.getUsersPosts.call(this, req.user._id, cb)
}

function toc(req, cb) {
  Svc.getTableOfContents.call(this, req.body.md, cb)
}

function create(req, cb) {
  $log('create?')
  Svc.create.call(this, req.body, cb)
}

function update(req, cb) {
  Svc.update.call(this, req.params.id, req.body, cb)
}

var auth = authd({isApiRequest:true})

export default class {

  constructor(app) {
    app.get('/posts', API.list)
    app.get('/posts/me', auth, serve(me))     
    app.get('/posts/:id', API.detail)  
    
    app.post('/posts', auth, serve(create))     
    app.post('/posts-toc', auth, serve(toc))     
    app.put('/posts/:id', auth, serve(update))  
  }

}