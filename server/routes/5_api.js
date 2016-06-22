module.exports = function(app, mw, {api}) {
  if (!api) return;

  app.API('auth', api)
    .uses('noBot')
    .get({'session':             ''                       })

  app.API('tags')
    .uses('noBot')
    .get ({ search:               'query.q'               })

  // app.API('reviews')
  //   .params('post postreview')
  //   .uses('authd')
  //   .get({ getMyReviews:           ''})
  //   .put({ submitReview:          'post body'              })
           // reply:                 'post postreview',
           // upvote:                'post postreview'        })
    // .put({'deleteReview': ,        'post postreview'})     // TODO only editors

  // app.API('posts')
    // .get({ getForks:               '' })
            // getActivity:            'post'                 })


  app.use(['/v1/api/adm/*',
           '/v1/api/bookings*',
           '/v1/api/requests*',
           '/v1/api/billing*',
           '/v1/api/experts*',
           '/v1/api/users*',
           ], [mw.$.noBot, mw.$.session, mw.$.cachedSlackUsers])

  app.honey.Router('general:api', { mount: '/v1/api', type: 'api' })
    .param('tag', mw.$.paramTag)
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
    .use(mw.$.authd)
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
