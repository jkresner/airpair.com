import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import UsersAPI from '../api/users'
import TagsAPI from '../api/tags'
import RedirectsAPI from '../api/redirects'
import {authd,adm,setAnonSessionData} from '../identity/auth/middleware'

export default function(app) {


  var router = require('express').Router()

    .param('tag', TagsAPI.paramFns.getBySlug)

    .get('/session', UsersAPI.getSession)
    .get('/session/full', UsersAPI.getSessionFull)
    .get('/verify', UsersAPI.verifyEmail)
    .put('/users/me/tag/:tag', setAnonSessionData, UsersAPI.toggleTag)

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
    .get('/posts', PostsAPI.getAllAdmin)
    .get('/users/role/:role', UsersAPI.getUsersInRole)
    .put('/users/:id/role/:role', UsersAPI.toggleUserInRole)
    .get('/redirects', RedirectsAPI.getAllRedirects)
    .post('/redirects', RedirectsAPI.createRedirect)
    .delete('/redirects/:id', RedirectsAPI.deleteRedirectById)


  router.use('/adm',admrouter)

  return router

}