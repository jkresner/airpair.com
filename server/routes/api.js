var API = require('../api/_all')
var {authd,setAnonSessionData} = require('../middleware/auth')
var {adm,emailv} = require('../middleware/authz')
var {bodyParam,populateUser,populateExpert,json2mb} = require('../middleware/data')
var Router = require('express').Router

module.exports = function(app) {

  var router = Router()
    .param('tag', API.Tags.paramFns.getBySlug)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('booking', API.Bookings.paramFns.getById)
    .param('paymethod', API.Paymethods.paramFns.getById)
    .param('expert', API.Experts.paramFns.getByIdForAdmin)
    .param('expertshaped', API.Experts.paramFns.getById)

    .get('/session/full', setAnonSessionData, API.Users.getSession)
    .put('/users/me/password-change', API.Users.requestPasswordChange)
    .put('/users/me/tag/:tag', setAnonSessionData, API.Users.toggleTag)
    .put('/users/me/tags', setAnonSessionData, API.Users.updateTags)
    .put('/users/me/bookmarks', setAnonSessionData, API.Users.updateBookmarks)
    .put('/users/me/bookmarks/:type/:id', setAnonSessionData, API.Users.toggleBookmark)
    .put('/users/me/email', setAnonSessionData, API.Users.changeEmail)
    .put('/users/me/name', setAnonSessionData, API.Users.changeName)
    .get('/users/me/maillists', setAnonSessionData, API.Users.getMaillists)
    .put('/users/me/maillists', setAnonSessionData, API.Users.toggleMaillist)
    .put('/users/me/password', (req, res, next) => {
      var inValid = API.Users.validation.changePassword(req.user, req.body.hash, req.body.password)
      if (inValid) return res.status(403).json({message:inValid})

      // $log('trying to change pass'.magenta, req.body.hash, req.body.password)
      $callSvc(API.Users.svc.changePassword,req)(req.body.hash, req.body.password, (e,r) => {
        if (e) { e.fromApi = true; return next(e) }

        var cb = (e,r) => {
          if (e) return next(e)
          req.login(r, (err) => {
            if (err) return next(err)
            res.json(r)
          })
        }

        $callSvc(API.Users.svc.localLogin,req)(r.email, req.body.password, cb, cb)
      })
    })

    .get('/posts/me', API.Posts.getMyPosts)
    .get('/posts/review', API.Posts.getPostsInReview)
    .get('/posts/recent', API.Posts.getRecentPublished)
    .get('/posts/by/:id', API.Posts.getUsersPublished)
    .get('/posts/tag/:tag', API.Posts.getByTag)

    .get('/requests/review/:id', API.Requests.getByIdForReview)

    .get('/workshops/', API.Workshops.getAll)
    .get('/workshops/:id', API.Workshops.getBySlug)

    .get('/tags/search/:id', API.Tags.search)

    .use(authd)

    .post('/tags', bodyParam('tagfrom3rdparty'), API.Tags.createFrom3rdParty)

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
    .get('/billing/orders/expert/:id', API.Orders.getMyDealOrdersForExpert)
    .post('/billing/orders/credit', API.Orders.buyCredit)
    .post('/billing/orders/deal/:expertshaped', API.Orders.buyDeal)

    .get('/billing/orders/payouts', API.Orders.getOrdersForPayouts)
    .get('/payouts/me', API.Payouts.getPayouts)
    .post('/payouts/:paymethod', bodyParam('orders'), API.Payouts.payoutOrders)

    .get('/bookings', API.Bookings.getByUserId)
    .get('/bookings/:id', API.Bookings.getById)
    .post('/bookings/:expertshaped', API.Bookings.createBooking)

    .get('/experts/me', API.Experts.getMe)
    .get('/experts/search/:id', API.Experts.search)
    .get('/experts/:id', API.Experts.getById)
    .get('/experts/:expert/history', API.Experts.getHistory)
    .post('/experts/me', populateUser, API.Experts.create)
    .put('/experts/:expert/me', populateUser, API.Experts.updateMe)
    .get('/experts/deal/:id', API.Experts.getByDeal)
    .post('/experts/:expert/deal', API.Experts.createDeal)
    .put('/experts/:expert/deal/:dealid/expire', API.Experts.expireDeal)

  var postsrouter = Router()
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


  var matchmakerrouter = Router()
    .param('expertshaped', API.Experts.paramFns.getById)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .use(authd)
    // .get('/experts/mojo/me', API.Mojo.getMatchesForRequest)
    .get('/experts/mojo/rank', populateExpert, API.Mojo.getRanked)
    // .get('/experts/dashboard', API.Experts.getMatchesForDashboard)
    // .get('/experts', API.Experts.getForExpertsPage)
    .use(adm) //-- Todo change to match maker permissions
    .get('/matchmaking/requests/waiting', API.Requests.getWaitingForMatchmaker)
    .get('/matchmaking/requests/:id', API.Requests.getByIdForMatchmaker)
    .put('/matchmaking/requests/:request/add/:expertshaped', API.Requests.addSuggestion)
    .put('/matchmaking/experts/:expertshaped/matchify/:request', API.Mojo.updateMatchingStats)


  router.use(matchmakerrouter)


  var admrouter = Router()
    .param('expert', API.Experts.paramFns.getByIdForAdmin)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('booking', API.Bookings.paramFns.getById)
    .param('order', API.Orders.paramFns.getByIdForAdmin)
    .param('tagforadm', API.Tags.paramFns.getById)

    .use(adm)
    .get('/tags', API.Tags.getAllForCache)
    .get('/tags/:id', API.Tags.getById)
    .post('/tags', API.Tags.createByAdmin)
    .put('/tags/:tagforadm', API.Tags.updateByAdmin)
    .get('/posts', API.Posts.getNewFoAdmin)
    .get('/posts/all', API.Posts.getAllForAdmin)
    .get('/orders/:start/:end/:userId?', API.Orders.getByQueryForAdmin)
    .get('/reports/orders', API.Reports.getOrderReports)
    .get('/reports/requests', API.Reports.getRequestReports)
    .get('/bookings/:start/:end/:userId?', API.Bookings.getByQueryForAdmin)
    .get('/bookings/:id', API.Bookings.getByIdForAdmin)
    .put('/bookings/:booking/recording', API.Bookings.addYouTubeData)
    .put('/bookings/:booking/hangout', API.Bookings.addHangout)
    .put('/bookings/:booking', API.Bookings.updateByAdmin)
    .put('/bookings/:booking/:order/:request/:id/swap', API.Bookings.cheatExpertSwap)
    .put('/bookings/:booking/create-chat', API.Bookings.createChat)
    .put('/bookings/:booking/associate-chat', API.Bookings.associateChat)
    .get('/payouts/:userId', API.Payouts.getPayouts)
    .get('/users/role/:role', API.Users.getUsersInRole)
    .put('/users/:id/role/:role', API.Users.toggleUserInRole)
    .get('/users/search/:id', API.Users.search)
    .put('/chat/invite-to-team/:userId', API.Chat.inviteToTeam)
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
    .get('/experts/active', API.Experts.getActiveForAdmin)
    .get('/experts/:id', API.Experts.getByIdForAdmin)
    .delete('/experts/:expert', API.Experts.deleteById)

  router.use('/adm',admrouter)

  return router

}
