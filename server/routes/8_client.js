module.exports = (app, mw) => {

  honey.Router('app',{type:'html'})
    .use(mw.$.abuser)
    .get([
           '/home',
           '/account',
           '/billing*',
           '/help*',
          ], mw.$.noBot, mw.$.session, mw.$.authd, mw.$.inflateMe, mw.$.pageClient)
    .get([
           '/find-an-expert',
           '/hire-software-developers',
           '*pair-programming*',
          ], mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.pageClient)



}
