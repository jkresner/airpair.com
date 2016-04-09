module.exports = function(app, mw) {


  if (config.middleware.livereload)
    app.use(mw.res.livereload(config.middleware.livereload))


  var landing = mw.$$('badBot session reqFirst')
  var landed = mw.$$('trackLanding landingPage')

  mw.$chain = {}
  mw.$chain.landingPage = (key, custom) =>
    $logIt('cfg.route', 'html  GET', cache.landing[key].url) ||
    _.union(landing, [mw.$.inflateLanding(key)], custom, landed)


  app.get('/', mw.$chain.landingPage('home',
    [mw.res.forbid('authd', usr => usr, { redirect: req => '/dashboard' })] ))


  app.get('/software-experts', mw.$chain.landingPage('posts',
    [ mw.$.cachedPublished, mw.$.cachedAds, mw.$.inflateAds,
      (req, res, next) => next(null, assign(req.locals.r, cache.published)) ] ))


  app.get('/100k-writing-competition', mw.$chain.landingPage('comp2015'))



  app.get(['/airconf','airconf2014','/workshops'], mw.$chain.landingPage('workshops',
    [mw.$.cachedAds, mw.$.inflateAds]))



}



