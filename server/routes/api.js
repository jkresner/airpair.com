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
var {authd,setAnonSessionData} = require('../middleware/auth')
var {adm,emailv} = require('../middleware/authz')


export default function(app) {

  var router = require('express').Router()

    .param('tag', TagsAPI.paramFns.getBySlug)
    .param('expert', ExpertsAPI.paramFns.getById)
    .param('request', RequestsAPI.paramFns.getByIdForAdmin)
    .param('booking', BookingsAPI.paramFns.getById)
    .param('paymethod', PaymethodsAPI.paramFns.getById)

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
    .get('/requests/:id/book/:expertId', authd, RequestsAPI.getRequestForBookingExpert)
    .put('/requests/:request/verify', authd, RequestsAPI.sendVerifyEmailByCustomer)
    .put('/requests/:request', authd, RequestsAPI.updateByCustomer)
    .put('/requests/:request/reply/:expert', authd, RequestsAPI.replyByExpert)
    .post('/requests', authd, RequestsAPI.create)
    .delete('/requests/:request', RequestsAPI.deleteById)

    .get('/workshops/', WorkshopsAPI.getAll)
    .get('/workshops/:id', WorkshopsAPI.getBySlug)
    .get('/billing/paymethods', PaymethodsAPI.getMyPaymethods)

    .use(authd) //-- swap out for email verify or something
    .post('/billing/paymethods', PaymethodsAPI.addPaymethod)
    .delete('/billing/paymethods/:paymethod', PaymethodsAPI.deletePaymethod)
    .get('/billing/orders', OrdersAPI.getMyOrders)  //emailv,
    .get('/billing/orders/credit/:id', OrdersAPI.getMyOrdersWithCredit)
    .post('/billing/orders/credit', OrdersAPI.buyCredit)
    // .post('/billing/orders/membership/:paymethod', OrdersAPI.buyMembership)
    .get('/billing/orders/payouts/:expert', OrdersAPI.getOrdersToPayout)

    .get('/bookings/:id', BookingsAPI.getById)
    .post('/bookings/:expert', BookingsAPI.createBooking)

    .get('/experts/me', ExpertsAPI.getMe)
    .get('/experts/search/:id', ExpertsAPI.search)
    .get('/experts/:id', ExpertsAPI.getById)
    .get('/experts', ExpertsAPI.getForExpertsPage)
    .get('/experts/match/:request', authd, ExpertsAPI.getMatchesForRequest)


  var matchmakerrouter = require('express').Router()
    .param('expert', ExpertsAPI.paramFns.getById)
    .param('request', RequestsAPI.paramFns.getByIdForAdmin)
    .use(adm) //-- Todo change to match maker permissions
    .get('/requests', RequestsAPI.getWaitingForMatchmaker)
    .get('/requests/waiting', RequestsAPI.getWaitingForMatchmaker)
    .get('/requests/:id', RequestsAPI.getByIdForMatchmaker)
    .put('/requests/:request/add/:expert', RequestsAPI.addSuggestion)
    .put('/experts/:id/matchify/:request', ExpertsAPI.updateMatchingStats)


  router.use('/matchmaking',matchmakerrouter)


  var admrouter = require('express').Router()
    .param('expert', ExpertsAPI.paramFns.getById)
    .param('request', RequestsAPI.paramFns.getByIdForAdmin)
    .param('booking', BookingsAPI.paramFns.getById)
    .param('order', OrdersAPI.paramFns.getByIdForAdmin)

    .use(adm)
    .get('/posts', PostsAPI.getAllAdmin)
    .get('/orders/:start/:end/:userId?', OrdersAPI.getByQueryForAdmin)
    .get('/bookings/:start/:end/:userId?', BookingsAPI.getByQueryForAdmin)
    .get('/bookings/:id', BookingsAPI.getByIdForAdmin)
    .put('/bookings/:booking', BookingsAPI.updateByAdmin)
    .get('/users/role/:role', UsersAPI.getUsersInRole)
    .put('/users/:id/role/:role', UsersAPI.toggleUserInRole)
    .get('/users/search/:id', UsersAPI.search)
    .get('/billing/orders/:id', OrdersAPI.getByIdForAdmin)
    .post('/billing/orders/credit', OrdersAPI.giveCredit)
    .put('/billing/orders/:order/release', OrdersAPI.releasePayout)
    .get('/billing/paymethods/:id', PaymethodsAPI.getUserPaymethodsByAdmin)
    .get('/views/user/:id', ViewsAPI.getByUserId)
    .get('/redirects', RedirectsAPI.getAllRedirects)
    .post('/redirects', RedirectsAPI.createRedirect)
    .delete('/redirects/:id', RedirectsAPI.deleteRedirectById)
    .get('/companys/search/:id', CompanysAPI.search)
    .put('/companys/migrate/:id', CompanysAPI.migrate)
    .put('/companys/member/:id', CompanysAPI.addMember)
    .get('/requests/active', RequestsAPI.getActiveForAdmin)
    .get('/requests/2015', RequestsAPI.get2015ForAdmin)
    .get('/requests/incomplete', RequestsAPI.getIncompleteForAdmin)
    .get('/requests/:id', RequestsAPI.getByIdForAdmin)
    .get('/requests/user/:id', RequestsAPI.getByUserIdForAdmin)
    .put('/requests/:request', RequestsAPI.updateByAdmin)
    .put('/requests/:request/message', RequestsAPI.sendMessageByAdmin)
    .put('/requests/:request/farm', RequestsAPI.farmByAdmin)
    .put('/requests/:request/remove/:expert', RequestsAPI.removeSuggestion)


  router.use('/adm',admrouter)

  return router

}
