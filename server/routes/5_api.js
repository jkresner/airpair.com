module.exports = function(app, mw) {

  app.API('session')
    .uses('noBot')
    .get({'full':                  ''})


  app.honey.Router('adm:api', { mount: '/v1/api/adm', type: 'api' })
    .use([mw.$.noBot, mw.$.session, mw.$.adm])
    .param('expert', API.Experts.paramFns.getByIdForAdmin)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('order', API.Orders.paramFns.getByIdForAdmin)
    // .param('tagforadm', API.Tags.paramFns.getById)
    .param('tag', API.Tags.paramFns.getBySlug)
    .param('expertshaped', API.Experts.paramFns.getById)
    .param('booking', API.Bookings.paramFns.getById)
    .get('/tags', API.Tags.getAllForCache)
    .get('/tags/:id', API.Tags.getById)
    .post('/tags', API.Tags.createByAdmin)
    // .put('/tags/:tagforadm', API.Tags.updateByAdmin)
    // .get('/posts', API.Posts.getNewFoAdmin)
    // .get('/posts/all', API.Posts.getAllForAdmin)
    .get('/orders/:start/:end/:userId?', API.Orders.getByQueryForAdmin)
    .get('/users/search/:id', API.Users.search)
    .get('/billing/orders/:id', API.Orders.getByIdForAdmin)
    .post('/billing/orders/credit', API.Orders.giveCredit)
    .get('/billing/paymethods/:id', API.Paymethods.getUserPaymethodsByAdmin)
    // .get('/views/user/:id', API.Views.getByUserId)
    .get('/redirects', API.Redirects.getAllRedirects)
    .post('/redirects', API.Redirects.createRedirect)
    .delete('/redirects/:id', API.Redirects.deleteRedirectById)
    .use(mw.$.cachedTemplates)
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
    .post('/experts/:expert/note', API.Experts.addNote)
    .put('/chat/invite-to-team/:userId', API.Chat.inviteToTeam)
    .put('/chat/sync-ims', API.Chat.syncIMs)
    // .get('/requests/waiting', API.Requests.getWaitingForMatchmaker)
    .get('/requests/:id', API.Requests.getByIdForMatchmaker)
    .put('/requests/:request/add/:expertshaped', API.Requests.addSuggestion)
    // .put('/requests/:request/group/:tag', API.Requests.groupSuggest)
    .put('/experts/:expertshaped/matchify/:request', API.Mojo.updateMatchingStats)
    // .get('/experts/mojo/me', API.Mojo.getMatchesForRequest)
    // .get('/experts/dashboard', API.Experts.getMatchesForDashboard)
    // .get('/experts', API.Experts.getForExpertsPage)
    .use(mw.$.cachedSlackUsers)
    .get('/bookings/:start/:end/:userId?', API.Bookings.getByQueryForAdmin)
    .get('/bookings/:id', API.Bookings.getByIdForAdmin)
    .put('/bookings/:booking/hangout', API.Bookings.addHangout)
    .put('/bookings/:booking/recording', API.Bookings.addYouTubeData)
    .delete('/bookings/:booking/recording/:recordingId', API.Bookings.deleteRecording)
    .put('/bookings/:booking', API.Bookings.updateByAdmin)
    .put('/bookings/:booking/:order/:request/:id/swap', API.Bookings.cheatExpertSwap)
    .post('/bookings/:booking/note', API.Bookings.addNote)
    // .post('/experts/:expert/note', API.Experts.addNote)
    .put('/bookings/chat/invite-to-team/:userId', API.Chat.inviteToTeam)
    .post('/bookings/chat/:booking/message', API.Bookings.postChatMessage)


  app.honey.Router('posts:api', { mount: '/v1/api/posts', type: 'api' })
    .param('tag', API.Tags.paramFns.getBySlug)
    // .param('expert', API.Experts.paramFns.getByIdForAdmin)
    .param('post', API.Posts.paramFns.getById)
    .param('postreview', API.Posts.reviewParamFn)
    .use(mw.$.session)
    .use(mw.$.cachedTags)
    .get('/tagged/:tag', API.Posts.getByTag)
    .use(mw.$.authd)
    .post('/:post/review', API.Posts.review)
    .put('/:post/review/:postreview', API.Posts.reviewUpdate)
    .put('/:post/review/:postreview/reply', API.Posts.reviewReply)
    // .put('/:post/review/:postreview/upvote', API.Posts.reviewUpvote)

    // .delete('/:post/review/:postreview',
      // mw.$.adm, API.Posts.reviewDelete)

    // .get('/me', API.Posts.getMyPosts)
  //   .get('/review', API.Posts.getPostsInReview)
  //   .get('/recent', API.Posts.getRecentPublished)
  //   .get('/by/:id', API.Posts.getUsersPublished)



  app.honey.Router('general:api', { mount: '/v1/api', type: 'api' })
    .param('tag', API.Tags.paramFns.getBySlug)
    // .param('tagfrom3rdparty', 'tags', 'getBy3rdParty')
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('booking', API.Bookings.paramFns.getById)
    .param('bookingforparticipant', API.Bookings.paramFns.getByIdForParticipant)
    .param('paymethod', API.Paymethods.paramFns.getById)
    .param('expert', API.Experts.paramFns.getByIdForAdmin)
    .param('expertshaped', API.Experts.paramFns.getById)
    .param('order', API.Orders.paramFns.getByIdForAdmin)

  //   .put('/users/me/tag/:tag', mw.$.setAnonSessionData, API.Users.toggleTag)
  //   .put('/users/me/tags', mw.$.setAnonSessionData, API.Users.updateTags)
  //   .put('/users/me/bookmarks', mw.$.setAnonSessionData, API.Users.updateBookmarks)
  //   .put('/users/me/bookmarks/:type/:id', mw.$.setAnonSessionData, API.Users.toggleBookmark)
    .use(mw.$.session)
    .use(mw.$.cachedTemplates)

    .get('/requests/review/:id', API.Requests.getByIdForReview)

    .get('/tags/search/:id', API.Tags.search)

    .use(mw.$.authd)
    // .post('/tags', mw.data.recast('tag','body.tagfrom3rdparty'), API.Tags.createFrom3rdParty)

    .get('/requests-authd', mw.$.inflateMe, API.Requests.getAllowed)
    .get('/requests', API.Requests.getMy)
    .get('/requests/:id', API.Requests.getByIdForUser)
    .get('/requests/:id/book/:expertshaped', API.Requests.getRequestForBookingExpert)
    .put('/requests/:request/verify', API.Requests.sendVerifyEmailByCustomer)
    .put('/requests/:request', API.Requests.updateByCustomer)
    .post('/requests', API.Requests.create)
    .delete('/requests/:request', API.Requests.deleteById)

  //   .get('/users/me/provider-scopes', populate.user, API.Users.getProviderScopes)
  //   .put('/users/me/email-verify', mw.$.onFirstReq, API.Users.verifyEmail)
    .put('/users/me/initials', API.Users.changeInitials)
    .put('/users/me/email', API.Users.changeEmail)
    .put('/users/me/name', API.Users.changeName)
    .put('/users/me/username', API.Users.changeUsername)
  //   .put('/users/me/bio', API.Users.changeBio)
    .put('/users/me/location', API.Users.changeLocationTimezone)

  //   .get('/company', API.Companys.getUsersCompany)

    .get('/experts/mojo/rank', mw.$.inflateMeExpert, API.Mojo.getRanked)

  //   .get('/experts/me', API.Experts.getMe)
  //   .get('/experts/search/:id', API.Experts.search)
  //   .get('/experts/:id', API.Experts.getById)
  //   .get('/experts/:expertshaped/history', API.Experts.getHistory)
  //   .get('/experts/deal/:id', API.Experts.getByDeal)
  //   .post('/experts/:expert/deal', API.Experts.createDeal)
  //   .put('/experts/:expert/deal/:dealid/expire', API.Experts.expireDeal)

    .get('/billing/paymethods', API.Paymethods.getMyPaymethods)
    .post('/billing/paymethods', API.Paymethods.addPaymethod)
    .delete('/billing/paymethods/:paymethod', API.Paymethods.deletePaymethod)
    .get('/billing/orders', API.Orders.getMyOrders)
    .get('/billing/orders/credit/:id', API.Orders.getMyOrdersWithCredit)
    .get('/billing/orders/expert/:id', API.Orders.getMyDealOrdersForExpert)
    .post('/billing/orders/credit', API.Orders.buyCredit)
    .post('/billing/orders/deal/:expertshaped', API.Orders.buyDeal)


    .use(mw.$.cachedSlackUsers)
    .use(mw.$.inflateMe)
    .put('/billing/orders/:order/release', mw.$.inflateOrderBooking, API.Orders.releasePayout)
    .post('/bookings/:expertshaped', API.Bookings.createBooking)
    .get('/bookings', API.Bookings.getByUserId)
    .get('/bookings/expert', API.Bookings.getByExpertId)
    .get('/bookings/:bookingforparticipant', API.Bookings.getForParticipant)
    .put('/bookings/:booking/suggest-time', API.Bookings.suggestTime)
    .put('/bookings/:booking/remove-time', API.Bookings.removeSuggestedTime)
    .put('/bookings/:booking/confirm-time', API.Bookings.confirmTime)
    .put('/bookings/:booking/create-chat', API.Bookings.createChat)
    .put('/bookings/:booking/associate-chat', API.Bookings.associateChat)
    .put('/bookings/:booking/:expert/customer-feedback', API.Bookings.customerFeedback)

}
