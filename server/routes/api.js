import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import UsersAPI from '../api/users'
import TagsAPI from '../api/tags'
import {authd,adm} from '../identity/auth/middleware'

export default function(app) {
  
  var router = require('express').Router()

    .get('/session', authd, UsersAPI.getSessionLite)
    .get('/session/full', authd, UsersAPI.getSessionByUserId)   

    .get('/tags/search/:id', TagsAPI.search)    
    .get('/tags/:slug', authd, TagsAPI.getBySlug)
    
    .get('/posts/recent', PostsAPI.getRecentPublished)
    .get('/posts/me', authd, PostsAPI.getUsersPosts)     
    .get('/posts/:id', PostsAPI.getById)  
    .get('/posts/by/:id', PostsAPI.getUsersPublished)     
    .post('/posts', authd, PostsAPI.create)     
    .post('/posts-toc', authd, PostsAPI.getTableOfContents)     
    .put('/posts/:id', authd, PostsAPI.update)  
    .put('/posts/publish/:id', authd, PostsAPI.publish)   
    .delete('/posts/:id', authd, PostsAPI.deleteById)
    

    .get('/workshops/', WorkshopsAPI.getAll)
    .get('/workshops/:id', WorkshopsAPI.getBySlug)

  var admrouter = require('express').Router()
    .use(adm)
    .put('/users/role/:id/:role', UsersAPI.toggleUserInRole)   

  router.use('/adm',admrouter)

  return router

}