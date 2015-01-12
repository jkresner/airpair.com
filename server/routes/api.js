var API = require('../api/_all')
var {authd,setAnonSessionData} = require('../middleware/auth')
var {adm,emailv} = require('../middleware/authz')
var {bodyParam} = require('../middleware/data')

export default function(app) {

  var router = require('express').Router()

    .param('tag', API.Tags.paramFns.getBySlug)
    .param('expert', API.Experts.paramFns.getById)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('booking', API.Bookings.paramFns.getById)
    .param('paymethod', API.Paymethods.paramFns.getById)

    .get('/session/full', setAnonSessionData, API.Users.getSessionFull)
    .put('/users/me/password', API.Users.changePassword)
    .put('/users/me/password-change', API.Users.requestPasswordChange)
    .put('/users/me/tag/:tag', setAnonSessionData, API.Users.toggleTag)
    .put('/users/me/tags', setAnonSessionData, API.Users.tags)
    .put('/users/me/bookmarks', setAnonSessionData, API.Users.bookmarks)
    .put('/users/me/bookmarks/:type/:id', setAnonSessionData, API.Users.toggleBookmark)
    .put('/users/me/email', setAnonSessionData, API.Users.changeEmail)
    .put('/users/me/name', setAnonSessionData, API.Users.changeName)
    .put('/users/me/email-verify', authd, setAnonSessionData, API.Users.verifyEmail)
    .put('/users/me', authd, API.Users.updateProfile)
    .get('/company', authd, API.Companys.getUsersCompany)

    .get('/tags/search/:id', API.Tags.search)
    .get('/tags/:slug', authd, API.Tags.getBySlug)

    .get('/posts/recent', API.Posts.getRecentPublished)
    .get('/posts/me', authd, API.Posts.getUsersPosts)
    .get('/posts/tag/:tag', API.Posts.getByTag)
    .get('/posts/:id', API.Posts.getById)
    .get('/posts/by/:id', API.Posts.getUsersPublished)
    .post('/posts', authd, API.Posts.create)
    .post('/posts-toc', authd, API.Posts.getTableOfContents)
    .put('/posts/:id', authd, API.Posts.update)
    .put('/posts/publish/:id', authd, API.Posts.publish)
    .delete('/posts/:id', authd, API.Posts.deleteById)

    .get('/requests', authd, API.Requests.getMy)
    .get('/requests/:id', authd, API.Requests.getByIdForUser)
    .get('/requests/review/:id', API.Requests.getByIdForReview)
    .get('/requests/:id/book/:expertId', authd, API.Requests.getRequestForBookingExpert)
    .put('/requests/:request/verify', authd, API.Requests.sendVerifyEmailByCustomer)
    .put('/requests/:request', authd, API.Requests.updateByCustomer)
    .put('/requests/:request/reply/:expert', authd, API.Requests.replyByExpert)
    .post('/requests', authd, API.Requests.create)
    .delete('/requests/:request', API.Requests.deleteById)

    .get('/workshops/', API.Workshops.getAll)
    .get('/workshops/:id', API.Workshops.getBySlug)


    .use(authd) //-- swap out for email verify or something
    .get('/billing/payoutmethods', API.Paymethods.getMyPayoutmethods)
    .get('/billing/paymethods', API.Paymethods.getMyPaymethods)
    .post('/billing/paymethods', API.Paymethods.addPaymethod)
    .delete('/billing/paymethods/:paymethod', API.Paymethods.deletePaymethod)
    .get('/billing/orders', API.Orders.getMyOrders)  //emailv,
    .get('/billing/orders/credit/:id', API.Orders.getMyOrdersWithCredit)
    .post('/billing/orders/credit', API.Orders.buyCredit)

    .get('/billing/orders/payouts', API.Orders.getOrdersForPayouts)
    .get('/payouts/me', API.Payouts.getPayouts)
    .post('/payouts/:paymethod', bodyParam('orders'), API.Payouts.payoutOrders)

    .get('/bookings/:id', API.Bookings.getById)
    .post('/bookings/:expert', API.Bookings.createBooking)

    .get('/experts/me', API.Experts.getMe)
    .get('/experts/search/:id', API.Experts.search)
    .get('/experts/:id', API.Experts.getById)
    .get('/experts', API.Experts.getForExpertsPage)
    .get('/experts/match/:request', authd, API.Experts.getMatchesForRequest)


  var matchmakerrouter = require('express').Router()
    .param('expert', API.Experts.paramFns.getById)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .use(adm) //-- Todo change to match maker permissions
    .get('/requests', API.Requests.getWaitingForMatchmaker)
    .get('/requests/waiting', API.Requests.getWaitingForMatchmaker)
    .get('/requests/:id', API.Requests.getByIdForMatchmaker)
    .put('/requests/:request/add/:expert', API.Requests.addSuggestion)
    .put('/experts/:id/matchify/:request', API.Experts.updateMatchingStats)


  router.use('/matchmaking',matchmakerrouter)


  var admrouter = require('express').Router()
    .param('expert', API.Experts.paramFns.getById)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('booking', API.Bookings.paramFns.getById)
    .param('order', API.Orders.paramFns.getByIdForAdmin)

    .use(adm)
    .get('/posts', API.Posts.getAllAdmin)
    .get('/orders/:start/:end/:userId?', API.Orders.getByQueryForAdmin)
    .get('/bookings/:start/:end/:userId?', API.Bookings.getByQueryForAdmin)
    .get('/bookings/:id', API.Bookings.getByIdForAdmin)
    .put('/bookings/:booking', API.Bookings.updateByAdmin)
    .get('/payouts/:userId', API.Payouts.getPayouts)
    .get('/users/role/:role', API.Users.getUsersInRole)
    .put('/users/:id/role/:role', API.Users.toggleUserInRole)
    .get('/users/search/:id', API.Users.search)
    .get('/billing/orders/:id', API.Orders.getByIdForAdmin)
    .post('/billing/orders/credit', API.Orders.giveCredit)
    .put('/billing/orders/:order/release', API.Orders.releasePayout)
    .get('/billing/paymethods/:id', API.Paymethods.getUserPaymethodsByAdmin)
    .get('/views/user/:id', API.Views.getByUserId)
    .get('/redirects', API.Redirects.getAllRedirects)
    .post('/redirects', API.Redirects.createRedirect)
    .delete('/redirects/:id', API.Redirects.deleteRedirectById)
    .get('/companys/search/:id', API.Companys.search)
    .put('/companys/migrate/:id', API.Companys.migrate)
    .put('/companys/member/:id', API.Companys.addMember)
    .get('/requests/active', API.Requests.getActiveForAdmin)
    .get('/requests/2015', API.Requests.get2015ForAdmin)
    .get('/requests/incomplete', API.Requests.getIncompleteForAdmin)
    .get('/requests/:id', API.Requests.getByIdForAdmin)
    .get('/requests/user/:id', API.Requests.getByUserIdForAdmin)
    .put('/requests/:request', API.Requests.updateByAdmin)
    .put('/requests/:request/message', API.Requests.sendMessageByAdmin)
    .put('/requests/:request/farm', API.Requests.farmByAdmin)
    .put('/requests/:request/remove/:expert', API.Requests.removeSuggestion)


  router.use('/adm',admrouter)

  return router

}
