var API = require('../api/_all')
var {authd,setAnonSessionData} = require('../middleware/auth')
var {adm,emailv} = require('../middleware/authz')
var {bodyParam,populateUser} = require('../middleware/data')

export default function(app) {

  var router = require('express').Router()
    .param('tag', API.Tags.paramFns.getBySlug)
    .param('expert', API.Experts.paramFns.getById)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('booking', API.Bookings.paramFns.getById)
    .param('paymethod', API.Paymethods.paramFns.getById)
    .param('postobj', API.Posts.paramFns.getById)

    .get('/session/full', setAnonSessionData, API.Users.getSession)
    .put('/users/me/password-change', API.Users.requestPasswordChange)
    .put('/users/me/tag/:tag', setAnonSessionData, API.Users.toggleTag)
    .put('/users/me/tags', setAnonSessionData, API.Users.updateTags)
    .put('/users/me/bookmarks', setAnonSessionData, API.Users.updateBookmarks)
    .put('/users/me/bookmarks/:type/:id', setAnonSessionData, API.Users.toggleBookmark)
    .put('/users/me/email', setAnonSessionData, API.Users.changeEmail)
    .put('/users/me/name', setAnonSessionData, API.Users.changeName)
    .put('/users/me/password', (req, res, next) => {
      var inValid = API.Users.validation.changePassword(req.user, req.body.hash, req.body.password)
      if (inValid) return res.status(403).json({message:inValid})

      // $log('trying to change pass'.magenta, req.body.hash, req.body.password)
      $callSvc(API.Users.svc.changePassword,req)(req.body.hash, req.body.password, (e,r) => {
        if (e) return next(e)
        req.login(r, (err) => {
          if (err) return next(err)
          res.json(r)
          // $log('change success loggedin'.magenta, r)
          next()
        })
      })
    })

    .get('/tags/search/:id', API.Tags.search)
    .get('/tags/:slug', authd, API.Tags.getBySlug)

    .get('/posts/me', API.Posts.getUsersPosts)
    .get('/posts/review', API.Posts.getPostsInReview)
    .get('/posts/recent', API.Posts.getRecentPublished)
    .get('/posts/by/:id', API.Posts.getUsersPublished)
    .get('/posts/tag/:tag', API.Posts.getByTag)

    .get('/requests/review/:id', API.Requests.getByIdForReview)

    .get('/workshops/', API.Workshops.getAll)
    .get('/workshops/:id', API.Workshops.getBySlug)

    .use(authd) //-- swap out for email verify or something


    .get('/posts/forks/me', populateUser, API.Posts.getUserForks)
    .get('/posts/:id', API.Posts.getById)
    .get('/posts/head/:postobj', populateUser, API.Posts.getGitHEAD)
    .post('/posts', API.Posts.create)
    .put('/posts/:postobj', API.Posts.update)
    .put('/posts/publish/:postobj', API.Posts.publish)
    .put('/posts/submit/:postobj', populateUser, API.Posts.submitForReview)
    .put('/posts/review/:postobj', API.Posts.addReview)
    .put('/posts/add-forker/:postobj', populateUser, API.Posts.addForker)
    .put('/posts/propagate-github/:postobj', populateUser, API.Posts.propagateMDfromGithub)
    .put('/posts/update-github-head/:postobj', populateUser, API.Posts.updateGithubHead)
    .delete('/posts/:postobj', API.Posts.deleteById)
    .post('/posts-toc',API.Posts.getTableOfContents)

    .get('/requests', API.Requests.getMy)
    .get('/requests/:id', API.Requests.getByIdForUser)
    .get('/requests/:id/book/:expertId', API.Requests.getRequestForBookingExpert)
    .put('/requests/:request/verify', API.Requests.sendVerifyEmailByCustomer)
    .put('/requests/:request', API.Requests.updateByCustomer)
    .put('/requests/:request/reply/:expert', API.Requests.replyByExpert)
    .post('/requests', API.Requests.create)
    .delete('/requests/:request', API.Requests.deleteById)

    .get('/users/me/site-notifications', API.Users.getSiteNotifications)
    .put('/users/me/site-notifications', API.Users.toggleSiteNotification)
    .put('/users/me/email-verify', setAnonSessionData, API.Users.verifyEmail)
    .put('/users/me/initials', API.Users.changeInitials)
    .put('/users/me/username', API.Users.changeUsername)
    .put('/users/me/bio', API.Users.changeBio)
    .put('/users/me/location', API.Users.changeLocationTimezone)

    .get('/company', API.Companys.getUsersCompany)

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

    .get('/bookings', API.Bookings.getByUserId)
    .get('/bookings/:id', API.Bookings.getById)
    .post('/bookings/:expert', API.Bookings.createBooking)

    .get('/experts/me', API.Experts.getMe)
    .get('/experts/search/:id', API.Experts.search)
    .get('/experts/dashboard', API.Experts.getMatchesForDashboard)
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
    .put('/bookings/:booking/recording', API.Bookings.addYouTubeData)
    .put('/bookings/:booking/hangout', API.Bookings.addHangout)
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
