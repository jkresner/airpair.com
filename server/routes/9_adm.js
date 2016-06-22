module.exports = function(app, mw, {adm}) {
  if (!adm) return;


  app.get('/adm/*', mw.$.session, mw.$.adm, mw.$.adminPage)

  app.honey.Router('adm:api', { mount: '/v1/api/adm', type: 'api' })
    .use(mw.$.adm)
    .useEnd(mw.$.apiJson)
    .param('request', API.Requests.paramFns.getByIdForAdmin)
    .param('order', API.Orders.paramFns.getByIdForAdmin)
    .param('tag', mw.$.paramTag)
    .param('expert', API.Experts.paramFns.getByIdForAdmin)
    .param('expertshaped', API.Experts.paramFns.getById)
    .param('booking', API.Bookings.paramFns.getById)
    .get('/users/search/:id', API.Users.search)
    .get('/orders/:start/:end/:userId?', API.Orders.getByQueryForAdmin)
    .get('/billing/orders/:id', API.Orders.getByIdForAdmin)
    .post('/billing/orders/credit', API.Orders.giveCredit)
    .get('/billing/paymethods/:id', API.Paymethods.getUserPaymethodsByAdmin)
    // .get('/requests/:id', API.Requests.getByIdForMatchmaker)
    .put('/requests/:request/add/:expertshaped', API.Requests.addSuggestion)
    .put('/experts/:expertshaped/matchify/:request', API.Mojo.updateMatchingStats)
    .get('/experts/new', API.Experts.getNewForAdmin)
    .get('/experts/active', API.Experts.getActiveForAdmin)
    .get('/experts/:id', API.Experts.getByIdForAdmin)
    .delete('/experts/:expert', API.Experts.deleteById)
    // .post('/experts/:expert/note', API.Experts.addNote)
    .get('/requests/active', API.Requests.getActiveForAdmin)
    .get('/requests/2015', API.Requests.get2015ForAdmin)
    .get('/requests/incomplete', API.Requests.getIncompleteForAdmin)
    .get('/requests/user/:id', API.Requests.getByUserIdForAdmin)
    .put('/requests/:request', API.Requests.updateByAdmin)
    .put('/requests/:request/message', API.Requests.sendMessageByAdmin)
    .put('/requests/:request/farm', API.Requests.farmByAdmin)
    .put('/requests/:request/remove/:expert', API.Requests.removeSuggestion)
    // .use(mw.$.cachedSlackUsers)
    .get('/requests/:id', API.Requests.getByIdForAdmin)
    .put('/chat/invite-to-team/:userId', API.Chat.inviteToTeam)
    // .put('/chat/sync-ims', API.Chat.syncIMs)
    .get('/bookings/:start/:end/:userId?', API.Bookings.getByQueryForAdmin)
    .get('/bookings/:id', API.Bookings.getByIdForAdmin)
    .put('/bookings/:booking/hangout', API.Bookings.addHangout)
    .put('/bookings/:booking/recording', API.Bookings.addYouTubeData)
    .delete('/bookings/:booking/recording/:recordingId', API.Bookings.deleteRecording)
    .put('/bookings/:booking', API.Bookings.updateByAdmin)
    .put('/bookings/:booking/:order/:request/:id/swap', API.Bookings.cheatExpertSwap)
    .put('/bookings/chat/invite-to-team/:userId', API.Chat.inviteToTeam)
    .post('/bookings/chat/:booking/message', API.Bookings.postChatMessage)

    // .get('/tags/:id', API.Tags.getById)
    // .get('/tags', API.Tags.getAllForCache)
    // .post('/tags', API.Tags.createByAdmin)
    // .get('/experts/mojo/me', API.Mojo.getMatchesForRequest)
    // .get('/experts', API.Experts.getForExpertsPage)
    // .post('/bookings/:booking/note', API.Bookings.addNote)
    // .post('/experts/:expert/note', API.Experts.addNote)
    // .param('tagforadm', API.Tags.paramFns.getById)
    // .put('/tags/:tagforadm', API.Tags.updateByAdmin)
    // .get('/views/user/:id', API.Views.getByUserId)






}
