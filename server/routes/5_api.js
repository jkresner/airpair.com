module.exports = function(app, mw) {

  app.API('session')
    .uses('noBot')
    .get({'full':                  ''})


  app.use('/v1/api', [mw.$.noBot, mw.$.session, mw.$.cachedTags, mw.$.cachedTemplates])
  app.use(['/v1/api/bookings/*',
           '/v1/api/requests/*'], [mw.$.cachedSlackUsers])


  app.honey.Router('posts:api', { mount: '/v1/api/posts', type: 'api' })
    .param('post', API.Posts.paramFns.getById)
    // .param('postreview', API.Posts.reviewParamFn)
    // .get('/tagged/:tag', API.Posts.getByTag)
    // .use(mw.$.authd)
    .useEnd(mw.$.apiJson)
    // .post('/:post/review', API.Posts.review)
    // .put('/:post/review/:postreview', API.Posts.reviewUpdate)
    // .put('/:post/review/:postreview/reply', API.Posts.reviewReply)
    // .put('/:post/review/:postreview/upvote', API.Posts.reviewUpvote)
    // .delete('/:post/review/:postreview',
    // mw.$.adm, API.Posts.reviewDelete)
    // .get('/me', API.Posts.getMyPosts)
    //   .get('/review', API.Posts.getPostsInReview)
    //   .get('/recent', API.Posts.getRecentPublished)
    //   .get('/by/:id', API.Posts.getUsersPublished)


  app.honey.Router('general:api', { mount: '/v1/api', type: 'api' })
    // .param('tag', API.Tags.paramFns.getBySlug)
    // .param('tagfrom3rdparty', 'tags', 'getBy3rdParty')
    .param('expertshaped', API.Experts.paramFns.getById)
    .param('order', API.Orders.paramFns.getByIdForAdmin)
    .param('paymethod', API.Paymethods.paramFns.getById)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .useEnd(mw.$.apiJson)
  //   .put('/users/me/tag/:tag', mw.$.setAnonSessionData, API.Users.toggleTag)
  //   .put('/users/me/tags', mw.$.setAnonSessionData, API.Users.updateTags)
  //   .put('/users/me/bookmarks', mw.$.setAnonSessionData, API.Users.updateBookmarks)
  //   .put('/users/me/bookmarks/:type/:id', mw.$.setAnonSessionData, API.Users.toggleBookmark)
    .get('/requests/review/:id', API.Requests.getByIdForReview)
    .get('/tags/search/:id', API.Tags.search)
    .use(mw.$.authd)
    // .post('/tags', mw.data.recast('tag','body.tagfrom3rdparty'), API.Tags.createFrom3rdParty)
    .get('/requests-authd', mw.$.inflateMe, API.Requests.getAllowed)
    .get('/requests', API.Requests.getMy)
    .get('/requests/:id', API.Requests.getByIdForUser)
    .get('/requests/:id/book/:expertshaped', API.Requests.getRequestForBookingExpert)
    .post('/requests', API.Requests.create)
    // .put('/requests/:request/verify', API.Requests.sendVerifyEmailByCustomer)
    .put('/requests/:request', API.Requests.updateByCustomer)
    .delete('/requests/:request', API.Requests.deleteById)
  //   .get('/users/me/provider-scopes', populate.user, API.Users.getProviderScopes)
  //   .put('/users/me/email-verify', mw.$.onFirstReq, API.Users.verifyEmail)
    .put('/users/me/initials', API.Users.changeInitials)
    .put('/users/me/email', API.Users.changeEmail)
    .put('/users/me/name', API.Users.changeName)
    .put('/users/me/username', API.Users.changeUsername)
  //   .put('/users/me/bio', API.Users.changeBio)
    .put('/users/me/location', API.Users.changeLocationTimezone)
    .get('/experts/mojo/rank', mw.$.inflateMeExpert, API.Mojo.getRanked)
  //   .get('/experts/me', API.Experts.getMe)
  //   .get('/experts/search/:id', API.Experts.search)
    .get('/experts/:id', API.Experts.getById)
    .get('/billing/paymethods', API.Paymethods.getMyPaymethods)
    .post('/billing/paymethods', API.Paymethods.addPaymethod)
    .delete('/billing/paymethods/:paymethod', API.Paymethods.deletePaymethod)
    .get('/billing/orders', API.Orders.getMyOrders)
    .get('/billing/orders/credit/:id', API.Orders.getMyOrdersWithCredit)
    .post('/billing/orders/credit', API.Orders.buyCredit)
    .put('/billing/orders/:order/release', mw.$.inflateOrderBooking, API.Orders.releasePayout)


  app.honey.Router('booking:api', { mount: '/v1/api/bookings', type: 'api' })
    .use([mw.$.authd, mw.$.inflateMe])
    .useEnd(mw.$.apiJson)
    .param('booking', API.Bookings.paramFns.getById)
    .param('bookingforparticipant', API.Bookings.paramFns.getByIdForParticipant)
    .param('expertshaped', API.Experts.paramFns.getById)
    .post('/:expertshaped', API.Bookings.createBooking)
    .get('/', API.Bookings.getByUserId)
    .get('/:bookingforparticipant', API.Bookings.getForParticipant)
    .put('/:booking/suggest-time', API.Bookings.suggestTime)
    .put('/:booking/remove-time', API.Bookings.removeSuggestedTime)
    .put('/:booking/confirm-time', API.Bookings.confirmTime)
    .put('/:booking/create-chat', API.Bookings.createChat)
    .put('/:booking/associate-chat', API.Bookings.associateChat)
    // .get('/expert', API.Bookings.getByExpertId)

}
