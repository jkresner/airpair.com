module.exports = function(app, mw) {


  app.use(['/billing*',
           '/bookings',
           '/bookings/*',
           '/booking/*',
           '/dashboard',
           '/experts',
           '/me*',
           '/help*',
           '/requests*',
           '/settings'],
           mw.$.noBot, mw.$.session, mw.$.authd, mw.$.clientPage)


  app.use(['/login',
           '/find-an-expert',
           '/hire-software-developers',
           '*pair-programming*',
           ], mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.clientPage)


  app.use('^/adm/*', mw.$.noBot, mw.$.session, mw.$.adm, mw.$.adminPage)


}
