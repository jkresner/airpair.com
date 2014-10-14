import RedirectsAPI from '../api/redirects'

var redirectWithQuery = (match, replace) =>
  (req, res) =>
    res.redirect(301, req.url.replace(match,replace))
    res.end()

export function init(app, cb) {
  if (!config.redirects.on) return cb()

  //-- Express routes don't handle spaces, so always put in %20
  //-- More so for some reason it's important to test the fully encoded
  //-- Version of the url first

  app.get(/%E2%80%A6/, redirectWithQuery('%E2%80%A6',''))
  app.get(/%20%e2%80%a6/, redirectWithQuery('%20%e2%80%a6',''))
  app.get(/%20%E2%80%A6/, redirectWithQuery('%20%E2%80%A6',''))
  app.get(/%20\.\.\./, redirectWithQuery('%20...',''))
  app.get(/\.\.\./, redirectWithQuery('...',''))

  RedirectsAPI.svc.getAllRedirects((e,all) =>{
    for (var r of all)
      app.get( r.previous, redirectWithQuery(r.previous,r.current))
    cb()
  })
}
