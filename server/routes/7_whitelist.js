module.exports = function(app, mw) {


  app.use(['/billing*',
           '/bookings',
           '/bookings/*',
           '/booking/*',
           '/dashboard',
           '/experts',
           '/login',
           '/me*',
           '/help*',
           '/requests*',
           '/settings'],
           mw.$.noBot, mw.$.session, mw.$.authd, mw.$.clientPage)


  app.use(['/find-an-expert',
           '/hire-software-developers',
           '*pair-programming*',
           ], mw.$.badBot, mw.$.session, mw.$.onFirstReq, mw.$.clientPage)



  app.use(['^/matchmaking*',
           '^/adm/*'],
           mw.$.noBot, mw.$.session, mw.$.adm, mw.$.adminPage)


}
