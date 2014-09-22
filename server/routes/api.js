import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import UsersAPI from '../api/users'
import TagsAPI from '../api/tags'
import {authd,adm} from '../identity/auth/middleware'

export default function(app) {
  
  var router = require('express').Router()


  router.get('/session', authd, UsersAPI.getSessionLite)
  router.get('/session/full', authd, UsersAPI.getSessionByUserId)   
  router.put('/adm/users/role/:id/:role', adm, UsersAPI.toggleUserInRole)   

  router.get('/tags/search/:id', TagsAPI.search)    
  router.get('/tags/:slug', TagsAPI.getBySlug)

  router.get('/posts/recent', PostsAPI.getRecentPublished)
  router.get('/posts/me', PostsAPI.getUsersPosts)     
  router.get('/posts/:id', PostsAPI.getById)  
  router.get('/posts/by/:id', PostsAPI.getUsersPublished)     
  router.post('/posts', authd, PostsAPI.create)     
  router.post('/posts-toc', authd, PostsAPI.getTableOfContents)     
  router.put('/posts/:id', authd, PostsAPI.update)  
  router.put('/posts/publish/:id', authd, PostsAPI.publish)   
  router.delete('/posts/:id', authd, PostsAPI.deleteById)
  
  router.get('/workshops/', WorkshopsAPI.getAll)
  router.get('/workshops/:id', WorkshopsAPI.getBySlug)

  
  return router

}