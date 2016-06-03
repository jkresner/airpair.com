// process.env.ENV = 'prod'
var MAServer    = require('meanair-server')
var config      = MAServer.Config(__dirname, process.env.ENV || 'dev', true)
var tracking    = require('./app.track')

var app = require('./app').run({ config, MAServer, tracking },
  function(e) {
    if (e) return $log('APP.ERROR'.red, e)

//     var urls = app.sitemap.map(url => `<url><loc>${url}</loc></url>`)
//                           .join('\n  ')
//                           .replace(new RegExp(config.http.host,'g'), 'https://www.airpair.com')

//     require('fs').writeFileSync(
//       __dirname.replace('server','web/robots/sitemap.xml'),
// `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   ${urls}
// </urlset>`)
  })



