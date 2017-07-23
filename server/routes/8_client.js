module.exports = (app, mw) => {

  // honey.Router('app',{type:'html'})


  app.get([
           '/home',
           '/account',
           '/billing*',
           '/help*',
          ],
           mw.$.noBot, mw.$.session, mw.$.authd, mw.$.inflateMe, mw.$.pageClient)


  app.get([
           '/find-an-expert',
           '/hire-software-developers',
           '*pair-programming*',
          ], mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.pageClient)



}
