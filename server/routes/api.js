import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import UsersAPI from '../api/users'
import TagsAPI from '../api/tags'
import RedirectsAPI from '../api/redirects'
import PaymethodsAPI from '../api/paymethods'
import OrdersAPI from '../api/orders'
import BookingsAPI from '../api/bookings'
import ExpertsAPI from '../api/experts'
import {authd,adm,setAnonSessionData,emailv} from '../identity/auth/middleware'


export default function(app) {

  var router = require('express').Router()

    .param('tag', TagsAPI.paramFns.getBySlug)
    .param('paymethod', PaymethodsAPI.paramFns.getById)
    .param('expert', ExpertsAPI.paramFns.getById)

    .get('/session/full', setAnonSessionData, UsersAPI.getSessionFull)
    .put('/users/me/tag/:tag', setAnonSessionData, UsersAPI.toggleTag)
    .put('/users/me', authd, UsersAPI.updateProfile)
    .put('/users/me/password-change', UsersAPI.requestPasswordChange)
    .put('/users/me/password', UsersAPI.changePassword)
    .put('/users/me/tags', setAnonSessionData, UsersAPI.tags)
    .put('/users/me/bookmarks', setAnonSessionData, UsersAPI.bookmarks)
    .put('/users/me/email', setAnonSessionData, UsersAPI.changeEmail)
    .put('/users/me/email-verify', authd, setAnonSessionData, UsersAPI.verifyEmail)
    .put('/users/me/bookmarks/:type/:id', setAnonSessionData, UsersAPI.toggleBookmark)

    .get('/tags/search/:id', TagsAPI.search)
    .get('/tags/:slug', authd, TagsAPI.getBySlug)

    .get('/posts/recent', PostsAPI.getRecentPublished)
    .get('/posts/me', authd, PostsAPI.getUsersPosts)
    .get('/posts/tag/:tag', PostsAPI.getByTag)
    .get('/posts/:id', PostsAPI.getById)
    .get('/posts/by/:id', PostsAPI.getUsersPublished)
    .post('/posts', authd, PostsAPI.create)
    .post('/posts-toc', authd, PostsAPI.getTableOfContents)
    .put('/posts/:id', authd, PostsAPI.update)
    .put('/posts/publish/:id', authd, PostsAPI.publish)
    .delete('/posts/:id', authd, PostsAPI.deleteById)

    .get('/workshops/', WorkshopsAPI.getAll)
    .get('/workshops/:id', WorkshopsAPI.getBySlug)
    .get('/billing/paymethods', PaymethodsAPI.getMyPaymethods)

    .use(authd) //-- swap out for email verify or something
    .post('/billing/paymethods', PaymethodsAPI.addPaymethod)
    .delete('/billing/paymethods/:id', PaymethodsAPI.deletePaymethod)
    .get('/billing/orders', emailv, OrdersAPI.getMyOrders)
    .get('/billing/orders/credit', OrdersAPI.getMyOrdersWithCredit)
    .post('/billing/orders/membership/:paymethod', OrdersAPI.buyMembership)
    .post('/billing/orders/credit/:paymethod', OrdersAPI.buyCredit)

    .post('/bookings/credit/:expert', BookingsAPI.createWithCredit)
    .post('/bookings/payg/:expert/:paymethod', BookingsAPI.createWithPAYG)


  var admrouter = require('express').Router()
    .use(adm)
    .get('/posts', PostsAPI.getAllAdmin)
    .get('/users/role/:role', UsersAPI.getUsersInRole)
    .put('/users/:id/role/:role', UsersAPI.toggleUserInRole)
    .get('/users/search/:id', UsersAPI.search)
    .post('/billing/orders/credit', OrdersAPI.giveCredit)
    .get('/redirects', RedirectsAPI.getAllRedirects)
    .post('/redirects', RedirectsAPI.createRedirect)
    .delete('/redirects/:id', RedirectsAPI.deleteRedirectById)


  router.use('/adm',admrouter)

  return router

}
