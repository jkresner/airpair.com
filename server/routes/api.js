var API = require('../api/_all')
var {authd,setAnonSessionData} = require('../middleware/auth')
var {adm,emailv} = require('../middleware/authz')
var {bodyParam,populateUser,json2mb} = require('../middleware/data')


export default function(app) {

  var router = require('express').Router()
    .param('tag', API.Tags.paramFns.getBySlug)
    .param('expert', API.Experts.paramFns.getById)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('booking', API.Bookings.paramFns.getById)
    .param('paymethod', API.Paymethods.paramFns.getById)

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
        })
      })
    })

    .get('/tags/search/:id', API.Tags.search)
    .get('/tags/:slug', authd, API.Tags.getBySlug)

    .get('/posts/me', API.Posts.getMyPosts)
    .get('/posts/review', API.Posts.getPostsInReview)
    .get('/posts/recent', API.Posts.getRecentPublished)
    .get('/posts/by/:id', API.Posts.getUsersPublished)
    .get('/posts/tag/:tag', API.Posts.getByTag)

    .get('/requests/review/:id', API.Requests.getByIdForReview)

    .get('/workshops/', API.Workshops.getAll)
    .get('/workshops/:id', API.Workshops.getBySlug)

    .use(authd)

    .get('/requests', API.Requests.getMy)
    .get('/requests/:id', API.Requests.getByIdForUser)
    .get('/requests/:id/book/:expertId', API.Requests.getRequestForBookingExpert)
    .put('/requests/:request/verify', API.Requests.sendVerifyEmailByCustomer)
    .put('/requests/:request', API.Requests.updateByCustomer)
    .put('/requests/:request/reply/:expert', API.Requests.replyByExpert)
    .post('/requests', API.Requests.create)
    .delete('/requests/:request', API.Requests.deleteById)

    .get('/users/me/provider-scopes', populateUser, API.Users.getProviderScopes)
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
    .post('/experts/me', populateUser, API.Experts.create)
    .put('/experts/:expert/me', populateUser, API.Experts.updateMe)

  var postsrouter = require('express').Router()
    .param('post', API.Posts.paramFns.getById)
    .param('postreview', API.Posts.reviewParamFn)

    .use(authd)
    .post('/:post/review', API.Posts.review)
    .put('/:post/review/:postreview', API.Posts.reviewUpdate)
    .put('/:post/review/:postreview/reply', API.Posts.reviewReply)
    .put('/:post/review/:postreview/upvote', API.Posts.reviewUpvote)
    .delete('/:post/review/:postreview', API.Posts.reviewDelete)

    .get('/:post/info', API.Posts.getByIdForEditingInfo)
    .get('/:post/contributors', API.Posts.getByIdForContributors)
    .post('/', API.Posts.create)
    .put('/:post', API.Posts.update)
    .delete('/:post', API.Posts.deleteById)
    .get('/check-slug/:post/:slug', API.Posts.checkSlugAvailable)
    .use(populateUser)
    // .get('/forks/me', API.Posts.getUserForks)
    .get('/:post/edit', API.Posts.getByIdForEditing)
    .get('/:post/submit', API.Posts.getByIdForSubmitting)
    .get('/:post/fork', API.Posts.getByIdForForking)
    .get('/:post/publish', API.Posts.getByIdForPublishing)
    .put('/:post/md', json2mb, API.Posts.updateMarkdown)
    .put('/publish/:post', API.Posts.publish)
    .put('/submit/:post', API.Posts.submitForReview)
    .put('/add-forker/:post', API.Posts.addForker)
    .put('/clobber-fork/:post', API.Posts.clobberFork)
    .put('/propagate-head/:post', API.Posts.propagateMDfromGithub)

  router.use('/posts', postsrouter)


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
    .get('/posts', API.Posts.getNewFoAdmin)
    .get('/posts/all', API.Posts.getAllForAdmin)
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
    .get('/experts/new', API.Experts.getNewForAdmin)

  router.use('/adm',admrouter)

  return router

}
