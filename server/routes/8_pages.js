module.exports = (app, mw) => {

  // honey.Router('app',{type:'html'})


  app.get([
          //  '/account',
          //  '/billing*',
          //  '/help*',
           '/home',
          ],
           mw.$.noBot, mw.$.session, mw.$.authd, mw.$.inflateMe, mw.$.pageClient)


  app.get([
           '/login',
           '/find-an-expert',
           '/hire-software-developers',
           '*pair-programming*',
          ], mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.pageClient)



}
