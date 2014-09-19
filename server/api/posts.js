import {serve, initAPI} from './_api'
import * as Svc from '../services/posts'
import {authd} from '../identity/auth/middleware'
var auth = authd({isApiRequest:true})

var actions = {
  getUsersPosts: (req) => [req.user._id],
  getTableOfContents: (req) => [req.body.md],
  publish: (req) => [req.params.id,req.body],
  getRecentPublished: (req) => [],
  getUsersPublished: (req) => [req.params.id],
}

var API = initAPI(Svc, actions)

export default class {

  constructor(app) {
    app.get('/posts/recent', API.getRecentPublished)
    app.get('/posts/me', auth, API.getUsersPosts)     
    app.get('/posts/:id', API.getById)  
    app.get('/posts/by/:id', API.getUsersPublished)     

    app.post('/posts', auth, API.create)     
    app.post('/posts-toc', auth, API.getTableOfContents)     
    app.put('/posts/:id', auth, API.update)  
    app.put('/posts/publish/:id', auth, API.publish)      

    app.delete('/posts/:id', auth, API.deleteById)      
  }

}