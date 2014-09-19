import {serve, initAPI} from './_api'
import * as Svc from '../services/posts'
import {authd} from '../identity/auth/middleware'
var auth = authd({isApiRequest:true})

var actions = {
  me: function(req, cb) { Svc.getUsersPosts.call(this, req.user._id, cb) },
  toc: function(req, cb) { Svc.getTableOfContents.call(this, req.body.md, cb) },
  publish: function(req, cb) { Svc.publish.call(this, req.params.id, req.body, cb) },
  recent: function(req, cb) { Svc.getRecentPublished.call(this, cb) },
  byuser: function(req, cb) { Svc.getUsersPublished.call(this, req.params.id, cb) },
}

var API = initAPI(Svc, actions)

export default class {

  constructor(app) {
    app.get('/posts/recent', API.recent)
    app.get('/posts/me', auth, API.me)     
    app.get('/posts/:id', API.detail)  
    app.get('/posts/by/:id', API.byuser)     

    app.post('/posts', auth, API.create)     
    app.post('/posts-toc', auth, API.toc)     
    app.put('/posts/:id', auth, API.update)  
    app.put('/posts/publish/:id', auth, API.publish)      

    app.delete('/posts/:id', auth, API.delete)      
  }

}