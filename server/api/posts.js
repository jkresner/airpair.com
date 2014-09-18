import {serve, initAPI} from './_api'
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
  Svc.create.call(this, req.body, cb)
}

function update(req, cb) {
  Svc.update.call(this, req.params.id, req.body, cb)
}

function publish(req, cb) {
  Svc.publish.call(this, req.params.id, req.body, cb)
}

function recent(req, cb) {
  Svc.getRecentPublished.call(this, cb)
}

function byuser(req, cb) {
  Svc.getUsersPublished.call(this, req.params.id, cb)
}

var auth = authd({isApiRequest:true})

export default class {

  constructor(app) {
    app.get('/posts/recent', serve(recent))
    app.get('/posts/me', auth, serve(me))     
    app.get('/posts/:id', API.detail)  
    app.get('/posts/by/:id', serve(byuser))     

    app.post('/posts', auth, serve(create))     
    app.post('/posts-toc', auth, serve(toc))     
    app.put('/posts/:id', auth, serve(update))  
    app.put('/posts/publish/:id', auth, serve(publish))      
  }

}