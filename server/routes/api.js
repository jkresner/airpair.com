import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import UsersAPI from '../api/users'
import TagsAPI from '../api/tags'
import RedirectsAPI from '../api/redirects'
import PaymethodsAPI from '../api/paymethods'
import OrdersAPI from '../api/orders'
import BookingsAPI from '../api/bookings'
import ExpertsAPI from '../api/experts'
import CompanysAPI from '../api/companys'
import ViewsAPI from '../api/views'
import RequestsAPI from '../api/requests'
import {authd,adm,setAnonSessionData,emailv} from '../identity/auth/middleware'


export default function(app) {

  var router = require('express').Router()

    .param('tag', TagsAPI.paramFns.getBySlug)
    .param('expert', ExpertsAPI.paramFns.getById)
    .param('request', RequestsAPI.paramFns.getByIdForAdmin)

    .get('/session/full', setAnonSessionData, UsersAPI.getSessionFull)
    .put('/users/me/password', UsersAPI.changePassword)
    .put('/users/me/password-change', UsersAPI.requestPasswordChange)
    .put('/users/me/tag/:tag', setAnonSessionData, UsersAPI.toggleTag)
    .put('/users/me/tags', setAnonSessionData, UsersAPI.tags)
    .put('/users/me/bookmarks', setAnonSessionData, UsersAPI.bookmarks)
    .put('/users/me/bookmarks/:type/:id', setAnonSessionData, UsersAPI.toggleBookmark)
    .put('/users/me/email', setAnonSessionData, UsersAPI.changeEmail)
    .put('/users/me/name', setAnonSessionData, UsersAPI.changeName)
    .put('/users/me/email-verify', authd, setAnonSessionData, UsersAPI.verifyEmail)
    .put('/users/me', authd, UsersAPI.updateProfile)
    .get('/company', authd, CompanysAPI.getUsersCompany)

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

    .get('/requests', authd, RequestsAPI.getMy)
    .get('/requests/:id', authd, RequestsAPI.getByIdForUser)
    .get('/requests/review/:id', RequestsAPI.getByIdForReview)
    .get('/requests/book/:id/:expertId', authd, RequestsAPI.getRequestForBookingExpert)
    .put('/requests/:request', authd, RequestsAPI.updateByCustomer)
    .put('/requests/:request/reply/:expert', authd, RequestsAPI.replyByExpert)
    .post('/requests', authd, RequestsAPI.create)

    .get('/workshops/', WorkshopsAPI.getAll)
    .get('/workshops/:id', WorkshopsAPI.getBySlug)
    .get('/billing/paymethods', PaymethodsAPI.getMyPaymethods)


    .use(authd) //-- swap out for email verify or something
    .post('/billing/paymethods', PaymethodsAPI.addPaymethod)
    .delete('/billing/paymethods/:id', PaymethodsAPI.deletePaymethod)
    .get('/billing/orders', OrdersAPI.getMyOrders)  //emailv,
    .get('/billing/orders/credit/:id', OrdersAPI.getMyOrdersWithCredit)
    .post('/billing/orders/credit', OrdersAPI.buyCredit)
    // .post('/billing/orders/membership/:paymethod', OrdersAPI.buyMembership)

    .post('/bookings/:expert', BookingsAPI.createBooking)

    .get('/experts/me', ExpertsAPI.getMe)
    .get('/experts/:id', ExpertsAPI.getById)
    .get('/experts', ExpertsAPI.getForExpertsPage)


  var admrouter = require('express').Router()
    .use(adm)
    .get('/posts', PostsAPI.getAllAdmin)
    .get('/orders/:start/:end', OrdersAPI.getOrdersByDateRange)
    .get('/users/role/:role', UsersAPI.getUsersInRole)
    .put('/users/:id/role/:role', UsersAPI.toggleUserInRole)
    .get('/users/search/:id', UsersAPI.search)
    .post('/billing/orders/credit', OrdersAPI.giveCredit)
    .get('/billing/paymethods/:id', PaymethodsAPI.getUserPaymethodsByAdmin)
    .get('/views/user/:id', ViewsAPI.getByUserId)
    .get('/redirects', RedirectsAPI.getAllRedirects)
    .post('/redirects', RedirectsAPI.createRedirect)
    .delete('/redirects/:id', RedirectsAPI.deleteRedirectById)
    .get('/companys/search/:id', CompanysAPI.search)
    .put('/companys/migrate/:id', CompanysAPI.migrate)
    .put('/companys/member/:id', CompanysAPI.addMember)
    .get('/requests/:id', RequestsAPI.getByIdForAdmin)



  router.use('/adm',admrouter)

  return router

}
