module.exports = function(app, mw) {


  app.get([
          //  '/account',
          //  '/billing*',
          //  '/help*',
           '/home',
          ],
           mw.$.noBot, mw.$.session, mw.$.authd, mw.$.inflateMe, mw.$.clientPage)


  app.get([
           '/find-an-expert',
           '/hire-software-developers',
           '*pair-programming*',           
          ], mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.clientPage)

}
