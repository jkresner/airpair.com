module.exports = (app, mw, {client}) =>

  // if (!client)
    // return;

  honey.Router('app',{type:'html'})
    .use(mw.$.livereload)
    .use(mw.$.session)
    .get(['/account',
          '/home',
       // '/billing*',
       // '/help*',
          ]
        , mw.$.authd, mw.$.inflateMe, mw.$.pageClient)

